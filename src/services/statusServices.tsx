import axios, { AxiosResponse } from 'axios';

export interface IStatusAssistant {
	Registro: number;
	tipo: string;
	descricao: string;
}

export async function assistant(data?: { search?: string }): Promise<IStatusAssistant[]> {
	try {
		const res: AxiosResponse<IStatusAssistant[]> = await axios.get('/api/assistant/status', {
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


