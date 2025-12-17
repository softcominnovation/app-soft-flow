'use client';

import { TextInput } from '@/components/Form';
import { Button, Col, Collapse, Form, Row, Modal } from 'react-bootstrap';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import ICaseFilter from '@/types/cases/ICaseFilter';
import { useCasesContext } from '@/contexts/casesContext';
import Cookies from 'js-cookie';
import Spinner from '@/components/Spinner';
import AsyncSelect from 'react-select/async';
import { useAsyncSelect, useToggle } from '@/hooks';
import { useEffect, useState, useRef } from 'react';
import { assistant as fetchProducts } from '@/services/productsServices';
import { assistant as fetchProjects } from '@/services/projectsServices';
import { assistant as fetchUsers } from '@/services/usersServices';
import { assistant as fetchVersions, IVersionAssistant } from '@/services/versionsServices';
import { assistant as fetchStatus, IStatusAssistant } from '@/services/statusServices';
import IProductAssistant from '@/types/assistant/IProductAssistant';
import IProjectAssistant from '@/types/assistant/IProjectAssistant';
import IUserAssistant from '@/types/assistant/IUserAssistant';
import type { AsyncSelectOption } from '@/hooks/useAsyncSelect';
import { asyncSelectStyles } from '@/components/Form/asyncSelectStyles';
import CasesModal from './casesModal';
import BottomDrawer from '@/components/BottomDrawer';
import TransferCasesModal from './components/TransferCasesModal';

type CaseFiltersProps = {
	onOpenFiltersDrawer?: () => void;
	showFiltersDrawer?: boolean;
	onCloseFiltersDrawer?: () => void;
	selectedCases?: Set<string>;
	onClearSelectedCases?: () => void;
};

