import FormResumeSkelleton from '@/app/(admin)/apps/cases/list/skelletons/formResumeSkelleton';
import { TextInput } from '@/components/Form';
import { FormProvider, useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { ICase } from '@/types/cases/ICase';
import { Form, Row, Col, Card } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

interface ResumeFormProps {
	caseData: ICase | null;
}

export default function ResumeForm({ caseData }: ResumeFormProps) {

	const methods = useForm();

	useEffect(() => {
		if (caseData) {
			methods.reset({
				codigo: caseData.caso.id,
				produto: caseData.produto?.nome || '',
				versao: caseData.produto?.versao || "-",
				prioridade: caseData.caso.caracteristicas.prioridade || '',
				desenvolvedor: caseData.caso.usuarios.desenvolvimento?.nome || '',
				resumo: caseData.caso.textos.descricao_resumo || '',
				descricao_completa: caseData.caso.textos.descricao_completa || '',
				anexo: caseData.caso.textos.anexo || '',
				status: caseData.caso.status.status_tipo || '',
			});
		}
	}, [caseData, methods]);


	return (
		<FormProvider {...methods}>
			{
				!caseData ? (
					<FormResumeSkelleton />
				) : (
					<div className="d-flex flex-column gap-4">
						{/* Informações Principais */}
						<Card className="border-0 shadow-sm">
							<Card.Header className="bg-light border-bottom">
								<h5 className="mb-0 d-flex align-items-center">
									<IconifyIcon icon="lucide:info" className="me-2 text-primary" />
									Informações do Caso
								</h5>
							</Card.Header>
							<Card.Body>
								<Row className="g-3">
									{/* Primeira linha: Código, Versão, Status */}
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
						</Card>

						{/* Resumo */}
						<Card className="border-0 shadow-sm">
							<Card.Header className="bg-light border-bottom">
								<h5 className="mb-0 d-flex align-items-center">
									<IconifyIcon icon="lucide:file-text" className="me-2 text-primary" />
									Descrição / Resumo
								</h5>
							</Card.Header>
							<Card.Body>
								<Row>
									<Form.Group style={{marginBottom: '18px'}}>
										<Form.Label className="fw-semibold">Resumo do Caso</Form.Label>
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
									<Form.Group style={{marginBottom: '18px'}}>
										<Form.Label className="fw-semibold">Descrição Completa</Form.Label>
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
									<Form.Group style={{marginBottom: '18px'}}>
										<Form.Label className="fw-semibold">Anexo</Form.Label>
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
						</Card>
					</div>
				)
			}
		</FormProvider>
	);
}
