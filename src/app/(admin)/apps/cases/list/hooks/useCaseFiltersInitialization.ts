import { useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import { UseFormReturn } from 'react-hook-form';
import { useQuery } from '@/hooks';
import { extractCaseFiltersFromUrl } from '@/utils/caseFilterUtils';
import { assistant as fetchProducts } from '@/services/productsServices';
import { assistant as fetchUsers } from '@/services/usersServices';
import { assistant as fetchVersions } from '@/services/versionsServices';
import { assistant as fetchStatus } from '@/services/statusServices';
import ICaseFilter from '@/types/cases/ICaseFilter';
import type { AsyncSelectOption } from '@/hooks/useAsyncSelect';
import IProductAssistant from '@/types/assistant/IProductAssistant';
import IUserAssistant from '@/types/assistant/IUserAssistant';
import { IVersionAssistant } from '@/services/versionsServices';
import { IStatusAssistant } from '@/services/statusServices';

interface UseCaseFiltersInitializationProps {
	methods: UseFormReturn<ICaseFilter>;
	setSelectedProduct: (option: AsyncSelectOption<IProductAssistant> | null) => void;
	setSelectedVersion: (option: AsyncSelectOption<IVersionAssistant> | null) => void;
	setSelectedStatus: (option: AsyncSelectOption<IStatusAssistant> | null) => void;
	setSelectedUser: (option: AsyncSelectOption<IUserAssistant> | null) => void;
	selectedUser: AsyncSelectOption<IUserAssistant> | null;
}

/**
 * Hook para inicializar filtros do localStorage e usuário logado
 */
export function useCaseFiltersInitialization({
	methods,
	setSelectedProduct,
	setSelectedVersion,
	setSelectedStatus,
	setSelectedUser,
	selectedUser,
}: UseCaseFiltersInitializationProps) {
	const userInitializedRef = useRef(false);
	const filtersInitializedRef = useRef(false);

	// Inicializar campos do formulário com valores do localStorage
	useEffect(() => {
		if (filtersInitializedRef.current) return;

		try {
			const savedData = localStorage.getItem('lastSelectedProduct');
			if (savedData) {
				const parsed = JSON.parse(savedData);

				// Inicializar produto se existir
				if (parsed.produto_id) {
					methods.setValue('produto_id', parsed.produto_id);
					// Buscar o produto para inicializar o selectedProduct
					fetchProducts({ search: '', nome: '' })
						.then((products) => {
							const savedProduct = products.find((p) => p.id === parsed.produto_id);
							if (savedProduct) {
								const productOption: AsyncSelectOption<IProductAssistant> = {
									value: savedProduct.id,
									label: savedProduct.nome_projeto || savedProduct.setor || 'Produto sem nome',
									raw: savedProduct,
								};
								setSelectedProduct(productOption);

								// Inicializar versão se existir e produto foi encontrado
								if (parsed.versao_produto && parsed.versao_produto.trim() !== '') {
									methods.setValue('versao_produto', parsed.versao_produto);
									// Buscar a versão para inicializar o selectedVersion
									fetchVersions({ produto_id: parsed.produto_id, search: '' })
										.then((versions) => {
											const savedVersion = versions.find((v) => v.versao === parsed.versao_produto);
											if (savedVersion) {
												const versionOption: AsyncSelectOption<IVersionAssistant> = {
													value: savedVersion.id,
													label: savedVersion.versao || 'Versão sem nome',
													raw: savedVersion,
												};
												setSelectedVersion(versionOption);
											}
										})
										.catch((error) => {
											console.error('Erro ao buscar versão salva:', error);
										});
								}
							}
						})
						.catch((error) => {
							console.error('Erro ao buscar produto salvo:', error);
						});
				}

				// Inicializar status se existir
				if (parsed.status_id) {
					methods.setValue('status_id', parsed.status_id);
					// Buscar o status para inicializar o selectedStatus
					fetchStatus({ search: '' })
						.then((statuses) => {
							const savedStatus = statuses.find((s) => String(s.Registro) === String(parsed.status_id));
							if (savedStatus) {
								const statusOption: AsyncSelectOption<IStatusAssistant> = {
									value: String(savedStatus.Registro),
									label: savedStatus.descricao || savedStatus.tipo || 'Status sem nome',
									raw: savedStatus,
								};
								setSelectedStatus(statusOption);
								methods.setValue('status_descricao', savedStatus.descricao);
							}
						})
						.catch((error) => {
							console.error('Erro ao buscar status salvo:', error);
						});
				}

				filtersInitializedRef.current = true;
			}
		} catch (error) {
			console.error('Erro ao carregar do localStorage:', error);
		}
	}, [methods, setSelectedProduct, setSelectedVersion, setSelectedStatus]);

	// Inicializar com o usuário logado
	useEffect(() => {
		const currentUserId = Cookies.get('user_id');
		if (currentUserId && !selectedUser && !userInitializedRef.current) {
			userInitializedRef.current = true;
			// Buscar o usuário logado e inicializar o campo
			fetchUsers({ search: '', nome_suporte: '' })
				.then((users) => {
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
						userInitializedRef.current = false; // Permite tentar novamente se não encontrou
					}
				})
				.catch((error) => {
					console.error('Erro ao buscar usuário logado:', error);
					userInitializedRef.current = false; // Permite tentar novamente em caso de erro
				});
		}
	}, [setSelectedUser, methods, selectedUser]);

	// Inicializar campos do formulário com valores da URL
	const queryParams = useQuery();
	const urlFiltersInitializedRef = useRef(false);
	
	useEffect(() => {
		if (urlFiltersInitializedRef.current) return;
		
		const urlFilters = extractCaseFiltersFromUrl(queryParams);
		
		// Inicializar campos de texto da URL
		if (urlFilters.descricao_resumo) {
			methods.setValue('descricao_resumo', urlFilters.descricao_resumo);
		}
		if (urlFilters.descricao_completa) {
			methods.setValue('descricao_completa', urlFilters.descricao_completa);
		}
		if (urlFilters.data_producao_inicio) {
			methods.setValue('data_producao_inicio', urlFilters.data_producao_inicio);
		}
		if (urlFilters.data_producao_fim) {
			methods.setValue('data_producao_fim', urlFilters.data_producao_fim);
		}
		
		if (urlFilters.descricao_resumo || urlFilters.descricao_completa || urlFilters.data_producao_inicio || urlFilters.data_producao_fim) {
			urlFiltersInitializedRef.current = true;
		}
	}, [methods, queryParams]);
}

