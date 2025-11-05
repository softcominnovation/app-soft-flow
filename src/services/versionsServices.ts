import axios from 'axios';

export interface IVersionAssistant {
    id: string;
    versao: string | null;
    abertura: string | null;
    fechamento: string | null;
    sequencia: string;
    testador_id: number;
}

export const assistant = async ({ produto_id }: { produto_id: string }) => {
    try {
        const response = await axios.get(`/api/assistant/versions`, {
            params: {
                produto_id
            }
        });
        return response.data as IVersionAssistant[];
    } catch (error) {
        console.error('Error fetching versions:', error);
        return [];
    }
};