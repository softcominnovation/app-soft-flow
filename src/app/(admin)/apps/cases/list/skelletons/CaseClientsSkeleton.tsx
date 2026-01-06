'use client';

import { Card, Col, Placeholder, Row } from 'react-bootstrap';

/**
 * Componente de skeleton para cards de clientes
 * Segue o padrão de skeleton usado no sistema
 */
export default function CaseClientsSkeleton() {
	return (
		<Row className="g-3">
			{Array.from({ length: 3 }).map((_, index) => (
				<Col xs={12} md={6} lg={4} key={`client-skeleton-${index}`}>
					<Card className="border-0 shadow-sm h-100">
						<Card.Body className="p-3">
							<div className="d-flex flex-column gap-3">
								{/* Header do card */}
								<div className="d-flex align-items-center justify-content-between">
									<Placeholder as="div" animation="glow" className="flex-grow-1">
										<Placeholder xs={8} style={{ height: '20px' }} />
									</Placeholder>
									<Placeholder as="span" animation="glow" className="rounded-pill bg-secondary-subtle" style={{ width: '80px', height: '24px' }} />
								</div>

								{/* Conteúdo do card */}
								<div className="d-flex flex-column gap-2">
									<div className="d-flex align-items-center gap-2">
										<Placeholder as="span" animation="glow" style={{ width: '16px', height: '16px' }} />
										<Placeholder as="div" animation="glow" className="flex-grow-1">
											<Placeholder xs={6} style={{ height: '14px' }} />
										</Placeholder>
									</div>
									<div className="d-flex align-items-center gap-2">
										<Placeholder as="span" animation="glow" style={{ width: '16px', height: '16px' }} />
										<Placeholder as="div" animation="glow" className="flex-grow-1">
											<Placeholder xs={7} style={{ height: '14px' }} />
										</Placeholder>
									</div>
									<div className="d-flex align-items-center gap-2">
										<Placeholder as="span" animation="glow" style={{ width: '16px', height: '16px' }} />
										<Placeholder as="div" animation="glow" className="flex-grow-1">
											<Placeholder xs={5} style={{ height: '14px' }} />
										</Placeholder>
									</div>
								</div>
							</div>
						</Card.Body>
					</Card>
				</Col>
			))}
		</Row>
	);
}
