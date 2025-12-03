"use client";

import { Button, Badge, Placeholder } from "react-bootstrap";
import { ICase } from "@/types/cases/ICase";
import { finalizeCase } from "@/services/caseServices";
import { toast } from "react-toastify";
import { useState } from "react";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useGetTipoBadgeVariant } from "@/hooks/caseTimeTracker/caseTimeTrackerVarianions";
import classNames from "classnames";

type Props = {
	item: ICase;
	onView: (caseId: string) => void;
	onFinalize?: () => void;
	isLoading?: boolean;
};

/**
 * Converte minutos para formato H:M
 */
const formatMinutesToHM = (minutes: number): string => {
	const hours = Math.floor(minutes / 60);
	const mins = minutes % 60;
	const paddedHours = hours.toString().padStart(2, '0');
	const paddedMinutes = mins.toString().padStart(2, '0');
	return `${paddedHours}:${paddedMinutes}`;
};

/**
 * Retorna a variante de badge para prioridade
 */
const getPriorityBadgeVariant = (priority: string): string => {
	const normalized = priority.toLowerCase();
	if (normalized.includes('alta') || normalized.includes('high')) return 'danger';
	if (normalized.includes('média') || normalized.includes('medium')) return 'warning';
	if (normalized.includes('baixa') || normalized.includes('low')) return 'success';
	return 'secondary';
};

