'use client';
import { Table } from 'react-bootstrap';
import { ICase } from '@/types/cases/ICase';
import ListSkelleton from '../skelletons/listSkelleton';
import CaseRow from './CaseRow';

interface CasesTableDesktopProps {
	cases: ICase[];
	loading: boolean;
	loadingMore: boolean;
	onViewCase: (id: string) => void;
	onFinalizeCase: (id: string) => void;
	finalizingCaseId: string | null;
}

/**
 * Componente da tabela de casos para desktop
 */
export default function CasesTableDesktop({
	cases,
	loading,
	loadingMore,
	onViewCase,
	onFinalizeCase,
	finalizingCaseId,
}: CasesTableDesktopProps) {
	return (
		<div className="d-none d-md-block">
			<Table responsive size="sm" className="table-centered table-nowrap table-sm align-middle mb-0 cases-table">
				<thead className="table-light text-muted">
					<tr>
						<th className="py-3">Numero do Caso</th>
						<th className="py-3">Atribuido</th>
						<th className="py-3">Produto</th>
						<th className="py-3">Versao</th>
						<th className="py-3">Prioridade</th>
						<th className="py-3">Descricao / Resumo</th>
						<th className="py-3">Status</th>
						<th className="py-3 text-center" style={{ width: '125px' }}>
							Ações
						</th>
					</tr>
				</thead>

				<tbody>
					{loading ? (
						<ListSkelleton rows={10} />
					) : cases.length ? (
						<>
							{cases.map((caseData, index) => (
								<CaseRow
									key={`${caseData.caso.id}-${index}`}
									case={caseData}
									index={index}
									onView={onViewCase}
									onFinalize={onFinalizeCase}
									isFinalizing={finalizingCaseId === caseData.caso.id.toString()}
								/>
							))}
							{loadingMore && <ListSkelleton rows={15} />}
						</>
					) : (
						<tr>
							<td colSpan={9} className="text-center text-muted py-4">
								Nenhum caso encontrado.
							</td>
						</tr>
					)}
				</tbody>
			</Table>
		</div>
	);
}

