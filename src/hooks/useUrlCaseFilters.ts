import { useMemo } from 'react';
import { useQuery } from '@/hooks';
import { extractCaseFiltersFromUrl, hasFilterParams } from '@/utils/caseFilterUtils';
import ICaseFilter from '@/types/cases/ICaseFilter';

/**
 * Hook customizado para extrair e processar filtros de casos da URL
 * Segue o princípio Single Responsibility - apenas extrai filtros da URL
 * 
 * @returns Objeto com os filtros extraídos e flag indicando se há filtros
 */
export const useUrlCaseFilters = () => {
	const queryParams = useQuery();

	const filters = useMemo<ICaseFilter>(() => {
		return extractCaseFiltersFromUrl(queryParams);
	}, [queryParams]);

	const hasFilters = useMemo(() => {
		return hasFilterParams(queryParams);
	}, [queryParams]);

	return {
		filters,
		hasFilters,
	};
};

