import axios, { AxiosResponse } from 'axios';

export interface ICategoryAssistant {
	id: number;
	tipo_categoria: string;
}

export async function assistant(data?: { search?: string }): Promise<ICategoryAssistant[]> {
	try {
		const res: AxiosResponse<ICategoryAssistant[]> = await axios.get('/api/assistant/categories', {
			params: data,
		});
		return res.data;
	} catch (err: unknown) {
		if (err instanceof Error) {
			throw new Error(err.message);
		}
		throw new Error(String(err));
	}
}

