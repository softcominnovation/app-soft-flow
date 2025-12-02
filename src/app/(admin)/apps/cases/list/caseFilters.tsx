'use client';

import { TextInput } from '@/components/Form';
import { Button, Col, Collapse, Form, Row } from 'react-bootstrap';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import ICaseFilter from '@/types/cases/ICaseFilter';
import { useCasesContext } from '@/contexts/casesContext';
import Cookies from 'js-cookie';
import Select from 'react-select';
import Spinner from '@/components/Spinner';
import AsyncSelect from 'react-select/async';
import { useAsyncSelect, useToggle } from '@/hooks';
import { useEffect, useState } from 'react';
import { assistant as fetchProducts } from '@/services/productsServices';
import { assistant as fetchProjects } from '@/services/projectsServices';
import { assistant as fetchUsers } from '@/services/usersServices';
import { assistant as fetchVersions, IVersionAssistant } from '@/services/versionsServices';
import IProductAssistant from '@/types/assistant/IProductAssistant';
import IProjectAssistant from '@/types/assistant/IProjectAssistant';
import IUserAssistant from '@/types/assistant/IUserAssistant';
import type { AsyncSelectOption } from '@/hooks/useAsyncSelect';
import { asyncSelectStyles } from '@/components/Form/asyncSelectStyles';
import CasesModal from './casesModal';
import BottomDrawer from '@/components/BottomDrawer';

type StatusOption = { value: string; label: string };

const statusOptions: StatusOption[] = [
	{ value: 'ATRIBUIDO', label: 'ATRIBUIDO' },
	{ value: 'NOVO', label: 'NOVO' },
	{ value: 'AGUARDANDO TESTE', label: 'AGUARDANDO TESTE' },
	{ value: 'CONCLUIDO', label: 'CONCLUIDO' },
];

type CaseFiltersProps = {
	onOpenFiltersDrawer?: () => void;
	showFiltersDrawer?: boolean;
	onCloseFiltersDrawer?: () => void;
};

const CaseFilters = ({ 
	onOpenFiltersDrawer, 
	showFiltersDrawer: externalShowFilters, 
	onCloseFiltersDrawer 
}: CaseFiltersProps = {}) => {
	const methods = useForm<ICaseFilter>();
	const { fetchCases, loading } = useCasesContext();
	const [internalShowFilters, setInternalShowFilters] = useState(false);
	
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
			const fallbackUserId = usuarioId && usuarioId !== '' ? usuarioId : Cookies.get('user_id');
			return fetchProjects({
				search: input,
				nome_projeto: input,
				...(fallbackUserId ? { usuario_id: fallbackUserId } : {}),
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
		if (!usuarioId) {
			setSelectedUser(null);
		}
	}, [usuarioId, setSelectedUser]);

	useEffect(() => {
		if (!produtoId) {
			setSelectedVersion(null);
			methods.setValue('versao_produto', '');
		}
	}, [produtoId, setSelectedVersion, methods]);

	useEffect(() => {
		if (!versaoProdutoId) {
			setSelectedVersion(null);
		}
	}, [versaoProdutoId, setSelectedVersion]);

	const onSearch = (data: ICaseFilter) => {
		const trimmedCaseNumber = data.numero_caso?.trim();
		console.log(data.usuario_id);
		const selectedUserId = data.usuario_id && data.usuario_id != "" ? data.usuario_id : Cookies.get('user_id');
		const currentUserId = Cookies.get('user_id');
		
		// Se o usuário alterou manualmente o filtro de usuário, marca para não salvar
		if (selectedUserId !== currentUserId) {
			try {
				sessionStorage.setItem('userFilterChangedManually', 'true');
				localStorage.removeItem('lastSelectedProduct');
			} catch (error) {
				console.error('Erro ao atualizar sessionStorage:', error);
			}
		} else {
			// Se voltou para o usuário padrão, remove a flag
			try {
				sessionStorage.removeItem('userFilterChangedManually');
			} catch (error) {
				console.error('Erro ao atualizar sessionStorage:', error);
			}
		}

		const payload: ICaseFilter = trimmedCaseNumber
			? { numero_caso: trimmedCaseNumber }
					: {
							...(data.status_descricao && { status_descricao: data.status_descricao }),
							...(data.status_id && { status_id: data.status_id }),
							...(data.produto_id && { produto_id: data.produto_id }),
							...(data.projeto_id && { projeto_id: data.projeto_id }),
							...(data.versao_produto && data.versao_produto.trim() !== '' && { versao_produto: data.versao_produto }),
							usuario_dev_id: selectedUserId,
							sort_by: 'prioridade',
						};

		console.log('Payload final:', payload);
		fetchCases(payload);
	};

	return (
		<FormProvider {...methods}>
			<form onSubmit={methods.handleSubmit(onSearch)} className="mb-0 mb-lg-3">
				<div className="d-flex flex-wrap flex-sm-nowrap align-items-center gap-2 mb-0 mb-lg-3">
					<div className="d-flex align-items-center gap-2 w-100 w-sm-auto">
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
					{/* Desktop: mostra botão de adicionar caso */}
					<div className="d-none d-lg-block">
						<CasesModal
							containerClassName="d-flex ms-sm-auto justify-content-sm-end w-100 w-sm-auto"
							buttonProps={{
								size: 'sm',
							}}
						/>
					</div>
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
												field.onChange(option?.raw?.versao ?? '');
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
												field.onChange(option?.value ?? '');
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
										<Select
											inputId="status-descricao"
											className="react-select case-status-select"
											classNamePrefix="react-select"
											options={statusOptions}
											placeholder="Selecione um status..."
											isClearable
											value={statusOptions.find((option) => option.value === field.value) ?? null}
											onChange={(option) => field.onChange(option?.value ?? '')}
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
											field.onChange(option?.raw?.versao ?? '');
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
											field.onChange(option?.value ?? '');
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
									<Select
										inputId="status-descricao"
										className="react-select case-status-select"
										classNamePrefix="react-select"
										options={statusOptions}
										placeholder="Selecione um status..."
										isClearable
										value={statusOptions.find((option) => option.value === field.value) ?? null}
										onChange={(option) => field.onChange(option?.value ?? '')}
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
			</form>
		</FormProvider>
	);
};

export default CaseFilters;
