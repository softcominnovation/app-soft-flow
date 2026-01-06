'use client';

import { Row, Col, Form, Placeholder, Card } from 'react-bootstrap';

/**
 * Skeleton para o modal de cliente - layout desktop (coluna esquerda)
 */
export default function ClienteModalDesktopSkeleton() {
	return (
		<div className="d-flex flex-column gap-3">
			{/* Header skeleton */}
			<div className="border-bottom pb-2">
				<div className="d-flex align-items-center gap-2 mb-1">
					<Placeholder as="h5" animation="glow" className="mb-0">
						<Placeholder xs={8} style={{ height: '24px' }} />
					</Placeholder>
					<Placeholder as="span" animation="glow" className="rounded-pill" style={{ width: '80px', height: '24px' }} />
				</div>
				<Placeholder as="p" animation="glow" className="mb-0">
					<Placeholder xs={6} style={{ height: '14px' }} />
				</Placeholder>
			</div>

			{/* Informações principais skeleton */}
			<Card className="border-0 shadow-sm">
				<Card.Header className="bg-light border-bottom">
					<Placeholder as="div" animation="glow">
						<Placeholder xs={5} style={{ height: '20px' }} />
					</Placeholder>
				</Card.Header>
				<Card.Body>
					<Row className="g-3">
						<Col xs={12} md={4}>
							<Form.Group>
								<Placeholder as={Form.Label} animation="glow" className="d-block mb-2">
									<Placeholder xs={4} style={{ height: '16px' }} />
								</Placeholder>
								<Placeholder as="div" animation="glow" style={{ width: '100%', height: '38px', borderRadius: '0.375rem' }} />
							</Form.Group>
						</Col>
						<Col xs={12} md={4}>
							<Form.Group>
								<Placeholder as={Form.Label} animation="glow" className="d-block mb-2">
									<Placeholder xs={3} style={{ height: '16px' }} />
								</Placeholder>
								<Placeholder as="div" animation="glow" style={{ width: '100%', height: '38px', borderRadius: '0.375rem' }} />
							</Form.Group>
						</Col>
						<Col xs={12} md={4}>
							<Form.Group>
								<Placeholder as={Form.Label} animation="glow" className="d-block mb-2">
									<Placeholder xs={6} style={{ height: '16px' }} />
								</Placeholder>
								<Placeholder as="div" animation="glow" style={{ width: '100%', height: '38px', borderRadius: '0.375rem' }} />
							</Form.Group>
						</Col>
					</Row>
				</Card.Body>
			</Card>

			{/* Endereço skeleton */}
			<Card className="border-0 shadow-sm">
				<Card.Header className="bg-light border-bottom">
					<Placeholder as="div" animation="glow">
						<Placeholder xs={4} style={{ height: '20px' }} />
					</Placeholder>
				</Card.Header>
				<Card.Body>
					<Row className="g-3">
						<Col xs={12}>
							<Form.Group>
								<Placeholder as={Form.Label} animation="glow" className="d-block mb-2">
									<Placeholder xs={5} style={{ height: '16px' }} />
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
									<Placeholder xs={5} style={{ height: '16px' }} />
								</Placeholder>
								<Placeholder as="div" animation="glow" style={{ width: '100%', height: '38px', borderRadius: '0.375rem' }} />
							</Form.Group>
						</Col>
						<Col xs={12} md={6}>
							<Form.Group>
								<Placeholder as={Form.Label} animation="glow" className="d-block mb-2">
									<Placeholder xs={3} style={{ height: '16px' }} />
								</Placeholder>
								<Placeholder as="div" animation="glow" style={{ width: '100%', height: '38px', borderRadius: '0.375rem' }} />
							</Form.Group>
						</Col>
					</Row>
				</Card.Body>
			</Card>
		</div>
	);
}

