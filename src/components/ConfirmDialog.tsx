'use client';
import { Modal, Button } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

interface ConfirmDialogProps {
	show: boolean;
	title?: string;
	message: string;
	confirmText?: string;
	cancelText?: string;
	confirmVariant?: 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'secondary';
	onConfirm: () => void;
	onCancel: () => void;
	loading?: boolean;
}

export default function ConfirmDialog({
	show,
	title = 'Confirmar ação',
	message,
	confirmText = 'Confirmar',
	cancelText = 'Cancelar',
	confirmVariant = 'primary',
	onConfirm,
	onCancel,
	loading = false,
}: ConfirmDialogProps) {
	return (
		<Modal
			show={show}
			onHide={loading ? undefined : onCancel}
			backdrop={loading ? 'static' : true}
			keyboard={!loading}
			centered
			size="sm"
		>
			<Modal.Header closeButton={!loading}>
				<Modal.Title className="d-flex align-items-center">
					<IconifyIcon icon="lucide:alert-circle" className="me-2 text-warning" />
					{title}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<p className="mb-0">{message}</p>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={onCancel} disabled={loading}>
					{cancelText}
				</Button>
				<Button
					variant={confirmVariant}
					onClick={onConfirm}
					disabled={loading}
					className="d-flex align-items-center"
				>
					{loading ? (
						<>
							<span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
							Processando...
						</>
					) : (
						<>
							<IconifyIcon icon="lucide:check" className="me-1" />
							{confirmText}
						</>
					)}
				</Button>
			</Modal.Footer>
		</Modal>
	);
}



