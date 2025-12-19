import { useForm } from 'react-hook-form';
import { useAsyncSelect } from '@/hooks';
import { assistant as fetchProducts } from '@/services/productsServices';
import { assistant as fetchProjects } from '@/services/projectsServices';
import { assistant as fetchUsers } from '@/services/usersServices';
import { assistant as fetchVersions } from '@/services/versionsServices';
import { IVersionAssistant } from '@/services/versionsServices';
import { assistant as fetchStatus } from '@/services/statusServices';
import { IStatusAssistant } from '@/services/statusServices';
import ICaseFilter from '@/types/cases/ICaseFilter';
import IProductAssistant from '@/types/assistant/IProductAssistant';
import IProjectAssistant from '@/types/assistant/IProjectAssistant';
import IUserAssistant from '@/types/assistant/IUserAssistant';
import type { AsyncSelectOption } from '@/hooks/useAsyncSelect';
import { useEffect } from 'react';

/**
 * Hook para gerenciar todos os selects assíncronos e lógica de filtros
 */
export function useCaseFilters() {
	const methods = useForm<ICaseFilter>();
	const produtoId = methods.watch('produto_id');
	const projetoId = methods.watch('projeto_id');
	const usuarioId = methods.watch('usuario_id');
	const versaoProdutoId = methods.watch('versao_produto');
	const statusDescricao = methods.watch('status_descricao');

	// Select de Produtos
	const {
		loadOptions: loadProductOptions,
		selectedOption: selectedProduct,
		setSelectedOption: setSelectedProduct,
		defaultOptions: defaultProductOptions,
		triggerDefaultLoad: triggerProductDefaultLoad,
		isLoading: isLoadingProducts,
	} = useAsyncSelect<IProductAssistant>({
		fetchItems: async (input) => fetchProducts({ search: input, nome: input }),
		getOptionLabel: (product) => product.nome_projeto || product.setor || 'Produto sem nome',
		getOptionValue: (product) => product.id,
		debounceMs: 1000,
	});

	// Select de Projetos
	const {
		loadOptions: loadProjectOptions,
		selectedOption: selectedProject,
		setSelectedOption: setSelectedProject,
		defaultOptions: defaultProjectOptions,
		triggerDefaultLoad: triggerProjectDefaultLoad,
		isLoading: isLoadingProjects,
	} = useAsyncSelect<IProjectAssistant>({
		fetchItems: async (input) => {
			return fetchProjects({
				search: input,
				nome_projeto: input,
				...(usuarioId && usuarioId !== '' ? { usuario_id: usuarioId } : {}),
			});
		},
		getOptionLabel: (project) => project.nome_projeto || project.setor || 'Projeto sem nome',
		getOptionValue: (project) => project.id,
		debounceMs: 1000,
	});

	// Select de Usuários
	const {
		loadOptions: loadUserOptions,
		selectedOption: selectedUser,
		setSelectedOption: setSelectedUser,
		defaultOptions: defaultUserOptions,
		triggerDefaultLoad: triggerUserDefaultLoad,
		isLoading: isLoadingUsers,
	} = useAsyncSelect<IUserAssistant>({
		fetchItems: async (input) => fetchUsers({ search: input, nome_suporte: input }),
		getOptionLabel: (user) => user.nome_suporte || user.setor || 'Usuario sem nome',
		getOptionValue: (user) => user.id,
		debounceMs: 1000,
	});

	// Select de Versões
	const {
		loadOptions: loadVersionOptions,
		selectedOption: selectedVersion,
		setSelectedOption: setSelectedVersion,
		defaultOptions: defaultVersionOptions,
		triggerDefaultLoad: triggerVersionDefaultLoad,
		isLoading: isLoadingVersions,
	} = useAsyncSelect<IVersionAssistant>({
		fetchItems: async (input) => {
			if (!produtoId) {
				return [];
			}
			return fetchVersions({ produto_id: produtoId, search: input });
		},
		getOptionLabel: (version) => version.versao || 'Versão sem nome',
		getOptionValue: (version) => version.id,
		debounceMs: 1000,
	});

	// Select de Status
	const {
		loadOptions: loadStatusOptions,
		selectedOption: selectedStatus,
		setSelectedOption: setSelectedStatus,
		defaultOptions: defaultStatusOptions,
		triggerDefaultLoad: triggerStatusDefaultLoad,
		isLoading: isLoadingStatus,
	} = useAsyncSelect<IStatusAssistant>({
		fetchItems: async (input) => fetchStatus({ search: input }),
		getOptionLabel: (status) => status.descricao || status.tipo || 'Status sem nome',
		getOptionValue: (status) => String(status.Registro),
		debounceMs: 800,
	});

	// Limpar selects quando campos relacionados são limpos
	useEffect(() => {
		if (!produtoId) {
			setSelectedProduct(null);
		}
	}, [produtoId, setSelectedProduct]);

	useEffect(() => {
		if (!projetoId) {
			setSelectedProject(null);
		}
	}, [projetoId, setSelectedProject]);

	useEffect(() => {
		if (!usuarioId || usuarioId.trim() === '') {
			setSelectedUser(null);
		}
	}, [usuarioId, setSelectedUser]);

	useEffect(() => {
		if (!produtoId) {
			setSelectedVersion(null);
			methods.setValue('versao_produto', undefined);
		}
	}, [produtoId, setSelectedVersion, methods]);

	useEffect(() => {
		if (!versaoProdutoId) {
			setSelectedVersion(null);
		}
	}, [versaoProdutoId, setSelectedVersion]);

	useEffect(() => {
		if (!statusDescricao) {
			setSelectedStatus(null);
			methods.setValue('status_id', '');
		}
	}, [statusDescricao, setSelectedStatus, methods]);

	return {
		methods,
		// Produtos
		loadProductOptions,
		selectedProduct,
		setSelectedProduct,
		defaultProductOptions,
		triggerProductDefaultLoad,
		isLoadingProducts,
		// Projetos
		loadProjectOptions,
		selectedProject,
		setSelectedProject,
		defaultProjectOptions,
		triggerProjectDefaultLoad,
		isLoadingProjects,
		// Usuários
		loadUserOptions,
		selectedUser,
		setSelectedUser,
		defaultUserOptions,
		triggerUserDefaultLoad,
		isLoadingUsers,
		// Versões
		loadVersionOptions,
		selectedVersion,
		setSelectedVersion,
		defaultVersionOptions,
		triggerVersionDefaultLoad,
		isLoadingVersions,
		// Status
		loadStatusOptions,
		selectedStatus,
		setSelectedStatus,
		defaultStatusOptions,
		triggerStatusDefaultLoad,
		isLoadingStatus,
		// Valores assistidos
		produtoId,
		projetoId,
		usuarioId,
	};
}

