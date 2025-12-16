import axios, { AxiosResponse } from 'axios';
import { ICaseEspecifiedResponse, ICaseResponse, ICreateAnotacaoResponse } from '@/types/cases/ICase';
import { ICaseProducaoResponse } from '@/types/cases/ICaseProducao';
import IAgendaDevAssistant from '@/types/assistant/IAgendaDevAssistant';

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

export async function finalizeCase(id: string): Promise<any> {
	try {
		const res = await axios.post(`/api/cases/finalizar/${id}`);
		return res.data;
	} catch (err: unknown) {
		if (err instanceof Error) {
			throw new Error(err.message);
		} else {
			throw new Error(String(err));
		}
	}
}

export async function diaryDevAssistant(id_colaborador: string): Promise<IAgendaDevAssistant[]> {
    try {
        const res = await axios.get('/api/assistant/agenda-dev', {
            params: { id_colaborador }
        });
        return res.data as IAgendaDevAssistant[];
    } catch (err: unknown) {
        if (err instanceof Error) {
            throw new Error(err.message);
        } else {
            throw new Error(String(err));
        }
    }
}

export async function createAnotacao(registro: number, anotacoes: string): Promise<ICreateAnotacaoResponse> {
	try {
		const res: AxiosResponse<ICreateAnotacaoResponse> = await axios.post('/api/cases/anotacoes', {
			registro,
			anotacoes,
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

export async function updateCase(id: string, data: any): Promise<any> {
	try {
		const res = await axios.patch(`/api/cases/${id}`, data);
		return res.data;
	} catch (err: unknown) {
		if (err instanceof Error) {
			throw new Error(err.message);
		} else {
			throw new Error(String(err));
		}
	}
}

export async function deleteCase(id: string): Promise<{ success: boolean; message: string }> {
	try {
		const res = await axios.delete(`/api/cases/${id}`);
		return res.data;
	} catch (err: unknown) {
		if (err instanceof Error) {
			throw new Error(err.message);
		} else {
			throw new Error(String(err));
		}
	}
}

export async function updateProducao(id: string, data: { tipo_producao: string; hora_abertura: string; hora_fechamento?: string; usuario_id: number; registro?: number; descricao?: string }): Promise<any> {
	try {
		const res = await axios.patch(`/api/cases/producao/${id}`, data);
		return res.data;
	} catch (err: unknown) {
		if (err instanceof Error) {
			throw new Error(err.message);
		} else {
			throw new Error(String(err));
		}
	}
}