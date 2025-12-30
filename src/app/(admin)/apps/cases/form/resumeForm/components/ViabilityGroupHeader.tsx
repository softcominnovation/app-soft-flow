'use client';
import { Form } from 'react-bootstrap';
import { Control, Controller, useFormContext } from 'react-hook-form';
import { useEffect } from 'react';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

interface ViabilityGroupHeaderProps {
	control: Control<any>;
}

/**
 * Componente para o header do grupo Viabilidade
 * Responsabilidade única: renderizar o header com checkbox principal
 */
export default function ViabilityGroupHeader({ control }: ViabilityGroupHeaderProps) {
	const { setValue, watch } = useFormContext();
	const entendivelValue = watch('entendivel');
	const realizavelValue = watch('realizavel');
	const completoValue = watch('completo');
	const viabilidadeValue = watch('viabilidade');

	// Calcula se todos os três estão marcados para refletir no checkbox principal
	const allChecked = entendivelValue && realizavelValue && completoValue;

	// Sincroniza o checkbox principal quando os três são marcados/desmarcados manualmente
	useEffect(() => {
		if (allChecked !== viabilidadeValue) {
			setValue('viabilidade', allChecked, { shouldValidate: false, shouldDirty: false });
		}
	}, [allChecked, viabilidadeValue, setValue]);

	return (
		<Controller
			name="viabilidade"
			control={control}
			render={({ field }) => {
				// Usa allChecked para mostrar o estado visual, mas mantém field.value para controle
				const displayChecked = allChecked;
				
				const handleChange = (checked: boolean) => {
					field.onChange(checked);
					// Marca ou desmarca os três checkboxes
					setValue('entendivel', checked, { shouldValidate: false });
					setValue('realizavel', checked, { shouldValidate: false });
					setValue('completo', checked, { shouldValidate: false });
				};
				
				return (
					<div 
						className="viability-group-header d-flex align-items-center justify-content-between p-3 rounded mb-3 bg-light border"
						style={{ 
							transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
						}}
					>
						<div className="d-flex align-items-center">
							<IconifyIcon 
								icon="lucide:check-circle-2" 
								className="me-2 text-primary" 
								style={{ 
									fontSize: '1rem',
									transition: 'all 0.2s ease'
								}} 
							/>
							<span 
								className="fw-semibold" 
								style={{ 
									fontSize: '0.95rem', 
									color: '#212529',
									letterSpacing: '0.01em'
								}}
							>
								Viabilidade
							</span>
						</div>
						<Form.Check
							type="checkbox"
							id="viabilidade-checkbox"
							checked={displayChecked}
							onChange={(e) => handleChange(e.target.checked)}
							className="mb-0"
							style={{ 
								transform: 'scale(1.15)',
								accentColor: 'var(--bs-primary)',
								cursor: 'pointer'
							}}
						/>
					</div>
				);
			}}
		/>
	);
}

