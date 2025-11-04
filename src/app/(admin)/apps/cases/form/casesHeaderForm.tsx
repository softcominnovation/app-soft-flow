import { Form, Card } from 'react-bootstrap';
import Select, { GroupBase } from 'react-select';
import AsyncSelect from 'react-select/async';
import { Control, Controller } from 'react-hook-form';
import ICasePost from '@/types/cases/ICasePost';
import { useAsyncSelect } from '@/hooks';
import { assistant as fetchProducts } from '@/services/productsServices';
import IProductAssistant from '@/types/assistant/IProductAssistant';
import type { AsyncSelectOption } from '@/hooks/useAsyncSelect';

type Props = {
	control: Control<ICasePost>
};

export default function CasesHeaderForm({ control }: Props) {

	const options: GroupBase<{ value: string, label: string }>[] = [
		{
			label: 'Produtos',
			options: [
				{ value: 'softcomshop', label: 'Softcomshop' },
				{ value: 'softshop', label: 'Softshop' },
				{ value: 'pdv', label: 'PDV' },
			]
		}
	];

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

	const priorityOptions = Array.from({ length: 10 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) }));

	return (
		<div className="container mt-4">
			<Card className="shadow-sm rounded-3">
				<Card.Body>
					<div className="row mb-3">
						<div className="col-md-6 mb-3 mb-md-0">
							<Form.Label className="fw-semibold">Produto*</Form.Label>
							<Controller
								name="product"
								control={control}
								render={({ field }) => (
									<AsyncSelect<AsyncSelectOption<IProductAssistant>, false>
										cacheOptions
										defaultOptions={selectedProduct ? [selectedProduct] : defaultProductOptions}
										loadOptions={loadProductOptions}
										inputId="produto-id"
										className="react-select"
										classNamePrefix="react-select"
										placeholder="Pesquise um produto..."
										isClearable
										value={selectedProduct}
										onChange={(option) => {
											setSelectedProduct(option as any);
											field.onChange(option ? { value: (option as any).value, label: (option as any).label } : null);
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
						</div>

						<div className="col-md-6">
							<Form.Label className="fw-semibold">Prioridade</Form.Label>
							<Controller
								name={'priority' as any}
								control={control}
								render={({ field }: any) => {
									const selected = (priorityOptions as any).find((o: any) => o.value === field.value) || null;
									return (
										<Select
											className="react-select"
											placeholder="Selecione a prioridade"
											classNamePrefix="react-select"
											options={priorityOptions as any}
											value={selected}
											onChange={(selectedOption: any) => field.onChange(selectedOption?.value)}
											onBlur={field.onBlur}
										/>
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
								control={control}
								render={({ field }) => {
									const flat = (options as any).flatMap((g: any) => g.options || []);
									const selected = flat.find((o: any) => o.value === field.value) || null;
									return (
										<Select
											className="react-select"
											placeholder="Selecione a versão"
											classNamePrefix="react-select"
											options={options as any}
											value={selected}
											onChange={(selectedOption: any) => field.onChange(selectedOption?.value)}
											onBlur={field.onBlur}
										/>
									);
								}}
							/>
						</div>
					</div>

				</Card.Body>
			</Card>
		</div>
	);

}
