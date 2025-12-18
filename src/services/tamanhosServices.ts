import axios, { AxiosResponse } from 'axios';

export interface ITamanho {
	id: number;
	tamanho: string;
	tempo: string;
	descricao: string;
}

export async function getTamanhos(): Promise<ITamanho[]> {
	try {
		const res: AxiosResponse<ITamanho[]> = await axios.get('/api/assistant/tamanhos');
		return res.data;
	} catch (err: unknown) {
		if (err instanceof Error) {
			throw new Error(err.message);
		}
		throw new Error(String(err));
	}
}

