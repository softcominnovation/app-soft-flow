'use client';
import { Modal, Button } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { useEffect } from 'react';

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
	useEffect(() => {
		const styleId = 'confirm-dialog-styles';
		let styleElement = document.getElementById(styleId) as HTMLStyleElement;
		if (!styleElement) {
			styleElement = document.createElement('style');
			styleElement.id = styleId;
			document.head.appendChild(styleElement);
		}
		
		styleElement.textContent = `
			.confirm-dialog-modal {
				z-index: 1070 !important;
			}
			.confirm-dialog-modal + .modal-backdrop {
				z-index: 1069 !important;
			}
			.confirm-dialog-modal .modal-dialog {
				max-width: 400px !important;
				width: 90% !important;
				margin: 1.75rem auto !important;
				height: auto !important;
				max-height: none !important;
				transform: translate(-50%, -50%) !important;
				position: fixed !important;
				top: 50% !important;
				left: 50% !important;
				margin-top: 0 !important;
				margin-left: 0 !important;
			}
			.confirm-dialog-modal .modal-content {
				max-height: none !important;
				height: auto !important;
				display: flex !important;
				flex-direction: column !important;
				overflow: visible !important;
				border-radius: 0.5rem !important;
			}
			.confirm-dialog-modal .modal-header,
			.confirm-dialog-modal .modal-body,
			.confirm-dialog-modal .modal-footer {
				flex-shrink: 0 !important;
				overflow: visible !important;
			}
		`;

		return () => {
			const style = document.getElementById(styleId);
			if (style) {
				style.remove();
			}
		};
	}, []);

	return (
		<Modal
			show={show}
			onHide={loading ? undefined : onCancel}
			backdrop={loading ? 'static' : true}
			keyboard={!loading}
			centered
			size="sm"
			contentClassName="shadow-lg"
			dialogClassName="confirm-dialog-modal"
			enforceFocus={false}
		>
			<Modal.Header closeButton={!loading} style={{ padding: '1rem', flexShrink: 0 }}>
				<Modal.Title className="d-flex align-items-center" style={{ fontSize: '1.1rem', margin: 0 }}>
					<IconifyIcon icon="lucide:alert-circle" className="me-2 text-warning" />
					{title}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body style={{ padding: '1rem', flexShrink: 0 }}>
				<p className="mb-0" style={{ margin: 0 }}>{message}</p>
			</Modal.Body>
			<Modal.Footer style={{ padding: '0.75rem 1rem', flexShrink: 0 }}>
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























