'use client';
import { DropdownButton, DropdownItem, Table } from 'react-bootstrap';
import { ICase } from '@/types/cases/ICase';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

interface CaseRowProps {
	case: ICase;
	index: number;
	onView: (id: string) => void;
	onFinalize: (id: string) => void;
	isFinalizing?: boolean;
}

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
 * Componente que representa uma linha da tabela de casos
 */
export default function CaseRow({ case: caseData, index, onView, onFinalize, isFinalizing = false }: CaseRowProps) {
	const caseId = caseData.caso.id.toString();
	const estimado = caseData.caso.tempos?.estimado_minutos ?? 0;
	const realizado = caseData.caso.tempos?.realizado_minutos ?? 0;

	return (
		<tr
			key={`${caseData.caso.id}-${index}`}
			className="align-middle"
			style={{ cursor: 'pointer' }}
			onClick={() => onView(caseId)}
		>
			<td className="py-2">
				<span className="text-body fw-bold">{caseData.caso.id}</span>
			</td>

			<td className="py-2">
				<span className="text-muted">{caseData.caso.usuarios.desenvolvimento?.nome}</span>
			</td>

			<td className="py-2">
				<span className="text-muted">{caseData.produto?.nome}</span>
			</td>

			<td className="py-2">
				<span className="fw-semibold">{caseData.produto?.versao || '-'}</span>
			</td>

			<td className="py-2">
				<span className="text-muted">{caseData.projeto?.id || '-'}</span>
			</td>

			<td className="py-2">
				<span className="text-muted">{caseData.caso.caracteristicas.prioridade}</span>
			</td>

			<td className="py-2" style={{ maxWidth: 360 }}>
				<p className="mb-0" style={{ whiteSpace: 'normal', wordBreak: 'break-word' }} title={caseData.caso.textos.descricao_resumo}>
					{caseData.caso.textos.descricao_resumo}
				</p>
			</td>

			<td className="py-2">
				<h5 className="my-0 fs-6">{caseData.caso.status.status_tipo || '-'}</h5>
			</td>

			<td className="py-2">
				<div className="d-flex flex-column">
					<div className="small">
						<span className="text-muted">Est: </span>
						<span className="fw-semibold">{formatMinutesToHM(estimado)}</span>
					</div>
					<div className="small">
						<span className="text-muted">Real: </span>
						<span className="fw-semibold">{formatMinutesToHM(realizado)}</span>
					</div>
				</div>
			</td>

			<td className="py-2 text-center position-relative" onClick={(e) => e.stopPropagation()}>
				<DropdownButton size="sm" variant="light" title={<IconifyIcon icon="lucide:align-left" />}>
					<DropdownItem className="text-center" onClick={() => onView(caseId)}>
						<IconifyIcon icon="lucide:eye" className="me-2" />
						Visualização resumida
					</DropdownItem>
					<DropdownItem
						className="text-center text-success"
						onClick={() => onFinalize(caseId)}
						disabled={isFinalizing}
					>
						{isFinalizing ? (
							<>
								<span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
								Finalizando...
							</>
						) : (
							<>
								<IconifyIcon icon="lucide:check-circle" className="me-2" />
								Finalizar Caso
							</>
						)}
					</DropdownItem>
				</DropdownButton>
			</td>
		</tr>
	);
}

