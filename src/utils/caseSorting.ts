import { ICase } from '@/types/cases/ICase';
import { SortDirection } from '@/components/table/SortableTableHeader';
import { CASE_SORT_FIELDS } from '@/constants/caseSortFields';

/**
 * Extrai o valor do campo para ordenação baseado no sortKey
 */
const getSortValue = (caseItem: ICase, sortKey: string): string | number | null => {
	switch (sortKey) {
		case CASE_SORT_FIELDS.NUMERO_CASO:
			return caseItem.caso.id;

		case CASE_SORT_FIELDS.ATRIBUIDO:
			return caseItem.caso.usuarios.desenvolvimento?.nome || '';

		case CASE_SORT_FIELDS.PRODUTO:
			return caseItem.produto?.nome || '';

		case CASE_SORT_FIELDS.VERSAO:
			return caseItem.produto?.versao || '';

		case CASE_SORT_FIELDS.PROJETO:
			return caseItem.projeto?.id || 0;

		case CASE_SORT_FIELDS.PRIORIDADE:
			return caseItem.caso.caracteristicas.prioridade || '';

		case CASE_SORT_FIELDS.DESCRICAO_RESUMO:
			return caseItem.caso.textos.descricao_resumo || '';

		case CASE_SORT_FIELDS.STATUS:
			return caseItem.caso.status.status_tipo || '';

		case CASE_SORT_FIELDS.TEMPO:
			// Ordena por tempo realizado, se não houver, usa estimado
			return caseItem.caso.tempos?.realizado_minutos ?? caseItem.caso.tempos?.estimado_minutos ?? 0;

		default:
			return null;
	}
};

/**
 * Compara dois valores para ordenação
 * Valores nulos/vazios sempre vão para o final da lista
 */
const compareValues = (a: string | number | null, b: string | number | null): number => {
	// Trata valores nulos/vazios - sempre vão para o final
	const aIsEmpty = a === null || a === '';
	const bIsEmpty = b === null || b === '';
	
	if (aIsEmpty && bIsEmpty) return 0;
	if (aIsEmpty) return 1; // a vai para o final
	if (bIsEmpty) return -1; // b vai para o final

	// Se ambos são números, compara numericamente
	if (typeof a === 'number' && typeof b === 'number') {
		return a - b;
	}

	// Caso contrário, compara como strings (case-insensitive)
	const strA = String(a).toLowerCase().trim();
	const strB = String(b).toLowerCase().trim();

	if (strA < strB) return -1;
	if (strA > strB) return 1;
	return 0;
};

/**
 * Ordena um array de casos baseado no sortKey e direction
 * Segue princípios SOLID: Single Responsibility (apenas ordenação)
 */
export const sortCases = (cases: ICase[], sortKey: string | null, direction: SortDirection): ICase[] => {
	// Se não há ordenação, retorna o array original
	if (!sortKey || !direction) {
		return cases;
	}

	// Cria uma cópia do array para não mutar o original
	const sortedCases = [...cases];

	sortedCases.sort((a, b) => {
		const valueA = getSortValue(a, sortKey);
		const valueB = getSortValue(b, sortKey);
		const comparison = compareValues(valueA, valueB);

		// Inverte a comparação se for descendente
		return direction === 'desc' ? -comparison : comparison;
	});

	return sortedCases;
};

