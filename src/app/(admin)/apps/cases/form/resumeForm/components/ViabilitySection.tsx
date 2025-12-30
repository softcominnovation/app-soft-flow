'use client';
import { Row, Col } from 'react-bootstrap';
import { Control } from 'react-hook-form';
import ViabilityGroupHeader from './ViabilityGroupHeader';
import ViabilityCheckboxItem from './ViabilityCheckboxItem';
import CaseFlagsSection from './CaseFlagsSection';

interface ViabilitySectionProps {
	control: Control<any>;
}

/**
 * Componente principal da seção de Viabilidade
 * Orquestra os sub-componentes seguindo o princípio de responsabilidade única
 */
export default function ViabilitySection({ control }: ViabilitySectionProps) {
	const viabilityCheckboxes = [
		{ name: 'entendivel', label: 'Entendível' },
		{ name: 'realizavel', label: 'Realizável' },
		{ name: 'completo', label: 'Completo' },
	];

	return (
		<div className="mt-4 pt-4 border-top">
			<Row className="g-3">
				<Col xs={12}>
					{/* Grupo Viabilidade */}
					<div className="mb-4">
						<ViabilityGroupHeader control={control} />

						{/* Checkboxes de Viabilidade */}
						<Row className="g-3 mb-4">
							{viabilityCheckboxes.map((checkbox) => (
								<Col xs={12} sm={6} md={4} key={checkbox.name}>
									<ViabilityCheckboxItem
										name={checkbox.name}
										label={checkbox.label}
										control={control}
										id={`${checkbox.name}-checkbox`}
									/>
								</Col>
							))}
						</Row>
					</div>

					{/* Outros Flags */}
					<CaseFlagsSection control={control} />
				</Col>
			</Row>
		</div>
	);
}
