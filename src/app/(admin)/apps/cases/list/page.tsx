'use client';
import { Card, CardBody, Col, Row } from 'react-bootstrap';
import CaseFilters from './caseFilters';
import CasesTable from './cases';
import { CasesProvider, useCasesContext } from '@/contexts/casesContext';
import { ToastContainer } from 'react-toastify';
import ProjectsSection from './components/caseListComponents/projectsSection';
import CasesFAB from './components/CasesFAB';
import { useState, useRef, useCallback, useEffect } from 'react';
import { useApplyUrlCaseFilters } from '@/hooks';
import TransferCasesModal from './components/TransferCasesModal';
import { Modal } from 'react-bootstrap';
import { Button, Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { ICase } from '@/types/cases/ICase';
import { findCase, allCase } from '@/services/caseServices';
import Spinner from '@/components/Spinner';
import { Form } from 'react-bootstrap';
import CasesTotalizadores from './components/CasesTotalizadores';
import Cookies from 'js-cookie';
import ICaseFilter from '@/types/cases/ICaseFilter';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const CasesList = () => {
	const { cases, loading, totalizadores, fetchCases } = useCasesContext();
	const [hasCasesWithReturn, setHasCasesWithReturn] = useState<boolean>(false);
	const [showingReturns, setShowingReturns] = useState<boolean>(false);
	const [returnCases, setReturnCases] = useState<ICase[]>([]);
	const [loadingReturns, setLoadingReturns] = useState<boolean>(false);
	const [showFiltersDrawer, setShowFiltersDrawer] = useState(false);
	const [showProductsDrawer, setShowProductsDrawer] = useState(false);
	const [selectedCases, setSelectedCases] = useState<Set<string>>(new Set());
	const [showTransferModal, setShowTransferModal] = useState(false);
	const [showWarningAlert, setShowWarningAlert] = useState(false);
	const openCaseModalRef = useRef<((caseData: ICase) => void) | null>(null);
	const [registroValue, setRegistroValue] = useState('');
	const [loadingRegistro, setLoadingRegistro] = useState(false);

	const handleOpenTransferModal = () => {
		// Verifica se há casos selecionados
		if (selectedCases.size === 0) {
			toast.warning('Selecione pelo menos um caso para transferir');
			return;
		}

		// Busca os casos selecionados na lista de casos
		const selectedCasesData = (cases || []).filter(caseItem => 
			selectedCases.has(caseItem.caso.id.toString())
		);

		// Verifica se todos os casos têm produto
		const casesWithProduct = selectedCasesData.filter(caseItem => 
			caseItem.produto && caseItem.produto.id !== null && caseItem.produto.id !== undefined
		);

		// Se não houver casos com produto, permite abrir o modal
		if (casesWithProduct.length === 0) {
			setShowTransferModal(true);
			return;
		}

		// Verifica se todos os casos têm o mesmo produto
		const firstProductId = casesWithProduct[0].produto?.id;
		const allSameProduct = casesWithProduct.every(caseItem => 
			caseItem.produto?.id === firstProductId
		);

		if (!allSameProduct) {
			// Mostra alerta e não abre o modal
			setShowWarningAlert(true);
			return;
		}

		// Se passou na validação, abre o modal
		setShowTransferModal(true);
	};

	const handleOpenCaseModal = useCallback((caseData: ICase) => {
		if (openCaseModalRef.current) {
			openCaseModalRef.current(caseData);
		}
	}, []);

	const handleSearchByRegistro = async () => {
		const trimmedRegistro = registroValue.trim();
		if (!trimmedRegistro) {
			return;
		}

		setLoadingRegistro(true);
		try {
			const response = await findCase(trimmedRegistro);
			if (response?.data) {
				handleOpenCaseModal(response.data);
				setRegistroValue('');
			} else {
				toast.warning('Caso não encontrado');
			}
		} catch (error: any) {
			console.error('Erro ao buscar caso:', error);
			toast.warning('Caso não encontrado');
		} finally {
			setLoadingRegistro(false);
		}
	};

	const handleRegistroKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			handleSearchByRegistro();
		}
	};

	// Verifica se há casos com retorno ao carregar a página e guarda os dados
	useEffect(() => {
		const checkCasesWithReturn = async () => {
			const userId = Cookies.get('user_id');
			if (!userId) return;

			try {
				setLoadingReturns(true);
				const filters: ICaseFilter = {
					usuario_dev_id: userId,
					status_id: 4, // Status retorno
					sort_by: 'prioridade',
				};

				const response = await allCase(filters);
				const hasReturns = response.data && response.data.length > 0;
				setHasCasesWithReturn(hasReturns);
				
				if (hasReturns) {
					setReturnCases(response.data);
				}
			} catch (error) {
				console.error('Erro ao verificar casos com retorno:', error);
			} finally {
				setLoadingReturns(false);
			}
		};

		checkCasesWithReturn();
	}, []);

	// Handler para alternar entre casos normais e casos com retorno (sem fazer requisição)
	const handleToggleReturnView = useCallback(() => {
		setShowingReturns(!showingReturns);
	}, [showingReturns]);

	// Determina quais casos exibir
	const displayCases = showingReturns ? returnCases : cases;
	const displayLoading = showingReturns ? loadingReturns : loading;

	return (
		<>
			<Row>
				<Col xs={12}>
					<Card>
						<CardBody>
							{/* Filtros - apenas desktop */}
							<div className="mb-3 d-none d-lg-block">
								<Row className="align-items-center g-2">
									<Col xs={12}>
										<CaseFilters 
											onOpenFiltersDrawer={() => setShowFiltersDrawer(true)}
											showFiltersDrawer={showFiltersDrawer}
											onCloseFiltersDrawer={() => setShowFiltersDrawer(false)}
											selectedCases={selectedCases}
											onClearSelectedCases={() => setSelectedCases(new Set())}
											onOpenCaseModal={handleOpenCaseModal}
										/>
									</Col>
								</Row>
							</div>
							
							{/* Seção de projetos - apenas desktop */}
							<div className="d-none d-lg-block mb-3">
								<ProjectsSection 
									onOpenProductsDrawer={() => setShowProductsDrawer(true)}
									showProductsDrawer={showProductsDrawer}
									onCloseProductsDrawer={() => setShowProductsDrawer(false)}
								/>
							</div>
							
							{/* Mobile: input de registro e gráfico de status */}
							<div className="d-lg-none mb-3">
								<div className="mb-3">
									<Form.Control
										type="text"
										value={registroValue}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRegistroValue(e.target.value)}
										onKeyPress={handleRegistroKeyPress}
										placeholder="Digite o número do caso"
										className="form-control-sm"
										disabled={loadingRegistro}
									/>
								</div>
								<ProjectsSection 
									onOpenProductsDrawer={() => setShowProductsDrawer(true)}
									showProductsDrawer={showProductsDrawer}
									onCloseProductsDrawer={() => setShowProductsDrawer(false)}
									mobileOnly
								/>
							</div>
							
							{/* Totalizadores - acima da tabela */}
							<div className="mb-3">
								<CasesTotalizadores totalizadores={totalizadores} loading={loading} />
							</div>
							
							{/* Header da seção de casos */}
							<style>{`
								@keyframes pulse-radiation {
									0% {
										box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.7);
									}
									50% {
										box-shadow: 0 0 0 10px rgba(220, 53, 69, 0);
									}
									100% {
										box-shadow: 0 0 0 0 rgba(220, 53, 69, 0);
									}
								}
								.return-badge-radiation {
									animation: pulse-radiation 2s infinite;
								}
								.cases-title-clickable {
									cursor: pointer;
									transition: all 0.2s ease;
								}
								.cases-title-clickable:hover {
									color: var(--bs-primary) !important;
									transform: translateX(3px);
								}
								.return-badge-hover:hover {
									transform: scale(1.05);
									transition: all 0.3s ease;
								}
							`}</style>
							<div className="mb-3 d-flex align-items-center justify-content-between">
								<h5 
									className={`mb-0 d-flex align-items-center fw-semibold ${showingReturns ? 'cases-title-clickable' : ''}`}
									onClick={showingReturns ? () => setShowingReturns(false) : undefined}
									style={showingReturns ? { cursor: 'pointer' } : {}}
								>
									<IconifyIcon icon="lucide:list" className="me-2 text-primary" style={{ fontSize: '1.125rem' }} />
									Casos
									{showingReturns && (
										<span className="text-muted ms-2 small">(clique para voltar)</span>
									)}
								</h5>
								{hasCasesWithReturn && (
									<Badge
										bg="danger"
										className={`d-flex align-items-center gap-1 cursor-pointer return-badge-hover ${showingReturns ? 'bg-secondary' : 'return-badge-radiation'}`}
										onClick={handleToggleReturnView}
										style={{ 
											cursor: 'pointer',
											padding: '0.5rem 0.75rem',
											fontSize: '0.875rem',
											fontWeight: '600',
											transition: 'all 0.3s ease'
										}}
									>
										<i className="mdi mdi-alert-circle me-1"></i>
										Casos com Retorno!
									</Badge>
								)}
							</div>
							
							<div className="table-responsive" style={{ marginLeft: '-1.25rem', marginRight: '-1.25rem', paddingLeft: '1.25rem', paddingRight: '1.25rem' }}>
								<CasesTable 
									data={displayCases} 
									loading={displayLoading}
									selectedCases={selectedCases}
									onSelectedCasesChange={setSelectedCases}
									onOpenCaseModalRef={openCaseModalRef}
								/>
							</div>
						</CardBody>
					</Card>
				</Col>
			</Row>
			
			{/* FAB apenas no mobile */}
			<div className="d-lg-none">
				<CasesFAB 
					onOpenFilters={() => setShowFiltersDrawer(true)}
					onOpenProducts={() => setShowProductsDrawer(true)}
					showFiltersDrawer={showFiltersDrawer}
					showProductsDrawer={showProductsDrawer}
					onOpenTransfer={handleOpenTransferModal}
					selectedCases={selectedCases}
				/>
			</div>
			
			{/* Modal de Transferência de Casos */}
			<TransferCasesModal
				show={showTransferModal}
				onHide={() => setShowTransferModal(false)}
				selectedCases={selectedCases}
				cases={cases}
			/>
			
			{/* Modal de Alerta de Warning */}
			<Modal
				show={showWarningAlert}
				onHide={() => setShowWarningAlert(false)}
				centered
				contentClassName="border-0"
				dialogStyle={{ maxWidth: '500px' }}
			>
				<div className="modal-filled bg-warning">
					<Modal.Body className="p-4">
						<div className="text-center">
							<i className="mdi mdi-alert-circle h1 mb-3"></i>
							<h4 className="mt-2 mb-3">Atenção</h4>
							<p className="mt-3 mb-0">
								Não é possível transferir casos de produtos diferentes. Por favor, selecione apenas casos do mesmo produto.
							</p>
							<Button variant="light" className="my-3" onClick={() => setShowWarningAlert(false)}>
								Entendi
							</Button>
						</div>
					</Modal.Body>
				</div>
			</Modal>
			
			<ToastContainer position='top-center'/>
		</>
	);
};

/**
 * Componente wrapper que aplica filtros da URL automaticamente
 * Segue o princípio Single Responsibility - apenas aplica filtros da URL
 */
const CasesListWithFilters = () => {
	useApplyUrlCaseFilters();
	return <CasesList />;
};

const CasesListWithProvider = () => (
	<CasesProvider>
		<CasesListWithFilters />
	</CasesProvider>
);

export default CasesListWithProvider;
