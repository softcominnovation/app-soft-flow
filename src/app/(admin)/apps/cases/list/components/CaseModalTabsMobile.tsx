import { Nav, Tab } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { ICase } from '@/types/cases/ICase';
import ResumeForm, { ResumeFormRef } from '@/app/(admin)/apps/cases/form/resumeForm/resumeForm';
import CaseTimeTracker from './CaseTimeTracker';
import CaseAnnotations from './CaseAnnotations';
import CaseClients from './CaseClients';
import TimetrackerSkelleton from '../skelletons/timetrackerSkelleton';
import type { CaseTimeDraft } from '@/utils/caseTime';

interface CaseModalTabsMobileProps {
	caseData: ICase | null;
	hasAnotacoes: boolean;
	resumeFormRef: React.RefObject<ResumeFormRef | null>;
	onCaseUpdated: (updatedCase: ICase) => void;
	onAnotacaoCreated: () => void;
	onTimeDraftChange?: (draft: CaseTimeDraft) => void;
}

export default function CaseModalTabsMobile({
	caseData,
	hasAnotacoes,
	resumeFormRef,
	onCaseUpdated,
	onAnotacaoCreated,
	onTimeDraftChange,
}: CaseModalTabsMobileProps) {
	const tabLinkStyle = hasAnotacoes
		? ({
				'--bs-nav-link-color': '#dc3545',
				'--bs-nav-link-hover-color': '#dc3545',
				color: '#dc3545',
				borderBottomColor: '#dc3545',
			} as React.CSSProperties)
		: {};

	const iconStyleMobile = hasAnotacoes ? { color: '#dc3545', fontSize: '1.1rem' } : { fontSize: '1.1rem' };
	const iconStyleDesktop = hasAnotacoes ? { color: '#dc3545' } : {};

	return (
		<Tab.Container defaultActiveKey="resumo">
			<div className="d-flex flex-column h-100" style={{ minHeight: 0 }}>
				<Nav variant="tabs" className="nav nav-tabs nav-bordered border-bottom flex-shrink-0" style={{ marginTop: 0, padding: '0 1rem' }}>
					<Nav.Item className="flex-fill">
						<Nav.Link eventKey="resumo" className="d-flex align-items-center justify-content-center text-center">
							<IconifyIcon icon="lucide:info" className="me-1 d-lg-none" style={{ fontSize: '1.1rem' }} />
							<IconifyIcon icon="lucide:info" className="me-2 d-none d-lg-inline" />
							<span>Resumo</span>
						</Nav.Link>
					</Nav.Item>
					<Nav.Item className="flex-fill">
						<Nav.Link
							eventKey="detalhes"
							className={`d-flex align-items-center justify-content-center text-center ${hasAnotacoes ? 'fw-bold' : ''}`}
							style={tabLinkStyle}
						>
							<IconifyIcon icon="lucide:file-text" className="me-1 d-lg-none" style={iconStyleMobile} />
							<IconifyIcon icon="lucide:file-text" className="me-2 d-none d-lg-inline" style={iconStyleDesktop} />
							<span style={hasAnotacoes ? { color: '#dc3545' } : {}}>Anotações</span>
							{hasAnotacoes && caseData?.caso?.anotacoes && (
								<span className="badge bg-danger ms-1 d-none d-lg-inline" style={{ fontSize: '0.65rem' }}>
									{caseData.caso.anotacoes.length}
								</span>
							)}
						</Nav.Link>
					</Nav.Item>
					<Nav.Item className="flex-fill">
						<Nav.Link eventKey="clientes" className="d-flex align-items-center justify-content-center text-center">
							<IconifyIcon icon="lucide:users" className="me-1 d-lg-none" style={{ fontSize: '1.1rem' }} />
							<IconifyIcon icon="lucide:users" className="me-2 d-none d-lg-inline" />
							<span>Clientes</span>
						</Nav.Link>
					</Nav.Item>
					<Nav.Item className="flex-fill">
						<Nav.Link eventKey="tempo" className="d-flex align-items-center justify-content-center text-center">
							<IconifyIcon icon="lucide:clock" className="me-1 d-lg-none" style={{ fontSize: '1.1rem' }} />
							<IconifyIcon icon="lucide:clock" className="me-2 d-none d-lg-inline" />
							<span>Tempo</span>
						</Nav.Link>
					</Nav.Item>
				</Nav>
				<div
					className="custom-scrollbar px-3 px-lg-4 py-3 py-lg-4"
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
						<Tab.Pane eventKey="tempo">
							{!caseData ? (
								<TimetrackerSkelleton />
							) : (
								<CaseTimeTracker
									key={caseData.caso.id}
									caseData={caseData}
									onCaseUpdated={onCaseUpdated}
									onTimeDraftChange={onTimeDraftChange}
								/>
							)}
						</Tab.Pane>
					</Tab.Content>
				</div>
			</div>
		</Tab.Container>
	);
}

