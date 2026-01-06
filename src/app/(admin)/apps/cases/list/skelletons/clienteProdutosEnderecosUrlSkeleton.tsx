import { Row, Col, Form, Placeholder, Card } from 'react-bootstrap';

export default function ClienteProdutosEnderecosUrlSkeleton() {
	return (
		<div className="d-flex flex-column gap-3">
			{/* Skeleton para 2 cards de produtos */}
			{[1, 2].map((index) => (
				<Card key={index} className="border" style={{ borderColor: 'rgba(0, 0, 0, 0.125)' }}>
					<Card.Body className="p-3">
						<div className="d-flex flex-column gap-3">
							{/* Header do card */}
							<div className="d-flex align-items-center justify-content-between">
								<Placeholder as="h6" animation="glow" className="mb-0">
									<Placeholder xs={6} style={{ height: '20px' }} />
								</Placeholder>
								<Placeholder as="span" animation="glow" className="rounded-pill" style={{ width: '60px', height: '20px' }} />
							</div>

							{/* Campos do formulário */}
							<Row className="g-2">
								<Col xs={12}>
									<Form.Group>
										<Placeholder as={Form.Label} animation="glow" className="d-block mb-2">
											<Placeholder xs={3} style={{ height: '16px' }} />
										</Placeholder>
										<Placeholder as="div" animation="glow" style={{ width: '100%', height: '38px', borderRadius: '0.375rem' }} />
									</Form.Group>
								</Col>
								<Col xs={12} md={6}>
									<Form.Group>
										<Placeholder as={Form.Label} animation="glow" className="d-block mb-2">
											<Placeholder xs={4} style={{ height: '16px' }} />
										</Placeholder>
										<Placeholder as="div" animation="glow" style={{ width: '100%', height: '38px', borderRadius: '0.375rem' }} />
									</Form.Group>
								</Col>
								<Col xs={12} md={6}>
									<Form.Group>
										<Placeholder as={Form.Label} animation="glow" className="d-block mb-2">
											<Placeholder xs={4} style={{ height: '16px' }} />
										</Placeholder>
										<Placeholder as="div" animation="glow" style={{ width: '100%', height: '38px', borderRadius: '0.375rem' }} />
									</Form.Group>
								</Col>
								<Col xs={12}>
									<div className="d-flex flex-column gap-1">
										<Placeholder as="small" animation="glow" className="d-block">
											<Placeholder xs={8} style={{ height: '14px' }} />
										</Placeholder>
										<Placeholder as="small" animation="glow" className="d-block">
											<Placeholder xs={7} style={{ height: '14px' }} />
										</Placeholder>
									</div>
								</Col>
							</Row>
						</div>
					</Card.Body>
				</Card>
			))}
		</div>
	);
}

