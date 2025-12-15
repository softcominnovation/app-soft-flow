"use client";
import { Card, Button, Modal, Placeholder, Nav, Tab } from "react-bootstrap";
import { ICase } from '@/types/cases/ICase';
import ResumeForm, { ResumeFormRef } from '@/app/(admin)/apps/cases/form/resumeForm/resumeForm';
import CaseTimeTracker from './components/CaseTimeTracker';
import CaseAnnotations from './components/CaseAnnotations';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import TimetrackerSkelleton from "./skelletons/timetrackerSkelleton";
import { CASE_CONFLICT_MODAL_CLOSE_EVENT, CASE_RESUME_MODAL_FORCE_CLOSE_EVENT } from '@/constants/caseTimeTracker';
import { finalizeCase, findCase } from '@/services/caseServices';
import { toast } from 'react-toastify';
import { useState, useContext, useEffect, useRef } from 'react';
import { CasesContext } from '@/contexts/casesContext';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useCasePermissions } from '@/hooks/useCasePermissions';

interface Props {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	case: ICase | null;
	setCase?: React.Dispatch<React.SetStateAction<ICase | null>>;
}

export default function CasesModalResume({ setOpen, open, case: caseData, setCase }: Props) {
	const [finalizing, setFinalizing] = useState(false);
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);
	const [localCaseData, setLocalCaseData] = useState<ICase | null>(caseData);
	const [saving, setSaving] = useState(false);
	const casesContext = useContext(CasesContext);
	const fetchCases = casesContext?.fetchCases;
	const resumeFormRef = useRef<ResumeFormRef>(null);
	
	// Calcula displayCaseData antes de usar no hook de permissões
	const displayCaseData = localCaseData || caseData;
	const permissions = useCasePermissions(displayCaseData);

	// Atualizar estado local quando caseData mudar
	useEffect(() => {
		setLocalCaseData(caseData);
	}, [caseData]);

	const handleAnotacaoCreated = async () => {
		if (!caseData?.caso.id) return;
		
		try {
			const response = await findCase(caseData.caso.id.toString());
			if (response?.data) {
				setLocalCaseData(response.data);
				if (setCase) {
					setCase(response.data);
				}
			}
		} catch (error) {
			console.error('Erro ao recarregar dados do caso:', error);
		}
	};

	const handleClose = () => {
		if (typeof window !== 'undefined') {
			window.dispatchEvent(new Event(CASE_CONFLICT_MODAL_CLOSE_EVENT));
			window.dispatchEvent(new Event(CASE_RESUME_MODAL_FORCE_CLOSE_EVENT));
		}
		setOpen(false);
	};

	const handleFinalizeCaseClick = () => {
		if (!displayCaseData?.caso.id || finalizing) {
			return;
		}
		setShowConfirmDialog(true);
	};

	const handleConfirmFinalize = async () => {
		if (!displayCaseData?.caso.id || finalizing) {
			return;
		}

		setFinalizing(true);
		setShowConfirmDialog(false);
		try {
			await finalizeCase(displayCaseData.caso.id.toString());
			toast.success('Caso finalizado com sucesso!');
			handleClose();
			// Recarregar a listagem de casos se o contexto estiver disponível
			if (fetchCases) {
				fetchCases();
			}
			// Recarregar a página para atualizar o card flutuante se houver
			setTimeout(() => {
				window.location.reload();
			}, 500);
		} catch (error: any) {
			console.error('Erro ao finalizar caso:', error);
			toast.error(error?.message || 'Erro ao finalizar o caso');
		} finally {
			setFinalizing(false);
		}
	};

	const handleSave = async () => {
		if (!resumeFormRef.current || saving) {
			return;
		}

		setSaving(true);
		try {
			await resumeFormRef.current.save();
		} catch (error) {
			console.error('Erro ao salvar:', error);
		} finally {
			setSaving(false);
		}
	};

	const hasAnotacoes = displayCaseData?.caso.anotacoes && displayCaseData.caso.anotacoes.length > 0;

	return (
		<>
			<style>{`
				${hasAnotacoes ? `
					.nav-tabs .nav-link[data-event-key="detalhes"].active,
					.nav-tabs .nav-link[data-event-key="detalhes"]:hover,
					.nav-tabs .nav-link[data-event-key="detalhes"] {
						color: #dc3545 !important;
					}
					.nav-tabs .nav-link[data-event-key="detalhes"].active {
						border-bottom-color: #dc3545 !important;
					}
				` : ''}
				
				.modal-extra-large .modal-body {
					padding: 0;
				}
			`}</style>
			<Modal 
				show={open} 
				onHide={handleClose} 
				backdrop="static" 
				fullscreen="sm-down"
				dialogClassName="modal-extra-large"
			>
				<Modal.Header closeButton className="bg-light border-bottom flex-shrink-0">
					<div className="d-flex align-items-center">
						<IconifyIcon icon="lucide:file-text" className="me-2 text-primary" />
						<Modal.Title className="fw-bold text-body">
							{!displayCaseData ? (
								<Placeholder as="span" animation="glow">
									<Placeholder xs={3} />
								</Placeholder>
							) : (
								`Caso #${displayCaseData.caso.id}`
							)}
						</Modal.Title>
					</div>
				</Modal.Header>
				<Modal.Body className="p-0 d-flex flex-column" style={{ maxHeight: 'calc(100vh - 180px)', overflow: 'hidden' }}>
					{/* Layout Mobile: Abas incluindo Tempo */}
					<div className="d-flex d-lg-none flex-column h-100" style={{ minHeight: 0 }}>
						<Tab.Container defaultActiveKey="resumo">
							<div className="d-flex flex-column h-100" style={{ minHeight: 0 }}>
								<Nav variant="tabs" className="nav nav-tabs nav-bordered border-bottom flex-shrink-0 px-4" style={{ marginTop: 0 }}>
									<Nav.Item>
										<Nav.Link eventKey="resumo" className="d-flex align-items-center">
											<IconifyIcon icon="lucide:info" className="me-2" />
											<span>Resumo</span>
										</Nav.Link>
									</Nav.Item>
									<Nav.Item>
										<Nav.Link 
											eventKey="detalhes" 
											className={`d-flex align-items-center ${hasAnotacoes ? 'fw-bold' : ''}`}
											style={hasAnotacoes ? { 
												'--bs-nav-link-color': '#dc3545',
												'--bs-nav-link-hover-color': '#dc3545',
												color: '#dc3545',
												borderBottomColor: '#dc3545'
											} as React.CSSProperties : {}}
										>
											<IconifyIcon 
												icon="lucide:file-text" 
												className="me-2" 
												style={hasAnotacoes ? { color: '#dc3545' } : {}}
											/>
											<span style={hasAnotacoes ? { color: '#dc3545' } : {}}>Anotações</span>
											{hasAnotacoes && displayCaseData?.caso?.anotacoes && (
												<span className="badge bg-danger ms-2" style={{ fontSize: '0.65rem' }}>
													{displayCaseData.caso.anotacoes.length}
												</span>
											)}
										</Nav.Link>
									</Nav.Item>
									<Nav.Item>
										<Nav.Link eventKey="tempo" className="d-flex align-items-center">
											<IconifyIcon icon="lucide:clock" className="me-2" />
											<span>Tempo</span>
										</Nav.Link>
									</Nav.Item>
								</Nav>
								<div className="custom-scrollbar px-4 py-4" style={{ flex: '1 1 auto', overflowY: 'auto', overflowX: 'hidden', minHeight: 0, maxHeight: '100%' }}>
									<Tab.Content>
										<Tab.Pane eventKey="resumo">
											<ResumeForm 
												ref={resumeFormRef}
												caseData={displayCaseData}
												onCaseUpdated={(updatedCase) => {
													setLocalCaseData(updatedCase);
													if (setCase) {
														setCase(updatedCase);
													}
												}}
											/>
										</Tab.Pane>
										<Tab.Pane eventKey="detalhes">
											{displayCaseData ? (
												<CaseAnnotations 
													anotacoes={displayCaseData.caso.anotacoes || []} 
													registro={displayCaseData.caso.id}
													onAnotacaoCreated={handleAnotacaoCreated}
												/>
											) : (
												<div className="text-center py-5">
													<IconifyIcon icon="lucide:loader-2" className="text-muted mb-3" style={{ fontSize: '3rem' }} />
													<h5 className="text-muted">Carregando caso...</h5>
												</div>
											)}
										</Tab.Pane>
										<Tab.Pane eventKey="tempo">
											{!displayCaseData ? (
												<TimetrackerSkelleton/>
											) : (
												<CaseTimeTracker 
													key={displayCaseData.caso.id} 
													caseData={displayCaseData}
													onCaseUpdated={(updatedCase) => {
														setLocalCaseData(updatedCase);
														if (setCase) {
															setCase(updatedCase);
														}
													}}
												/>
											)}
										</Tab.Pane>
									</Tab.Content>
								</div>
							</div>
						</Tab.Container>
					</div>

					{/* Layout Desktop: Duas colunas com tempo sempre visível */}
					<div className="d-none d-lg-flex h-100" style={{ minHeight: 0 }}>
						{/* Coluna esquerda - Conteúdo principal (Abas) */}
						<div className="d-flex flex-column" style={{ flex: '1 1 auto', minWidth: 0 }}>
							<Tab.Container defaultActiveKey="resumo">
								<div className="d-flex flex-column h-100" style={{ minHeight: 0 }}>
									<Nav variant="tabs" className="nav nav-tabs nav-bordered border-bottom flex-shrink-0 px-4" style={{ marginTop: 0 }}>
										<Nav.Item>
											<Nav.Link eventKey="resumo" className="d-flex align-items-center">
												<IconifyIcon icon="lucide:info" className="me-2" />
												<span>Resumo</span>
											</Nav.Link>
										</Nav.Item>
										<Nav.Item>
											<Nav.Link 
												eventKey="detalhes" 
												className={`d-flex align-items-center ${hasAnotacoes ? 'fw-bold' : ''}`}
												style={hasAnotacoes ? { 
													'--bs-nav-link-color': '#dc3545',
													'--bs-nav-link-hover-color': '#dc3545',
													color: '#dc3545',
													borderBottomColor: '#dc3545'
												} as React.CSSProperties : {}}
											>
												<IconifyIcon 
													icon="lucide:file-text" 
													className="me-2" 
													style={hasAnotacoes ? { color: '#dc3545' } : {}}
												/>
												<span style={hasAnotacoes ? { color: '#dc3545' } : {}}>Anotações</span>
												{hasAnotacoes && caseData?.caso?.anotacoes && (
													<span className="badge bg-danger ms-2" style={{ fontSize: '0.65rem' }}>
														{caseData.caso.anotacoes.length}
													</span>
												)}
											</Nav.Link>
										</Nav.Item>
									</Nav>
									<div className="custom-scrollbar px-4 py-4" style={{ flex: '1 1 auto', overflowY: 'auto', overflowX: 'hidden', minHeight: 0, maxHeight: '100%' }}>
										<Tab.Content>
											<Tab.Pane eventKey="resumo">
												<ResumeForm 
													ref={resumeFormRef}
													caseData={displayCaseData}
													onCaseUpdated={(updatedCase) => {
														setLocalCaseData(updatedCase);
														if (setCase) {
															setCase(updatedCase);
														}
													}}
												/>
											</Tab.Pane>
											<Tab.Pane eventKey="detalhes">
												{displayCaseData ? (
													<CaseAnnotations 
														anotacoes={displayCaseData.caso.anotacoes || []} 
														registro={displayCaseData.caso.id}
														onAnotacaoCreated={handleAnotacaoCreated}
													/>
												) : (
													<div className="text-center py-5">
														<IconifyIcon icon="lucide:loader-2" className="text-muted mb-3" style={{ fontSize: '3rem' }} />
														<h5 className="text-muted">Carregando caso...</h5>
													</div>
												)}
											</Tab.Pane>
										</Tab.Content>
									</div>
								</div>
							</Tab.Container>
						</div>

						{/* Separador vertical sutil */}
						<div className="border-start border-secondary" style={{ width: '1px', margin: '12px 0', opacity: 0.3 }} />

						{/* Coluna direita - Tempo (sempre visível) */}
						<div className="d-flex flex-column" style={{ width: '480px', minWidth: '480px', maxWidth: '480px' }}>
							<div className="custom-scrollbar px-4 py-4" style={{ flex: '1 1 auto', overflowY: 'auto', overflowX: 'hidden' }}>
								{!caseData ? (
									<TimetrackerSkelleton/>
								) : (
									<CaseTimeTracker 
										key={caseData.caso.id} 
										caseData={caseData}
										onCaseUpdated={(updatedCase) => {
											setLocalCaseData(updatedCase);
											if (setCase) {
												setCase(updatedCase);
											}
										}}
									/>
								)}
							</div>
						</div>
					</div>
				</Modal.Body>
				<Modal.Footer className="bg-light border-top">
					<Button 
						variant="primary" 
						onClick={handleSave} 
						disabled={saving || !displayCaseData || !permissions.canSave}
						className="d-flex align-items-center"
						style={{ backgroundColor: '#0d6efd', borderColor: '#0d6efd' }}
					>
						{saving ? (
							<>
								<span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
								Salvando...
							</>
						) : (
							<>
								<IconifyIcon icon="lucide:save" className="me-1" />
								Salvar
							</>
						)}
					</Button>
					<Button 
						variant="success" 
						onClick={handleFinalizeCaseClick} 
						className="d-flex align-items-center"
					>
						{finalizing ? (
							<>
								<span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
								Finalizando...
							</>
						) : (
							<>
								<IconifyIcon icon="lucide:check-circle" className="me-1" />
								Finalizar Caso
							</>
						)}
					</Button>
					<Button variant="secondary" onClick={handleClose} className="d-flex align-items-center">
						<IconifyIcon icon="lucide:x" className="me-1" />
						Fechar
					</Button>
				</Modal.Footer>
			</Modal>
			{displayCaseData && (
				<ConfirmDialog
					show={showConfirmDialog}
					title="Finalizar Caso"
					message={`Deseja realmente finalizar o Caso #${displayCaseData.caso.id}?`}
					confirmText="Finalizar"
					cancelText="Cancelar"
					confirmVariant="success"
					onConfirm={handleConfirmFinalize}
					onCancel={() => setShowConfirmDialog(false)}
					loading={finalizing}
				/>
			)}
		</>
	);
}
