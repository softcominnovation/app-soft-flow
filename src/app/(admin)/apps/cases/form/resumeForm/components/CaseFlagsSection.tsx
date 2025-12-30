'use client';
import { Row, Col } from 'react-bootstrap';
import { Control } from 'react-hook-form';
import ViabilityCheckboxItem from './ViabilityCheckboxItem';

interface CaseFlagsSectionProps {
	control: Control<any>;
}

/**
 * Componente para a seção de flags do caso
 * Responsabilidade única: renderizar os checkboxes de flags
 */
export default function CaseFlagsSection({ control }: CaseFlagsSectionProps) {
	const flags = [
		{ name: 'liberacao', label: 'Liberação' },
		{ name: 'entregue', label: 'Entregue' },
		{ name: 'atualizacao_auto', label: 'Atualização Auto' },
	];

	return (
		<div className="border-top pt-4">
			<Row className="g-3">
				{flags.map((flag) => (
					<Col xs={12} sm={6} md={4} key={flag.name}>
						<ViabilityCheckboxItem
							name={flag.name}
							label={flag.label}
							control={control}
							id={`${flag.name}-checkbox`}
						/>
					</Col>
				))}
			</Row>
		</div>
	);
}

