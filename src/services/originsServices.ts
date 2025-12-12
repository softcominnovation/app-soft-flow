import axios from 'axios';

export interface IOriginAssistant {
	id: number;
	nome: string;
}

export const assistant = async ({ search }: { search?: string } = {}) => {
    try {
        const response = await axios.get('/api/assistant/origins', {
            params: {
                ...(search ? { search } : {})
            }
        });
        return response.data as IOriginAssistant[];
    } catch (error) {
        console.error('Error fetching origins:', error);
        return [];
    }
};