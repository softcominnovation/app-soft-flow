'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { allCase, findCase } from '@/services/caseServices';
import { ICase, ICaseEspecifiedResponse, ICaseResponse } from '@/types/cases/ICase';
import { toast } from 'react-toastify';
import ICaseFilter from '@/types/cases/ICaseFilter';
import Cookies from 'js-cookie';

interface CasesContextType {
	cases: ICase[];
	loading: boolean;
	loadingMore: boolean;
	pagination: ICaseResponse['pagination'] | null;
	fetchCases: (data?: ICaseFilter) => Promise<void>;
	loadMoreCases: () => Promise<void>;
	fetchEspecifiedCases: (id: string) => Promise<ICaseEspecifiedResponse | undefined>;
}

const CasesContext = createContext<CasesContextType | undefined>(undefined);

export function useCasesContext() {
	const context = useContext(CasesContext);
	if (!context) {
		throw new Error('useCasesContext must be used within a CasesProvider');
	}
	return context;
}

export const CasesProvider = ({ children }: { children: React.ReactNode }) => {
	const [cases, setCases] = useState<ICase[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [loadingMore, setLoadingMore] = useState<boolean>(false);
	const [pagination, setPagination] = useState<ICaseResponse['pagination'] | null>(null);
	const [currentFilters, setCurrentFilters] = useState<ICaseFilter | undefined>(undefined);

	const buildDefaultFilters = useCallback((): ICaseFilter => {
		const userId = Cookies.get('user_id');
		return {
			usuario_dev_id: userId,
			sort_by: 'prioridade',
			status_descricao: 'ATRIBUIDO',
		};
	}, []);

	const fetchCases = useCallback(async (data?: ICaseFilter) => {
		setLoading(true);
		try {
			const caseNumber = data?.numero_caso?.trim();
			let filters: ICaseFilter;
			
			if (caseNumber) {
				filters = { numero_caso: caseNumber };
			} else {
				const defaultFilters = buildDefaultFilters();
				// Se status_id for fornecido, remove status_descricao dos filtros padrão
				if (data?.status_id) {
					const { status_descricao, ...filtersWithoutStatusDesc } = defaultFilters;
					filters = { ...filtersWithoutStatusDesc, ...data };
				} else {
					filters = { ...defaultFilters, ...data };
				}
			}

			const { cursor, ...sanitizedFilters } = filters;
			const response = await allCase(sanitizedFilters);
			setCases(response.data);
			setPagination(response.pagination ?? null);
			setCurrentFilters(sanitizedFilters);
		} catch (error) {
			toast.error('Nao foi possivel obter os dados');
		} finally {
			setLoading(false);
		}
	}, [buildDefaultFilters]);

	const loadMoreCases = useCallback(async () => {
		if (!pagination?.has_more || !pagination.next_cursor || loadingMore) {
			return;
		}

		setLoadingMore(true);
		try {
			const baseFilters = currentFilters ?? buildDefaultFilters();
			const response = await allCase({
				...baseFilters,
				cursor: pagination.next_cursor,
			});
			setCases((prevCases) => [...prevCases, ...response.data]);
			setPagination(response.pagination ?? null);
		} catch (error) {
			toast.error('Nao foi possivel obter mais casos');
		} finally {
			setLoadingMore(false);
		}
	}, [buildDefaultFilters, currentFilters, loadingMore, pagination]);

	const fetchEspecifiedCases = async (id: string):Promise<ICaseEspecifiedResponse | undefined> => {

		try {
			const response = await findCase(id);
			return response;
		} catch (error) {
			toast.error('Nao foi possivel obter os dados do caso');
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		fetchCases();
	}, [fetchCases]);

	return (
		<CasesContext.Provider value={{ cases, loading, loadingMore, pagination, fetchCases, loadMoreCases, fetchEspecifiedCases }}>
			{children}
		</CasesContext.Provider>
	);
};

