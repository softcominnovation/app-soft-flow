'use client';
import { Card, CardBody, Col, Row } from 'react-bootstrap';
import CaseFilters from './caseFilters';
import CasesTable from './cases';
import { CasesProvider, useCasesContext } from '@/contexts/casesContext';
import { ToastContainer } from 'react-toastify';
import ProjectsSection from './components/caseListComponents/projectsSection';
import CasesFAB from './components/CasesFAB';
import { useState, useRef, useCallback } from 'react';
import { useApplyUrlCaseFilters } from '@/hooks';
import TransferCasesModal from './components/TransferCasesModal';
import { Modal } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { ICase } from '@/types/cases/ICase';
import { findCase } from '@/services/caseServices';
import Spinner from '@/components/Spinner';
import { Form } from 'react-bootstrap';

const CasesList = () => {
	const { cases, loading } = useCasesContext();
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
							
							<div className="table-responsive">
								<CasesTable 
									data={cases} 
									loading={loading}
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
