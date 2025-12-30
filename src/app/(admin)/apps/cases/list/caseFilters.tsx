'use client';

import { FormProvider } from 'react-hook-form';
import { useCasesContext } from '@/contexts/casesContext';
import { ICase } from '@/types/cases/ICase';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { assistant as fetchProducts } from '@/services/productsServices';
import { assistant as fetchUsers } from '@/services/usersServices';
import { assistant as fetchVersions } from '@/services/versionsServices';
import { assistant as fetchStatus } from '@/services/statusServices';
import type { AsyncSelectOption } from '@/hooks/useAsyncSelect';
import IProductAssistant from '@/types/assistant/IProductAssistant';
import IUserAssistant from '@/types/assistant/IUserAssistant';
import { IVersionAssistant } from '@/services/versionsServices';
import { IStatusAssistant } from '@/services/statusServices';
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

	// Desktop sempre usa estado interno para o Drawer lateral
	// Mobile usa estado externo para o Drawer inferior
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

	// Função para restaurar o estado inicial dos filtros (localStorage + usuário logado)
	const restoreInitialFilters = async () => {
		// Limpa campos que não fazem parte do estado inicial
		setSelectedProject(null);
		methods.setValue('projeto_id', undefined as any, { shouldValidate: false, shouldDirty: false });
		methods.setValue('descricao_resumo', undefined as any, { shouldValidate: false, shouldDirty: false });
		methods.setValue('data_producao_inicio', undefined as any, { shouldValidate: false, shouldDirty: false });
		methods.setValue('data_producao_fim', undefined as any, { shouldValidate: false, shouldDirty: false });
		
		// Limpa o input de registro
		setRegistroValue('');
		
		// Restaura valores do localStorage
		try {
			const savedData = localStorage.getItem('lastSelectedProduct');
			if (savedData) {
				const parsed = JSON.parse(savedData);
				
				// Restaurar produto se existir
				if (parsed.produto_id) {
					methods.setValue('produto_id', parsed.produto_id);
					try {
						const products = await fetchProducts({ search: '', nome: '' });
						const savedProduct = products.find((p) => p.id === parsed.produto_id);
						if (savedProduct) {
							const productOption: AsyncSelectOption<IProductAssistant> = {
								value: savedProduct.id,
								label: savedProduct.nome_projeto || savedProduct.setor || 'Produto sem nome',
								raw: savedProduct,
							};
							setSelectedProduct(productOption);
							
							// Restaurar versão se existir
							if (parsed.versao_produto && parsed.versao_produto.trim() !== '') {
								methods.setValue('versao_produto', parsed.versao_produto);
								try {
									const versions = await fetchVersions({ produto_id: parsed.produto_id, search: '' });
									const savedVersion = versions.find((v) => v.versao === parsed.versao_produto);
									if (savedVersion) {
										const versionOption: AsyncSelectOption<IVersionAssistant> = {
											value: savedVersion.id,
											label: savedVersion.versao || 'Versão sem nome',
											raw: savedVersion,
										};
										setSelectedVersion(versionOption);
									} else {
										setSelectedVersion(null);
										methods.setValue('versao_produto', undefined as any, { shouldValidate: false, shouldDirty: false });
									}
								} catch (error) {
									console.error('Erro ao buscar versão salva:', error);
									setSelectedVersion(null);
									methods.setValue('versao_produto', undefined as any, { shouldValidate: false, shouldDirty: false });
								}
							} else {
								setSelectedVersion(null);
								methods.setValue('versao_produto', undefined as any, { shouldValidate: false, shouldDirty: false });
							}
						} else {
							setSelectedProduct(null);
							setSelectedVersion(null);
							methods.setValue('produto_id', undefined as any, { shouldValidate: false, shouldDirty: false });
							methods.setValue('versao_produto', undefined as any, { shouldValidate: false, shouldDirty: false });
						}
					} catch (error) {
						console.error('Erro ao buscar produto salvo:', error);
						setSelectedProduct(null);
						setSelectedVersion(null);
						methods.setValue('produto_id', undefined as any, { shouldValidate: false, shouldDirty: false });
						methods.setValue('versao_produto', undefined as any, { shouldValidate: false, shouldDirty: false });
					}
				} else {
					setSelectedProduct(null);
					setSelectedVersion(null);
					methods.setValue('produto_id', undefined as any, { shouldValidate: false, shouldDirty: false });
					methods.setValue('versao_produto', undefined as any, { shouldValidate: false, shouldDirty: false });
				}
				
				// Restaurar status se existir
				if (parsed.status_id) {
					methods.setValue('status_id', parsed.status_id);
					try {
						const statuses = await fetchStatus({ search: '' });
						const savedStatus = statuses.find((s) => String(s.Registro) === String(parsed.status_id));
						if (savedStatus) {
							const statusOption: AsyncSelectOption<IStatusAssistant> = {
								value: String(savedStatus.Registro),
								label: savedStatus.descricao || savedStatus.tipo || 'Status sem nome',
								raw: savedStatus,
							};
							setSelectedStatus(statusOption);
							methods.setValue('status_descricao', savedStatus.descricao);
						} else {
							setSelectedStatus(null);
							methods.setValue('status_id', undefined as any, { shouldValidate: false, shouldDirty: false });
							methods.setValue('status_descricao', undefined as any, { shouldValidate: false, shouldDirty: false });
						}
					} catch (error) {
						console.error('Erro ao buscar status salvo:', error);
						setSelectedStatus(null);
						methods.setValue('status_id', undefined as any, { shouldValidate: false, shouldDirty: false });
						methods.setValue('status_descricao', undefined as any, { shouldValidate: false, shouldDirty: false });
					}
				} else {
					setSelectedStatus(null);
					methods.setValue('status_id', undefined as any, { shouldValidate: false, shouldDirty: false });
					methods.setValue('status_descricao', undefined as any, { shouldValidate: false, shouldDirty: false });
				}
			} else {
				// Se não há dados salvos, limpa produto, versão e status
				setSelectedProduct(null);
				setSelectedVersion(null);
				setSelectedStatus(null);
				methods.setValue('produto_id', undefined as any, { shouldValidate: false, shouldDirty: false });
				methods.setValue('versao_produto', undefined as any, { shouldValidate: false, shouldDirty: false });
				methods.setValue('status_id', undefined as any, { shouldValidate: false, shouldDirty: false });
				methods.setValue('status_descricao', undefined as any, { shouldValidate: false, shouldDirty: false });
			}
		} catch (error) {
			console.error('Erro ao carregar do localStorage:', error);
			// Em caso de erro, limpa tudo
			setSelectedProduct(null);
			setSelectedVersion(null);
			setSelectedStatus(null);
			methods.setValue('produto_id', undefined as any, { shouldValidate: false, shouldDirty: false });
			methods.setValue('versao_produto', undefined as any, { shouldValidate: false, shouldDirty: false });
			methods.setValue('status_id', undefined as any, { shouldValidate: false, shouldDirty: false });
			methods.setValue('status_descricao', undefined as any, { shouldValidate: false, shouldDirty: false });
		}
		
		// Restaura o usuário logado
		const currentUserId = Cookies.get('user_id');
		if (currentUserId) {
			try {
				const users = await fetchUsers({ search: '', nome_suporte: '' });
				const loggedUser = users.find((user) => user.id === currentUserId);
				if (loggedUser) {
					const userOption: AsyncSelectOption<IUserAssistant> = {
						value: loggedUser.id,
						label: loggedUser.nome_suporte || loggedUser.setor || 'Usuario sem nome',
						raw: loggedUser,
					};
					setSelectedUser(userOption);
					methods.setValue('usuario_id', loggedUser.id);
				} else {
					setSelectedUser(null);
					methods.setValue('usuario_id', undefined as any, { shouldValidate: false, shouldDirty: false });
				}
			} catch (error) {
				console.error('Erro ao buscar usuário logado:', error);
				setSelectedUser(null);
				methods.setValue('usuario_id', undefined as any, { shouldValidate: false, shouldDirty: false });
			}
		} else {
			setSelectedUser(null);
			methods.setValue('usuario_id', undefined as any, { shouldValidate: false, shouldDirty: false });
		}
		
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

	// Função para limpar todos os filtros e restaurar ao estado inicial
	const clearAllFilters = () => {
		restoreInitialFilters();
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
					onHide={() => setInternalShowFilters(false)}
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
