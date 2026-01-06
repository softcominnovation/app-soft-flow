import { useState, useEffect, useCallback } from 'react';
import { getCaseClients } from '@/services/caseServices';
import { ICaseCliente } from '@/types/cases/ICaseCliente';
import axios from 'axios';

interface UseCaseClientsReturn {
	clients: ICaseCliente[];
	loading: boolean;
	error: Error | null;
	refetch: () => void;
}

/**
 * Hook customizado para buscar clientes relacionados a um caso
 * Segue o princípio de responsabilidade única (SRP) - apenas lógica de busca de dados
 */
export function useCaseClients(registro: number | null): UseCaseClientsReturn {
	const [clients, setClients] = useState<ICaseCliente[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const fetchClients = useCallback(async () => {
		if (!registro) {
			setClients([]);
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const response = await getCaseClients(registro);
			setClients(response.data || []);
		} catch (err: unknown) {
			// Preserva informações de erro de permissão se existirem
			if (axios.isAxiosError(err) && err.response?.data) {
				const errorData = err.response.data;
				const errorMessage = errorData.message || 'Erro ao buscar clientes';
				const error = new Error(errorMessage);
				(error as any).response = { data: errorData, status: err.response.status };
				setError(error);
			} else if (err instanceof Error) {
				setError(err);
			} else {
				setError(new Error('Erro ao buscar clientes'));
			}
			setClients([]);
		} finally {
			setLoading(false);
		}
	}, [registro]);

	useEffect(() => {
		fetchClients();
	}, [fetchClients]);

	return {
		clients,
		loading,
		error,
		refetch: fetchClients,
	};
}
