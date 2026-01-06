import { useState, useEffect, useCallback } from 'react';
import { getClienteById } from '@/services/clientesServices';
import { ICliente } from '@/types/clientes/ICliente';

interface UseClienteReturn {
	cliente: ICliente | null;
	loading: boolean;
	error: Error | null;
	refetch: () => void;
}

/**
 * Hook customizado para buscar dados de um cliente específico
 * Segue o princípio de responsabilidade única (SRP) - apenas lógica de busca de dados
 */
export function useCliente(id: number | null): UseClienteReturn {
	const [cliente, setCliente] = useState<ICliente | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const fetchCliente = useCallback(async () => {
		if (!id) {
			setCliente(null);
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const response = await getClienteById(id);
			setCliente(response.data || null);
		} catch (err) {
			const errorMessage = err instanceof Error ? err : new Error('Erro ao buscar cliente');
			setError(errorMessage);
			setCliente(null);
		} finally {
			setLoading(false);
		}
	}, [id]);

	useEffect(() => {
		fetchCliente();
	}, [fetchCliente]);

	return {
		cliente,
		loading,
		error,
		refetch: fetchCliente,
	};
}

