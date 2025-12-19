import { useState, useRef, useContext } from 'react';
import { toast } from 'react-toastify';
import { ICase } from '@/types/cases/ICase';
import { finalizeCase, findCase, deleteCase, cloneCase } from '@/services/caseServices';
import { CasesContext } from '@/contexts/casesContext';
import { CASE_CONFLICT_MODAL_CLOSE_EVENT, CASE_RESUME_MODAL_FORCE_CLOSE_EVENT } from '@/constants/caseTimeTracker';
import { ResumeFormRef } from '@/app/(admin)/apps/cases/form/resumeForm/resumeForm';

interface UseCaseModalActionsProps {
	caseData: ICase | null;
	setCase?: (caseData: ICase | null) => void;
	setLocalCaseData: (caseData: ICase | null) => void;
	onClose: () => void;
	openModal?: (caseData: ICase) => void;
}

export function useCaseModalActions({
	caseData,
	setCase,
	setLocalCaseData,
	onClose,
	openModal,
}: UseCaseModalActionsProps) {
	const [finalizing, setFinalizing] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const [saving, setSaving] = useState(false);
	const [cloning, setCloning] = useState(false);
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	
	const casesContext = useContext(CasesContext);
	const fetchCases = casesContext?.fetchCases;
	const resumeFormRef = useRef<ResumeFormRef>(null);

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
			onClose();
			if (fetchCases) {
				fetchCases();
			}
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

	const handleCloneCase = async () => {
		if (!caseData?.caso.id || cloning) {
			return;
		}

		setCloning(true);
		try {
			const res = await cloneCase(caseData.caso.id.toString());
			toast.success('Caso clonado com sucesso!');
			
			const novoRegistro = res?.data?.registro;
			
			if (novoRegistro && openModal) {
				try {
					const response = await findCase(novoRegistro.toString());
					if (response?.data) {
						onClose();
						openModal(response.data);
					}
				} catch (findError) {
					console.error('Erro ao buscar caso clonado:', findError);
					onClose();
				}
			} else {
				onClose();
			}
			
			if (fetchCases) {
				fetchCases();
			}
		} catch (error: any) {
			console.error('Erro ao clonar caso:', error);
			toast.error(error?.message || 'Erro ao clonar o caso');
		} finally {
			setCloning(false);
		}
	};

	const handleShareCase = async () => {
		if (!caseData?.caso.id) {
			return;
		}

		const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://app-soft-flowss.vercel.app';
		const shareUrl = `${baseUrl}/apps/cases/list?caseId=${caseData.caso.id}`;

		try {
			await navigator.clipboard.writeText(shareUrl);
			toast.success('Link copiado para a área de transferência!');
		} catch (error) {
			console.error('Erro ao copiar link:', error);
			// Fallback para navegadores que não suportam clipboard API
			const textArea = document.createElement('textarea');
			textArea.value = shareUrl;
			textArea.style.position = 'fixed';
			textArea.style.opacity = '0';
			document.body.appendChild(textArea);
			textArea.select();
			try {
				document.execCommand('copy');
				toast.success('Link copiado para a área de transferência!');
			} catch (err) {
				toast.error('Erro ao copiar link. Tente novamente.');
			}
			document.body.removeChild(textArea);
		}
	};

	const handleDeleteCaseClick = () => {
		if (!caseData?.caso.id || deleting) {
			return;
		}
		setShowDeleteDialog(true);
	};

	const handleConfirmDelete = async () => {
		if (!caseData?.caso.id || deleting) {
			return;
		}

		setDeleting(true);
		setShowDeleteDialog(false);
		try {
			await deleteCase(caseData.caso.id.toString());
			toast.success('Caso excluído com sucesso!');
			onClose();
			if (fetchCases) {
				fetchCases();
			}
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

	const handleClose = () => {
		if (typeof window !== 'undefined') {
			window.dispatchEvent(new Event(CASE_CONFLICT_MODAL_CLOSE_EVENT));
			window.dispatchEvent(new Event(CASE_RESUME_MODAL_FORCE_CLOSE_EVENT));
		}
		onClose();
	};

	return {
		// Refs
		resumeFormRef,
		
		// Loading states
		finalizing,
		deleting,
		saving,
		cloning,
		
		// Dialog states
		showConfirmDialog,
		showDeleteDialog,
		setShowConfirmDialog,
		setShowDeleteDialog,
		
		// Handlers
		handleAnotacaoCreated,
		handleSave,
		handleFinalizeCaseClick,
		handleConfirmFinalize,
		handleCloneCase,
		handleShareCase,
		handleDeleteCaseClick,
		handleConfirmDelete,
		handleClose,
	};
}

