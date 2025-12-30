'use client';
import { Form } from 'react-bootstrap';
import { Control, Controller } from 'react-hook-form';

interface ViabilityCheckboxItemProps {
	name: string;
	label: string;
	control: Control<any>;
	id?: string;
}

/**
 * Componente reutilizável para checkbox de viabilidade
 * Segue o princípio de responsabilidade única
 */
export default function ViabilityCheckboxItem({ name, label, control, id }: ViabilityCheckboxItemProps) {
	return (
		<Controller
			name={name}
			control={control}
			render={({ field }) => {
				const isChecked = field.value ?? false;
				
				return (
					<div 
						className="viability-checkbox-item p-3 rounded h-100 position-relative"
						style={{ 
							backgroundColor: isChecked ? 'var(--bs-primary-bg-subtle, #f0f7ff)' : '#ffffff', 
							border: `2px solid ${isChecked ? 'var(--bs-primary)' : '#e9ecef'}`,
							transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
							cursor: 'pointer',
							boxShadow: isChecked 
								? '0 2px 8px rgba(var(--bs-primary-rgb, 13, 110, 253), 0.15)' 
								: '0 1px 3px rgba(0, 0, 0, 0.05)',
						}}
						onClick={() => field.onChange(!field.value)}
						onMouseEnter={(e) => {
							if (!isChecked) {
								e.currentTarget.style.borderColor = 'var(--bs-primary)';
								e.currentTarget.style.boxShadow = '0 2px 8px rgba(var(--bs-primary-rgb, 13, 110, 253), 0.2)';
								e.currentTarget.style.transform = 'translateY(-2px)';
							}
						}}
						onMouseLeave={(e) => {
							if (!isChecked) {
								e.currentTarget.style.borderColor = '#e9ecef';
								e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
								e.currentTarget.style.transform = 'translateY(0)';
							}
						}}
					>
					<div className="d-flex align-items-center" style={{ gap: '0.75rem' }}>
						<input
							type="checkbox"
							id={id ?? `${name}-checkbox`}
							checked={isChecked}
							onChange={(e) => field.onChange(e.target.checked)}
							className="form-check-input"
							style={{ 
								marginTop: '0.125rem',
								accentColor: 'var(--bs-primary)',
								cursor: 'pointer',
								width: '1.1em',
								height: '1.1em'
							}}
						/>
						<Form.Label 
							htmlFor={id ?? `${name}-checkbox`}
							className="mb-0"
							style={{ 
								fontSize: '0.95rem',
								fontWeight: isChecked ? '600' : '500',
								color: isChecked ? 'var(--bs-primary)' : '#495057',
								transition: 'all 0.2s ease',
								cursor: 'pointer',
								margin: 0,
								lineHeight: '1.5'
							}}
						>
							{label}
						</Form.Label>
					</div>
						{isChecked && (
							<div 
								className="position-absolute top-0 end-0 m-2"
								style={{
									width: '8px',
									height: '8px',
									backgroundColor: 'var(--bs-primary)',
									borderRadius: '50%',
									boxShadow: '0 0 0 3px rgba(var(--bs-primary-rgb, 13, 110, 253), 0.2)'
								}}
							/>
						)}
					</div>
				);
			}}
		/>
	);
}

