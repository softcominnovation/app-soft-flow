import { Form, Card } from 'react-bootstrap';
import Select, { GroupBase } from 'react-select';
import AsyncSelect from 'react-select/async';
import { Control, Controller, useFormContext, useWatch } from 'react-hook-form';
import ICasePost from '@/types/cases/ICasePost';
import { useAsyncSelect } from '@/hooks';
import { assistant as fetchProducts } from '@/services/productsServices';
import { assistant as fetchVersions, IVersionAssistant } from '@/services/versionsServices';
import { assistant as fetchOrigins, IOriginAssistant } from '@/services/originsServices';
import { assistant as fetchStatus, IStatusAssistant } from '@/services/statusServices';
import { assistant as fetchModules, IModuleAssistant } from '@/services/modulesServices';
import { assistant as fetchCategories, ICategoryAssistant } from '@/services/categoriesServices';
import IProductAssistant from '@/types/assistant/IProductAssistant';
import type { AsyncSelectOption } from '@/hooks/useAsyncSelect';
import { asyncSelectStyles, filterOption } from '@/components/Form/asyncSelectStyles';
import { useEffect } from 'react';

type Props = {
	control: Control<ICasePost>
};

export default function CasesHeaderForm({ control }: Props) {
	const { getValues, setValue } = useFormContext<ICasePost>();

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
		debounceMs: 800,
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
			if (!selectedProduct) return [];
			const productId = selectedProduct.value;
			return fetchVersions({ search: input, produto_id: productId });
		},
		getOptionLabel: (version) => version.versao || version.sequencia || 'Sem versão',
		getOptionValue: (version) => version.id,
		debounceMs: 800,
	});

	const priorityOptions = Array.from({ length: 10 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) }));

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
		try {
			const formValues = getValues ? getValues() : undefined;
			if (formValues) {
				if (formValues.product && !selectedProduct) setSelectedProduct(formValues.product as any);
				if (formValues.version && !selectedVersion) setSelectedVersion(formValues.version as any);
				if (formValues.status && !selectedStatus) setSelectedStatus(formValues.status as any);
			}
		} catch (e) {
			// ignore if getValues unavailable
		}
	}, [getValues, selectedProduct, selectedVersion, selectedStatus, setSelectedProduct, setSelectedVersion, setSelectedStatus]);

	// Inicializar status "Aberto" (Registro: 1) quando o componente montar, apenas se não houver status já selecionado
	useEffect(() => {
		const initializeStatusAberto = async () => {
			if (!selectedStatus) {
				// Buscar status para encontrar o "Aberto"
				try {
					const statuses = await fetchStatus({});
					const statusAberto = statuses.find((s) => s.Registro === 1);
					if (statusAberto) {
						const statusOption: AsyncSelectOption<IStatusAssistant> = {
							value: String(statusAberto.Registro),
							label: statusAberto.descricao || statusAberto.tipo || 'Aberto',
							raw: statusAberto,
						};
						setSelectedStatus(statusOption);
						setValue('status', statusOption);
					}
				} catch (error) {
					console.error('Erro ao buscar status Aberto:', error);
				}
			}
		};
		
		initializeStatusAberto();
	}, [selectedStatus, setSelectedStatus, setValue]);

	const {
		loadOptions: loadOriginOptions,
		selectedOption: selectedOrigin,
		setSelectedOption: setSelectedOrigin,
		defaultOptions: defaultOriginOptions,
		triggerDefaultLoad: triggerOriginDefaultLoad,
		isLoading: isLoadingOrigins,
	} = useAsyncSelect<IOriginAssistant>({
		fetchItems: async (input) => fetchOrigins({ search: input }),
		getOptionLabel: (origin) => origin.nome,
		getOptionValue: (origin) => origin.id,
		debounceMs: 800,
	});

	const {
		loadOptions: loadModuleOptions,
		selectedOption: selectedModule,
		setSelectedOption: setSelectedModule,
		defaultOptions: defaultModuleOptions,
		triggerDefaultLoad: triggerModuleDefaultLoad,
		isLoading: isLoadingModules,
	} = useAsyncSelect<IModuleAssistant>({
		fetchItems: async (input) => {
			if (!selectedProduct) return [];
			const productId = selectedProduct.value;
			return fetchModules({ produto_id: productId, search: input });
		},
		getOptionLabel: (module) => module.nome || 'Módulo sem nome',
		getOptionValue: (module) => module.nome,
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

	// Limpar módulo quando produto mudar
	useEffect(() => {
		if (!selectedProduct) {
			setSelectedModule(null);
			setValue('modulo', '');
		}
	}, [selectedProduct, setSelectedModule, setValue]);

	useEffect(() => {
		const formValues = getValues();
		if (formValues.Id_Origem && !selectedOrigin) {
			const v: any = formValues.Id_Origem as any;
			if (typeof v === 'object') {
				setSelectedOrigin(v);
			} else {
				const match = (defaultOriginOptions as any)?.find((o: any) => o?.value === v);
				if (match) setSelectedOrigin(match);
			}
		}
		if (formValues.modulo && !selectedModule) {
			const v: any = formValues.modulo as any;
			if (typeof v === 'object') {
				setSelectedModule(v);
			} else {
				const match = (defaultModuleOptions as any)?.find((o: any) => o?.value === v);
				if (match) setSelectedModule(match);
			}
		}
		if (formValues.category && !selectedCategory) {
			const v: any = formValues.category as any;
			if (typeof v === 'object') {
				setSelectedCategory(v);
			} else {
				const match = (defaultCategoryOptions as any)?.find((o: any) => o?.value === v);
				if (match) setSelectedCategory(match);
			}
		}
	}, [getValues, selectedOrigin, setSelectedOrigin, defaultOriginOptions, selectedModule, setSelectedModule, defaultModuleOptions, selectedCategory, setSelectedCategory, defaultCategoryOptions]);

	return (

		<div className="container mt-4">
			<Card className="shadow-sm rounded-3">
				<Card.Body>
					<div className="row mb-3">
						<div className="col-md-4 mb-3 mb-md-0">
							<Form.Label className="fw-semibold">Produto*</Form.Label>
							<Controller
								name="product"
								rules={{ required: 'O campo Projeto (id do Produto) é obrigatório.' }}
								control={control}
								render={({ field, fieldState }) => (
									<>
										<AsyncSelect<AsyncSelectOption<IProductAssistant>, false>
											cacheOptions
											defaultOptions={selectedProduct ? [selectedProduct] : defaultProductOptions}
											loadOptions={loadProductOptions}
											inputId="produto-id"
											className={`react-select ${fieldState.error ? 'is-invalid' : ''}`}
											// pass invalid flag to styles so we can render red border
											{...({ isInvalid: Boolean(fieldState.error) } as any)}
											classNamePrefix="react-select"
											placeholder="Pesquise um produto..."
											isClearable
											styles={asyncSelectStyles}
											filterOption={filterOption}
											value={selectedProduct}
											onChange={(option) => {
												const typedOption = option as AsyncSelectOption<IProductAssistant>;
												setSelectedProduct(typedOption);
												field.onChange(typedOption);
											}}
											onBlur={field.onBlur}
											onMenuOpen={() => {
												triggerProductDefaultLoad();
											}}
											noOptionsMessage={() => (isLoadingProducts ? 'Carregando...' : 'Nenhum produto encontrado')}
											loadingMessage={() => 'Carregando...'}
										/>
										{fieldState.error && (
											<Form.Control.Feedback type="invalid" className="d-block">
												{String(fieldState.error.message)}
											</Form.Control.Feedback>
										)}
									</>
								)}
							/>
						</div>

						<div className="col-md-4 mb-3 mb-md-0">
							<Form.Label className="fw-semibold">Versão*</Form.Label>
							<Controller
								name="version"
								rules={{ required: 'O campo Versão do Produto é obrigatório.' }}
								control={control}
								render={({ field, fieldState }) => (
									<>
											<AsyncSelect<AsyncSelectOption<IVersionAssistant>, false>
												cacheOptions
												defaultOptions={selectedVersion ? [selectedVersion] : defaultVersionOptions}
												loadOptions={loadVersionOptions}
												inputId="versao-id"
												className={`react-select ${fieldState.error ? 'is-invalid' : ''}`}
											{...({ isInvalid: Boolean(fieldState.error) } as any)}
											classNamePrefix="react-select"
											styles={asyncSelectStyles}
											filterOption={filterOption}
											placeholder="Selecione a versão..."
											isClearable
											isDisabled={!selectedProduct}
											value={selectedVersion}
											onChange={(option) => {
												const typedOption = option as AsyncSelectOption<IVersionAssistant>;
												setSelectedVersion(typedOption);
												field.onChange(typedOption);
											}}
											onBlur={field.onBlur}
											onMenuOpen={() => {
												triggerVersionDefaultLoad();
											}}
											noOptionsMessage={() => (isLoadingVersions ? 'Carregando...' : 'Nenhuma versão encontrada')}
											loadingMessage={() => 'Carregando...'}
										/>
										{fieldState.error && (
											<Form.Control.Feedback type="invalid" className="d-block">
												{String(fieldState.error.message)}
											</Form.Control.Feedback>
										)}
									</>
								)}
							/>
						</div>

						<div className="col-md-4 mb-3 mb-md-0">
							<Form.Label className="fw-semibold">Módulo*</Form.Label>
							<Controller
								name="modulo"
								rules={{ required: 'O campo Módulo é obrigatório.' }}
								control={control}
								render={({ field, fieldState }) => (
									<>
										<AsyncSelect<AsyncSelectOption<IModuleAssistant>, false>
											cacheOptions
											defaultOptions={selectedModule ? [selectedModule] : defaultModuleOptions}
											loadOptions={loadModuleOptions}
											inputId="modulo-id"
											className={`react-select ${fieldState.error ? 'is-invalid' : ''}`}
											{...({ isInvalid: Boolean(fieldState.error) } as any)}
											classNamePrefix="react-select"
											placeholder={!selectedProduct ? 'Selecione um produto primeiro' : 'Pesquise um módulo...'}
											isClearable
											isDisabled={!selectedProduct}
											styles={asyncSelectStyles}
											filterOption={filterOption}
											value={selectedModule}
											onChange={(option) => {
												const typedOption = option as AsyncSelectOption<IModuleAssistant>;
												setSelectedModule(typedOption);
												const value = typedOption?.raw?.nome ?? '';
												field.onChange(value || undefined);
											}}
											onBlur={field.onBlur}
											onMenuOpen={() => {
												if (selectedProduct) {
													triggerModuleDefaultLoad();
												}
											}}
											noOptionsMessage={() => (isLoadingModules ? 'Carregando...' : 'Nenhum módulo encontrado')}
											loadingMessage={() => 'Carregando...'}
										/>
										{fieldState.error && (
											<Form.Control.Feedback type="invalid" className="d-block">
												{String(fieldState.error.message)}
											</Form.Control.Feedback>
										)}
									</>
								)}
							/>
						</div>
					</div>
					<div className="row mb-3">
						<div className="col-md-4 mb-3 mb-md-0">
							<Form.Label className="fw-semibold">Prioridade*</Form.Label>
							<Controller
								name="priority"
								rules={{ required: 'O campo Prioridade (1,2,3,4,5,6,7,8,9,10) é obrigatório.' }}
								control={control}
								render={({ field, fieldState }) => {
									const selected = priorityOptions.find((o) => o.value === field.value);
									return (
										<>
											<Select
												className={`react-select ${fieldState.error ? 'is-invalid' : ''}`}
												{...({ isInvalid: Boolean(fieldState.error) } as any)}
												inputId="priority"
												placeholder="Selecione a prioridade"
												classNamePrefix="react-select"
												options={priorityOptions}
												value={selected}
												onChange={(selectedOption) => field.onChange((selectedOption as any)?.value)}
												onBlur={field.onBlur}
											/>
											{fieldState.error && (
												<Form.Control.Feedback type="invalid" className="d-block">
													{String(fieldState.error.message)}
												</Form.Control.Feedback>
											)}
										</>
									);
								}}
							/>
						</div>

						<div className="col-md-4 mb-3 mb-md-0">
							<Form.Label className="fw-semibold">Status*</Form.Label>
							<Controller
								name="status"
								rules={{ required: 'O campo Status é obrigatório.' }}
								control={control}
								render={({ field, fieldState }) => (
									<>
										<AsyncSelect<AsyncSelectOption<IStatusAssistant>, false>
											cacheOptions
											defaultOptions={selectedStatus ? [selectedStatus] : defaultStatusOptions}
											loadOptions={loadStatusOptions}
											inputId="status-id"
											className={`react-select ${fieldState.error ? 'is-invalid' : ''}`}
											{...({ isInvalid: Boolean(fieldState.error) } as any)}
											classNamePrefix="react-select"
											placeholder="Pesquise um status..."
											isClearable
											value={selectedStatus}
											onChange={(option) => {
												setSelectedStatus(option as any);
												const value = option ? { value: (option as any).value, label: (option as any).label } : undefined;
												field.onChange(value);
											}}
											onBlur={field.onBlur}
											onMenuOpen={() => triggerStatusDefaultLoad()}
											noOptionsMessage={() => (isLoadingStatus ? 'Carregando...' : 'Nenhum status encontrado')}
											loadingMessage={() => 'Carregando...'}
										/>
										{fieldState.error && (
											<Form.Control.Feedback type="invalid" className="d-block">
												{String(fieldState.error.message)}
											</Form.Control.Feedback>
										)}
									</>
								)}
							/>
						</div>

						<div className="col-md-4 mb-3 mb-md-0">
							<Form.Label className="fw-semibold">Categoria*</Form.Label>
							<Controller
								name="category"
								rules={{ required: 'O campo Categoria é obrigatório.' }}
								control={control}
								render={({ field, fieldState }) => (
									<>
										<AsyncSelect<AsyncSelectOption<ICategoryAssistant>, false>
											cacheOptions
											defaultOptions={selectedCategory ? [selectedCategory] : defaultCategoryOptions}
											loadOptions={loadCategoryOptions}
											inputId="categoria-id"
											className={`react-select ${fieldState.error ? 'is-invalid' : ''}`}
											{...({ isInvalid: Boolean(fieldState.error) } as any)}
											classNamePrefix="react-select"
											placeholder="Pesquise uma categoria..."
											isClearable
											styles={asyncSelectStyles}
											filterOption={filterOption}
											value={selectedCategory}
											onChange={(option) => {
												const typedOption = option as AsyncSelectOption<ICategoryAssistant>;
												setSelectedCategory(typedOption);
												field.onChange(typedOption?.value ?? undefined);
											}}
											onBlur={field.onBlur}
											onMenuOpen={() => triggerCategoryDefaultLoad()}
											noOptionsMessage={() => (isLoadingCategories ? 'Carregando...' : 'Nenhuma categoria encontrada')}
											loadingMessage={() => 'Carregando...'}
										/>
										{fieldState.error && (
											<Form.Control.Feedback type="invalid" className="d-block">
												{String(fieldState.error.message)}
											</Form.Control.Feedback>
										)}
									</>
								)}
							/>
						</div>
					</div>
					<div className="row mb-3">
						<div className="col-md-4 mb-3 mb-md-0">
							<Form.Label className="fw-semibold">Origem*</Form.Label>
							<Controller
								name="Id_Origem"
								rules={{ required: 'O campo ID Origem é obrigatório.' }}
								control={control}
								render={({ field, fieldState }) => (
									<>
										<AsyncSelect<AsyncSelectOption<IOriginAssistant>, false>
											cacheOptions
											defaultOptions={selectedOrigin ? [selectedOrigin] : defaultOriginOptions}
											loadOptions={loadOriginOptions}
											inputId="origem-id"
											className={`react-select ${fieldState.error ? 'is-invalid' : ''}`}
											{...({ isInvalid: Boolean(fieldState.error) } as any)}
											classNamePrefix="react-select"
											placeholder="Selecione a origem..."
											isClearable
											styles={asyncSelectStyles}
											filterOption={filterOption}
											value={selectedOrigin}
                            onChange={(option) => {
                                const typedOption = option as AsyncSelectOption<IOriginAssistant>;
                                setSelectedOrigin(typedOption);
                                // store full option in form state to preserve label/value when switching steps
                                field.onChange(typedOption);
                            }}
											onBlur={field.onBlur}
											onMenuOpen={() => triggerOriginDefaultLoad()}
											noOptionsMessage={() => (isLoadingOrigins ? 'Carregando...' : 'Nenhuma origem encontrada')}
											loadingMessage={() => 'Carregando...'}
										/>
										{fieldState.error && (
											<Form.Control.Feedback type="invalid" className="d-block">
												{String(fieldState.error.message)}
											</Form.Control.Feedback>
										)}
									</>
								)}
							/>
						</div>
					</div>
				</Card.Body>
			</Card>
		</div>
	);

}
