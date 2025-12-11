import { useLayoutEffect, useRef } from 'react';
import { useCasesContext } from '@/contexts/casesContext';
import { useUrlCaseFilters } from './useUrlCaseFilters';

/**
 * Hook customizado para aplicar automaticamente filtros da URL aos casos
 * Segue o princípio Single Responsibility - apenas aplica filtros da URL
 * 
 * @param options - Opções de configuração
 * @param options.onFiltersApplied - Callback chamado quando os filtros são aplicados
 */
export const useApplyUrlCaseFilters = (options?: { onFiltersApplied?: () => void }) => {
	const { fetchCases } = useCasesContext();
	const { filters, hasFilters } = useUrlCaseFilters();
	const filtersAppliedRef = useRef(false);

	useLayoutEffect(() => {
		if (filtersAppliedRef.current || !fetchCases || !hasFilters) return;

		const hasAnyFilter = Object.keys(filters).length > 0;

		if (hasAnyFilter) {
			filtersAppliedRef.current = true;
			fetchCases(filters);
			options?.onFiltersApplied?.();
		}
	}, [fetchCases, filters, hasFilters, options]);
};

