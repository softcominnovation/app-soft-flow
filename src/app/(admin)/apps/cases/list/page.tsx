'use client';
import { Card, CardBody, Col, Row } from 'react-bootstrap';
import CaseFilters from './caseFilters';
import CasesTable from './cases';
import { CasesProvider, useCasesContext } from '@/contexts/casesContext';
import { ToastContainer } from 'react-toastify';
import ProjectsSection from './components/caseListComponents/projectsSection';
import CasesFAB from './components/CasesFAB';
import { useState } from 'react';

const CasesList = () => {
	const { cases, loading } = useCasesContext();
	const [showFiltersDrawer, setShowFiltersDrawer] = useState(false);
	const [showProductsDrawer, setShowProductsDrawer] = useState(false);

	return (
		<>
			<Row>
				<Col xs={12}>
					<Card>
						<CardBody>
							{/* Filtros - apenas desktop */}
							<div className="mb-3 d-none d-lg-block">
								<Row className="align-items-center g-2">
									<Col xs={12}>
										<CaseFilters 
											onOpenFiltersDrawer={() => setShowFiltersDrawer(true)}
											showFiltersDrawer={showFiltersDrawer}
											onCloseFiltersDrawer={() => setShowFiltersDrawer(false)}
										/>
									</Col>
								</Row>
							</div>
							
							{/* Seção de projetos - apenas desktop */}
							<div className="d-none d-lg-block mb-3">
								<ProjectsSection 
									onOpenProductsDrawer={() => setShowProductsDrawer(true)}
									showProductsDrawer={showProductsDrawer}
									onCloseProductsDrawer={() => setShowProductsDrawer(false)}
								/>
							</div>
							
							{/* Mobile: apenas gráfico de status */}
							<div className="d-lg-none mb-3">
								<ProjectsSection 
									onOpenProductsDrawer={() => setShowProductsDrawer(true)}
									showProductsDrawer={showProductsDrawer}
									onCloseProductsDrawer={() => setShowProductsDrawer(false)}
									mobileOnly
								/>
							</div>
							
							<div className="table-responsive">
								<CasesTable data={cases} loading={loading} />
							</div>
						</CardBody>
					</Card>
				</Col>
			</Row>
			
			{/* FAB apenas no mobile */}
			<div className="d-lg-none">
				<CasesFAB 
					onOpenFilters={() => setShowFiltersDrawer(true)}
					onOpenProducts={() => setShowProductsDrawer(true)}
					showFiltersDrawer={showFiltersDrawer}
					showProductsDrawer={showProductsDrawer}
				/>
			</div>
			
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
