import { Card, Collapse, Row, Form } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import AccordionToggle from './AccordionToggle';
import { ICase } from '@/types/cases/ICase';

interface CaseDescriptionSectionProps {
	caseData: ICase;
	isOpen: boolean;
	onToggle: (eventKey: string) => void;
}

export default function CaseDescriptionSection({ 
	caseData, 
	isOpen, 
	onToggle 
}: CaseDescriptionSectionProps) {
	const eventKey = '1';

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
						<IconifyIcon icon="lucide:file-text" className="me-2 text-primary" />
						Descrição / Resumo
					</h5>
				</AccordionToggle>
			</Card.Header>
			<Collapse in={isOpen}>
				<div>
					<Card.Body style={{ padding: '1.5rem' }}>
						<Row>
							<Form.Group style={{marginBottom: '24px'}}>
								<Form.Label className="fw-semibold mb-2">Resumo do Caso</Form.Label>
								<Form.Control
									as="textarea"
									name="resumo"
									placeholder="Descrição resumida do caso"
									disabled
									rows={2}
									className="bg-light"
									value={caseData.caso.textos.descricao_resumo || ''}
								/>
							</Form.Group>
							<Form.Group style={{marginBottom: '24px'}}>
								<Form.Label className="fw-semibold mb-2">Descrição Completa</Form.Label>
								<Form.Control
									as="textarea"
									name="descricao_completa"
									placeholder="Descrição Completa"
									rows={6}
									disabled
									className="bg-light"
									value={caseData.caso.textos.descricao_completa || ''}
								/>
							</Form.Group>
							<Form.Group style={{marginBottom: '0'}}>
								<Form.Label className="fw-semibold mb-2">Anexo</Form.Label>
								<Form.Control
									as="input"
									name="anexo"
									placeholder="Esse caso não possui anexos"
									disabled
									className="bg-light"
									value={caseData.caso.textos.anexo || ''}
								/>
							</Form.Group>
						</Row>
					</Card.Body>
				</div>
			</Collapse>
		</Card>
	);
}

