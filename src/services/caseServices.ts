import axios, { AxiosResponse } from 'axios';
import { ICaseEspecifiedResponse, ICaseResponse } from '@/types/cases/ICase';
import { ICaseProducaoResponse } from '@/types/cases/ICaseProducao';

export async function allCase(data: any): Promise<ICaseResponse> {
	try {
		const res: AxiosResponse<ICaseResponse> = await axios.get('/api/cases', {
			params: data,
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

export async function findCase(id: string): Promise<ICaseEspecifiedResponse> {
	try {
		const res: AxiosResponse<ICaseEspecifiedResponse> = await axios.get(`/api/cases/${id}`, {
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

export async function startTimeCase(id: string): Promise<ICaseProducaoResponse> {
	try {
		const res: AxiosResponse<ICaseProducaoResponse> = await axios.post(`/api/cases/start/${id}`, {
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

export async function stopTimeCase(id: string): Promise<ICaseProducaoResponse> {
	try {
		const res: AxiosResponse<ICaseProducaoResponse> = await axios.post(`/api/cases/stop/${id}`, {
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

export async function createCase(data: any): Promise<any> {
	try {
		const res = await axios.post('/api/cases', data);
		return res.data;
	} catch (err: unknown) {
		if (err instanceof Error) {
			throw new Error(err.message);
		} else {
			throw new Error(String(err));
		}
	}
}
