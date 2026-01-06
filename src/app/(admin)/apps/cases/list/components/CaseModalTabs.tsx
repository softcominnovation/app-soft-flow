import { Nav, Tab } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { ICase } from '@/types/cases/ICase';
import ResumeForm, { ResumeFormRef } from '@/app/(admin)/apps/cases/form/resumeForm/resumeForm';
import CaseTimeTracker from './CaseTimeTracker';
import CaseAnnotations from './CaseAnnotations';
import CaseClients from './CaseClients';
import TimetrackerSkelleton from '../skelletons/timetrackerSkelleton';

interface CaseModalTabsProps {
	caseData: ICase | null;
	hasAnotacoes: boolean;
	resumeFormRef: React.RefObject<ResumeFormRef | null>;
	onCaseUpdated: (updatedCase: ICase) => void;
	onAnotacaoCreated: () => void;
}

export default function CaseModalTabs({
	caseData,
	hasAnotacoes,
	resumeFormRef,
	onCaseUpdated,
	onAnotacaoCreated,
}: CaseModalTabsProps) {
	const tabLinkStyle = hasAnotacoes
		? ({
				'--bs-nav-link-color': '#dc3545',
				'--bs-nav-link-hover-color': '#dc3545',
				color: '#dc3545',
				borderBottomColor: '#dc3545',
			} as React.CSSProperties)
		: {};

	const iconStyle = hasAnotacoes ? { color: '#dc3545' } : {};

	return (
		<Tab.Container defaultActiveKey="resumo">
			<div className="d-flex flex-column h-100" style={{ minHeight: 0 }}>
				<Nav variant="tabs" className="nav nav-tabs nav-bordered border-bottom flex-shrink-0 px-4" style={{ marginTop: 0 }}>
					<Nav.Item>
						<Nav.Link eventKey="resumo" className="d-flex align-items-center">
							<IconifyIcon icon="lucide:info" className="me-2" />
							<span>Resumo</span>
						</Nav.Link>
					</Nav.Item>
					<Nav.Item>
						<Nav.Link
							eventKey="detalhes"
							className={`d-flex align-items-center ${hasAnotacoes ? 'fw-bold' : ''}`}
							style={tabLinkStyle}
						>
							<IconifyIcon icon="lucide:file-text" className="me-2" style={iconStyle} />
							<span style={iconStyle}>Anotações</span>
							{hasAnotacoes && caseData?.caso?.anotacoes && (
								<span className="badge bg-danger ms-2" style={{ fontSize: '0.65rem' }}>
									{caseData.caso.anotacoes.length}
								</span>
							)}
						</Nav.Link>
					</Nav.Item>
					<Nav.Item>
						<Nav.Link eventKey="clientes" className="d-flex align-items-center">
							<IconifyIcon icon="lucide:users" className="me-2" />
							<span>Clientes</span>
						</Nav.Link>
					</Nav.Item>
				</Nav>
				<div
					className="custom-scrollbar px-4 py-4"
					style={{ flex: '1 1 auto', overflowY: 'auto', overflowX: 'hidden', minHeight: 0, maxHeight: '100%' }}
				>
					<Tab.Content>
						<Tab.Pane eventKey="resumo">
							<ResumeForm ref={resumeFormRef} caseData={caseData} onCaseUpdated={onCaseUpdated} />
						</Tab.Pane>
						<Tab.Pane eventKey="detalhes">
							{caseData ? (
								<CaseAnnotations
									anotacoes={caseData.caso.anotacoes || []}
									registro={caseData.caso.id}
									onAnotacaoCreated={onAnotacaoCreated}
								/>
							) : (
								<div className="text-center py-5">
									<IconifyIcon icon="lucide:loader-2" className="text-muted mb-3" style={{ fontSize: '3rem' }} />
									<h5 className="text-muted">Carregando caso...</h5>
								</div>
							)}
						</Tab.Pane>
						<Tab.Pane eventKey="clientes">
							<CaseClients registro={caseData?.caso?.id || null} />
						</Tab.Pane>
					</Tab.Content>
				</div>
			</div>
		</Tab.Container>
	);
}