export default function MobileCaseCard({ item, onView, onFinalize, isLoading = false }: Props) {
	const caseId = `${item.caso.id}`;
	const developerName = item.caso.usuarios.desenvolvimento?.nome || "Não atribuído";
	const productName = item.produto?.nome || "-";
	const version = item.produto?.versao || "-";
	const priority = item.caso.caracteristicas.prioridade || "N/A";
	const statusTipo = item.caso.status.status_tipo;
	const summary = item.caso.textos.descricao_resumo;
	const estimado = item.caso.tempos?.estimado_minutos ?? 0;
	const realizado = item.caso.tempos?.realizado_minutos ?? 0;
	const statusTempo = item.caso.tempos?.status_tempo;
	const isTimeStarted = statusTempo === 'INICIADO';
	const [finalizing, setFinalizing] = useState(false);
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);

	const statusVariant = useGetTipoBadgeVariant(statusTipo || '');
	const priorityVariant = getPriorityBadgeVariant(priority);

	const handleFinalizeCaseClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (finalizing) {
			return;
		}
		setShowConfirmDialog(true);
	};

	const handleConfirmFinalize = async () => {
		if (finalizing) {
			return;
		}

		setFinalizing(true);
		setShowConfirmDialog(false);
		try {
			await finalizeCase(caseId);
			toast.success('Caso finalizado com sucesso!');
			if (onFinalize) {
				onFinalize();
			}
			// Recarregar a página para atualizar a listagem e o card flutuante
			setTimeout(() => {
				window.location.reload();
			}, 500);
		} catch (error: any) {
			console.error('Erro ao finalizar caso:', error);
			toast.error(error?.message || 'Erro ao finalizar o caso');
		} finally {
			setFinalizing(false);
		}
	};

	if (isLoading) {
		return (
			<div 
				className={`border rounded-3 mb-3 shadow-sm overflow-hidden ${isTimeStarted ? 'border-success border-2 bg-success bg-opacity-10' : 'bg-body'}`}
				style={{ 
					cursor: 'wait',
				}}
			>
				{/* Header Skeleton */}
				<div className="bg-body-tertiary border-bottom p-3">
					<div className="d-flex justify-content-between align-items-center mb-2">
						<div className="flex-grow-1">
							<Placeholder as="div" animation="glow" className="mb-1">
								<Placeholder xs={4} style={{ height: '16px' }} />
							</Placeholder>
							<Placeholder as="div" animation="glow">
								<Placeholder xs={6} style={{ height: '12px' }} />
							</Placeholder>
						</div>
					</div>
					<div className="d-flex gap-2">
						<Placeholder as="div" animation="glow" style={{ width: '80px', height: '24px', borderRadius: '4px' }} />
						<Placeholder as="div" animation="glow" style={{ width: '100px', height: '24px', borderRadius: '4px' }} />
					</div>
				</div>
				{/* Content Skeleton */}
				<div className="p-3">
					<div className="mb-3">
						<Placeholder as="div" animation="glow" className="mb-2">
							<Placeholder xs={3} style={{ height: '12px' }} />
						</Placeholder>
						<Placeholder as="div" animation="glow" className="mb-1">
							<Placeholder xs={8} style={{ height: '15px' }} />
						</Placeholder>
						<Placeholder as="div" animation="glow">
							<Placeholder xs={5} style={{ height: '12px' }} />
						</Placeholder>
					</div>
					<div className="mb-3 p-2 bg-body-tertiary rounded">
						<Placeholder as="div" animation="glow" className="mb-2">
							<Placeholder xs={3} style={{ height: '12px' }} />
						</Placeholder>
						<div className="d-flex gap-4">
							<div>
								<Placeholder as="div" animation="glow" className="mb-1">
									<Placeholder xs={4} style={{ height: '10px' }} />
								</Placeholder>
								<Placeholder as="div" animation="glow">
									<Placeholder xs={3} style={{ height: '16px' }} />
								</Placeholder>
							</div>
							<div>
								<Placeholder as="div" animation="glow" className="mb-1">
									<Placeholder xs={4} style={{ height: '10px' }} />
								</Placeholder>
								<Placeholder as="div" animation="glow">
									<Placeholder xs={3} style={{ height: '16px' }} />
								</Placeholder>
							</div>
						</div>
					</div>
					<div className="mb-3">
						<Placeholder as="div" animation="glow" className="mb-2">
							<Placeholder xs={3} style={{ height: '12px' }} />
						</Placeholder>
						<Placeholder as="div" animation="glow">
							<Placeholder xs={12} style={{ height: '14px' }} />
						</Placeholder>
						<Placeholder as="div" animation="glow" className="mt-1">
							<Placeholder xs={10} style={{ height: '14px' }} />
						</Placeholder>
					</div>
					<div className="d-flex gap-2 mt-3 pt-3 border-top">
						<Placeholder as="div" animation="glow" className="flex-grow-1" style={{ height: '32px', borderRadius: '4px' }} />
						<Placeholder as="div" animation="glow" className="flex-grow-1" style={{ height: '32px', borderRadius: '4px' }} />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div 
			className={`border rounded-3 mb-3 shadow-sm overflow-hidden ${isTimeStarted ? 'border-success border-2 bg-success bg-opacity-10' : 'bg-body'}`}
			style={{ 
				cursor: 'pointer',
				transition: 'all 0.2s ease-in-out',
			}}
			onClick={() => onView(caseId)}
			onMouseEnter={(e) => {
				e.currentTarget.style.transform = 'translateY(-2px)';
				e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
			}}
			onMouseLeave={(e) => {
				e.currentTarget.style.transform = 'translateY(0)';
				e.currentTarget.style.boxShadow = '';
			}}
		>
			{/* Header com ID e Badges */}
			<div className="bg-body-tertiary border-bottom p-3">
				<div className="d-flex justify-content-between align-items-center mb-2">
					<div className="d-flex align-items-center gap-2">
						<div>
							<h6 className="mb-0 fw-bold text-body">Caso #{caseId}</h6>
							<small className="text-muted d-flex align-items-center gap-1">
								<IconifyIcon icon="lucide:user" className="fs-6" />
								{developerName}
							</small>
						</div>
					</div>
				</div>
				<div className="d-flex gap-2 flex-wrap">
					<Badge 
						bg={priorityVariant}
						className="px-2 py-1 d-flex align-items-center"
					>
						<IconifyIcon icon="lucide:alert-circle" className="me-1" style={{ fontSize: '12px' }} />
						{priority}
					</Badge>
					{statusTipo && (
						<Badge 
							bg={statusVariant}
							className="px-2 py-1 d-flex align-items-center"
						>
							<IconifyIcon icon="lucide:circle" className="me-1" style={{ fontSize: '8px' }} />
							{statusTipo}
						</Badge>
					)}
				</div>
			</div>

			{/* Conteúdo */}
			<div className="p-3">
				{/* Produto e Versão */}
				<div className="mb-3">
					<div className="d-flex align-items-center gap-2 mb-2">
						<IconifyIcon icon="lucide:package" className="text-primary" style={{ fontSize: '18px' }} />
						<span className="text-muted small fw-semibold text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
							Produto
						</span>
					</div>
					<p className="mb-1 fw-semibold text-body" style={{ fontSize: '15px' }}>{productName}</p>
					<div className="d-flex align-items-center gap-2">
						<IconifyIcon icon="lucide:tag" className="text-muted" style={{ fontSize: '14px' }} />
						<span className="text-muted small">v{version}</span>
						{item.projeto?.id && (
							<>
								<span className="text-muted">•</span>
								<span className="text-muted small">Projeto #{item.projeto.id}</span>
							</>
						)}
					</div>
				</div>

				{/* Tempo */}
				<div className="mb-3 p-2 bg-body-tertiary rounded">
					<div className="d-flex align-items-center gap-2 mb-2">
						<IconifyIcon icon="lucide:clock" className="text-info" style={{ fontSize: '16px' }} />
						<span className="text-muted small fw-semibold text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
							Tempo
						</span>
					</div>
					<div className="d-flex gap-4">
						<div>
							<span className="text-muted small d-block mb-1">Estimado</span>
							<span className="fw-bold text-body" style={{ fontSize: '16px' }}>
								{formatMinutesToHM(estimado)}
							</span>
						</div>
						<div>
							<span className="text-muted small d-block mb-1">Realizado</span>
							<span className="fw-bold text-body" style={{ fontSize: '16px' }}>
								{formatMinutesToHM(realizado)}
							</span>
						</div>
					</div>
				</div>

				{/* Resumo */}
				{summary && (
					<div className="mb-3">
						<div className="d-flex align-items-center gap-2 mb-2">
							<IconifyIcon icon="lucide:file-text" className="text-secondary" style={{ fontSize: '16px' }} />
							<span className="text-muted small fw-semibold text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
								Resumo
							</span>
						</div>
						<p 
							className="mb-0 text-body" 
							style={{ 
								fontSize: '14px',
								lineHeight: '1.5',
								whiteSpace: 'normal', 
								wordBreak: 'break-word',
								display: '-webkit-box',
								WebkitLineClamp: 3,
								WebkitBoxOrient: 'vertical',
								overflow: 'hidden'
							}}
						>
							{summary}
						</p>
					</div>
				)}

				{/* Ações */}
				<div className="d-flex gap-2 mt-3 pt-3 border-top" onClick={(e) => e.stopPropagation()}>
					<Button 
						variant="outline-primary" 
						className="flex-grow-1 d-flex align-items-center justify-content-center gap-1"
						onClick={() => onView(caseId)}
						size="sm"
					>
						<IconifyIcon icon="lucide:eye" style={{ fontSize: '16px' }} />
						<span>Ver Detalhes</span>
					</Button>
					<Button 
						variant="outline-success" 
						className="flex-grow-1 d-flex align-items-center justify-content-center gap-1"
						onClick={handleFinalizeCaseClick}
						disabled={finalizing}
						size="sm"
					>
						{finalizing ? (
							<>
								<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
								<span>Finalizando...</span>
							</>
						) : (
							<>
								<IconifyIcon icon="lucide:check-circle" style={{ fontSize: '16px' }} />
								<span>Finalizar</span>
							</>
						)}
					</Button>
				</div>
			</div>

			<ConfirmDialog
				show={showConfirmDialog}
				title="Finalizar Caso"
				message={`Deseja realmente finalizar o Caso #${caseId}?`}
				confirmText="Finalizar"
				cancelText="Cancelar"
				confirmVariant="success"
				onConfirm={handleConfirmFinalize}
				onCancel={() => setShowConfirmDialog(false)}
				loading={finalizing}
			/>
		</div>
	);
}
