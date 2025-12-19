import { Button } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { CasePermissions } from '@/hooks/useCasePermissions';
import { ICase } from '@/types/cases/ICase';

interface CaseModalActionButtonsProps {
	caseData: ICase | null;
	permissions: CasePermissions;
	saving: boolean;
	deleting: boolean;
	cloning: boolean;
	finalizing: boolean;
	onSave: () => void;
	onDelete: () => void;
	onClone: () => void;
	onShare: () => void;
	onFinalize: () => void;
	variant?: 'mobile' | 'desktop';
}

export default function CaseModalActionButtons({
	caseData,
	permissions,
	saving,
	deleting,
	cloning,
	finalizing,
	onSave,
	onDelete,
	onClone,
	onShare,
	onFinalize,
	variant = 'desktop',
}: CaseModalActionButtonsProps) {
	if (variant === 'mobile') {
		return (
			<div className="d-flex d-lg-none flex-column w-100 gap-2">
				<div className="d-flex gap-2 w-100">
					<Button
						variant="primary"
						onClick={onSave}
						disabled={saving || !caseData || !permissions.canSave}
						className="d-flex align-items-center justify-content-center flex-fill"
						style={{ backgroundColor: '#0d6efd', borderColor: '#0d6efd', minHeight: '44px' }}
					>
						{saving ? (
							<>
								<span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
								Salvando...
							</>
						) : (
							<>
								<IconifyIcon icon="lucide:save" className="me-1" style={{ fontSize: '1.1rem' }} />
								Salvar
							</>
						)}
					</Button>
					<Button
						variant="danger"
						onClick={onDelete}
						disabled={deleting || !caseData || !permissions.canDelete}
						className="d-flex align-items-center justify-content-center flex-fill"
						style={{ minHeight: '44px' }}
					>
						{deleting ? (
							<>
								<span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
								Excluindo...
							</>
						) : (
							<>
								<IconifyIcon icon="lucide:trash-2" className="me-1" style={{ fontSize: '1.1rem' }} />
								Excluir
							</>
						)}
					</Button>
				</div>
				<div className="d-flex gap-1 w-100" style={{ maxWidth: '100%' }}>
					<Button
						variant="secondary"
						onClick={onClone}
						disabled={cloning || !caseData}
						className="d-flex align-items-center justify-content-center"
						style={{
							minHeight: '44px',
							flex: '1 1 0%',
							fontSize: '0.8rem',
							padding: '0.4rem 0.5rem',
							maxWidth: 'calc(33.333% - 0.333rem)',
						}}
					>
						{cloning ? (
							<>
								<span
									className="spinner-border spinner-border-sm me-1"
									role="status"
									aria-hidden="true"
									style={{ width: '0.75rem', height: '0.75rem' }}
								></span>
								<span style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>Clonando...</span>
							</>
						) : (
							<>
								<IconifyIcon icon="lucide:copy" className="me-1" style={{ fontSize: '0.9rem', flexShrink: 0 }} />
								<span style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>Clonar</span>
							</>
						)}
					</Button>
					<Button
						variant="info"
						onClick={onShare}
						disabled={!caseData}
						className="d-flex align-items-center justify-content-center"
						style={{
							minHeight: '44px',
							flex: '1 1 0%',
							fontSize: '0.8rem',
							padding: '0.4rem 0.5rem',
							maxWidth: 'calc(33.333% - 0.333rem)',
						}}
						title="Compartilhar link do caso"
					>
						<IconifyIcon icon="lucide:share-2" className="me-1" style={{ fontSize: '0.9rem', flexShrink: 0 }} />
						<span style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>Compartilhar</span>
					</Button>
					<Button
						variant="success"
						onClick={onFinalize}
						disabled={finalizing || !caseData}
						className="d-flex align-items-center justify-content-center"
						style={{
							minHeight: '44px',
							flex: '1 1 0%',
							fontSize: '0.8rem',
							padding: '0.4rem 0.5rem',
							maxWidth: 'calc(33.333% - 0.333rem)',
						}}
					>
						{finalizing ? (
							<>
								<span
									className="spinner-border spinner-border-sm me-1"
									role="status"
									aria-hidden="true"
									style={{ width: '0.75rem', height: '0.75rem' }}
								></span>
								<span style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>Finalizando...</span>
							</>
						) : (
							<>
								<IconifyIcon icon="lucide:check-circle" className="me-1" style={{ fontSize: '0.9rem', flexShrink: 0 }} />
								<span style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>Finalizar</span>
							</>
						)}
					</Button>
				</div>
			</div>
		);
	}

	// Desktop variant
	return (
		<div className="d-none d-lg-flex gap-2 justify-content-end">
			<Button
				variant="primary"
				onClick={onSave}
				disabled={saving || !caseData || !permissions.canSave}
				className="d-flex align-items-center"
				style={{ backgroundColor: '#0d6efd', borderColor: '#0d6efd' }}
			>
				{saving ? (
					<>
						<span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
						Salvando...
					</>
				) : (
					<>
						<IconifyIcon icon="lucide:save" className="me-1" />
						Salvar
					</>
				)}
			</Button>
			<Button
				variant="secondary"
				onClick={onClone}
				disabled={cloning || !caseData}
				className="d-flex align-items-center"
			>
				{cloning ? (
					<>
						<span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
						Clonando...
					</>
				) : (
					<>
						<IconifyIcon icon="lucide:copy" className="me-1" />
						Clonar
					</>
				)}
			</Button>
			<Button
				variant="info"
				onClick={onShare}
				disabled={!caseData}
				className="d-flex align-items-center"
				title="Compartilhar link do caso"
			>
				<IconifyIcon icon="lucide:share-2" className="me-1" />
				Compartilhar
			</Button>
			<Button
				variant="success"
				onClick={onFinalize}
				disabled={finalizing || !caseData}
				className="d-flex align-items-center"
			>
				{finalizing ? (
					<>
						<span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
						Finalizando...
					</>
				) : (
					<>
						<IconifyIcon icon="lucide:check-circle" className="me-1" />
						Finalizar Caso
					</>
				)}
			</Button>
			<Button
				variant="danger"
				onClick={onDelete}
				disabled={deleting || !caseData || !permissions.canDelete}
				className="d-flex align-items-center"
			>
				{deleting ? (
					<>
						<span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
						Excluindo...
					</>
				) : (
					<>
						<IconifyIcon icon="lucide:trash-2" className="me-1" />
						Excluir
					</>
				)}
			</Button>
		</div>
	);
}

