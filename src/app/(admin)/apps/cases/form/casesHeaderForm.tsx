import { Form, Card } from 'react-bootstrap';
import Select, { GroupBase } from 'react-select';
import AsyncSelect from 'react-select/async';
import { Control, Controller, useFormContext, useWatch } from 'react-hook-form';
import ICasePost from '@/types/cases/ICasePost';
import { useAsyncSelect } from '@/hooks';
import { assistant as fetchProducts } from '@/services/productsServices';
import { assistant as fetchVersions, IVersionAssistant } from '@/services/versionsServices';
import { assistant as fetchOrigins, IOriginAssistant } from '@/services/originsServices';
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
		fetchItems: async () => {
			if (!selectedProduct) return [];
			const productId = selectedProduct.value;
			return fetchVersions({ produto_id: productId });
		},
		getOptionLabel: (version) => version.sequencia || 'Sem sequência',
		getOptionValue: (version) => version.id,
		debounceMs: 800,
	});

	useEffect(() => {
		const formValues = getValues();
		if (formValues.product && !selectedProduct) {
			setSelectedProduct(formValues.product as any);
		}
		if (formValues.version && !selectedVersion) {
			setSelectedVersion(formValues.version as any);
		}
	}, [getValues, selectedProduct, selectedVersion, setSelectedProduct, setSelectedVersion]);

		const priorityOptions = Array.from({ length: 10 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) }));

	const {
		loadOptions: loadOriginOptions,
		selectedOption: selectedOrigin,
		setSelectedOption: setSelectedOrigin,
		defaultOptions: defaultOriginOptions,
		triggerDefaultLoad: triggerOriginDefaultLoad,
		isLoading: isLoadingOrigins,
	} = useAsyncSelect<IOriginAssistant>({
		fetchItems: async () => fetchOrigins(),
		getOptionLabel: (origin) => origin.nome,
		getOptionValue: (origin) => origin.id,
		debounceMs: 800,
	});

	useEffect(() => {
		const formValues = getValues();
		if (formValues.Id_Origem && !selectedOrigin) {
			setSelectedOrigin(formValues.Id_Origem as any);
		}
	}, [getValues, selectedOrigin, setSelectedOrigin]);

	return (

		<div className="container mt-4">
			<Card className="shadow-sm rounded-3">
				<Card.Body>
					<div className="row mb-3">
						<div className="col-md-6 mb-3 mb-md-0">
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

						<div className="col-md-6">
							<Form.Label className="fw-semibold">Prioridade</Form.Label>
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
						
						
						
						
					</div>
					<div className="row mb-3">
						<div className="col-md-6 mb-3 mb-md-0">
							<Form.Label className="fw-semibold">Versão</Form.Label>
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

						<div className="col-md-6">
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
												field.onChange(typedOption?.value);
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