const CaseFilters = ({ 
	onOpenFiltersDrawer, 
	showFiltersDrawer: externalShowFilters, 
	onCloseFiltersDrawer,
	selectedCases = new Set(),
	onClearSelectedCases
}: CaseFiltersProps = {}) => {
	const methods = useForm<ICaseFilter>();
	const { fetchCases, loading, cases } = useCasesContext();
	const [internalShowFilters, setInternalShowFilters] = useState(false);
	const [showTransferModal, setShowTransferModal] = useState(false);
	const [showWarningAlert, setShowWarningAlert] = useState(false);
	const userInitializedRef = useRef(false);
	const filtersInitializedRef = useRef(false);
	
	// Desktop sempre usa estado interno para o Collapse
	// Mobile usa estado externo para o Drawer
	const showFiltersDesktop = internalShowFilters;
	const showFiltersMobile = externalShowFilters !== undefined ? externalShowFilters : false;
	
	// Função para desktop (sempre usa estado interno)
	const toggleFiltersDesktop = () => {
		setInternalShowFilters(prev => !prev);
	};
	
	// Função para mobile (usa estado externo)
	const toggleFiltersMobile = () => {
		if (onOpenFiltersDrawer) {
			onOpenFiltersDrawer();
		}
	};
	const produtoId = methods.watch('produto_id');
	const projetoId = methods.watch('projeto_id');
	const usuarioId = methods.watch('usuario_id');

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

	const versaoProdutoId = methods.watch('versao_produto');
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
		// Limpa o selectedUser quando o campo do formulário está vazio
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

	const statusDescricao = methods.watch('status_descricao');
	useEffect(() => {
		if (!statusDescricao) {
			setSelectedStatus(null);
			methods.setValue('status_id', '');
		}
	}, [statusDescricao, setSelectedStatus, methods]);

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

	const onSearch = (data: ICaseFilter) => {
		// Limpa os casos selecionados antes de fazer a pesquisa
		if (onClearSelectedCases) {
			onClearSelectedCases();
		}

		const trimmedCaseNumber = data.numero_caso?.trim();
		// Usa o selectedUser diretamente para garantir que só inclui se houver seleção
		// Verifica explicitamente se selectedUser existe, não é null, e tem um value válido
		const hasSelectedUser = selectedUser !== null && selectedUser !== undefined && selectedUser.value;
		const usuarioId = hasSelectedUser ? String(selectedUser.value).trim() : '';

		// Verifica se produto_id tem valor válido (não vazio)
		const hasProdutoId = data.produto_id && data.produto_id.toString().trim() !== '';
		// Verifica se versao_produto tem valor válido (não vazio)
		const hasVersaoProduto = data.versao_produto && data.versao_produto.trim() !== '';

		const payload: ICaseFilter = trimmedCaseNumber
			? { numero_caso: trimmedCaseNumber }
					: {
							...(data.status_descricao && data.status_descricao.trim() !== '' && { status_descricao: data.status_descricao }),
							...(data.status_id && { status_id: data.status_id }),
							...(hasProdutoId && { produto_id: data.produto_id }),
							...(data.projeto_id && data.projeto_id.toString().trim() !== '' && { projeto_id: data.projeto_id }),
							...(hasVersaoProduto && { versao_produto: data.versao_produto }),
							// Inclui usuario_dev_id apenas se houver um usuário selecionado (não vazio)
							...(usuarioId && usuarioId !== '' ? { usuario_dev_id: usuarioId } : {}),
							sort_by: 'prioridade',
						};

		// Salva no localStorage se houver produto_id selecionado
		fetchCases(payload, true);
	};

	const handleOpenTransferModal = () => {
		// Verifica se há casos selecionados
		if (selectedCases.size === 0) {
			return;
		}

		// Busca os casos selecionados na lista de casos
		const selectedCasesData = (cases || []).filter(caseItem => 
			selectedCases.has(caseItem.caso.id.toString())
		);

		// Verifica se todos os casos têm produto
		const casesWithProduct = selectedCasesData.filter(caseItem => 
			caseItem.produto && caseItem.produto.id !== null && caseItem.produto.id !== undefined
		);

		// Se não houver casos com produto, permite abrir o modal
		if (casesWithProduct.length === 0) {
			setShowTransferModal(true);
			return;
		}

		// Verifica se todos os casos têm o mesmo produto
		const firstProductId = casesWithProduct[0].produto?.id;
		const allSameProduct = casesWithProduct.every(caseItem => 
			caseItem.produto?.id === firstProductId
		);

		if (!allSameProduct) {
			// Mostra alerta e não abre o modal
			setShowWarningAlert(true);
			return;
		}

		// Se passou na validação, abre o modal
		setShowTransferModal(true);
	};

	return (
		<FormProvider {...methods}>
			<form onSubmit={methods.handleSubmit(onSearch)} className="mb-0 mb-lg-3">
				<div className="d-flex flex-wrap flex-sm-nowrap align-items-center gap-2 mb-0 mb-lg-3">
					<div className="d-flex align-items-center gap-2 w-100 w-sm-auto flex-grow-1">
						{/* Desktop: mantém Collapse */}
						<Button 
							type="button" 
							variant="outline-secondary" 
							size="sm" 
							onClick={toggleFiltersDesktop}
							className="d-none d-lg-inline-flex"
						>
							<i className="uil uil-search" />
						</Button>
						
						{/* Mobile: botão para abrir drawer */}
						<Button 
							type="button" 
							variant="outline-secondary" 
							size="sm" 
							onClick={toggleFiltersMobile}
							className="d-inline-flex d-lg-none"
						>
							<i className="uil uil-search" />
						</Button>
						
						{!showFiltersDesktop && (
							<>
								{/* Desktop e telas >= sm: comportamento antigo (sem expandir) */}
								<Button
									type="submit"
									variant="primary"
									size="sm"
									disabled={loading}
									className="d-none d-sm-inline-flex"
								>
									{loading ? 'Pesquisando...' : 'Pesquisar'}
								</Button>
							</>
						)}
					</div>
					{/* Desktop: mostra botões de adicionar e transferir casos */}
					<div className="d-none d-lg-flex gap-2 align-items-center flex-shrink-0">
						<Button
							variant="outline-primary"
							size="sm"
							className="d-inline-flex align-items-center justify-content-center gap-1 transfer-cases-btn"
							disabled={selectedCases.size === 0}
							onClick={handleOpenTransferModal}
						>
							<i className="mdi mdi-swap-horizontal"></i>
							<span>Transferir Casos</span>
						</Button>
						<CasesModal
							containerClassName=""
							buttonProps={{
								size: 'sm',
							}}
						/>
					</div>
					<TransferCasesModal
						show={showTransferModal}
						onHide={() => setShowTransferModal(false)}
						selectedCases={selectedCases}
						cases={cases}
					/>
				</div>
				
				{/* Desktop: mantém Collapse */}
				<Collapse in={showFiltersDesktop} mountOnEnter unmountOnExit className="d-none d-lg-block">
					<div>
						<Row className="g-3 g-lg-4 align-items-end">
							<Col xs={12} sm={6} md={4} lg={3}>
								<Form.Label className="fw-medium text-muted small">Numero do caso</Form.Label>
								<TextInput
									{...methods.register('numero_caso')}
									type="text"
									name="numero_caso"
									placeholder="Digite o numero..."
									className="form-control-sm"
								/>
							</Col>
							<Col xs={12} sm={6} md={6} lg={3}>
								<Form.Label className="fw-medium text-muted small">Produto</Form.Label>
								<Controller
									name="produto_id"
									control={methods.control}
									render={({ field }) => (
										<AsyncSelect<AsyncSelectOption<IProductAssistant>, false>
											cacheOptions
											defaultOptions={selectedProduct ? [selectedProduct] : defaultProductOptions}
											loadOptions={loadProductOptions}
											inputId="produto-id"
											className="react-select case-status-select"
											classNamePrefix="react-select"
											placeholder="Pesquise um produto..."
											isClearable
											value={selectedProduct}
											onChange={(option) => {
												setSelectedProduct(option);
												field.onChange(option?.value || undefined);
											}}
											onBlur={field.onBlur}
											onMenuOpen={() => {
												triggerProductDefaultLoad();
											}}
											noOptionsMessage={() => (isLoadingProducts ? 'Carregando...' : 'Nenhum produto encontrado')}
											loadingMessage={() => 'Carregando...'}
										/>
									)}
								/>
							</Col>
							<Col xs={12} sm={6} md={6} lg={3}>
								<Form.Label className="fw-medium text-muted small">Versões</Form.Label>
								<Controller
									name="versao_produto"
									control={methods.control}
									render={({ field }) => (
										<AsyncSelect<AsyncSelectOption<IVersionAssistant>, false>
											cacheOptions
											defaultOptions={selectedVersion ? [selectedVersion] : defaultVersionOptions}
											loadOptions={loadVersionOptions}
											inputId="versao-produto-id"
											className="react- case-status-select"
											classNamePrefix="react-select"
											styles={asyncSelectStyles}
											placeholder={!produtoId ? 'Selecione um produto primeiro' : 'Pesquise uma versão...'}
											isClearable
											isDisabled={!produtoId}
											value={selectedVersion}
											onChange={(option) => {
												setSelectedVersion(option);
												field.onChange(option?.raw?.versao || undefined);
											}}
											onBlur={field.onBlur}
											onMenuOpen={() => {
												if (produtoId) {
													triggerVersionDefaultLoad();
												}
											}}
											noOptionsMessage={() => (isLoadingVersions ? 'Carregando...' : !produtoId ? 'Selecione um produto primeiro' : 'Nenhuma versão encontrada')}
											loadingMessage={() => 'Carregando...'}
										/>
									)}
								/>
							</Col>
							<Col xs={12} sm={6} md={6} lg={3}>
								<Form.Label className="fw-medium text-muted small">Projeto</Form.Label>
								<Controller
									name="projeto_id"
									control={methods.control}
									render={({ field }) => (
										<AsyncSelect<AsyncSelectOption<IProjectAssistant>, false>
											cacheOptions
											defaultOptions={selectedProject ? [selectedProject] : defaultProjectOptions}
											loadOptions={loadProjectOptions}
											inputId="projeto-id"
											className="react-select case-status-select"
											classNamePrefix="react-select"
											placeholder="Pesquise um projeto..."
											isClearable
											value={selectedProject}
											onChange={(option) => {
												setSelectedProject(option);
												field.onChange(option?.value || undefined);
											}}
											onBlur={field.onBlur}
											onMenuOpen={() => {
												triggerProjectDefaultLoad();
											}}
											noOptionsMessage={() => (isLoadingProjects ? 'Carregando...' : 'Nenhum projeto encontrado')}
											loadingMessage={() => 'Carregando...'}
										/>
									)}
								/>
							</Col>
							<Col xs={12} sm={6} md={6} lg={3}>
								<Form.Label className="fw-medium text-muted small">Usuario</Form.Label>
								<Controller
									name="usuario_id"
									control={methods.control}
									render={({ field }) => (
										<AsyncSelect<AsyncSelectOption<IUserAssistant>, false>
											cacheOptions
											defaultOptions={selectedUser ? [selectedUser] : defaultUserOptions}
											loadOptions={loadUserOptions}
											inputId="usuario-id"
											className="react-select case-status-select"
											classNamePrefix="react-select"
											placeholder="Pesquise um usuario..."
											isClearable
											value={selectedUser}
											onChange={(option) => {
												setSelectedUser(option);
												field.onChange(option ? option.value : '');
												// Garante que o campo seja limpo no formulário quando não há seleção
												if (!option) {
													methods.setValue('usuario_id', '');
												}
											}}
											onBlur={field.onBlur}
											onMenuOpen={() => {
												triggerUserDefaultLoad();
											}}
											noOptionsMessage={() => (isLoadingUsers ? 'Carregando...' : 'Nenhum usuario encontrado')}
											loadingMessage={() => 'Carregando...'}
										/>
									)}
								/>
							</Col>
							<Col xs={12} sm={6} md={6} lg={3}>
								<Form.Label className="fw-medium text-muted small">Status</Form.Label>
								<Controller
									name="status_descricao"
									control={methods.control}
									render={({ field }) => (
										<AsyncSelect<AsyncSelectOption<IStatusAssistant>, false>
											cacheOptions
											defaultOptions={selectedStatus ? [selectedStatus] : defaultStatusOptions}
											loadOptions={loadStatusOptions}
											inputId="status-descricao"
											className="react-select case-status-select"
											classNamePrefix="react-select"
											styles={asyncSelectStyles}
											placeholder="Pesquise um status..."
											isClearable
											value={selectedStatus}
											onChange={(option) => {
												setSelectedStatus(option);
												field.onChange(option?.raw?.descricao ?? '');
												methods.setValue('status_id', option?.value ?? '');
											}}
											onBlur={field.onBlur}
											onMenuOpen={() => {
												triggerStatusDefaultLoad();
											}}
											noOptionsMessage={() => (isLoadingStatus ? 'Carregando...' : 'Nenhum status encontrado')}
											loadingMessage={() => 'Carregando...'}
										/>
									)}
								/>
							</Col>
							<Col xs={12} sm={6} md={4} lg={2} className="d-grid">
								<Button type="submit" variant="primary" size="sm" disabled={loading} className="filter-search-button w-100">
									{
										loading ?
										<span className='text-center'>
											<span style={{marginRight: '10px'}}>Pesquisando</span>
											<Spinner className="spinner-grow-sm" tag="span" color="white" type="bordered" />
										</span>
										:
										'Pesquisar'
									}
								</Button>
							</Col>
						</Row>
					</div>
				</Collapse>
				
				{/* Mobile: Drawer */}
				<div className="d-lg-none">
					<BottomDrawer
						show={showFiltersMobile}
						onHide={() => {
							if (onCloseFiltersDrawer) {
								onCloseFiltersDrawer();
							}
						}}
						title="Filtros de Casos"
						icon="lucide:filter"
						maxHeight="90vh"
					>
					<Row className="g-3 align-items-end">
						<Col xs={12}>
							<Form.Label className="fw-medium text-muted small">Numero do caso</Form.Label>
							<TextInput
								{...methods.register('numero_caso')}
								type="text"
								name="numero_caso"
								placeholder="Digite o numero..."
								className="form-control-sm"
							/>
						</Col>
						<Col xs={12}>
							<Form.Label className="fw-medium text-muted small">Produto</Form.Label>
							<Controller
								name="produto_id"
								control={methods.control}
								render={({ field }) => (
									<AsyncSelect<AsyncSelectOption<IProductAssistant>, false>
										cacheOptions
										defaultOptions={selectedProduct ? [selectedProduct] : defaultProductOptions}
										loadOptions={loadProductOptions}
										inputId="produto-id"
										className="react-select case-status-select"
										classNamePrefix="react-select"
										placeholder="Pesquise um produto..."
										isClearable
										value={selectedProduct}
										onChange={(option) => {
											setSelectedProduct(option);
											field.onChange(option?.value ?? '');
										}}
										onBlur={field.onBlur}
										onMenuOpen={() => {
											triggerProductDefaultLoad();
										}}
										noOptionsMessage={() => (isLoadingProducts ? 'Carregando...' : 'Nenhum produto encontrado')}
										loadingMessage={() => 'Carregando...'}
									/>
								)}
							/>
						</Col>
						<Col xs={12}>
							<Form.Label className="fw-medium text-muted small">Versões</Form.Label>
							<Controller
								name="versao_produto"
								control={methods.control}
								render={({ field }) => (
									<AsyncSelect<AsyncSelectOption<IVersionAssistant>, false>
										cacheOptions
										defaultOptions={selectedVersion ? [selectedVersion] : defaultVersionOptions}
										loadOptions={loadVersionOptions}
										inputId="versao-produto-id"
										className="react-select case-status-select"
										classNamePrefix="react-select"
										styles={asyncSelectStyles}
										placeholder={!produtoId ? 'Selecione um produto primeiro' : 'Pesquise uma versão...'}
										isClearable
										isDisabled={!produtoId}
										value={selectedVersion}
										onChange={(option) => {
											setSelectedVersion(option);
											field.onChange(option?.raw?.versao || undefined);
										}}
										onBlur={field.onBlur}
										onMenuOpen={() => {
											if (produtoId) {
												triggerVersionDefaultLoad();
											}
										}}
										noOptionsMessage={() => (isLoadingVersions ? 'Carregando...' : !produtoId ? 'Selecione um produto primeiro' : 'Nenhuma versão encontrada')}
										loadingMessage={() => 'Carregando...'}
									/>
								)}
							/>
						</Col>
						<Col xs={12}>
							<Form.Label className="fw-medium text-muted small">Projeto</Form.Label>
							<Controller
								name="projeto_id"
								control={methods.control}
								render={({ field }) => (
									<AsyncSelect<AsyncSelectOption<IProjectAssistant>, false>
										cacheOptions
										defaultOptions={selectedProject ? [selectedProject] : defaultProjectOptions}
										loadOptions={loadProjectOptions}
										inputId="projeto-id"
										className="react-select case-status-select"
										classNamePrefix="react-select"
										placeholder="Pesquise um projeto..."
										isClearable
										value={selectedProject}
										onChange={(option) => {
											setSelectedProject(option);
											field.onChange(option?.value ?? '');
										}}
										onBlur={field.onBlur}
										onMenuOpen={() => {
											triggerProjectDefaultLoad();
										}}
										noOptionsMessage={() => (isLoadingProjects ? 'Carregando...' : 'Nenhum projeto encontrado')}
										loadingMessage={() => 'Carregando...'}
									/>
								)}
							/>
						</Col>
						<Col xs={12}>
							<Form.Label className="fw-medium text-muted small">Usuario</Form.Label>
							<Controller
								name="usuario_id"
								control={methods.control}
								render={({ field }) => (
									<AsyncSelect<AsyncSelectOption<IUserAssistant>, false>
										cacheOptions
										defaultOptions={selectedUser ? [selectedUser] : defaultUserOptions}
										loadOptions={loadUserOptions}
										inputId="usuario-id"
										className="react-select case-status-select"
										classNamePrefix="react-select"
										placeholder="Pesquise um usuario..."
										isClearable
										value={selectedUser}
										onChange={(option) => {
											setSelectedUser(option);
											field.onChange(option ? option.value : '');
											// Garante que o campo seja limpo no formulário quando não há seleção
											if (!option) {
												methods.setValue('usuario_id', '');
											}
										}}
										onBlur={field.onBlur}
										onMenuOpen={() => {
											triggerUserDefaultLoad();
										}}
										noOptionsMessage={() => (isLoadingUsers ? 'Carregando...' : 'Nenhum usuario encontrado')}
										loadingMessage={() => 'Carregando...'}
									/>
								)}
							/>
						</Col>
						<Col xs={12}>
							<Form.Label className="fw-medium text-muted small">Status</Form.Label>
							<Controller
								name="status_descricao"
								control={methods.control}
								render={({ field }) => (
									<AsyncSelect<AsyncSelectOption<IStatusAssistant>, false>
										cacheOptions
										defaultOptions={selectedStatus ? [selectedStatus] : defaultStatusOptions}
										loadOptions={loadStatusOptions}
										inputId="status-descricao"
										className="react-select case-status-select"
										classNamePrefix="react-select"
										styles={asyncSelectStyles}
										placeholder="Pesquise um status..."
										isClearable
										value={selectedStatus}
										onChange={(option) => {
											setSelectedStatus(option);
											field.onChange(option?.raw?.descricao ?? '');
											methods.setValue('status_id', option?.value ?? '');
										}}
										onBlur={field.onBlur}
										onMenuOpen={() => {
											triggerStatusDefaultLoad();
										}}
										noOptionsMessage={() => (isLoadingStatus ? 'Carregando...' : 'Nenhum status encontrado')}
										loadingMessage={() => 'Carregando...'}
									/>
								)}
							/>
						</Col>
						<Col xs={12} className="d-grid mt-2">
							<Button 
								type="submit" 
								variant="primary" 
								size="sm" 
								disabled={loading} 
								className="w-100"
								onClick={() => {
									methods.handleSubmit(onSearch)();
									if (externalShowFilters !== undefined && onCloseFiltersDrawer) {
										onCloseFiltersDrawer();
									} else {
										setInternalShowFilters(false);
									}
								}}
							>
								{
									loading ?
									<span className='text-center d-flex align-items-center justify-content-center gap-2'>
										<span>Pesquisando</span>
										<Spinner className="spinner-grow-sm" tag="span" color="white" type="bordered" />
									</span>
									:
									'Pesquisar'
								}
							</Button>
						</Col>
					</Row>
					</BottomDrawer>
				</div>
				
				{/* Modal de Alerta de Warning */}
				<Modal
					show={showWarningAlert}
					onHide={() => setShowWarningAlert(false)}
					centered
					contentClassName="border-0"
					dialogStyle={{ maxWidth: '500px' }}
				>
					<div className="modal-filled bg-warning">
						<Modal.Body className="p-4">
							<div className="text-center">
								<i className="mdi mdi-alert-circle h1 mb-3"></i>
								<h4 className="mt-2 mb-3">Atenção</h4>
								<p className="mt-3 mb-0">
									Não é possível transferir casos de produtos diferentes. Por favor, selecione apenas casos do mesmo produto.
								</p>
								<Button variant="light" className="my-3" onClick={() => setShowWarningAlert(false)}>
									Entendi
								</Button>
							</div>
						</Modal.Body>
					</div>
				</Modal>
			</form>
		</FormProvider>
	);
};

export default CaseFilters;
