import axios from 'axios';

export interface IVersionAssistant {
    id: string;
    versao: string | null;
    abertura: string | null;
    fechamento: string | null;
    sequencia: string;
    testador_id: number;
}

export const assistant = async ({ produto_id, search }: { produto_id: string; search?: string }) => {
    try {
        const response = await axios.get(`/api/assistant/versions`, {
            params: {
                produto_id,
                ...(search ? { search } : {})
            }
        });
        return response.data as IVersionAssistant[];
    } catch (error) {
        console.error('Error fetching versions:', error);
        return [];
    }
};