'use client';
import { Table, Form } from 'react-bootstrap';
import { ICase } from '@/types/cases/ICase';
import ListSkelleton from '../skelletons/listSkelleton';
import CaseRow from './CaseRow';
import SortableTableHeader, { SortDirection } from '@/components/table/SortableTableHeader';
import { CASE_SORT_FIELDS } from '@/constants/caseSortFields';

interface CasesTableDesktopProps {
	cases: ICase[];
	loading: boolean;
	loadingMore: boolean;
	onViewCase: (id: string) => void;
	onFinalizeCase: (id: string) => void;
	finalizingCaseId: string | null;
	loadingCaseId: string | null;
	currentSortKey?: string | null;
	currentSortDirection?: SortDirection;
	onSort: (sortKey: string, direction: SortDirection) => void;
	selectedCases: Set<string>;
	onToggleCaseSelection: (caseId: string) => void;
	onSelectAll: () => void;
	isAllSelected: boolean;
}

/**
 * Componente da tabela de casos para desktop
 * Implementa ordenação nas colunas especificadas seguindo boas práticas de componentização
 */
export default function CasesTableDesktop({
	cases,
	loading,
	loadingMore,
	onViewCase,
	onFinalizeCase,
	finalizingCaseId,
	loadingCaseId,
	currentSortKey,
	currentSortDirection,
	onSort,
	selectedCases,
	onToggleCaseSelection,
	onSelectAll,
	isAllSelected,
}: CasesTableDesktopProps) {
	return (
		<div className="d-none d-md-block">
			<Table responsive size="sm" className="table-centered table-nowrap table-sm align-middle mb-0 cases-table">
				<thead className="table-light text-muted">
					<tr>
						<th className="py-3" style={{ width: '50px' }}>
							<Form.Check
								type="checkbox"
								checked={isAllSelected}
								onChange={onSelectAll}
								onClick={(e) => e.stopPropagation()}
							/>
						</th>
						<SortableTableHeader
							sortKey={CASE_SORT_FIELDS.NUMERO_CASO}
							currentSortKey={currentSortKey}
							currentSortDirection={currentSortDirection}
							onSort={onSort}
						>
							Numero do Caso
						</SortableTableHeader>
						<SortableTableHeader
							sortKey={CASE_SORT_FIELDS.ATRIBUIDO}
							currentSortKey={currentSortKey}
							currentSortDirection={currentSortDirection}
							onSort={onSort}
						>
							Atribuido
						</SortableTableHeader>
						<SortableTableHeader
							sortKey={CASE_SORT_FIELDS.PRODUTO}
							currentSortKey={currentSortKey}
							currentSortDirection={currentSortDirection}
							onSort={onSort}
						>
							Produto
						</SortableTableHeader>
						<SortableTableHeader
							sortKey={CASE_SORT_FIELDS.VERSAO}
							currentSortKey={currentSortKey}
							currentSortDirection={currentSortDirection}
							onSort={onSort}
						>
							Versao
						</SortableTableHeader>
						<SortableTableHeader
							sortKey={CASE_SORT_FIELDS.PROJETO}
							currentSortKey={currentSortKey}
							currentSortDirection={currentSortDirection}
							onSort={onSort}
						>
							Projeto
						</SortableTableHeader>
						<SortableTableHeader
							sortKey={CASE_SORT_FIELDS.PRIORIDADE}
							currentSortKey={currentSortKey}
							currentSortDirection={currentSortDirection}
							onSort={onSort}
						>
							Prioridade
						</SortableTableHeader>
						<SortableTableHeader
							sortKey={CASE_SORT_FIELDS.DESCRICAO_RESUMO}
							currentSortKey={currentSortKey}
							currentSortDirection={currentSortDirection}
							onSort={onSort}
						>
							Descricao / Resumo
						</SortableTableHeader>
						<SortableTableHeader
							sortKey={CASE_SORT_FIELDS.STATUS}
							currentSortKey={currentSortKey}
							currentSortDirection={currentSortDirection}
							onSort={onSort}
						>
							Status
						</SortableTableHeader>
						<SortableTableHeader
							sortKey={CASE_SORT_FIELDS.TEMPO}
							currentSortKey={currentSortKey}
							currentSortDirection={currentSortDirection}
							onSort={onSort}
						>
							Tempo
						</SortableTableHeader>
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
									isLoading={loadingCaseId === caseData.caso.id.toString()}
									isSelected={selectedCases.has(caseData.caso.id.toString())}
									onToggleSelection={onToggleCaseSelection}
								/>
							))}
							{loadingMore && <ListSkelleton rows={15} />}
						</>
					) : (
						<tr>
							<td colSpan={11} className="text-center text-muted py-4">
								Nenhum caso encontrado.
							</td>
						</tr>
					)}
				</tbody>
			</Table>
		</div>
	);
}

