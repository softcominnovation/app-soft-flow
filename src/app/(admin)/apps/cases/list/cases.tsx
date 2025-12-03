'use client';
import { useEffect, useRef, useCallback, useState } from 'react';
import { useCasesContext } from '@/contexts/casesContext';
import CasesModalResume from './casesModalResume';
import CasesTableDesktop from './components/CasesTableDesktop';
import CasesTableMobile from './components/CasesTableMobile';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useCaseModal, useCaseModalFromUrl, useCaseFinalization } from './hooks';
import { CASE_CONFLICT_MODAL_CLOSE_EVENT, CASE_RESUME_MODAL_FORCE_CLOSE_EVENT } from '@/constants/caseTimeTracker';
import { ICase } from '@/types/cases/ICase';

type Props = {
	data: ICase[] | null;
	loading: boolean;
};

/**
 * Componente principal da tabela de casos
 * Orquestra a renderização e lógica de negócio dos casos
 */
const CasesTable = ({ data, loading }: Props) => {
	const { fetchEspecifiedCases, loadMoreCases, pagination, loadingMore, fetchCases } = useCasesContext();
	const sentinelRef = useRef<HTMLDivElement | null>(null);
	const [loadingCaseId, setLoadingCaseId] = useState<string | null>(null);

	// Gerencia o estado do modal
	const { openResumeModal, especifiedCase, openModal, closeModal, setCase } = useCaseModal();

	// Gerencia a finalização de casos
	const {
		finalizingCaseId,
		caseToFinalize,
		handleFinalizeCaseClick,
		handleConfirmFinalize,
		showConfirmDialog,
		setShowConfirmDialog,
		setCaseToFinalize,
	} = useCaseFinalization(fetchCases);

	// Callback estável para quando o caso for carregado via URL
	const handleCaseLoadedFromUrl = useCallback(
		(caseData: ICase) => {
			setCase(caseData);
			openModal(caseData);
		},
		[setCase, openModal]
	);

	// Abre o modal automaticamente se houver um ID de caso nos parâmetros da URL
	useCaseModalFromUrl({
		fetchEspecifiedCases,
		onCaseLoaded: handleCaseLoadedFromUrl,
	});

	// Paginação infinita
	useEffect(() => {
		const node = sentinelRef.current;

		if (!node || !pagination?.has_more) {
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						loadMoreCases();
					}
				});
			},
			{
				root: null,
				rootMargin: '200px 0px 0px 0px',
				threshold: 0,
			}
		);

		observer.observe(node);

		return () => {
			observer.disconnect();
		};
	}, [loadMoreCases, pagination?.has_more, pagination?.next_cursor]);

	const handleViewCase = (id: string) => {
		if (typeof window !== 'undefined') {
			window.dispatchEvent(new Event(CASE_CONFLICT_MODAL_CLOSE_EVENT));
			window.dispatchEvent(new Event(CASE_RESUME_MODAL_FORCE_CLOSE_EVENT));
		}
		setCase(null);
		setLoadingCaseId(id);
		fetchEspecifiedCases(id).then((response) => {
			if (response?.data) {
				openModal(response.data);
			}
		}).finally(() => {
			setLoadingCaseId(null);
		});
	};

	const cases = data || [];

	return (
		<>
			<style>{`
				.cases-table tbody tr:hover {
					background-color: rgba(0, 0, 0, 0.05) !important;
					transition: background-color 0.2s ease;
				}
			`}</style>

			<CasesTableDesktop
				cases={cases}
				loading={loading}
				loadingMore={loadingMore}
				onViewCase={handleViewCase}
				onFinalizeCase={handleFinalizeCaseClick}
				finalizingCaseId={finalizingCaseId}
				loadingCaseId={loadingCaseId}
			/>

			<CasesTableMobile
				cases={cases}
				loading={loading}
				loadingMore={loadingMore}
				onViewCase={handleViewCase}
				onFinalizeCase={fetchCases}
				loadingCaseId={loadingCaseId}
			/>

			<div
				ref={sentinelRef}
				style={{
					height: pagination?.has_more ? 1 : 0,
					width: '100%',
				}}
			/>

			<CasesModalResume setOpen={closeModal} open={openResumeModal} case={especifiedCase} />

			<ConfirmDialog
				show={showConfirmDialog}
				title="Finalizar Caso"
				message={caseToFinalize ? `Deseja realmente finalizar o Caso #${caseToFinalize}?` : ''}
				confirmText="Finalizar"
				cancelText="Cancelar"
				confirmVariant="success"
				onConfirm={handleConfirmFinalize}
				onCancel={() => {
					setShowConfirmDialog(false);
					setCaseToFinalize(null);
				}}
				loading={!!finalizingCaseId}
			/>
		</>
	);
};

export default CasesTable;
