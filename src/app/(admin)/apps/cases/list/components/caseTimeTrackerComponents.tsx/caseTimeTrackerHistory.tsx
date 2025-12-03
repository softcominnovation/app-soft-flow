"use client"
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { useGetTipoBadgeVariant as getTipoBadgeVariant, useGetTipoIcon as getTipoIcon } from "@/hooks/caseTimeTracker/caseTimeTrackerVarianions";
import { formatTipoLabel } from "@/hooks/caseTimeTracker/useFormatLabel";
import getAberturaFechamentoDuration from "@/hooks/caseTimeTracker/useGetAberturaFechamentoDuration";
import formatTimer from "@/hooks/useFormatTimer";
import { Producao } from "@/types/cases/ICase";
import { Badge, Card, ListGroup } from "react-bootstrap";

type Props = {
    historyEntries: Producao[]
}

export default function CaseTimeTrackerHistory({historyEntries}:Props) {
    const badgeBaseClass = "d-inline-flex align-items-center gap-1 text-capitalize py-1 px-2 rounded-2";

    return (
        <Card className="border-0 shadow-sm mb-0">
				<Card.Body style={{ padding: '1.5rem' }}>
					<h5 className="mb-3 d-flex align-items-center">
						<IconifyIcon icon="lucide:list" className="me-2 text-primary" />
						Historico de Tempos
					</h5>
					<ListGroup variant="flush" className="border-top">
						{historyEntries.length ? (
							historyEntries.map((entry, index) => {
								const duration = getAberturaFechamentoDuration(entry.datas.abertura, entry.datas.fechamento);

								return (
									<ListGroup.Item
										key={index}
										className={`d-flex flex-column flex-md-row gap-2 justify-content-between align-items-start align-items-md-center py-3 px-0 ${index < historyEntries.length - 1 ? 'border-bottom' : ''}`}
									>
										<div className="d-flex flex-column gap-1">
											<Badge
												bg={getTipoBadgeVariant(entry.tipo)}
												className={badgeBaseClass}
												style={{ fontSize: '0.78rem', width: 'fit-content' }}
											>
												<IconifyIcon icon={getTipoIcon(entry.tipo)}/>
												{formatTipoLabel(entry.tipo)}
											</Badge>
											<small className="text-muted">
												{formatTimer(entry.datas.abertura)}
												{entry.datas.fechamento && ` - ${formatTimer(entry.datas.fechamento)}`}
											</small>
										</div>
										{duration && (
											<Badge bg="info" className="ms-md-auto py-1 px-2 rounded-2" style={{ fontSize: '0.78rem' }}>
												{duration}
											</Badge>
										)}
									</ListGroup.Item>
								);
							})
						) : (
							<ListGroup.Item className="py-4 text-center text-muted" style={{ borderBottom: 'none' }}>
								Nenhum historico de tempo registrado.
							</ListGroup.Item>
						)}
					</ListGroup>
				</Card.Body>
			</Card>
    )
}
