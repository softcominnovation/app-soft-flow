"use client";

import { Button } from "react-bootstrap";
import { ICase } from "@/types/cases/ICase";

type Props = {
	item: ICase;
	onView: (caseId: string) => void;
};

export default function MobileCaseCard({ item, onView }: Props) {
	const caseId = `${item.caso.id}`;
	const developerName = item.caso.usuarios.desenvolvimento?.nome || "Nao atribuido";
	const productName = item.produto?.nome || "-";
	const version = item.produto?.versao || "-";
	const priority = item.caso.caracteristicas.prioridade || "N/A";
	const resolucao = item.caso.status.resolucao;
	const summary = item.caso.textos.descricao_resumo;

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
						{resolucao || "-"}
					</p>
				</div>
			</div>

			<div>
				<p className="mb-1 text-muted small">Resumo</p>
				<p className="mb-0 text-break">{summary}</p>
			</div>

			<div className="mt-3" onClick={(e) => e.stopPropagation()}>
				<Button variant="outline-primary" className="w-100" onClick={() => onView(caseId)}>
					Visualização resumida
				</Button>
			</div>
		</div>
	);
}
