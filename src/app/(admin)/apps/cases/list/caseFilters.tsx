'use client';

import { FormProvider } from 'react-hook-form';
import { useCasesContext } from '@/contexts/casesContext';
import { ICase } from '@/types/cases/ICase';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
	const router = useRouter();
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

	// Função para limpar todos os filtros
	const clearAllFilters = () => {
		// Limpa todos os selects primeiro
		setSelectedProduct(null);
		setSelectedProject(null);
		setSelectedUser(null);
		setSelectedVersion(null);
		setSelectedStatus(null);
		
		// Limpa o input de registro
		setRegistroValue('');
		
		// Limpa explicitamente todos os campos do formulário com undefined/null
		// Usa setValue para garantir que os valores sejam realmente limpos
		methods.setValue('produto_id', undefined as any, { shouldValidate: false, shouldDirty: false });
		methods.setValue('versao_produto', undefined as any, { shouldValidate: false, shouldDirty: false });
		methods.setValue('projeto_id', undefined as any, { shouldValidate: false, shouldDirty: false });
		methods.setValue('usuario_id', undefined as any, { shouldValidate: false, shouldDirty: false });
		methods.setValue('status_id', undefined as any, { shouldValidate: false, shouldDirty: false });
		methods.setValue('status_descricao', undefined as any, { shouldValidate: false, shouldDirty: false });
		methods.setValue('descricao_resumo', undefined as any, { shouldValidate: false, shouldDirty: false });
		methods.setValue('descricao_completa', undefined as any, { shouldValidate: false, shouldDirty: false });
		methods.setValue('data_producao_inicio', undefined as any, { shouldValidate: false, shouldDirty: false });
		methods.setValue('data_producao_fim', undefined as any, { shouldValidate: false, shouldDirty: false });
		methods.setValue('sort_by', undefined as any, { shouldValidate: false, shouldDirty: false });
		
		// Limpa o formulário (reset) com valores undefined
		// keepValues: false garante que os valores sejam realmente limpos
		methods.reset({
			produto_id: undefined,
			versao_produto: undefined,
			projeto_id: undefined,
			usuario_id: undefined,
			status_id: undefined,
			status_descricao: undefined,
			descricao_resumo: undefined,
			descricao_completa: undefined,
			data_producao_inicio: undefined,
			data_producao_fim: undefined,
			sort_by: undefined,
		}, { keepDefaultValues: false, keepValues: false });
		
		// Limpa a URL removendo todos os parâmetros de filtro
		if (typeof window !== 'undefined') {
			const url = new URL(window.location.href);
			const filterParams = [
				'usuario_dev_id',
				'produto_id',
				'versao_produto',
				'status_id',
				'status_id[]',
				'sort_by',
				'projeto_id',
				'usuario_id',
				'descricao_resumo',
				'descricao_completa',
				'data_producao_inicio',
				'data_producao_fim',
			];
			
			// Remove todos os parâmetros de filtro
			filterParams.forEach((param) => {
				url.searchParams.delete(param);
			});
			
			// Remove também qualquer variação de status_id que possa existir
			const allParams = Array.from(url.searchParams.keys());
			allParams.forEach((key) => {
				if (key.startsWith('status_id')) {
					url.searchParams.delete(key);
				}
			});
			
			router.replace(url.pathname + url.search, { scroll: false });
		}
		
		// Limpa os casos selecionados
		if (onClearSelectedCases) {
			onClearSelectedCases();
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
					onClearAllFilters={clearAllFilters}
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
					onClearAllFilters={clearAllFilters}
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
					onClearAllFilters={clearAllFilters}
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
