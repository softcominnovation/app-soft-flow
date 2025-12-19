import axios from 'axios';

export interface IModuleAssistant {
	nome: string;
}

export const assistant = async ({ produto_id, search }: { produto_id: string; search?: string }) => {
    try {
        const response = await axios.get('/api/assistant/modules', {
            params: {
                produto_id,
            }
        });
        // A API retorna um array de strings, então transformamos em objetos
        let modules = response.data as string[];
        
        // Filtrar localmente se houver busca
        if (search) {
            const searchLower = search.toLowerCase();
            modules = modules.filter((nome) => nome.toLowerCase().includes(searchLower));
        }
        
        return modules.map((nome) => ({ nome })) as IModuleAssistant[];
    } catch (error) {
        console.error('Error fetching modules:', error);
        return [];
    }
};

