'use client';
import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { allCase, findCase, diaryDevAssistant } from '@/services/caseServices';
import { ICase, ICaseEspecifiedResponse, ICaseResponse } from '@/types/cases/ICase';
import { toast } from 'react-toastify';
import ICaseFilter from '@/types/cases/ICaseFilter';
import Cookies from 'js-cookie';
import IAgendaDevAssistant from '@/types/assistant/IAgendaDevAssistant';

interface CasesContextType {
	cases: ICase[];
	loading: boolean;
	loadingMore: boolean;
	pagination: ICaseResponse['pagination'] | null;
	currentFilters: ICaseFilter | undefined;
	pendingFilters: ICaseFilter | undefined;
	agendaDev: IAgendaDevAssistant[];
	agendaDevLoading: boolean;
	fetchCases: (data?: ICaseFilter) => Promise<void>;
	loadMoreCases: () => Promise<void>;
	fetchEspecifiedCases: (id: string) => Promise<ICaseEspecifiedResponse | undefined>;
	fetchAgendaDev: (userId: string) => Promise<void>;
}

export const CasesContext = createContext<CasesContextType | undefined>(undefined);

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
	const [pendingFilters, setPendingFilters] = useState<ICaseFilter | undefined>(undefined);
	const [agendaDev, setAgendaDev] = useState<IAgendaDevAssistant[]>([]);
	const [agendaDevLoading, setAgendaDevLoading] = useState<boolean>(false);
	
	// Cache para evitar múltiplas requisições simultâneas
	const agendaDevCacheRef = useRef<{ userId: string; data: IAgendaDevAssistant[]; timestamp: number } | null>(null);
	const agendaDevRequestRef = useRef<Map<string, Promise<void>>>(new Map());
	const CACHE_DURATION = 30000; // 30 segundos

	const buildDefaultFilters = useCallback((): ICaseFilter => {
		const userId = Cookies.get('user_id');
		
		// Tenta carregar do localStorage
		try {
			const savedData = localStorage.getItem('lastSelectedProduct');
			if (savedData) {
				const parsed = JSON.parse(savedData);
				// Só usa se for do mesmo usuário
				if (parsed.usuario_dev_id === userId) {
					return {
						usuario_dev_id: userId,
						produto_id: parsed.produto_id,
						versao_produto: parsed.versao_produto,
						status_id: parsed.status_id,
						sort_by: 'prioridade',
					};
				}
			}
		} catch (error) {
			console.error('Erro ao carregar do localStorage:', error);
		}
		
		return {
			usuario_dev_id: userId,
			sort_by: 'prioridade',
			status_descricao: 'ATRIBUIDO',
		};
	}, []);

	const fetchCases = useCallback(async (data?: ICaseFilter, shouldSaveToLocalStorage?: boolean) => {
		// Atualiza os filtros pendentes imediatamente para que outros componentes possam reagir
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
		// Atualiza os filtros pendentes imediatamente
		setPendingFilters(sanitizedFilters);
		
		setLoading(true);
		try {
			const response = await allCase(sanitizedFilters);
			setCases(response.data);
			setPagination(response.pagination ?? null);
			setCurrentFilters(sanitizedFilters);
			// Limpa os filtros pendentes após sucesso, pois agora estão confirmados em currentFilters
			setPendingFilters(undefined);
		} catch (error) {
			toast.error('Nao foi possivel obter os dados');
			// Em caso de erro, limpa os filtros pendentes
			setPendingFilters(undefined);
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

	const fetchAgendaDev = useCallback(async (userId: string) => {
		if (!userId) {
			setAgendaDev([]);
			return;
		}

		// Verifica se há cache válido
		const now = Date.now();
		if (
			agendaDevCacheRef.current &&
			agendaDevCacheRef.current.userId === userId &&
			(now - agendaDevCacheRef.current.timestamp) < CACHE_DURATION
		) {
			setAgendaDev(agendaDevCacheRef.current.data);
			return;
		}

		// Se já há uma requisição em andamento para este userId, aguarda ela
		const existingRequest = agendaDevRequestRef.current.get(userId);
		if (existingRequest) {
			await existingRequest;
			// Após aguardar, verifica novamente o cache com timestamp atualizado
			const nowAfterWait = Date.now();
			if (
				agendaDevCacheRef.current &&
				agendaDevCacheRef.current.userId === userId &&
				(nowAfterWait - agendaDevCacheRef.current.timestamp) < CACHE_DURATION
			) {
				setAgendaDev(agendaDevCacheRef.current.data);
				return;
			}
		}

		// Cria uma nova requisição
		const requestPromise = (async () => {
			setAgendaDevLoading(true);
			try {
				const data = await diaryDevAssistant(userId);
				// Atualiza o cache
				agendaDevCacheRef.current = {
					userId,
					data: data ?? [],
					timestamp: Date.now(),
				};
				setAgendaDev(data ?? []);
			} catch (err) {
				console.error('Falha ao carregar agenda do dev:', err);
				setAgendaDev([]);
			} finally {
				setAgendaDevLoading(false);
				agendaDevRequestRef.current.delete(userId);
			}
		})();

		agendaDevRequestRef.current.set(userId, requestPromise);
		await requestPromise;
	}, []);

	// Não faz chamada automática se já houver filtros aplicados (vindos da URL, por exemplo)
	useEffect(() => {
		// Verifica se há filtros na URL antes de fazer a chamada automática
		if (typeof window !== 'undefined') {
			const urlParams = new URLSearchParams(window.location.search);
			const hasUrlFilters = 
				urlParams.has('usuario_dev_id') || 
				urlParams.has('produto_id') || 
				urlParams.has('versao_produto') || 
				urlParams.has('status_id') || 
				urlParams.has('status_id[]') ||
				urlParams.has('sort_by');
			
			// Se não houver filtros na URL, faz a chamada automática
			if (!hasUrlFilters) {
				fetchCases();
			}
		} else {
			// No servidor, sempre faz a chamada automática
			fetchCases();
		}
	}, [fetchCases]);

	return (
		<CasesContext.Provider value={{ cases, loading, loadingMore, pagination, currentFilters, pendingFilters, agendaDev, agendaDevLoading, fetchCases, loadMoreCases, fetchEspecifiedCases, fetchAgendaDev }}>
			{children}
		</CasesContext.Provider>
	);
};

