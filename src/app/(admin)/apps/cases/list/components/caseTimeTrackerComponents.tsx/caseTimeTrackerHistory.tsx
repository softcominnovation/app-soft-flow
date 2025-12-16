"use client"
import { useState } from "react";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { useGetTipoBadgeVariant as getTipoBadgeVariant, useGetTipoIcon as getTipoIcon } from "@/hooks/caseTimeTracker/caseTimeTrackerVarianions";
import { formatTipoLabel } from "@/hooks/caseTimeTracker/useFormatLabel";
import getAberturaFechamentoDuration from "@/hooks/caseTimeTracker/useGetAberturaFechamentoDuration";
import formatTimer from "@/hooks/useFormatTimer";
import { Producao } from "@/types/cases/ICase";
import { Badge, Card, ListGroup } from "react-bootstrap";
import ProductionDetailsModal from "./ProductionDetailsModal";

type Props = {
    historyEntries: Producao[];
    caseId?: number;
}

export default function CaseTimeTrackerHistory({historyEntries, caseId}:Props) {
    const badgeBaseClass = "d-inline-flex align-items-center gap-1 text-capitalize py-1 px-2 rounded-2";
    const [selectedProduction, setSelectedProduction] = useState<Producao | null>(null);
    const [showModal, setShowModal] = useState(false);

    const handleItemClick = (entry: Producao) => {
        setSelectedProduction(entry);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedProduction(null);
    };

    return (
        <>
            <style>{`
                .case-time-history-card .card-header {
                    padding: 0 !important;
                }
                
                .case-time-history-card .card-header > div {
                    padding: 1.5rem;
                }
                
                .case-time-history-card .card-header h5 {
                    font-size: 1rem;
                    font-weight: 600;
                    margin: 0;
                }
                
                .case-time-history-card .card-header h5 .iconify-icon {
                    font-size: 1.125rem;
                }
                
                @media (max-width: 991.98px) {
                    .case-time-history-card .card-header > div {
                        padding: 1rem !important;
                    }
                    
                    .case-time-history-card .card-body {
                       	padding: 1rem !important;
                   	}
                   	
                   	.case-time-history-card .card-header h5 {
                   		font-size: 0.9375rem;
                   	}
                   	
                   	.case-time-history-item {
                   		margin-left: -1rem !important;
                   		margin-right: -1rem !important;
                   		padding-left: 1rem !important;
                   		padding-right: 1rem !important;
                   		padding-top: 0.875rem !important;
                   		padding-bottom: 0.875rem !important;
                   	}
                   	
                   	.case-time-history-item .badge {
                   		font-size: 0.75rem !important;
                   		padding: 0.375rem 0.625rem !important;
                   		white-space: nowrap;
                   	}
                   	
                   	.case-time-history-item small {
                   		font-size: 0.8125rem;
                   		line-height: 1.4;
                   		word-break: break-word;
                   	}
                   	
                   	.case-time-history-duration {
                   		margin-top: 0.5rem;
                   		width: 100%;
                   		justify-content: flex-start !important;
                   	}
                }
            `}</style>
            <Card className="border-0 shadow-sm mb-0 case-time-history-card">
				<Card.Header className="bg-light border-bottom p-0">
					<div style={{ padding: '1.5rem' }}>
						<h5 className="mb-0 d-flex align-items-center">
							<IconifyIcon icon="lucide:list" className="me-2 text-primary" />
							Historico de Tempos
						</h5>
					</div>
				</Card.Header>
				<Card.Body style={{ padding: '1.5rem' }}>
					<ListGroup variant="flush" className="border-top">
						{historyEntries.length ? (
							historyEntries.map((entry, index) => {
								const duration = getAberturaFechamentoDuration(entry.datas.abertura, entry.datas.fechamento);

								return (
									<ListGroup.Item
										key={index}
										className={`case-time-history-item d-flex flex-column flex-md-row gap-2 gap-md-2 justify-content-between align-items-start align-items-md-center py-3 ${index < historyEntries.length - 1 ? 'border-bottom' : ''}`}
										style={{ 
											transition: 'background-color 0.2s ease',
											cursor: 'pointer',
											marginLeft: '-1.5rem',
											marginRight: '-1.5rem',
											paddingLeft: '1.5rem',
											paddingRight: '1.5rem'
										}}
										onClick={() => handleItemClick(entry)}
										onMouseEnter={(e) => {
											e.currentTarget.style.backgroundColor = 'rgba(0, 123, 255, 0.05)';
										}}
										onMouseLeave={(e) => {
											e.currentTarget.style.backgroundColor = '';
										}}
										title={`Abertura: ${new Date(entry.datas.abertura).toLocaleString('pt-BR', { 
											day: '2-digit', 
											month: '2-digit', 
											year: 'numeric', 
											hour: '2-digit', 
											minute: '2-digit',
											second: '2-digit'
										})}${entry.datas.fechamento ? ` | Fechamento: ${new Date(entry.datas.fechamento).toLocaleString('pt-BR', { 
											day: '2-digit', 
											month: '2-digit', 
											year: 'numeric', 
											hour: '2-digit', 
											minute: '2-digit',
											second: '2-digit'
										})}` : ''}${duration ? ` | Duração: ${duration}` : ''}`}
									>
										<div className="d-flex flex-column gap-1 w-100 w-md-auto">
											<Badge
												bg={getTipoBadgeVariant(entry.tipo)}
												className={badgeBaseClass}
												style={{ fontSize: '0.78rem', width: 'fit-content' }}
											>
												<IconifyIcon icon={getTipoIcon(entry.tipo)}/>
												{formatTipoLabel(entry.tipo)}
											</Badge>
											<small className="text-muted d-block">
												{formatTimer(entry.datas.abertura)}
												{entry.datas.fechamento && ` - ${formatTimer(entry.datas.fechamento)}`}
											</small>
										</div>
										{duration && (
											<div className="d-flex align-items-center gap-2 ms-md-auto case-time-history-duration">
												<Badge 
													bg="info" 
													className="py-1 px-2 rounded-2" 
													style={{ fontSize: '0.78rem' }}
												>
													{duration}
												</Badge>
											</div>
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
			{/* <ProductionDetailsModal
				show={showModal}
				onHide={handleCloseModal}
				production={selectedProduction}
				caseId={caseId}
			/> */}
        </>
    )
}
