'use client';
import { Form } from 'react-bootstrap';
import { Control, Controller, RegisterOptions } from 'react-hook-form';

type TextInputProps = {
	name: string;
	id?: string;
	className?: string;
	containerClass?: string;
	label?: string;
	placeholder?: string;
	rows?: number;
	helpText?: string;
	errors?: any;
	control?: Control<any>;
	register?: RegisterOptions;
};

export default function TextInput({
	name,
	id,
	label,
	className,
	containerClass,
	rows = 3,
	placeholder,
	helpText,
	errors,
	control,
	register,
	...props
}: TextInputProps) {
	return (
		<Controller
			name={name}
			control={control}
			rules={register}
			render={({ field, fieldState }) => (
				<Form.Group className={containerClass}>
					{label && <Form.Label>{label}</Form.Label>}
					<Form.Control
						id={id}
						{...props}
						{...field}
						value={field.value ?? ''}
						onChange={(e) => {
							field.onChange(e.target.value);
						}}
						as={'textarea'}
						rows={rows}
						placeholder={placeholder}
						className={className}
						isInvalid={Boolean(fieldState.error?.message)}
					/>
					{helpText && (
						<Form.Text id={`${name}-help`} muted>
							{helpText}
						</Form.Text>
					)}
					{errors && fieldState.error && <Form.Control.Feedback type="invalid">{fieldState.error['message']}</Form.Control.Feedback>}
				</Form.Group>
			)}
		/>
	);
}
