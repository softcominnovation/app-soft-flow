'use client';
import { useState, useEffect, useCallback } from 'react';
import { CASE_RESUME_MODAL_FORCE_CLOSE_EVENT } from '@/constants/caseTimeTracker';
import { ICase } from '@/types/cases/ICase';

interface UseCaseModalReturn {
	openResumeModal: boolean;
	especifiedCase: ICase | null;
	openModal: (caseData: ICase) => void;
	closeModal: () => void;
	setCase: (caseData: ICase | null) => void;
}

/**
 * Hook para gerenciar o estado do modal de resumo de caso
 */
export default function useCaseModal(): UseCaseModalReturn {
	const [openResumeModal, setOpenResumeModal] = useState(false);
	const [especifiedCase, setEspecifiedCase] = useState<ICase | null>(null);

	// Limpa o caso quando o modal fecha
	useEffect(() => {
		if (!openResumeModal) {
			setEspecifiedCase(null);
		}
	}, [openResumeModal]);

	// Listener para fechar o modal via evento
	useEffect(() => {
		if (typeof window === 'undefined') {
			return;
		}

		const handleForceClose = () => {
			setOpenResumeModal(false);
		};

		window.addEventListener(CASE_RESUME_MODAL_FORCE_CLOSE_EVENT, handleForceClose);
		return () => {
			window.removeEventListener(CASE_RESUME_MODAL_FORCE_CLOSE_EVENT, handleForceClose);
		};
	}, []);

	const openModal = useCallback((caseData: ICase) => {
		setEspecifiedCase(caseData);
		setOpenResumeModal(true);
	}, []);

	const closeModal = useCallback(() => {
		setOpenResumeModal(false);
	}, []);

	const setCase = useCallback((caseData: ICase | null) => {
		setEspecifiedCase(caseData);
	}, []);

	return {
		openResumeModal,
		especifiedCase,
		openModal,
		closeModal,
		setCase,
	};
}

