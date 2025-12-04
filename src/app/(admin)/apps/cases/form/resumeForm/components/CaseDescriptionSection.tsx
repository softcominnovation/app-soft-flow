import { Card, Collapse, Row, Form } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import AccordionToggle from './AccordionToggle';
import { ICase } from '@/types/cases/ICase';
import { useMemo } from 'react';

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

	// Processa o valor do anexo: remove # do início e fim, e verifica se é URL válida
	const processedAnexo = useMemo(() => {
		const anexo = caseData.caso.textos.anexo || '';
		if (!anexo) return { value: '', isUrl: false };

		// Remove # do início e fim se existirem
		let processedValue = anexo.trim();
		if (processedValue.startsWith('#') && processedValue.endsWith('#')) {
			processedValue = processedValue.slice(1, -1).trim();
		}

		// Verifica se é uma URL válida
		const urlPattern = /^(https?:\/\/|www\.)[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/i;
		const isUrl = urlPattern.test(processedValue);

		// Garante que URLs sem protocolo tenham https://
		let url = processedValue;
		if (isUrl && !processedValue.startsWith('http://') && !processedValue.startsWith('https://')) {
			url = `https://${processedValue}`;
		}

		return { value: processedValue, isUrl, url };
	}, [caseData.caso.textos.anexo]);

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
							<Form.Group style={{marginBottom: '24px'}}>
								<Form.Label className="fw-semibold mb-2">Anexo</Form.Label>
								{processedAnexo.value && processedAnexo.isUrl ? (
									<Form.Control
										as="input"
										name="anexo"
										placeholder="Esse caso não possui anexos"
										readOnly
										className="bg-light text-primary"
										value={processedAnexo.value}
										style={{ cursor: 'pointer' }}
										onClick={() => {
											window.open(processedAnexo.url, '_blank', 'noopener,noreferrer');
										}}
									/>
								) : (
									<Form.Control
										as="input"
										name="anexo"
										placeholder="Esse caso não possui anexos"
										disabled
										className="bg-light"
										value={processedAnexo.value || ''}
									/>
								)}
							</Form.Group>
							<Form.Group style={{marginBottom: '0'}}>
								<Form.Label className="fw-semibold mb-2">Informações Adicionais</Form.Label>
								<Form.Control
									as="textarea"
									name="informacoes_adicionais"
									placeholder="Informações adicionais do caso"
									disabled
									rows={2}
									className="bg-light"
									value={caseData.caso.textos.informacoes_adicionais || ''}
								/>
							</Form.Group>
						</Row>
					</Card.Body>
				</div>
			</Collapse>
		</Card>
	);
}

