import axios, { AxiosResponse } from 'axios';
import { ICaseEspecifiedResponse, ICaseResponse, ICreateAnotacaoResponse, IUpdateAnotacaoResponse, IDeleteAnotacaoResponse } from '@/types/cases/ICase';
import { ICaseProducaoResponse } from '@/types/cases/ICaseProducao';
import IAgendaDevAssistant from '@/types/assistant/IAgendaDevAssistant';
import { ICaseClienteResponse } from '@/types/cases/ICaseCliente';

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

export async function cloneCase(id: string): Promise<any> {
	try {
		const res = await axios.post(`/api/cases/clonar/${id}`);
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

export async function updateAnotacao(id: number, anotacoes: string): Promise<IUpdateAnotacaoResponse> {
	try {
		const res: AxiosResponse<IUpdateAnotacaoResponse> = await axios.put(`/api/cases/anotacoes/${id}`, {
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

export async function deleteAnotacao(id: number): Promise<IDeleteAnotacaoResponse> {
	try {
		const res: AxiosResponse<IDeleteAnotacaoResponse> = await axios.delete(`/api/cases/anotacoes/${id}`);
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

export interface IBulkUpdateCaseRequest {
	ids: number[];
	AtribuidoPara?: number;
	Estado?: number;
	status?: number;
	TempoStatus?: string;
	DescricaoResumo?: string;
	DescricaoCompleta?: string;
	PassosParaReproduzir?: string;
	InformacoesAdicionais?: string;
	Projeto?: number;
	cronograma_id?: number;
	Relator?: number;
	Categoria?: number;
	Prioridade?: number;
	Resolucao?: number;
	TempoEstimado?: number;
	DataConclusao?: string;
	PrazoConclusao?: string;
	tamanho?: number;
	Modulo?: string;
	tipo_abertura?: string;
	versao_produto?: string;
	VersaoProduto?: string;
	produto_id?: string;
	atribuido_qa?: number;
}

export interface IBulkUpdateCaseResponse {
	success: boolean;
	message: string;
	updated: number;
	not_found: number[];
}

export async function bulkUpdateCases(data: IBulkUpdateCaseRequest): Promise<IBulkUpdateCaseResponse> {
	try {
		const res = await axios.post<IBulkUpdateCaseResponse>('/api/cases/bulk-update', data);
		return res.data;
	} catch (err: unknown) {
		if (err instanceof Error) {
			throw new Error(err.message);
		} else {
			throw new Error(String(err));
		}
	}
}

export async function getCaseClients(registro: number): Promise<ICaseClienteResponse> {
	try {
		const res: AxiosResponse<ICaseClienteResponse> = await axios.get(`/api/cases/${registro}/clientes`);
		return res.data;
	} catch (err: unknown) {
		// Preserva a estrutura do erro do axios para tratamento de permissões
		if (axios.isAxiosError(err)) {
			throw err;
		}
		if (err instanceof Error) {
			throw new Error(err.message);
		} else {
			throw new Error(String(err));
		}
	}
}

export async function createCaseClient(registro: number, cliente: number): Promise<any> {
	try {
		const res: AxiosResponse<any> = await axios.post(`/api/cases/${registro}/clientes`, {
			cliente,
		});
		return res.data;
	} catch (err: unknown) {
		// Preserva a estrutura do erro do axios para tratamento de permissões
		if (axios.isAxiosError(err)) {
			throw err;
		}
		if (err instanceof Error) {
			throw new Error(err.message);
		} else {
			throw new Error(String(err));
		}
	}
}

export async function deleteCaseClient(sequencia: number): Promise<{ message: string }> {
	try {
		const res: AxiosResponse<{ message: string }> = await axios.delete(`/api/projeto-casos-clientes/${sequencia}`);
		return res.data;
	} catch (err: unknown) {
		// Preserva a estrutura do erro do axios para tratamento de permissões
		if (axios.isAxiosError(err)) {
			throw err;
		}
		if (err instanceof Error) {
			throw new Error(err.message);
		} else {
			throw new Error(String(err));
		}
	}
}