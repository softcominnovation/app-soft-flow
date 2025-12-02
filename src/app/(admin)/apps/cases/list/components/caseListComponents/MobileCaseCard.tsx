"use client";

import { Button } from "react-bootstrap";
import { ICase } from "@/types/cases/ICase";
import { finalizeCase } from "@/services/caseServices";
import { toast } from "react-toastify";
import { useState } from "react";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import ConfirmDialog from "@/components/ConfirmDialog";

type Props = {
	item: ICase;
	onView: (caseId: string) => void;
	onFinalize?: () => void;
};

export default function MobileCaseCard({ item, onView, onFinalize }: Props) {
	const caseId = `${item.caso.id}`;
	const developerName = item.caso.usuarios.desenvolvimento?.nome || "Nao atribuido";
	const productName = item.produto?.nome || "-";
	const version = item.produto?.versao || "-";
	const priority = item.caso.caracteristicas.prioridade || "N/A";
	const statusTipo = item.caso.status.status_tipo;
	const summary = item.caso.textos.descricao_resumo;
	const [finalizing, setFinalizing] = useState(false);
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);

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

	return (
		<div 
			className="border rounded-3 p-3 mb-3 shadow-sm bg-body-tertiary"
			style={{ cursor: 'pointer' }}
			onClick={() => onView(caseId)}
		>
			<div className="d-flex justify-content-between align-items-start mb-2">
				<div>
					<p className="mb-0 fw-semibold">Caso #{caseId}</p>
					<p className="mb-0 text-muted small">{developerName}</p>
				</div>
				<span className="badge bg-light text-dark text-uppercase">{priority}</span>
			</div>

			<div className="mb-2">
				<p className="mb-1 text-muted small">Produto</p>
				<p className="mb-0 fw-medium">{productName}</p>
			</div>

			<div className="mb-2 d-flex justify-content-between gap-3">
				<div>
					<p className="mb-1 text-muted small">Versao</p>
					<p className="mb-0 fw-medium">{version}</p>
				</div>
				<div className="text-end">
					<p className="mb-1 text-muted small">Status</p>
					<p className="mb-0 fw-semibold">
						{statusTipo || "-"}
					</p>
				</div>
			</div>

			<div>
				<p className="mb-1 text-muted small">Resumo</p>
				<p className="mb-0 text-break" style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{summary}</p>
			</div>

			<div className="mt-3 d-flex gap-2" onClick={(e) => e.stopPropagation()}>
				<Button variant="outline-primary" className="flex-grow-1" onClick={() => onView(caseId)}>
					<IconifyIcon icon="lucide:eye" className="me-1" />
					Visualização resumida
				</Button>
				<Button 
					variant="outline-success" 
					className="flex-grow-1" 
					onClick={handleFinalizeCaseClick}
					disabled={finalizing}
				>
					{finalizing ? (
						<>
							<span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
							Finalizando...
						</>
					) : (
						<>
							<IconifyIcon icon="lucide:check-circle" className="me-1" />
							Finalizar
						</>
					)}
				</Button>
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
