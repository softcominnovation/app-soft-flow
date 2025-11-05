import axios from 'axios';

export interface IOriginAssistant {
    id: string;
    nome: string;
}

export const assistant = async () => {
    try {
        const response = await axios.get('/api/assistant/origins');
        return response.data as IOriginAssistant[];
    } catch (error) {
        console.error('Error fetching origins:', error);
        return [];
    }
};