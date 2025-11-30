'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMensagens, IMensagensFilters } from '@/services/mensagensServices';
import { IMensagem, IMensagensResponse } from '@/types/mensagens/IMensagem';
import { toast } from 'react-toastify';

interface MensagensContextType {
	mensagens: IMensagem[];
	loading: boolean;
	loadingMore: boolean;
	total: number;
	hasMore: boolean;
	currentFilters: IMensagensFilters | undefined;
	fetchMensagens: (data?: IMensagensFilters) => Promise<void>;
	loadMoreMensagens: () => Promise<void>;
	marcarComoLida: (msgId: number) => Promise<void>;
}

export const MensagensContext = createContext<MensagensContextType | undefined>(undefined);

export function useMensagensContext() {
	const context = useContext(MensagensContext);
	if (!context) {
		throw new Error('useMensagensContext must be used within a MensagensProvider');
	}
	return context;
}

export const MensagensProvider = ({ children }: { children: React.ReactNode }) => {
	const [mensagens, setMensagens] = useState<IMensagem[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [loadingMore, setLoadingMore] = useState<boolean>(false);
	const [total, setTotal] = useState<number>(0);
	const [currentFilters, setCurrentFilters] = useState<IMensagensFilters | undefined>(undefined);
	const [hasMore, setHasMore] = useState<boolean>(false);

	const fetchMensagens = useCallback(async (data?: IMensagensFilters) => {
		setLoading(true);
		try {
			const response = await getMensagens(data);
			setMensagens(response.data);
			setTotal(response.total);
			setCurrentFilters(data);
			setHasMore(false);
		} catch (error) {
			toast.error('Não foi possível obter as mensagens');
		} finally {
			setLoading(false);
		}
	}, []);

	const loadMoreMensagens = useCallback(async () => {
	}, []);

	const marcarComoLida = useCallback(async (msgId: number) => {
		try {
			const { marcarMensagemComoLida } = await import('@/services/mensagensServices');
			await marcarMensagemComoLida(msgId);
			setMensagens((prev) =>
				prev.map((msg) =>
					msg.id === msgId
						? {
								...msg,
								status_leitura: {
									...msg.status_leitura,
									lido: true,
									data_lido: new Date().toISOString(),
								},
							}
						: msg
				)
			);
		} catch (error) {
			toast.error('Não foi possível marcar a mensagem como lida');
		}
	}, []);

	// Removido o useEffect inicial - os filtros vão fazer a busca inicial

	return (
		<MensagensContext.Provider
			value={{
				mensagens,
				loading,
				loadingMore,
				total,
				hasMore,
				currentFilters,
				fetchMensagens,
				loadMoreMensagens,
				marcarComoLida,
			}}
		>
			{children}
		</MensagensContext.Provider>
	);
};

