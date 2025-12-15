"use client";
import { Modal, Form, Row, Col } from "react-bootstrap";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { Producao } from "@/types/cases/ICase";
import { useGetTipoBadgeVariant as getTipoBadgeVariant, useGetTipoIcon as getTipoIcon } from "@/hooks/caseTimeTracker/caseTimeTrackerVarianions";
import { formatTipoLabel } from "@/hooks/caseTimeTracker/useFormatLabel";
import getAberturaFechamentoDuration from "@/hooks/caseTimeTracker/useGetAberturaFechamentoDuration";

interface ProductionDetailsModalProps {
	show: boolean;
	onHide: () => void;
	production: Producao | null;
}

export default function ProductionDetailsModal({ show, onHide, production }: ProductionDetailsModalProps) {
	if (!production) return null;

	const duration = getAberturaFechamentoDuration(production.datas.abertura, production.datas.fechamento);

	// Formatar datas para exibição
	const formatDate = (dateString: string | null) => {
		if (!dateString) return "-";
		const date = new Date(dateString);
		return date.toLocaleString('pt-BR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		});
	};

	// Mock dos dados - como solicitado pelo usuário
	const mockProject = production.projeto_id ? `Projeto ${production.projeto_id}` : "-";
	const mockUser = production.usuario_id ? `Usuário ${production.usuario_id}` : "-";

	return (
		<Modal
			show={show}
			onHide={onHide}
			size="lg"
			backdrop="static"
			keyboard={true}
			contentClassName="shadow-lg"
		>
			<Modal.Header closeButton className="bg-light border-bottom">
				<Modal.Title className="fw-bold text-primary d-flex align-items-center gap-2">
					<IconifyIcon icon="lucide:clock" />
					Produção - Editar
				</Modal.Title>
			</Modal.Header>
			<Modal.Body style={{ padding: '1.5rem' }}>
				<Form>
					<Row>
						<Col md={6} className="mb-3">
							<Form.Group>
								<Form.Label className="fw-semibold">Tipo</Form.Label>
								<Form.Select
									value={production.tipo || ""}
									disabled
									className="bg-light"
								>
									<option value={production.tipo || ""}>
										{formatTipoLabel(production.tipo)}
									</option>
								</Form.Select>
							</Form.Group>
						</Col>
						<Col md={6} className="mb-3">
							<Form.Group>
								<Form.Label className="fw-semibold">Usuário</Form.Label>
								<Form.Select
									value={production.usuario_id || ""}
									disabled
									className="bg-light"
								>
									<option value={production.usuario_id || ""}>
										{mockUser}
									</option>
								</Form.Select>
							</Form.Group>
						</Col>
					</Row>

					<Row>
						<Col md={6} className="mb-3">
							<Form.Group>
								<Form.Label className="fw-semibold">Abertura</Form.Label>
								<Form.Control
									type="text"
									value={formatDate(production.datas.abertura)}
									readOnly
									className="bg-light"
								/>
							</Form.Group>
						</Col>
						<Col md={6} className="mb-3">
							<Form.Group>
								<Form.Label className="fw-semibold">Fechamento</Form.Label>
								<Form.Control
									type="text"
									value={formatDate(production.datas.fechamento || null)}
									readOnly
									className="bg-light"
								/>
							</Form.Group>
						</Col>
					</Row>

					<Row>
						<Col md={6} className="mb-3">
							<Form.Group>
								<Form.Label className="fw-semibold">Projeto</Form.Label>
								<Form.Select
									value={production.projeto_id || ""}
									disabled
									className="bg-light"
								>
									<option value={production.projeto_id || ""}>
										{mockProject}
									</option>
								</Form.Select>
							</Form.Group>
						</Col>
						<Col md={6} className="mb-3">
							<Form.Group>
								<Form.Label className="fw-semibold">Tempo Decorrido</Form.Label>
								<Form.Control
									type="text"
									value={duration || "-"}
									readOnly
									className="bg-light"
								/>
							</Form.Group>
						</Col>
					</Row>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<button
					type="button"
					className="btn btn-danger"
					onClick={onHide}
					style={{ marginRight: 'auto' }}
				>
					<IconifyIcon icon="lucide:x" className="me-1" />
					Fechar
				</button>
			</Modal.Footer>
		</Modal>
	);
}
