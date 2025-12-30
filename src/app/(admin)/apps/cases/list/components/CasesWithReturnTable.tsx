'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { Card, CardBody, CardHeader, Collapse, Button } from 'react-bootstrap';
import { ICase } from '@/types/cases/ICase';
import { useCasesContext } from '@/contexts/casesContext';
import Cookies from 'js-cookie';
import ICaseFilter from '@/types/cases/ICaseFilter';
import { allCase } from '@/services/caseServices';
import CasesTable from '../cases';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

/**
 * Componente que exibe uma tabela de casos com retorno do usuário
 * Mostra apenas casos com status_id = 4 (retorno) atribuídos ao usuário logado
 * Usa o mesmo componente CasesTable da tabela principal
 */
export default function CasesWithReturnTable() {
	const [casesWithReturn, setCasesWithReturn] = useState<ICase[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [selectedCases, setSelectedCases] = useState<Set<string>>(new Set());
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const openCaseModalRef = useRef<((caseData: ICase) => void) | null>(null);

	// Busca casos com retorno do usuário logado
	const fetchCasesWithReturn = useCallback(async () => {
		const userId = Cookies.get('user_id');
		if (!userId) return;

		const filters: ICaseFilter = {
			usuario_dev_id: userId,
			status_id: 4, // Status retorno
			sort_by: 'prioridade',
		};

		try {
			setLoading(true);
			const response = await allCase(filters);
			setCasesWithReturn(response.data || []);
		} catch (error) {
			console.error('Erro ao buscar casos com retorno:', error);
		} finally {
			setLoading(false);
		}
	}, []);

	// Carrega casos com retorno ao montar o componente
	useEffect(() => {
		fetchCasesWithReturn();
	}, [fetchCasesWithReturn]);

	// Só renderiza se tiver dados ou se estiver carregando
	if (!loading && casesWithReturn.length === 0) {
		return null;
	}

	const hasReturn = casesWithReturn.length > 0;

	return (
		<Card className="mb-3 border-0 shadow-sm">
			<style>{`
				@keyframes pulse {
					0%, 100% {
						opacity: 1;
						transform: scale(1);
					}
					50% {
						opacity: 0.7;
						transform: scale(1.1);
					}
				}
				.pulse-indicator {
					animation: pulse 2s infinite;
					display: inline-block;
				}
				.cases-return-header:hover {
					background-color: rgba(220, 53, 69, 0.05) !important;
					transition: background-color 0.2s ease;
				}
			`}</style>
			<CardHeader className="bg-light border-bottom p-0">
				<Button
					variant="link"
					onClick={() => setIsOpen(!isOpen)}
					className="text-start w-100 d-flex align-items-center justify-content-between cases-return-header p-3"
					style={{ textDecoration: 'none' }}
				>
					<h5 className="mb-0 text-danger d-flex align-items-center fw-semibold" style={{ fontSize: '1rem' }}>
						<IconifyIcon icon="lucide:alert-circle" className="me-2 text-danger" style={{ fontSize: '1.125rem' }} />
						Casos com Retorno
						{hasReturn && (
							<span className="pulse-indicator ms-2">
								<i className="mdi mdi-alert-circle text-danger" style={{ fontSize: '1.2rem' }}></i>
							</span>
						)}
					</h5>
					<i className={`mdi mdi-chevron-${isOpen ? 'up' : 'down'} text-muted`} style={{ fontSize: '1.5rem' }}></i>
				</Button>
			</CardHeader>
			<Collapse in={isOpen}>
				<div>
					<CardBody>
						<div className="table-responsive" style={{ marginLeft: '-1.25rem', marginRight: '-1.25rem', paddingLeft: '1.25rem', paddingRight: '1.25rem' }}>
							<CasesTable 
								data={casesWithReturn} 
								loading={loading}
								selectedCases={selectedCases}
								onSelectedCasesChange={setSelectedCases}
								onOpenCaseModalRef={openCaseModalRef}
							/>
						</div>
					</CardBody>
				</div>
			</Collapse>
		</Card>
	);
}

