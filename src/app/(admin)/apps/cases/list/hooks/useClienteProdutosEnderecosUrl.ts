import { useState, useEffect, useCallback } from 'react';
import { getClienteProdutosEnderecosUrl } from '@/services/clientesServices';
import { IClienteProdutoEnderecoUrl } from '@/types/clientes/IClienteProdutoEnderecoUrl';

interface UseClienteProdutosEnderecosUrlReturn {
	produtos: IClienteProdutoEnderecoUrl[];
	loading: boolean;
	error: Error | null;
	refetch: () => void;
}

export function useClienteProdutosEnderecosUrl(registro: number | null): UseClienteProdutosEnderecosUrlReturn {
	const [produtos, setProdutos] = useState<IClienteProdutoEnderecoUrl[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const fetchProdutos = useCallback(async () => {
		if (!registro) {
			setProdutos([]);
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const response = await getClienteProdutosEnderecosUrl(registro);
			setProdutos(response.data || []);
		} catch (err) {
			const errorMessage = err instanceof Error ? err : new Error('Erro ao buscar produtos/endereços/URLs');
			setError(errorMessage);
			setProdutos([]);
		} finally {
			setLoading(false);
		}
	}, [registro]);

	useEffect(() => {
		// Não busca automaticamente - só quando expandir
	}, [fetchProdutos]);

	return {
		produtos,
		loading,
		error,
		refetch: fetchProdutos,
	};
}

