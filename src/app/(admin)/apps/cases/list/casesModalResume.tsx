"use client";
import { Card, Button, Modal, Placeholder, Nav, Tab } from "react-bootstrap";
import { ICase } from '@/types/cases/ICase';
import ResumeForm, { ResumeFormRef } from '@/app/(admin)/apps/cases/form/resumeForm/resumeForm';
import CaseTimeTracker from './components/CaseTimeTracker';
import CaseAnnotations from './components/CaseAnnotations';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import TimetrackerSkelleton from "./skelletons/timetrackerSkelleton";
import { CASE_CONFLICT_MODAL_CLOSE_EVENT, CASE_RESUME_MODAL_FORCE_CLOSE_EVENT } from '@/constants/caseTimeTracker';
import { finalizeCase, findCase, deleteCase } from '@/services/caseServices';
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
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [deleting, setDeleting] = useState(false);
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

	// Prevenir scroll do body quando modal está aberto (especialmente no mobile)
	useEffect(() => {
		if (open) {
			// Salvar a posição atual do scroll
			const scrollY = window.scrollY;
			document.body.style.position = 'fixed';
			document.body.style.top = `-${scrollY}px`;
			document.body.style.width = '100%';
			document.body.style.overflow = 'hidden';
			
			return () => {
				// Restaurar o scroll quando o modal fechar
				document.body.style.position = '';
				document.body.style.top = '';
				document.body.style.width = '';
				document.body.style.overflow = '';
				window.scrollTo(0, scrollY);
			};
		}
	}, [open]);

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

	const handleDeleteCaseClick = () => {
		if (!displayCaseData?.caso.id || deleting) {
			return;
		}
		setShowDeleteDialog(true);
	};

	const handleConfirmDelete = async () => {
		if (!displayCaseData?.caso.id || deleting) {
			return;
		}

		setDeleting(true);
		setShowDeleteDialog(false);
		try {
			await deleteCase(displayCaseData.caso.id.toString());
			toast.success('Caso excluído com sucesso!');
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
			console.error('Erro ao excluir caso:', error);
			toast.error(error?.message || 'Erro ao excluir o caso');
		} finally {
			setDeleting(false);
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
				
				/* Prevenir scroll do body quando modal está aberto */
				body.modal-open {
					overflow: hidden !important;
					position: fixed !important;
					width: 100% !important;
					height: 100% !important;
				}

				.modal-fullscreen {
					position: fixed !important;
					top: 0 !important;
					left: 0 !important;
					right: 0 !important;
					bottom: 0 !important;
					margin: 0 !important;
					max-width: 100% !important;
					width: 100% !important;
					height: 100% !important;
				}

				.modal-fullscreen .modal-dialog {
					margin: 0 !important;
					max-width: 100% !important;
					width: 100% !important;
					height: 100% !important;
					display: flex !important;
					flex-direction: column !important;
				}

				.modal-fullscreen .modal-content {
					height: 100% !important;
					border: 0 !important;
					border-radius: 0 !important;
					display: flex !important;
					flex-direction: column !important;
				}
				
				.modal-fullscreen .modal-body {
					padding: 0;
					flex: 1 1 auto;
					overflow: hidden;
					display: flex;
					flex-direction: column;
					min-height: 0;
					max-height: 100vh;
				}

				/* Garantir que o modal-dialog não cause scroll */
				@media (max-width: 991.98px) {
					.modal-fullscreen {
						position: fixed !important;
						top: 0 !important;
						left: 0 !important;
						right: 0 !important;
						bottom: 0 !important;
						margin: 0 !important;
						width: 100vw !important;
						height: 100vh !important;
						max-width: 100vw !important;
						max-height: 100vh !important;
					}

					.modal-fullscreen .modal-dialog {
						margin: 0 !important;
						max-width: 100% !important;
						width: 100% !important;
						height: 100% !important;
						max-height: 100vh !important;
						display: flex !important;
						flex-direction: column !important;
					}

					.modal-fullscreen .modal-content {
						height: 100vh !important;
						max-height: 100vh !important;
						border: 0 !important;
						border-radius: 0 !important;
						display: flex !important;
						flex-direction: column !important;
						overflow: hidden !important;
					}

					.modal-fullscreen .modal-header {
						flex-shrink: 0;
					}

					.modal-fullscreen .modal-footer {
						flex-shrink: 0;
					}
				}

				/* Melhorias Mobile */
				@media (max-width: 991.98px) {
					/* Header mais compacto no mobile */
					.modal-fullscreen .modal-header {
						padding: 0.75rem 1rem;
						min-height: 56px;
					}

					.modal-fullscreen .modal-title {
						font-size: 1.1rem;
					}

					/* Abas mais touch-friendly */
					.modal-fullscreen .nav-tabs {
						padding: 0.5rem 1rem;
						gap: 0.25rem;
					}

					.modal-fullscreen .nav-tabs .nav-link {
						padding: 0.75rem 1rem;
						font-size: 0.9rem;
						border-radius: 0.375rem 0.375rem 0 0;
						min-height: 44px;
						display: flex;
						align-items: center;
						justify-content: center;
					}

					.modal-fullscreen .nav-tabs .nav-link .iconify-icon {
						font-size: 1.1rem;
					}

					/* Conteúdo com padding adequado */
					.modal-fullscreen .modal-body .custom-scrollbar {
						padding: 1rem !important;
					}

					/* Footer com botões em grid no mobile */
					.modal-fullscreen .modal-footer {
						padding: 1rem;
						flex-wrap: wrap;
						gap: 0.5rem;
						background: #f8f9fa;
						border-top: 1px solid #dee2e6;
					}

					.modal-fullscreen .modal-footer .btn {
						flex: 1 1 calc(50% - 0.25rem);
						min-width: calc(50% - 0.25rem);
						min-height: 44px;
						font-size: 0.9rem;
						padding: 0.625rem 1rem;
						display: flex;
						align-items: center;
						justify-content: center;
						gap: 0.5rem;
					}

					.modal-fullscreen .modal-footer .btn .iconify-icon {
						font-size: 1.1rem;
					}

					/* Botão Fechar em linha própria */
					.modal-fullscreen .modal-footer .btn-secondary {
						flex: 1 1 100%;
						min-width: 100%;
						margin-top: 0.25rem;
					}

					/* Cards com melhor espaçamento */
					.modal-fullscreen .card {
						margin-bottom: 1rem;
					}

					.modal-fullscreen .card-header {
						padding: 1rem;
					}

					.modal-fullscreen .card-body {
						padding: 1rem !important;
					}

					/* Form groups com melhor espaçamento */
					.modal-fullscreen .form-group {
						margin-bottom: 1.25rem;
					}

					.modal-fullscreen .form-label {
						font-size: 0.875rem;
						margin-bottom: 0.5rem;
					}

					.modal-fullscreen .form-label .iconify-icon {
						font-size: 1rem;
					}

					/* Inputs mais touch-friendly */
					.modal-fullscreen .form-control,
					.modal-fullscreen .react-select__control {
						min-height: 44px;
						font-size: 1rem;
					}

					/* Badge nas abas menor */
					.modal-fullscreen .nav-tabs .badge {
						font-size: 0.65rem;
						padding: 0.25rem 0.5rem;
					}

					/* Melhor espaçamento entre cards */
					.modal-fullscreen .card {
						margin-bottom: 1.25rem;
						border-radius: 0.5rem;
					}

					/* Headers de cards mais compactos no mobile */
					.modal-fullscreen .card-header h5,
					.modal-fullscreen .card-header h6 {
						font-size: 0.95rem;
						font-weight: 600;
					}

					.modal-fullscreen .card-header .iconify-icon {
						font-size: 1rem;
					}

					.modal-fullscreen .card-header {
						padding: 0.5rem 0 !important;
					}

					/* Headers de cards compactos também no desktop */
					.modal-fullscreen .card-header h5,
					.modal-fullscreen .card-header h6 {
						font-size: 0.95rem;
						font-weight: 600;
						margin-bottom: 0;
					}

					.modal-fullscreen .card-header .iconify-icon {
						font-size: 1rem;
					}

					.modal-fullscreen .accordion-toggle {
						padding: 0.5rem 1rem !important;
					}

					/* Labels mais legíveis */
					.modal-fullscreen .form-label {
						font-size: 0.875rem;
						margin-bottom: 0.5rem;
						font-weight: 600;
					}

					/* Textareas com melhor altura no mobile */
					.modal-fullscreen textarea.form-control {
						font-size: 1rem;
						line-height: 1.5;
						min-height: 80px;
					}

					/* Melhor contraste e espaçamento nos inputs */
					.modal-fullscreen .form-control:focus,
					.modal-fullscreen .react-select__control--is-focused {
						border-color: #0d6efd;
						box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
					}

					/* Accordion toggle mais touch-friendly */
					.modal-fullscreen .accordion-toggle {
						min-height: 48px;
						display: flex;
						align-items: center;
					}

					/* Scrollbar mais visível no mobile */
					.modal-fullscreen .custom-scrollbar::-webkit-scrollbar {
						width: 6px;
					}

					.modal-fullscreen .custom-scrollbar::-webkit-scrollbar-thumb {
						background-color: rgba(0, 0, 0, 0.2);
						border-radius: 3px;
					}

					/* Espaçamento melhor entre seções */
					.modal-fullscreen .d-flex.flex-column[style*="gap"] {
						gap: 1.25rem !important;
					}
				}
			`}</style>
			<Modal 
				show={open} 
				onHide={handleClose} 
				backdrop="static" 
				fullscreen={true}
			>
				<Modal.Header closeButton className="bg-light border-bottom flex-shrink-0">
					<div className="d-flex align-items-center w-100">
						<IconifyIcon icon="lucide:file-text" className="me-2 text-primary d-none d-lg-block" />
						<IconifyIcon icon="lucide:file-text" className="me-2 text-primary d-lg-none" style={{ fontSize: '1.25rem' }} />
						<Modal.Title className="fw-bold text-body mb-0">
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
				<Modal.Body className="p-0 d-flex flex-column" style={{ flex: '1 1 auto', overflow: 'hidden', minHeight: 0 }}>
					{/* Layout Mobile: Abas incluindo Tempo */}
					<div className="d-flex d-lg-none flex-column h-100" style={{ minHeight: 0 }}>
						<Tab.Container defaultActiveKey="resumo">
							<div className="d-flex flex-column h-100" style={{ minHeight: 0 }}>
								<Nav variant="tabs" className="nav nav-tabs nav-bordered border-bottom flex-shrink-0" style={{ marginTop: 0, padding: '0 1rem' }}>
									<Nav.Item className="flex-fill">
										<Nav.Link eventKey="resumo" className="d-flex align-items-center justify-content-center text-center">
											<IconifyIcon icon="lucide:info" className="me-1 d-lg-none" style={{ fontSize: '1.1rem' }} />
											<IconifyIcon icon="lucide:info" className="me-2 d-none d-lg-inline" />
											<span>Resumo</span>
										</Nav.Link>
									</Nav.Item>
									<Nav.Item className="flex-fill">
										<Nav.Link 
											eventKey="detalhes" 
											className={`d-flex align-items-center justify-content-center text-center ${hasAnotacoes ? 'fw-bold' : ''}`}
											style={hasAnotacoes ? { 
												'--bs-nav-link-color': '#dc3545',
												'--bs-nav-link-hover-color': '#dc3545',
												color: '#dc3545',
												borderBottomColor: '#dc3545'
											} as React.CSSProperties : {}}
										>
											<IconifyIcon 
												icon="lucide:file-text" 
												className="me-1 d-lg-none" 
												style={hasAnotacoes ? { color: '#dc3545', fontSize: '1.1rem' } : { fontSize: '1.1rem' }}
											/>
											<IconifyIcon 
												icon="lucide:file-text" 
												className="me-2 d-none d-lg-inline" 
												style={hasAnotacoes ? { color: '#dc3545' } : {}}
											/>
											<span style={hasAnotacoes ? { color: '#dc3545' } : {}}>Anotações</span>
											{hasAnotacoes && displayCaseData?.caso?.anotacoes && (
												<span className="badge bg-danger ms-1" style={{ fontSize: '0.65rem' }}>
													{displayCaseData.caso.anotacoes.length}
												</span>
											)}
										</Nav.Link>
									</Nav.Item>
									<Nav.Item className="flex-fill">
										<Nav.Link eventKey="tempo" className="d-flex align-items-center justify-content-center text-center">
											<IconifyIcon icon="lucide:clock" className="me-1 d-lg-none" style={{ fontSize: '1.1rem' }} />
											<IconifyIcon icon="lucide:clock" className="me-2 d-none d-lg-inline" />
											<span>Tempo</span>
										</Nav.Link>
									</Nav.Item>
								</Nav>
								<div className="custom-scrollbar px-3 px-lg-4 py-3 py-lg-4" style={{ flex: '1 1 auto', overflowY: 'auto', overflowX: 'hidden', minHeight: 0, maxHeight: '100%' }}>
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
					<div className="d-flex d-lg-none flex-column w-100 gap-2">
						<div className="d-flex gap-2 w-100">
							<Button 
								variant="primary" 
								onClick={handleSave} 
								disabled={saving || !displayCaseData || !permissions.canSave}
								className="d-flex align-items-center justify-content-center flex-fill"
								style={{ backgroundColor: '#0d6efd', borderColor: '#0d6efd', minHeight: '44px' }}
							>
								{saving ? (
									<>
										<span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
										Salvando...
									</>
								) : (
									<>
										<IconifyIcon icon="lucide:save" className="me-1" style={{ fontSize: '1.1rem' }} />
										Salvar
									</>
								)}
							</Button>
							<Button 
								variant="success" 
								onClick={handleFinalizeCaseClick} 
								disabled={finalizing || !displayCaseData}
								className="d-flex align-items-center justify-content-center flex-fill"
								style={{ minHeight: '44px' }}
							>
								{finalizing ? (
									<>
										<span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
										Finalizando...
									</>
								) : (
									<>
										<IconifyIcon icon="lucide:check-circle" className="me-1" style={{ fontSize: '1.1rem' }} />
										Finalizar Caso
									</>
								)}
							</Button>
						</div>
						<Button 
							variant="danger" 
							onClick={handleDeleteCaseClick} 
							disabled={deleting || !displayCaseData || !permissions.canDelete}
							className="d-flex align-items-center justify-content-center w-100"
							style={{ minHeight: '44px' }}
						>
							{deleting ? (
								<>
									<span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
									Excluindo...
								</>
							) : (
								<>
									<IconifyIcon icon="lucide:trash-2" className="me-1" style={{ fontSize: '1.1rem' }} />
									Excluir
								</>
							)}
						</Button>
					</div>
					{/* Desktop buttons - alinhados à direita */}
					<div className="d-none d-lg-flex gap-2 justify-content-end">
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
							disabled={finalizing || !displayCaseData}
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
						<Button 
							variant="danger" 
							onClick={handleDeleteCaseClick} 
							disabled={deleting || !displayCaseData || !permissions.canDelete}
							className="d-flex align-items-center"
						>
							{deleting ? (
								<>
									<span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
									Excluindo...
								</>
							) : (
								<>
									<IconifyIcon icon="lucide:trash-2" className="me-1" />
									Excluir
								</>
							)}
						</Button>
					</div>
			</Modal.Footer>
			</Modal>
			{displayCaseData && (
				<>
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
					<ConfirmDialog
						show={showDeleteDialog}
						title="Excluir Caso"
						message={`Deseja realmente excluir o Caso #${displayCaseData.caso.id}? Esta ação não pode ser desfeita.`}
						confirmText="Excluir"
						cancelText="Cancelar"
						confirmVariant="danger"
						onConfirm={handleConfirmDelete}
						onCancel={() => setShowDeleteDialog(false)}
						loading={deleting}
					/>
				</>
			)}
		</>
	);
}
