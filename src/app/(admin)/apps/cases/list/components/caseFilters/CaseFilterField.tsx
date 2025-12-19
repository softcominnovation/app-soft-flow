import { Controller, Control } from 'react-hook-form';
import { Col, Form } from 'react-bootstrap';
import AsyncSelect from 'react-select/async';
import type { AsyncSelectOption } from '@/hooks/useAsyncSelect';
import { asyncSelectStyles } from '@/components/Form/asyncSelectStyles';
import ICaseFilter from '@/types/cases/ICaseFilter';

interface CaseFilterFieldProps<T> {
	name: keyof ICaseFilter;
	control: Control<ICaseFilter>;
	label: string;
	loadOptions: (input: string) => Promise<AsyncSelectOption<T>[]>;
	selectedOption: AsyncSelectOption<T> | null;
	onChange: (option: AsyncSelectOption<T> | null) => void;
	defaultOptions: AsyncSelectOption<T>[];
	triggerDefaultLoad: () => void;
	isLoading: boolean;
	placeholder: string;
	inputId: string;
	isDisabled?: boolean;
	onBlur?: () => void;
	colSize?: {
		xs?: number;
		sm?: number;
		md?: number;
		lg?: number;
	};
	useCustomStyles?: boolean;
	getValue?: (option: AsyncSelectOption<T> | null) => string | number | undefined;
	onFieldChange?: (value: string | number | undefined) => void;
}

/**
 * Componente reutilizável para campos de filtro com AsyncSelect
 */
export default function CaseFilterField<T>({
	name,
	control,
	label,
	loadOptions,
	selectedOption,
	onChange,
	defaultOptions,
	triggerDefaultLoad,
	isLoading,
	placeholder,
	inputId,
	isDisabled = false,
	onBlur,
	colSize = { xs: 12, sm: 6, md: 6, lg: 3 },
	useCustomStyles = false,
	getValue,
	onFieldChange,
}: CaseFilterFieldProps<T>) {
	return (
		<Col xs={colSize.xs} sm={colSize.sm} md={colSize.md} lg={colSize.lg}>
			<Form.Label className="fw-medium text-muted small">{label}</Form.Label>
			<Controller
				name={name}
				control={control}
				render={({ field }) => (
					<AsyncSelect<AsyncSelectOption<T>, false>
						cacheOptions
						defaultOptions={selectedOption ? [selectedOption] : defaultOptions}
						loadOptions={loadOptions}
						inputId={inputId}
						className="react-select case-status-select"
						classNamePrefix="react-select"
						styles={useCustomStyles ? asyncSelectStyles : undefined}
						placeholder={placeholder}
						isClearable
						isDisabled={isDisabled}
						value={selectedOption}
						onChange={(option) => {
							onChange(option);
							const value = getValue ? getValue(option) : option?.value || undefined;
							field.onChange(value);
							if (onFieldChange) {
								onFieldChange(value);
							}
						}}
						onBlur={onBlur || field.onBlur}
						onMenuOpen={() => {
							triggerDefaultLoad();
						}}
						noOptionsMessage={() => (isLoading ? 'Carregando...' : 'Nenhum resultado encontrado')}
						loadingMessage={() => 'Carregando...'}
					/>
				)}
			/>
		</Col>
	);
}

