import axios, { AxiosResponse } from 'axios';
import { IMensagensResponse } from '@/types/mensagens/IMensagem';

export interface IMensagensFilters {
	id?: number;
	lido?: boolean | number;
	data_msg_inicio?: string;
	data_msg_fim?: string;
}

export interface IMarcarLidaResponse {
	success: boolean;
	message: string;
}

export async function getMensagens(filters?: IMensagensFilters): Promise<IMensagensResponse> {
	try {
		const res: AxiosResponse<IMensagensResponse> = await axios.get('/api/mensagens', {
			params: filters,
		});
		return res.data;
	} catch (err: unknown) {
		if (err instanceof Error) {
			throw new Error(err.message);
		} else {
			throw new Error(String(err));
		}
	}
}

export async function marcarMensagemComoLida(msgId: number): Promise<IMarcarLidaResponse> {
	try {
		const res: AxiosResponse<IMarcarLidaResponse> = await axios.put(`/api/mensagens/${msgId}/lido`);
		return res.data;
	} catch (err: unknown) {
		if (err instanceof Error) {
			throw new Error(err.message);
		} else {
			throw new Error(String(err));
		}
	}
}

