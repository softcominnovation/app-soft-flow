'use client';
import { Form } from 'react-bootstrap';
import { Control, Controller, RegisterOptions, useFormContext } from 'react-hook-form';

type TextInputProps = {
	type: 'text' | 'email' | 'number';
	id?: string;
	name: string;
	className?: string;
	containerClass?: string;
	label?: string;
	placeholder?: string;
	bsPrefix?: string;
	helpText?: string;
	readOnly?: boolean;
	disabled?: boolean;
	errors?: any;
	control?: Control<any>;
	register?: RegisterOptions;
};

export default function TextInput({
	name,
	id,
	className,
	containerClass,
	label,
	placeholder,
	helpText,
	errors,
	register,
    control,
	type,
	disabled,
	readOnly,
	...props
}: TextInputProps) {
    const form = useFormContext();
    const resolvedControl = control ?? form?.control;

    return (
        <Controller
            name={name}
            control={resolvedControl}
            rules={register}
            render={({ field, fieldState }) => (
                <Form.Group className={containerClass ?? ''}>
					{label && <Form.Label>{label}</Form.Label>}
					<Form.Control
						id={id}
						type={type}
						{...props}
						{...field}
						value={field.value ?? ''}
						onChange={(e) => {
							field.onChange(e.target.value);
						}}
						placeholder={placeholder}
						className={className}
						isInvalid={Boolean(fieldState.error?.message)}
						disabled={disabled}
						readOnly={readOnly}
					/>
					{helpText && (
						<Form.Text id={`${name}-help`} muted>
							{helpText}
						</Form.Text>
					)}
					{errors || (fieldState.error && <Form.Control.Feedback type="invalid">{fieldState.error['message']}</Form.Control.Feedback>)}
				</Form.Group>
			)}
		/>
	);
}
