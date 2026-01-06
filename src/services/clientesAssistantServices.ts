import axios from 'axios';
import IClienteAssistant from '@/types/assistant/IClienteAssistant';

interface ClientesAssistantResponse {
	success: boolean;
	data: IClienteAssistant[];
	pagination?: {
		per_page: number;
		next_cursor: string | null;
		prev_cursor: string | null;
		has_more: boolean;
	};
}

export const assistant = async (data: { search?: string; per_page?: number; cursor?: string }): Promise<IClienteAssistant[]> => {
	try {
		const response = await axios.get<ClientesAssistantResponse>('/api/assistant/clientes', {
			params: data,
		});
		return response.data.data || [];
	} catch (error) {
		console.error('Erro ao buscar clientes:', error);
		throw error;
	}
};

