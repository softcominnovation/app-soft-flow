"use client";

import FloatingActionButton from "@/components/FloatingActionButton";
import { useModal } from "@/app/(admin)/ui/base-ui/hooks";
import CaseWizard from "../../form/wizard/caseWizard";
import { Modal } from "react-bootstrap";

type Props = {
	onOpenFilters: () => void;
	onOpenProducts: () => void;
	showFiltersDrawer?: boolean;
	showProductsDrawer?: boolean;
	onOpenTransfer: () => void;
	selectedCases: Set<string>;
};

/**
 * Componente FAB específico para a página de casos
 * Gerencia as ações: Filtros, Adicionar Caso, Produtos Priorizados e Transferir Casos
 */
export default function CasesFAB({ onOpenFilters, onOpenProducts, showFiltersDrawer, showProductsDrawer, onOpenTransfer, selectedCases }: Props) {
	const { isOpen, toggleModal, openModalWithClass } = useModal();
	
	// Esconde o FAB quando qualquer drawer ou modal estiver aberto
	const shouldHide = showFiltersDrawer || showProductsDrawer || isOpen;

	const actions = [
		{
			icon: "lucide:filter",
			label: "Filtros",
			onClick: onOpenFilters,
		},
		{
			icon: "lucide:package",
			label: "Produtos Priorizados",
			onClick: onOpenProducts,
		},
		{
			icon: "lucide:move-right",
			label: "Transferir Casos",
			onClick: onOpenTransfer,
		},
		{
			icon: "lucide:plus",
			label: "Adicionar Novo Caso",
			onClick: () => openModalWithClass("modal-full-width"),
		},
	];

	return (
		<>
			{!shouldHide && (
				<FloatingActionButton actions={actions} mainIcon="lucide:plus" mainLabel="Ações" />
			)}
			
			<Modal
				show={isOpen}
				onHide={toggleModal}
				size="lg"
				backdrop="static"
				fullscreen="sm-down"
			>
				<Modal.Header closeButton className="bg-light border-bottom">
					<Modal.Title className="fw-bold text-primary">Adicionar Novo Caso</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<CaseWizard onClose={toggleModal} />
				</Modal.Body>
			</Modal>
		</>
	);
}

