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
	fetchCases: (data?: ICaseFilter, shouldSaveToLocalStorage?: boolean) => Promise<void>;
	loadMoreCases: () => Promise<void>;
	fetchEspecifiedCases: (id: string) => Promise<ICaseEspecifiedResponse | undefined>;
	fetchAgendaDev: (userId: string, forceRefresh?: boolean) => Promise<void>;
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
				return {
					usuario_dev_id: userId, // Sempre inclui o usuário logado nos filtros padrão
					produto_id: parsed.produto_id,
					versao_produto: parsed.versao_produto,
					status_id: parsed.status_id,
					sort_by: 'prioridade',
				};
			}
		} catch (error) {
			console.error('Erro ao carregar do localStorage:', error);
		}
		
		return {
			usuario_dev_id: userId, // Sempre inclui o usuário logado nos filtros padrão
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
			
			// Se não há data ou data está vazio, usa os filtros padrão (com usuário logado)
			if (!data || Object.keys(data).length === 0) {
				filters = defaultFilters;
			} else {
				// Se há data, remove usuario_dev_id, status_id e status_descricao dos filtros padrão
				// Esses campos só serão incluídos se forem fornecidos explicitamente em data
				const { usuario_dev_id: _, status_id: __, status_descricao: ___, ...baseFilters } = defaultFilters;
				
				// Mescla os filtros base com os dados fornecidos
				filters = { ...baseFilters, ...data };
				
				// Se data.usuario_dev_id foi fornecido e não está vazio, inclui; senão, remove
				if (data.usuario_dev_id && data.usuario_dev_id !== '') {
					filters.usuario_dev_id = data.usuario_dev_id;
				} else {
					delete filters.usuario_dev_id;
				}
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
			
			// Salva os filtros no localStorage se shouldSaveToLocalStorage for true ou se não foi especificado
			// Salva produto_id, versao_produto, status_id e usuario_dev_id
			if (shouldSaveToLocalStorage !== false && sanitizedFilters.produto_id) {
				try {
					const dataToSave = {
						produto_id: sanitizedFilters.produto_id,
						versao_produto: sanitizedFilters.versao_produto || '',
						status_id: sanitizedFilters.status_id || '',
						usuario_dev_id: sanitizedFilters.usuario_dev_id || '',
					};
					localStorage.setItem('lastSelectedProduct', JSON.stringify(dataToSave));
				} catch (error) {
					console.error('Erro ao salvar no localStorage:', error);
				}
			}
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

	const fetchAgendaDev = useCallback(async (userId: string, forceRefresh: boolean = false) => {
		if (!userId) {
			setAgendaDev([]);
			return;
		}

		// Se forceRefresh for true, invalida o cache
		if (forceRefresh) {
			agendaDevCacheRef.current = null;
		}

		// Verifica se há cache válido
		const now = Date.now();
		if (
			!forceRefresh &&
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

