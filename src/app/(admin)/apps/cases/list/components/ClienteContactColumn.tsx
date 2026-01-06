import { Card, Form } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { ICliente } from '@/types/clientes/ICliente';
import { Placeholder } from 'react-bootstrap';

interface ClienteContactColumnProps {
	cliente: ICliente | null;
	loading: boolean;
}

export default function ClienteContactColumn({ cliente, loading }: ClienteContactColumnProps) {
	const formatPhone = (phone: string) => {
		if (!phone) return '-';
		return phone;
	};

	if (loading) {
		return (
			<div className="d-flex flex-column gap-3">
				<Card className="border-0 shadow-sm">
					<Card.Header className="bg-light border-bottom">
						<Placeholder as="div" animation="glow">
							<Placeholder xs={6} style={{ height: '20px' }} />
						</Placeholder>
					</Card.Header>
					<Card.Body>
						<div className="d-flex flex-column gap-3">
							<Form.Group>
								<Placeholder as={Form.Label} animation="glow" className="d-block mb-2">
									<Placeholder xs={7} style={{ height: '16px' }} />
								</Placeholder>
								<Placeholder as="div" animation="glow" style={{ width: '100%', height: '38px', borderRadius: '0.375rem' }} />
							</Form.Group>
							<Form.Group>
								<Placeholder as={Form.Label} animation="glow" className="d-block mb-2">
									<Placeholder xs={7} style={{ height: '16px' }} />
								</Placeholder>
								<Placeholder as="div" animation="glow" style={{ width: '100%', height: '38px', borderRadius: '0.375rem' }} />
							</Form.Group>
							<Form.Group>
								<Placeholder as={Form.Label} animation="glow" className="d-block mb-2">
									<Placeholder xs={4} style={{ height: '16px' }} />
								</Placeholder>
								<Placeholder as="div" animation="glow" style={{ width: '100%', height: '38px', borderRadius: '0.375rem' }} />
							</Form.Group>
						</div>
					</Card.Body>
				</Card>
			</div>
		);
	}

	if (!cliente) {
		return null;
	}

	return (
		<div className="d-flex flex-column gap-3">
			<Card className="border-0 shadow-sm">
				<Card.Header className="bg-light border-bottom">
					<h5 className="mb-0 fw-semibold d-flex align-items-center gap-2" style={{ fontSize: '1rem' }}>
						<IconifyIcon icon="lucide:phone" className="text-primary" />
						Informações de Contato
					</h5>
				</Card.Header>
				<Card.Body>
					<div className="d-flex flex-column gap-3">
						<Form.Group>
							<Form.Label className="fw-semibold d-flex align-items-center gap-2 small">
								<IconifyIcon icon="lucide:phone-call" className="text-primary" style={{ fontSize: '0.875rem' }} />
								Telefone Residencial
							</Form.Label>
							<Form.Control type="text" value={formatPhone(cliente.fone_resid)} disabled />
						</Form.Group>
						<Form.Group>
							<Form.Label className="fw-semibold d-flex align-items-center gap-2 small">
								<IconifyIcon icon="lucide:phone" className="text-primary" style={{ fontSize: '0.875rem' }} />
								Telefone Comercial
							</Form.Label>
							<Form.Control type="text" value={formatPhone(cliente.fone_com)} disabled />
						</Form.Group>
						<Form.Group>
							<Form.Label className="fw-semibold d-flex align-items-center gap-2 small">
								<IconifyIcon icon="lucide:mail" className="text-primary" style={{ fontSize: '0.875rem' }} />
								E-mail
							</Form.Label>
							<Form.Control type="email" value={cliente.email || ''} disabled />
						</Form.Group>
					</div>
				</Card.Body>
			</Card>
		</div>
	);
}

