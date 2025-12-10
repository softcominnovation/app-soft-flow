/**
 * Constantes para campos de ordenação da tabela de casos
 * Mapeia os sortKeys usados na UI para os nomes esperados pelo backend
 */
export const CASE_SORT_FIELDS = {
	NUMERO_CASO: 'numero_caso',
	ATRIBUIDO: 'atribuido',
	PRODUTO: 'produto',
	VERSAO: 'versao',
	PROJETO: 'projeto',
	PRIORIDADE: 'prioridade',
	DESCRICAO_RESUMO: 'descricao_resumo',
	STATUS: 'status',
	TEMPO: 'tempo',
} as const;

export type CaseSortField = typeof CASE_SORT_FIELDS[keyof typeof CASE_SORT_FIELDS];

