"use client"
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { useGetTipoBadgeVariant, useGetTipoIcon } from "@/hooks/caseTimeTracker/caseTimeTrackerVarianions";
import { formatTipoLabel } from "@/hooks/caseTimeTracker/useFormatLabel";
import { Badge, Button, Card, Col, Row, Spinner } from "react-bootstrap";

type Props = {
    stopCurrentTime: (id: string, isRetry?: boolean) => Promise<void>,
    startNewTime: (id: string, isRetry?: boolean) => Promise<void>,
    isRunning: boolean,
    loading: boolean,
    currentTipo: string,
    runningStart: string | null,
    elapsedMinutes: number | null,
    caseId: string | undefined,
    estimadoMinutos: number,
    realizadoMinutos: number
}

const formatMinutesToHours = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) {
        return `${hours}h ${mins}min`;
    } else if (hours > 0) {
        return `${hours}h`;
    } else {
        return `${mins}min`;
    }
};

export default function CaseTimeTrackerTimeControl({
    caseId,
    stopCurrentTime,
    startNewTime,
    isRunning,
    loading,
    currentTipo,
    runningStart,
    elapsedMinutes,
    estimadoMinutos,
    realizadoMinutos
}:Props) {

    const badgeBaseClass = "d-inline-flex align-items-center gap-1 text-capitalize py-1 px-2 rounded-2";

    return (
        <Card className="border-0 shadow-sm">
				<Card.Header className="bg-light border-bottom">
					<h5 className="mb-0 d-flex align-items-center">
						<IconifyIcon icon="lucide:clock" className="me-2 text-primary" />
						Controle de Tempo
					</h5>
				</Card.Header>
				<Card.Body>
					<Row className="align-items-md-center g-3">
						<Col xs={12} md={8}>
							<div className="d-flex flex-column gap-2">
								<div className="d-flex flex-wrap align-items-center gap-2">
									<Badge
										bg={isRunning ? 'success' : 'secondary'}
										className={badgeBaseClass}
										style={{ fontSize: '0.78rem' }}
									>
										<IconifyIcon icon={isRunning ? 'lucide:play' : 'lucide:pause'} />
										{isRunning ? 'Em andamento' : 'Pausado'}
									</Badge>
									<Badge
										bg={useGetTipoBadgeVariant(currentTipo)}
										className={badgeBaseClass}
										style={{ fontSize: '0.78rem' }}
									>
										<IconifyIcon icon={useGetTipoIcon(currentTipo)} />
										{formatTipoLabel(currentTipo)}
									</Badge>
								</div>
								<div className="text-muted d-flex align-items-center gap-2">
									<IconifyIcon icon={isRunning ? 'lucide:timer' : 'lucide:pause'} />
									<span className="small mb-0">
										{isRunning
											? runningStart
												? `Iniciado em: ${runningStart}`
												: 'Tempo em andamento'
											: 'Nenhum tempo em andamento'}
									</span>
								</div>
								{isRunning && elapsedMinutes !== null && (
									<div className="text-muted small">
										Tempo corrido: {elapsedMinutes} {elapsedMinutes === 1 ? 'minuto' : 'minutos'}
									</div>
								)}
								<div className="d-flex align-items-center gap-3 mt-2 pt-2 border-top">
									<div className="d-flex align-items-center gap-2">
										<IconifyIcon icon="lucide:target" className="text-primary" />
										<span className="small fw-medium">
											Tempo estimado: <span className="text-primary">{formatMinutesToHours(estimadoMinutos)}</span>
										</span>
									</div>
									<div className="d-flex align-items-center gap-2">
										<IconifyIcon icon="lucide:clock" className="text-info" />
										<span className="small fw-medium">
											Tempo total: <span className="text-info">{formatMinutesToHours(realizadoMinutos)}</span>
										</span>
									</div>
									<div className="d-flex align-items-center gap-2">
										<IconifyIcon icon="lucide:hourglass" className="text-warning" />
										<span className="small fw-medium">
											Tempo restante: <span className="text-warning">{formatMinutesToHours(Math.max(estimadoMinutos - realizadoMinutos, 0))}</span>
										</span>
									</div>
								</div>
							</div>
						</Col>
						<Col xs={12} md={4}>
							<div className="d-grid gap-2 d-md-flex justify-content-md-end">
								{
									isRunning ?
										<Button
											disabled={loading || !caseId}
											variant="danger"
											onClick={() => stopCurrentTime(caseId ?? '')}
											className="d-flex align-items-center justify-content-center justify-content-md-between gap-2"
										>
											<IconifyIcon icon="lucide:square" />
											{
												loading ?
													<span className="d-flex align-items-center gap-2">
														<span>Parar tempo</span>
														<Spinner
															as="span"
															animation="border"
															variant="light"
															size="sm"
														/>
													</span>
													:
													'Parar tempo'
											}
										</Button>
										:
										<Button
											disabled={loading || !caseId}
											variant="success"
											onClick={() => startNewTime(caseId ?? '')}
											className="d-flex align-items-center justify-content-center justify-content-md-between gap-2"
										>
											<IconifyIcon icon="lucide:play" />
											{
												loading ?
													<span className="d-flex align-items-center gap-2">
														<span>Iniciar tempo</span>
														<Spinner
															as="span"
															animation="border"
															variant="light"
															size="sm"
														/>
													</span>
													:
													'Iniciar tempo'
											}
										</Button>
								}
							</div>
						</Col>
					</Row>
				</Card.Body>
			</Card>
    )
}
