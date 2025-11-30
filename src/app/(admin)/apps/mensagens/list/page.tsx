'use client';
import { Card, CardBody, Col, Row } from 'react-bootstrap';
import MensagensTable from './mensagens';
import MensagensFilters from './mensagensFilters';
import { MensagensProvider, useMensagensContext } from '@/contexts/mensagensContext';
import { ToastContainer } from 'react-toastify';
import PageBreadcrumb from '@/components/PageBreadcrumb';

const MensagensList = () => {
	const { mensagens, loading } = useMensagensContext();
	return (
		<>
			<div className="px-3">
				<PageBreadcrumb title="Notificações" subName="Apps" />
			</div>
			<Row>
				<Col xs={12}>
					<Card>
						<CardBody>
							<div className="mb-3">
								<Row className="align-items-center g-2">
									<Col xs={12}>
										<MensagensFilters />
									</Col>
								</Row>
							</div>
							<MensagensTable data={mensagens} loading={loading} />
						</CardBody>
					</Card>
				</Col>
			</Row>
			<ToastContainer position="top-center" />
		</>
	);
};

const MensagensListWithProvider = () => (
	<MensagensProvider>
		<MensagensList />
	</MensagensProvider>
);

export default MensagensListWithProvider;

