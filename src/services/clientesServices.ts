import axios, { AxiosResponse } from 'axios';
import { IClienteResponse } from '@/types/clientes/ICliente';
import { IClienteProdutoEnderecoUrlResponse } from '@/types/clientes/IClienteProdutoEnderecoUrl';

export async function getClienteById(id: number): Promise<IClienteResponse> {
	try {
		const res: AxiosResponse<IClienteResponse> = await axios.get(`/api/clientes/${id}`);
		return res.data;
	} catch (err: unknown) {
		if (err instanceof Error) {
			throw new Error(err.message);
		} else {
			throw new Error(String(err));
		}
	}
}

export async function getClienteProdutosEnderecosUrl(registro: number): Promise<IClienteProdutoEnderecoUrlResponse> {
	try {
		const res: AxiosResponse<IClienteProdutoEnderecoUrlResponse> = await axios.get(
			`/api/clientes/${registro}/produtos-enderecos-url?registro=${registro}`
		);
		return res.data;
	} catch (err: unknown) {
		if (err instanceof Error) {
			throw new Error(err.message);
		} else {
			throw new Error(String(err));
		}
	}
}

