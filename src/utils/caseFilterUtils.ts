import ICaseFilter from '@/types/cases/ICaseFilter';

/**
 * Tipo para query parameters que podem ser string ou array de strings
 */
type QueryParams = Record<string, string | string[] | undefined>;

/**
 * Converte um valor de query param para string, tratando arrays
 * @param value - Valor que pode ser string, array de strings ou undefined
 * @returns String ou null se não houver valor
 */
export const getStringValue = (value: string | string[] | undefined): string | null => {
	if (!value) return null;
	return Array.isArray(value) ? value[0] : value;
};

/**
 * Processa o status_id que pode ser um array na URL
 * @param statusIdParam - Parâmetro status_id que pode ser string ou array
 * @returns Valor processado para o filtro
 */
export const processStatusId = (
	statusIdParam: string | string[] | undefined
): string | number | (string | number)[] | undefined => {
	if (!statusIdParam) return undefined;

	if (Array.isArray(statusIdParam)) {
		return statusIdParam.length === 1 ? statusIdParam[0] : statusIdParam;
	}

	return statusIdParam;
};

/**
 * Extrai filtros de casos a partir dos query parameters da URL
 * Segue o princípio Single Responsibility - apenas extrai e converte dados
 * 
 * @param queryParams - Query parameters da URL
 * @returns Objeto ICaseFilter com os filtros extraídos
 */
export const extractCaseFiltersFromUrl = (queryParams: QueryParams): ICaseFilter => {
	const filters: ICaseFilter = {};

	const usuarioDevId = getStringValue(queryParams['usuario_dev_id']);
	if (usuarioDevId) {
		filters.usuario_dev_id = usuarioDevId;
	}

	const produtoId = getStringValue(queryParams['produto_id']);
	if (produtoId) {
		filters.produto_id = produtoId;
	}

	const versaoProduto = getStringValue(queryParams['versao_produto']);
	if (versaoProduto) {
		filters.versao_produto = versaoProduto;
	}

	const sortBy = getStringValue(queryParams['sort_by']);
	if (sortBy) {
		filters.sort_by = sortBy;
	}

	// O useQuery remove os [] da chave, então status_id[] vira status_id
	const statusIdParam = queryParams['status_id'];
	const processedStatusId = processStatusId(statusIdParam);
	if (processedStatusId) {
		filters.status_id = processedStatusId;
	}

	return filters;
};

/**
 * Verifica se há parâmetros de filtro na URL
 * @param queryParams - Query parameters da URL
 * @returns true se houver pelo menos um parâmetro de filtro
 */
export const hasFilterParams = (queryParams: QueryParams): boolean => {
	return !!(
		queryParams['usuario_dev_id'] ||
		queryParams['produto_id'] ||
		queryParams['versao_produto'] ||
		queryParams['status_id'] ||
		queryParams['sort_by']
	);
};

/**
 * Constrói uma query string a partir de um objeto ICaseFilter
 * Segue o princípio Single Responsibility - apenas converte filtros para query string
 * 
 * @param filters - Objeto de filtros
 * @returns Array de strings no formato "chave=valor" para query string
 */
export const buildFilterQueryParams = (filters: ICaseFilter): string[] => {
	const params: string[] = [];

	if (filters.usuario_dev_id) {
		params.push(`usuario_dev_id=${encodeURIComponent(filters.usuario_dev_id)}`);
	}

	if (filters.produto_id) {
		params.push(`produto_id=${encodeURIComponent(filters.produto_id)}`);
	}

	if (filters.versao_produto) {
		params.push(`versao_produto=${encodeURIComponent(filters.versao_produto)}`);
	}

	if (filters.sort_by) {
		params.push(`sort_by=${encodeURIComponent(filters.sort_by)}`);
	}

	// Trata status_id que pode ser um array
	if (filters.status_id) {
		const statusIds = Array.isArray(filters.status_id)
			? filters.status_id
			: [filters.status_id];

		statusIds.forEach((statusId) => {
			if (statusId) {
				params.push(`status_id[]=${encodeURIComponent(String(statusId))}`);
			}
		});
	}

	return params;
};

/**
 * Constrói uma query string completa a partir de filtros
 * @param filters - Objeto de filtros
 * @returns Query string formatada (sem o "?")
 */
export const buildFilterQueryString = (filters: ICaseFilter): string => {
	const params = buildFilterQueryParams(filters);
	return params.join('&');
};

