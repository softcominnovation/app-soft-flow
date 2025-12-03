import { Card, Collapse, Row, Col, Form } from 'react-bootstrap';
import { TextInput } from '@/components/Form';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import AccordionToggle from './AccordionToggle';

interface CaseInfoSectionProps {
	isOpen: boolean;
	onToggle: (eventKey: string) => void;
}

export default function CaseInfoSection({ isOpen, onToggle }: CaseInfoSectionProps) {
	const eventKey = '0';

	return (
		<Card className="border-0 shadow-sm mb-0">
			<Card.Header className="bg-light border-bottom p-0">
				<AccordionToggle 
					eventKey={eventKey} 
					className="p-3"
					isOpen={isOpen}
					onToggle={onToggle}
				>
					<h5 className="mb-0 d-flex align-items-center text-body">
						<IconifyIcon icon="lucide:info" className="me-2 text-primary" />
						Informações do Caso
					</h5>
				</AccordionToggle>
			</Card.Header>
			<Collapse in={isOpen}>
				<div>
					<Card.Body>
						<Row className="g-3">
							{/* Primeira linha: Código, Versão, Status, Prioridade */}
							<Col md={3}>
								<Form.Group>
									<Form.Label className="fw-semibold d-flex align-items-center">
										<IconifyIcon icon="lucide:hash" className="me-2 text-muted" />
										Código
									</Form.Label>
									<TextInput
										type="text"
										name="codigo"
										placeholder="Código"
										disabled
										className="bg-light"
									/>
								</Form.Group>
							</Col>
							<Col md={3}>
								<Form.Group>
									<Form.Label className="fw-semibold d-flex align-items-center">
										<IconifyIcon icon="lucide:tag" className="me-2 text-muted" />
										Versão
									</Form.Label>
									<TextInput
										type="text"
										name="versao"
										placeholder="Versão"
										disabled
										className="bg-light"
									/>
								</Form.Group>
							</Col>
							<Col md={3}>
								<Form.Group>
									<Form.Label className="fw-semibold d-flex align-items-center">
										<IconifyIcon icon="lucide:activity" className="me-2 text-muted" />
										Status
									</Form.Label>
									<TextInput
										type="text"
										name="status"
										placeholder="Status"
										disabled
										className="bg-light"
									/>
								</Form.Group>
							</Col>
							<Col md={3}>
								<Form.Group>
									<Form.Label className="fw-semibold d-flex align-items-center">
										<IconifyIcon icon="lucide:alert-triangle" className="me-2 text-muted" />
										Prioridade
									</Form.Label>
									<TextInput
										type="text"
										name="prioridade"
										placeholder="Prioridade"
										disabled
										className="bg-light"
									/>
								</Form.Group>
							</Col>
							{/* Segunda linha: Produto e Desenvolvedor */}
							<Col md={6}>
								<Form.Group>
									<Form.Label className="fw-semibold d-flex align-items-center">
										<IconifyIcon icon="lucide:package" className="me-2 text-muted" />
										Produto
									</Form.Label>
									<TextInput
										type="text"
										name="produto"
										placeholder="Nome do produto"
										disabled
										className="bg-light"
									/>
								</Form.Group>
							</Col>
							<Col md={6}>
								<Form.Group>
									<Form.Label className="fw-semibold d-flex align-items-center">
										<IconifyIcon icon="lucide:user" className="me-2 text-muted" />
										Desenvolvedor
									</Form.Label>
									<TextInput
										type="text"
										name="desenvolvedor"
										placeholder="Nome do desenvolvedor"
										disabled
										className="bg-light"
									/>
								</Form.Group>
							</Col>
						</Row>
					</Card.Body>
				</div>
			</Collapse>
		</Card>
	);
}

