'use client';
import { Button } from 'react-bootstrap';
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
		// Adiciona animações CSS
		const styleId = 'confirm-dialog-animations';
		let styleElement = document.getElementById(styleId) as HTMLStyleElement;
		if (!styleElement) {
			styleElement = document.createElement('style');
			styleElement.id = styleId;
			document.head.appendChild(styleElement);
		}
		
		styleElement.textContent = `
			@keyframes fadeIn {
				from {
					opacity: 0;
				}
				to {
					opacity: 1;
				}
			}
			@keyframes modalSlideIn {
				from {
					opacity: 0;
					transform: translate(-50%, -50%) scale(0.9);
				}
				to {
					opacity: 1;
					transform: translate(-50%, -50%) scale(1);
				}
			}
		`;

		if (show) {
			// Previne scroll no body quando o modal está aberto
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}

		return () => {
			document.body.style.overflow = '';
		};
	}, [show]);

	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && show && !loading) {
				onCancel();
			}
		};

		if (show) {
			document.addEventListener('keydown', handleEscape);
		}

		return () => {
			document.removeEventListener('keydown', handleEscape);
		};
	}, [show, loading, onCancel]);

	if (!show) return null;

	const getVariantClass = () => {
		const variants: Record<string, string> = {
			primary: 'btn-primary',
			success: 'btn-success',
			danger: 'btn-danger',
			warning: 'btn-warning',
			info: 'btn-info',
			secondary: 'btn-secondary',
		};
		return variants[confirmVariant] || 'btn-primary';
	};

	return (
		<>
			{/* Backdrop */}
			<div
				className="position-fixed top-0 start-0 w-100 h-100"
				style={{
					backgroundColor: 'rgba(0, 0, 0, 0.5)',
					zIndex: 1069,
					cursor: loading ? 'not-allowed' : 'pointer',
					animation: 'fadeIn 0.2s ease-in-out',
				}}
				onClick={loading ? undefined : onCancel}
			/>

			{/* Modal */}
			<div
				className="position-fixed top-50 start-50 translate-middle"
				style={{
					zIndex: 1070,
					width: '90%',
					maxWidth: '400px',
					animation: 'modalSlideIn 0.3s ease-out',
				}}
				onClick={(e) => e.stopPropagation()}
			>
				<div
					className="bg-body rounded shadow-lg"
					style={{
						display: 'flex',
						flexDirection: 'column',
					}}
				>
					{/* Header */}
					<div
						className="d-flex align-items-center justify-content-between p-3 border-bottom"
						style={{ flexShrink: 0 }}
					>
						<h5 className="d-flex align-items-center mb-0 text-body" style={{ fontSize: '1.1rem' }}>
							<IconifyIcon icon="lucide:alert-circle" className="me-2 text-warning" />
							{title}
						</h5>
						{!loading && (
							<button
								type="button"
								className="btn-close"
								onClick={onCancel}
								aria-label="Close"
							/>
						)}
					</div>

					{/* Body */}
					<div className="p-3" style={{ flexShrink: 0 }}>
						<p className="mb-0 text-body">{message}</p>
					</div>

					{/* Footer */}
					<div
						className="d-flex justify-content-end gap-2 p-3 border-top"
						style={{ flexShrink: 0 }}
					>
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
					</div>
				</div>
			</div>
		</>
	);
}























