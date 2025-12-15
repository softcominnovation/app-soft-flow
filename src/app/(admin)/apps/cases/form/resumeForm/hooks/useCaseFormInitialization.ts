/**
 * Hook para gerenciar a inicialização dos campos do formulário de caso
 */

import { useEffect, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ICase } from '@/types/cases/ICase';
import { useAsyncSelect } from '@/hooks';
import type { AsyncSelectOption } from '@/hooks/useAsyncSelect';
import { assistant as fetchProducts } from '@/services/productsServices';
import { assistant as fetchUsers } from '@/services/usersServices';
import { assistant as fetchVersions, IVersionAssistant } from '@/services/versionsServices';
import { assistant as fetchProjects } from '@/services/projectsServices';
import { assistant as fetchOrigins, IOriginAssistant } from '@/services/originsServices';
import { assistant as fetchCategories, type ICategoryAssistant } from '@/services/categoriesServices';
import { assistant as fetchStatus, IStatusAssistant } from '@/services/statusServices';
import IProductAssistant from '@/types/assistant/IProductAssistant';
import IUserAssistant from '@/types/assistant/IUserAssistant';
import IProjectAssistant from '@/types/assistant/IProjectAssistant';
import Cookies from 'js-cookie';

interface UseCaseFormInitializationParams {
	caseData: ICase | null;
	methods: UseFormReturn<any>;
	produtoId: string | null;
}

