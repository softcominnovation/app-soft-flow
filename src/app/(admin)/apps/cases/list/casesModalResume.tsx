"use client";
import { Card, Button, Modal, Placeholder, Nav, Tab } from "react-bootstrap";
import { ICase } from '@/types/cases/ICase';
import ResumeForm from '@/app/(admin)/apps/cases/form/resumeForm/resumeForm';
import CaseTimeTracker from './components/CaseTimeTracker';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import TimetrackerSkelleton from "./skelletons/timetrackerSkelleton";
import { CASE_CONFLICT_MODAL_CLOSE_EVENT, CASE_RESUME_MODAL_FORCE_CLOSE_EVENT } from '@/constants/caseTimeTracker';
import { finalizeCase } from '@/services/caseServices';
import { toast } from 'react-toastify';
import { useState, useContext } from 'react';
import { CasesContext } from '@/contexts/casesContext';
import ConfirmDialog from '@/components/ConfirmDialog';

interface Props {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	case: ICase | null;
}

export default function CasesModalResume({ setOpen, open, case: caseData }: Props) {
	const [finalizing, setFinalizing] = useState(false);
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);
	// Usar useContext diretamente - retorna undefined se não estiver dentro do provider
	const casesContext = useContext(CasesContext);
	const fetchCases = casesContext?.fetchCases;

	const handleClose = () => {
		if (typeof window !== 'undefined') {
			window.dispatchEvent(new Event(CASE_CONFLICT_MODAL_CLOSE_EVENT));
			window.dispatchEvent(new Event(CASE_RESUME_MODAL_FORCE_CLOSE_EVENT));
		}
		setOpen(false);
	};

	const handleFinalizeCaseClick = () => {
		if (!caseData?.caso.id || finalizing) {
			return;
		}
		setShowConfirmDialog(true);
	};

	const handleConfirmFinalize = async () => {
		if (!caseData?.caso.id || finalizing) {
			return;
		}

		setFinalizing(true);
		setShowConfirmDialog(false);
		try {
			await finalizeCase(caseData.caso.id.toString());
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

	return (
		<>
			<Modal show={open} onHide={handleClose} size="xl" backdrop="static" fullscreen="sm-down">
				<Modal.Header closeButton className="bg-primary text-white flex-shrink-0">
					<div className="d-flex align-items-center">
						<IconifyIcon icon="lucide:file-text" className="me-2" />
						<Modal.Title className="fw-bold">
							{!caseData ? (
								<Placeholder as="span" animation="glow">
									<Placeholder xs={3} />
								</Placeholder>
							) : (
								`Caso #${caseData.caso.id}`
							)}
						</Modal.Title>
					</div>
				</Modal.Header>
				<Modal.Body className="p-0 d-flex flex-column" style={{ maxHeight: 'calc(100vh - 180px)', overflow: 'hidden' }}>
					<Tab.Container defaultActiveKey="resumo">
						<div className="d-flex flex-column h-100" style={{ minHeight: 0 }}>
							<Nav variant="tabs" className="nav nav-tabs nav-bordered border-bottom flex-shrink-0">
								<Nav.Item>
									<Nav.Link eventKey="resumo" className="d-flex align-items-center">
										<IconifyIcon icon="lucide:info" className="me-2" />
										<span>Resumo</span>
									</Nav.Link>
								</Nav.Item>
								<Nav.Item>
									<Nav.Link eventKey="detalhes" className="d-flex align-items-center">
										<IconifyIcon icon="lucide:file-text" className="me-2" />
										<span>Anotações</span>
									</Nav.Link>
								</Nav.Item>
								<Nav.Item>
									<Nav.Link eventKey="tempo" className="d-flex align-items-center">
										<IconifyIcon icon="lucide:clock" className="me-2" />
										<span>Tempo</span>
									</Nav.Link>
								</Nav.Item>
							</Nav>
							<div className="p-4" style={{ flex: '1 1 auto', overflowY: 'auto', overflowX: 'hidden', minHeight: 0, maxHeight: '100%' }}>
								<Tab.Content>
									<Tab.Pane eventKey="resumo">
										<ResumeForm caseData={caseData}/>
									</Tab.Pane>
									<Tab.Pane eventKey="detalhes">
										<div className="text-center py-5">
											<IconifyIcon icon="lucide:file-text" className="text-muted mb-3" style={{ fontSize: '3rem' }} />
											<h5 className="text-muted">Teste Aba Detalhes</h5>
											<p className="text-muted">Conteúdo da aba de detalhes será implementado aqui.</p>
										</div>
									</Tab.Pane>
									<Tab.Pane eventKey="tempo">
										{
											!caseData ? <TimetrackerSkelleton/> : <CaseTimeTracker key={caseData.caso.id} caseData={caseData} />
										}
									</Tab.Pane>
								</Tab.Content>
							</div>
						</div>
					</Tab.Container>
				</Modal.Body>
				<Modal.Footer className="bg-light border-top">
					<Button 
						variant="success" 
						onClick={handleFinalizeCaseClick} 
						disabled={finalizing || !caseData}
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
			{caseData && (
				<ConfirmDialog
					show={showConfirmDialog}
					title="Finalizar Caso"
					message={`Deseja realmente finalizar o Caso #${caseData.caso.id}?`}
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
