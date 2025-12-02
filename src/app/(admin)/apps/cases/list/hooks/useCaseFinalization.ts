'use client';
import { useState, useCallback } from 'react';
import { finalizeCase } from '@/services/caseServices';
import { toast } from 'react-toastify';

interface UseCaseFinalizationReturn {
	finalizingCaseId: string | null;
	caseToFinalize: string | null;
	handleFinalizeCaseClick: (caseId: string) => void;
	handleConfirmFinalize: () => Promise<void>;
	showConfirmDialog: boolean;
	setShowConfirmDialog: (show: boolean) => void;
	setCaseToFinalize: (caseId: string | null) => void;
	onFinalizeSuccess?: () => void;
}

/**
 * Hook para gerenciar a finalização de casos
 */
export default function useCaseFinalization(
	onFinalizeSuccess?: () => void
): UseCaseFinalizationReturn {
	const [finalizingCaseId, setFinalizingCaseId] = useState<string | null>(null);
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);
	const [caseToFinalize, setCaseToFinalize] = useState<string | null>(null);

	const handleFinalizeCaseClick = useCallback((caseId: string) => {
		if (finalizingCaseId) {
			return;
		}
		setCaseToFinalize(caseId);
		setShowConfirmDialog(true);
	}, [finalizingCaseId]);

	const handleConfirmFinalize = useCallback(async () => {
		if (!caseToFinalize || finalizingCaseId) {
			return;
		}

		setFinalizingCaseId(caseToFinalize);
		setShowConfirmDialog(false);
		try {
			await finalizeCase(caseToFinalize);
			toast.success('Caso finalizado com sucesso!');
			onFinalizeSuccess?.();
			setTimeout(() => {
				window.location.reload();
			}, 500);
		} catch (error: any) {
			console.error('Erro ao finalizar caso:', error);
			toast.error(error?.message || 'Erro ao finalizar o caso');
		} finally {
			setFinalizingCaseId(null);
			setCaseToFinalize(null);
		}
	}, [caseToFinalize, finalizingCaseId, onFinalizeSuccess]);

	return {
		finalizingCaseId,
		caseToFinalize,
		handleFinalizeCaseClick,
		handleConfirmFinalize,
		showConfirmDialog,
		setShowConfirmDialog,
		setCaseToFinalize,
	};
}