export function useCaseFormInitialization({
	caseData,
	methods,
	produtoId,
}: UseCaseFormInitializationParams) {
	const initializedRef = useRef<string | null>(null);
	const versionInitializedRef = useRef<string | null>(null);
	const previousProdutoIdRef = useRef<string | null>(null);

	// Hooks para produtos, versões e usuários
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

	const {
		loadOptions: loadVersionOptions,
		selectedOption: selectedVersion,
		setSelectedOption: setSelectedVersion,
		defaultOptions: defaultVersionOptions,
		triggerDefaultLoad: triggerVersionDefaultLoad,
		isLoading: isLoadingVersions,
	} = useAsyncSelect<IVersionAssistant>({
		fetchItems: async (input) => {
			if (!produtoId) return [];
			return fetchVersions({ produto_id: produtoId, search: input });
		},
		getOptionLabel: (version) => version.versao || 'Versão sem nome',
		getOptionValue: (version) => version.id,
		debounceMs: 1000,
	});

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

	const {
		loadOptions: loadQaOptions,
		selectedOption: selectedQa,
		setSelectedOption: setSelectedQa,
		defaultOptions: defaultQaOptions,
		triggerDefaultLoad: triggerQaDefaultLoad,
		isLoading: isLoadingQa,
	} = useAsyncSelect<IUserAssistant>({
		fetchItems: async (input) => fetchUsers({ search: input, nome_suporte: input }),
		getOptionLabel: (user) => user.nome_suporte || user.setor || 'Usuario sem nome',
		getOptionValue: (user) => user.id,
		debounceMs: 1000,
	});

	const userId = Cookies.get('user_id') || '';

	const {
		loadOptions: loadProjectOptions,
		selectedOption: selectedProject,
		setSelectedOption: setSelectedProject,
		defaultOptions: defaultProjectOptions,
		triggerDefaultLoad: triggerProjectDefaultLoad,
		isLoading: isLoadingProjects,
	} = useAsyncSelect<IProjectAssistant>({
		fetchItems: async (input) => {
			const params: any = { usuario_id: userId };
			if (input) {
				params.search = input;
				params.setor_projeto = input;
			}
			return fetchProjects(params);
		},
		getOptionLabel: (project) => project.nome_projeto || `Projeto ${project.numero_projeto}`,
		getOptionValue: (project) => String(project.id),
		debounceMs: 1000,
	});

	const {
		loadOptions: loadOriginOptions,
		selectedOption: selectedOrigin,
		setSelectedOption: setSelectedOrigin,
		defaultOptions: defaultOriginOptions,
		triggerDefaultLoad: triggerOriginDefaultLoad,
		isLoading: isLoadingOrigins,
	} = useAsyncSelect<IOriginAssistant>({
		fetchItems: async (input) => fetchOrigins({ search: input }),
		getOptionLabel: (origin) => origin.nome || 'Origem sem nome',
		getOptionValue: (origin) => String(origin.id),
		debounceMs: 1000,
	});

	const {
		loadOptions: loadCategoryOptions,
		selectedOption: selectedCategory,
		setSelectedOption: setSelectedCategory,
		defaultOptions: defaultCategoryOptions,
		triggerDefaultLoad: triggerCategoryDefaultLoad,
		isLoading: isLoadingCategories,
	} = useAsyncSelect<ICategoryAssistant>({
		fetchItems: async (input) => fetchCategories({ search: input }),
		getOptionLabel: (category) => category.tipo_categoria || 'Categoria sem nome',
		getOptionValue: (category) => String(category.id),
		debounceMs: 1000,
	});

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

	// Limpar versão quando produto mudar
	useEffect(() => {
		if (previousProdutoIdRef.current !== null && previousProdutoIdRef.current !== produtoId) {
			setSelectedVersion(null);
			methods.setValue('versao', '');
			versionInitializedRef.current = null;
		}
		previousProdutoIdRef.current = produtoId || null;
	}, [produtoId, setSelectedVersion, methods]);

	// Inicializar campos básicos (produto, desenvolvedor, status)
	useEffect(() => {
		if (!caseData?.caso?.id) return;

		const caseId = String(caseData.caso.id);
		if (initializedRef.current === caseId) return;

		initializedRef.current = caseId;
		versionInitializedRef.current = null;
		previousProdutoIdRef.current = null;

		// Inicializar produto
		if (caseData.produto?.id) {
			const productId = String(caseData.produto.id);
			const productOption: AsyncSelectOption<IProductAssistant> = {
				value: productId,
				label: caseData.produto.nome || 'Produto sem nome',
				raw: {
					id: productId,
					nome_projeto: caseData.produto.nome || '',
					setor: '',
				} as IProductAssistant,
			};
			setSelectedProduct(productOption);
			methods.setValue('produto_id', productId);
		}

		// Inicializar desenvolvedor
		if (caseData.caso?.usuarios?.desenvolvimento?.id && caseData.caso.usuarios.desenvolvimento.id !== '0' && caseData.caso.usuarios.desenvolvimento.id !== 0) {
			const userId = String(caseData.caso.usuarios.desenvolvimento.id);
			const userOption: AsyncSelectOption<IUserAssistant> = {
				value: userId,
				label: caseData.caso.usuarios.desenvolvimento.nome || 'Usuario sem nome',
				raw: {
					id: userId,
					nome_suporte: caseData.caso.usuarios.desenvolvimento.nome || '',
					setor: '',
				} as IUserAssistant,
			};
			setSelectedUser(userOption);
			methods.setValue('desenvolvedor_id', userId);
			methods.setValue('desenvolvedor', caseData.caso.usuarios.desenvolvimento.nome || '');
		} else {
			// Limpar desenvolvedor se não houver valor válido
			setSelectedUser(null);
			methods.setValue('desenvolvedor_id', '');
			methods.setValue('desenvolvedor', '');
		}

		// Inicializar QA
		if (caseData.caso?.usuarios?.qa?.id && caseData.caso.usuarios.qa.id !== '0' && caseData.caso.usuarios.qa.id !== 0) {
			const qaId = String(caseData.caso.usuarios.qa.id);
			const qaOption: AsyncSelectOption<IUserAssistant> = {
				value: qaId,
				label: caseData.caso.usuarios.qa.nome || 'Usuario sem nome',
				raw: {
					id: qaId,
					nome_suporte: caseData.caso.usuarios.qa.nome || '',
					setor: '',
				} as IUserAssistant,
			};
			setSelectedQa(qaOption);
			methods.setValue('qa_id', qaId);
			methods.setValue('qa', caseData.caso.usuarios.qa.nome || '');
		} else {
			// Limpar QA se não houver valor válido
			setSelectedQa(null);
			methods.setValue('qa_id', '');
			methods.setValue('qa', '');
		}

		// Inicializar Projeto
		if (caseData.projeto?.id) {
			const projectId = String(caseData.projeto.id);
			const projectOption: AsyncSelectOption<IProjectAssistant> = {
				value: projectId,
				label: caseData.projeto.descricao || `Projeto ${projectId}`,
				raw: {
					id: Number(projectId),
					numero_projeto: Number(projectId),
					nome_projeto: caseData.projeto.descricao || '',
					data_inicial: caseData.projeto.datas?.inicial || '',
					data_final: caseData.projeto.datas?.final || '',
					setor: '',
				} as IProjectAssistant,
			};
			setSelectedProject(projectOption);
			methods.setValue('projeto_id', projectId);
		} else {
			setSelectedProject(null);
			methods.setValue('projeto_id', '');
		}

		// Inicializar Origem
		if (caseData.caso?.caracteristicas?.id_origem) {
			const originId = String(caseData.caso.caracteristicas.id_origem);
			const originOption: AsyncSelectOption<IOriginAssistant> = {
				value: originId,
				label: caseData.caso.caracteristicas.tipo_origem || 'Origem sem nome',
				raw: {
					id: Number(originId),
					nome: caseData.caso.caracteristicas.tipo_origem || '',
				} as IOriginAssistant,
			};
			setSelectedOrigin(originOption);
			methods.setValue('origem_id', originId);
		} else {
			setSelectedOrigin(null);
			methods.setValue('origem_id', '');
		}

		// Inicializar Categoria usando os dados que já vêm na resposta da API
		// Não precisa fazer requisição, os dados já estão em caseData.caso.caracteristicas
		const categoriaId = caseData.caso?.caracteristicas?.categoria;
		const tipoCategoria = caseData.caso?.caracteristicas?.tipo_categoria;
		
		if (categoriaId && categoriaId !== 0 && tipoCategoria) {
			// Criar opção diretamente usando os dados que já vêm na resposta
			const categoryOption: AsyncSelectOption<ICategoryAssistant> = {
				value: String(categoriaId),
				label: tipoCategoria,
				raw: {
					id: Number(categoriaId),
					tipo_categoria: tipoCategoria,
				} as ICategoryAssistant,
			};
			setSelectedCategory(categoryOption);
			methods.setValue('categoria_id', String(categoriaId));
			methods.setValue('categoria', tipoCategoria);
		} else {
			setSelectedCategory(null);
			methods.setValue('categoria_id', '');
			methods.setValue('categoria', tipoCategoria || '');
		}

		// Inicializar status usando os dados que já vêm na resposta da API
		// Não precisa fazer requisição, os dados já estão em caseData.caso.status
		const statusId = caseData.caso.status?.codigo || caseData.caso.status?.status_id || caseData.caso.status?.id || '';
		const statusDescricao = caseData.caso.status?.descricao || '';
		
		if (statusId && statusDescricao) {
			// Criar opção diretamente usando os dados que já vêm na resposta
			const statusOption: AsyncSelectOption<IStatusAssistant> = {
				value: String(statusId),
				label: statusDescricao,
				raw: {
					Registro: Number(statusId),
					descricao: statusDescricao,
					tipo: caseData.caso.status?.status_tipo || caseData.caso.status?.estado || '',
				} as IStatusAssistant,
			};
			setSelectedStatus(statusOption);
			methods.setValue('status', { value: statusOption.value, label: statusOption.label }, { shouldValidate: false, shouldDirty: false });
		} else {
			setSelectedStatus(null);
			methods.setValue('status', null);
		}
	}, [caseData, methods, setSelectedStatus]);

	// Garantir que o status seja definido após o reset do formulário
	useEffect(() => {
		if (!caseData?.caso?.id) return;
		
		const statusId = caseData.caso.status?.codigo || caseData.caso.status?.status_id || caseData.caso.status?.id || '';
		const statusDescricao = caseData.caso.status?.descricao || '';
		const currentStatus = methods.getValues('status');
		
		// Se o status não estiver definido ou estiver como null/string vazia, definir novamente
		// Usando os dados que já vêm na resposta, sem fazer requisição
		if (statusId && statusDescricao && (!currentStatus || (typeof currentStatus === 'string' && currentStatus === '') || currentStatus === null)) {
			// Aguardar um pouco para garantir que o reset já foi executado
			const timeoutId = setTimeout(() => {
				const statusOption: AsyncSelectOption<IStatusAssistant> = {
					value: String(statusId),
					label: statusDescricao,
					raw: {
						Registro: Number(statusId),
						descricao: statusDescricao,
						tipo: caseData.caso.status?.status_tipo || caseData.caso.status?.estado || '',
					} as IStatusAssistant,
				};
				setSelectedStatus(statusOption);
				methods.setValue('status', { value: statusOption.value, label: statusOption.label }, { shouldValidate: false, shouldDirty: false });
			}, 100);
			
			return () => clearTimeout(timeoutId);
		}
	}, [caseData, methods, setSelectedStatus]);

	// Inicializar versão usando os dados que já vêm na resposta da API
	// Não precisa fazer requisição, os dados já estão em caseData.produto.versao ou caseData.caso.caracteristicas.versao_produto
	useEffect(() => {
		if (!caseData?.caso?.id || !produtoId || !selectedProduct) return;

		const caseId = String(caseData.caso.id);
		const versaoKey = `${caseId}-${produtoId}`;
		
		if (versionInitializedRef.current === versaoKey) return;

		const versaoValue = caseData.produto?.versao || caseData.caso?.caracteristicas?.versao_produto || '';
		if (!versaoValue) return;

		versionInitializedRef.current = versaoKey;

		// Criar opção diretamente usando o texto da versão que já vem na resposta
		// Não precisa fazer requisição, apenas usar o texto da versão
		const versionOption: AsyncSelectOption<IVersionAssistant> = {
			value: versaoValue, // Usar o texto como value também
			label: versaoValue,
			raw: {
				id: versaoValue,
				versao: versaoValue,
				sequencia: versaoValue,
			} as IVersionAssistant,
		};
		setSelectedVersion(versionOption);
		// Salvar o texto da versão, não o ID
		methods.setValue('versao', versaoValue);
	}, [caseData, produtoId, selectedProduct, methods, setSelectedVersion]);

	return {
		// Produto
		loadProductOptions,
		selectedProduct,
		setSelectedProduct,
		defaultProductOptions,
		triggerProductDefaultLoad,
		isLoadingProducts,

		// Versão
		loadVersionOptions,
		selectedVersion,
		setSelectedVersion,
		defaultVersionOptions,
		triggerVersionDefaultLoad,
		isLoadingVersions,

		// Usuário (Desenvolvedor)
		loadUserOptions,
		selectedUser,
		setSelectedUser,
		defaultUserOptions,
		triggerUserDefaultLoad,
		isLoadingUsers,

		// QA
		loadQaOptions,
		selectedQa,
		setSelectedQa,
		defaultQaOptions,
		triggerQaDefaultLoad,
		isLoadingQa,

		// Projeto
		loadProjectOptions,
		selectedProject,
		setSelectedProject,
		defaultProjectOptions,
		triggerProjectDefaultLoad,
		isLoadingProjects,

		// Origem
		loadOriginOptions,
		selectedOrigin,
		setSelectedOrigin,
		defaultOriginOptions,
		triggerOriginDefaultLoad,
		isLoadingOrigins,

		// Categoria
		loadCategoryOptions,
		selectedCategory,
		setSelectedCategory,
		defaultCategoryOptions,
		triggerCategoryDefaultLoad,
		isLoadingCategories,

		// Status
		loadStatusOptions,
		selectedStatus,
		setSelectedStatus,
		defaultStatusOptions,
		triggerStatusDefaultLoad,
		isLoadingStatus,
	};
}

