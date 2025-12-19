'use client';

import { FormProvider } from 'react-hook-form';
import { useCasesContext } from '@/contexts/casesContext';
import { ICase } from '@/types/cases/ICase';
import { useState } from 'react';
import {
	useCaseFilters,
	useCaseSearchByRegistro,
	useCaseFiltersInitialization,
	useCaseTransfer,
	useCaseFiltersSearch,
} from './hooks';
import {
	CaseFiltersHeader,
	CaseFiltersDesktop,
	CaseFiltersMobile,
	TransferWarningModal,
} from './components/caseFilters';
import TransferCasesModal from './components/TransferCasesModal';

type CaseFiltersProps = {
	onOpenFiltersDrawer?: () => void;
	showFiltersDrawer?: boolean;
	onCloseFiltersDrawer?: () => void;
	selectedCases?: Set<string>;
	onClearSelectedCases?: () => void;
	onOpenCaseModal?: (caseData: ICase) => void;
};

/**
 * Componente principal de filtros de casos
 * Refatorado seguindo princípios SOLID e boas práticas de componentização
 */
const CaseFilters = ({
	onOpenFiltersDrawer,
	showFiltersDrawer: externalShowFilters,
	onCloseFiltersDrawer,
	selectedCases = new Set(),
	onClearSelectedCases,
	onOpenCaseModal,
}: CaseFiltersProps = {}) => {
	const { fetchCases, loading, cases } = useCasesContext();
	const [internalShowFilters, setInternalShowFilters] = useState(false);

	// Desktop sempre usa estado interno para o Collapse
	// Mobile usa estado externo para o Drawer
	const showFiltersDesktop = internalShowFilters;
	const showFiltersMobile = externalShowFilters !== undefined ? externalShowFilters : false;

	// Função para desktop (sempre usa estado interno)
	const toggleFiltersDesktop = () => {
		setInternalShowFilters((prev) => !prev);
	};

	// Função para mobile (usa estado externo)
	const toggleFiltersMobile = () => {
		if (onOpenFiltersDrawer) {
			onOpenFiltersDrawer();
		}
	};

	// Hook para gerenciar todos os selects assíncronos
	const {
		methods,
		loadProductOptions,
		selectedProduct,
		setSelectedProduct,
		defaultProductOptions,
		triggerProductDefaultLoad,
		isLoadingProducts,
		loadProjectOptions,
		selectedProject,
		setSelectedProject,
		defaultProjectOptions,
		triggerProjectDefaultLoad,
		isLoadingProjects,
		loadUserOptions,
		selectedUser,
		setSelectedUser,
		defaultUserOptions,
		triggerUserDefaultLoad,
		isLoadingUsers,
		loadVersionOptions,
		selectedVersion,
		setSelectedVersion,
		defaultVersionOptions,
		triggerVersionDefaultLoad,
		isLoadingVersions,
		loadStatusOptions,
		selectedStatus,
		setSelectedStatus,
		defaultStatusOptions,
		triggerStatusDefaultLoad,
		isLoadingStatus,
		produtoId,
	} = useCaseFilters();

	// Hook para busca por registro
	const { registroValue, setRegistroValue, loadingRegistro, searchByRegistro } =
		useCaseSearchByRegistro(onOpenCaseModal);

	// Hook para inicialização de filtros
	useCaseFiltersInitialization({
		methods,
		setSelectedProduct,
		setSelectedVersion,
		setSelectedStatus,
		setSelectedUser,
		selectedUser,
	});

	// Hook para lógica de transferência
	const {
		showTransferModal,
		setShowTransferModal,
		showWarningAlert,
		setShowWarningAlert,
		handleOpenTransferModal,
	} = useCaseTransfer(selectedCases, cases);

	// Hook para construir payload e executar busca
	const { onSearch } = useCaseFiltersSearch({
		methods,
		selectedUser,
		selectedStatus,
		fetchCases,
		onClearSelectedCases,
	});

	// Handler para busca por registro no submit do form
	const handleSearch = async (data: any) => {
		const trimmedRegistro = registroValue.trim();
		if (trimmedRegistro) {
			await searchByRegistro(trimmedRegistro);
			return;
		}
		onSearch(data);
	};

	// Handler para tecla Enter no input de registro
	const handleRegistroKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			methods.handleSubmit(handleSearch)();
		}
	};

	return (
		<FormProvider {...methods}>
			<form onSubmit={methods.handleSubmit(handleSearch)} className="mb-0 mb-lg-3">
				<CaseFiltersHeader
					registroValue={registroValue}
					onRegistroChange={setRegistroValue}
					onRegistroKeyPress={handleRegistroKeyPress}
					loadingRegistro={loadingRegistro}
					showFiltersDesktop={showFiltersDesktop}
					onToggleFiltersDesktop={toggleFiltersDesktop}
					onToggleFiltersMobile={toggleFiltersMobile}
					loading={loading}
					onSubmit={() => methods.handleSubmit(handleSearch)()}
					selectedCases={selectedCases}
					onOpenTransferModal={handleOpenTransferModal}
				/>

				<CaseFiltersDesktop
					show={showFiltersDesktop}
					control={methods.control}
					loadProductOptions={loadProductOptions}
					selectedProduct={selectedProduct}
					setSelectedProduct={setSelectedProduct}
					defaultProductOptions={defaultProductOptions}
					triggerProductDefaultLoad={triggerProductDefaultLoad}
					isLoadingProducts={isLoadingProducts}
					loadVersionOptions={loadVersionOptions}
					selectedVersion={selectedVersion}
					setSelectedVersion={setSelectedVersion}
					defaultVersionOptions={defaultVersionOptions}
					triggerVersionDefaultLoad={triggerVersionDefaultLoad}
					isLoadingVersions={isLoadingVersions}
					produtoId={produtoId}
					loadProjectOptions={loadProjectOptions}
					selectedProject={selectedProject}
					setSelectedProject={setSelectedProject}
					defaultProjectOptions={defaultProjectOptions}
					triggerProjectDefaultLoad={triggerProjectDefaultLoad}
					isLoadingProjects={isLoadingProjects}
					loadUserOptions={loadUserOptions}
					selectedUser={selectedUser}
					setSelectedUser={setSelectedUser}
					defaultUserOptions={defaultUserOptions}
					triggerUserDefaultLoad={triggerUserDefaultLoad}
					isLoadingUsers={isLoadingUsers}
					loadStatusOptions={loadStatusOptions}
					selectedStatus={selectedStatus}
					setSelectedStatus={setSelectedStatus}
					defaultStatusOptions={defaultStatusOptions}
					triggerStatusDefaultLoad={triggerStatusDefaultLoad}
					isLoadingStatus={isLoadingStatus}
					loading={loading}
					loadingRegistro={loadingRegistro}
					onSubmit={() => methods.handleSubmit(handleSearch)()}
					methods={methods}
				/>

				<CaseFiltersMobile
					show={showFiltersMobile}
					onHide={() => {
						if (onCloseFiltersDrawer) {
							onCloseFiltersDrawer();
						}
					}}
					control={methods.control}
					loadProductOptions={loadProductOptions}
					selectedProduct={selectedProduct}
					setSelectedProduct={setSelectedProduct}
					defaultProductOptions={defaultProductOptions}
					triggerProductDefaultLoad={triggerProductDefaultLoad}
					isLoadingProducts={isLoadingProducts}
					loadVersionOptions={loadVersionOptions}
					selectedVersion={selectedVersion}
					setSelectedVersion={setSelectedVersion}
					defaultVersionOptions={defaultVersionOptions}
					triggerVersionDefaultLoad={triggerVersionDefaultLoad}
					isLoadingVersions={isLoadingVersions}
					produtoId={produtoId}
					loadProjectOptions={loadProjectOptions}
					selectedProject={selectedProject}
					setSelectedProject={setSelectedProject}
					defaultProjectOptions={defaultProjectOptions}
					triggerProjectDefaultLoad={triggerProjectDefaultLoad}
					isLoadingProjects={isLoadingProjects}
					loadUserOptions={loadUserOptions}
					selectedUser={selectedUser}
					setSelectedUser={setSelectedUser}
					defaultUserOptions={defaultUserOptions}
					triggerUserDefaultLoad={triggerUserDefaultLoad}
					isLoadingUsers={isLoadingUsers}
					loadStatusOptions={loadStatusOptions}
					selectedStatus={selectedStatus}
					setSelectedStatus={setSelectedStatus}
					defaultStatusOptions={defaultStatusOptions}
					triggerStatusDefaultLoad={triggerStatusDefaultLoad}
					isLoadingStatus={isLoadingStatus}
					loading={loading}
					loadingRegistro={loadingRegistro}
					onSubmit={() => methods.handleSubmit(handleSearch)()}
					methods={methods}
				/>

				<TransferCasesModal
					show={showTransferModal}
					onHide={() => setShowTransferModal(false)}
					selectedCases={selectedCases}
					cases={cases}
				/>

				<TransferWarningModal show={showWarningAlert} onHide={() => setShowWarningAlert(false)} />
			</form>
		</FormProvider>
	);
};

export default CaseFilters;
