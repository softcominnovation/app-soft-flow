import { useState } from 'react';
import { ICase } from '@/types/cases/ICase';

/**
 * Hook para gerenciar lógica de transferência de casos
 */
export function useCaseTransfer(selectedCases: Set<string>, cases: ICase[] | null) {
	const [showTransferModal, setShowTransferModal] = useState(false);
	const [showWarningAlert, setShowWarningAlert] = useState(false);

	const handleOpenTransferModal = () => {
		// Verifica se há casos selecionados
		if (selectedCases.size === 0) {
			return;
		}

		// Busca os casos selecionados na lista de casos
		const selectedCasesData = (cases || []).filter((caseItem) =>
			selectedCases.has(caseItem.caso.id.toString())
		);

		// Verifica se todos os casos têm produto
		const casesWithProduct = selectedCasesData.filter(
			(caseItem) =>
				caseItem.produto && caseItem.produto.id !== null && caseItem.produto.id !== undefined
		);

		// Se não houver casos com produto, permite abrir o modal
		if (casesWithProduct.length === 0) {
			setShowTransferModal(true);
			return;
		}

		// Verifica se todos os casos têm o mesmo produto
		const firstProductId = casesWithProduct[0].produto?.id;
		const allSameProduct = casesWithProduct.every((caseItem) => caseItem.produto?.id === firstProductId);

		if (!allSameProduct) {
			// Mostra alerta e não abre o modal
			setShowWarningAlert(true);
			return;
		}

		// Se passou na validação, abre o modal
		setShowTransferModal(true);
	};

	return {
		showTransferModal,
		setShowTransferModal,
		showWarningAlert,
		setShowWarningAlert,
		handleOpenTransferModal,
	};
}

