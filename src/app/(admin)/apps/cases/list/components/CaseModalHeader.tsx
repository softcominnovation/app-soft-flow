import { Modal, Placeholder } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { ICase } from '@/types/cases/ICase';

interface CaseModalHeaderProps {
	caseData: ICase | null;
}

export default function CaseModalHeader({ caseData }: CaseModalHeaderProps) {
	return (
		<Modal.Header closeButton className="bg-light border-bottom flex-shrink-0">
			<div className="d-flex align-items-center w-100">
				<IconifyIcon icon="lucide:file-text" className="me-2 text-primary d-none d-lg-block" />
				<IconifyIcon icon="lucide:file-text" className="me-2 text-primary d-lg-none" style={{ fontSize: '1.25rem' }} />
				<Modal.Title className="fw-bold text-body mb-0">
					{!caseData ? (
						<Placeholder as="span" animation="glow">
							<Placeholder xs={3} />
						</Placeholder>
					) : (
						`Caso #${caseData.caso.id}`
					)}
				</Modal.Title>
			</div>
		</Modal.Header>
	);
}

