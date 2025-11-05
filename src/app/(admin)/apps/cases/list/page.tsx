'use client';
import { Card, CardBody, Col, Row } from 'react-bootstrap';
import CaseFilters from './caseFilters';
import CasesTable from './cases';
import { CasesProvider, useCasesContext } from '@/contexts/casesContext';
import { ToastContainer } from 'react-toastify';
import ProjectsSection from './components/caseListComponents/projectsSection';

const CasesList = () => {
	const { cases, loading } = useCasesContext();
	return (
		<>
			<Row>
				<Col xs={12}>
					<Card>
						<CardBody>
							<div className="mb-3">
								<Row className="align-items-center g-2">
									<Col xs={12}>
										<CaseFilters />
									</Col>
								</Row>
							</div>
							<ProjectsSection />
							<div className="table-responsive">
								<CasesTable data={cases} loading={loading} />
							</div>
						</CardBody>
					</Card>
				</Col>
			</Row>
			<ToastContainer position='top-center'/>
		</>
	);
};

const CasesListWithProvider = () => (
	<CasesProvider>
		<CasesList />
	</CasesProvider>
);

export default CasesListWithProvider;
