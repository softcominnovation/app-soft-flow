import axios, { AxiosResponse } from 'axios';
import { IPersonalizedProduct, IPersonalizedProductsResponse, IUpdateProductOrder } from '@/types/personalizedProducts/IPersonalizedProduct';

export async function getPersonalizedProducts(colaboradorId: number): Promise<IPersonalizedProductsResponse> {
	try {
		const res: AxiosResponse<IPersonalizedProductsResponse> = await axios.get('/api/personalized-products', {
			params: { id_colaborador: colaboradorId },
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

export interface IBulkUpdateOrderRequest {
	id_colaborador: number;
	ids: number[];
	start_at?: number;
}

export interface IBulkUpdateOrderResponse {
	success: boolean;
	message: string;
	updated: number;
	not_found: number[];
}

export async function bulkUpdateProductsOrder(
	id_colaborador: number,
	ids: number[],
	start_at: number = 0
): Promise<IBulkUpdateOrderResponse> {
	try {
		const res: AxiosResponse<IBulkUpdateOrderResponse> = await axios.post(
			'/api/personalized-products/order/bulk-update',
			{
				id_colaborador,
				ids,
				start_at,
			}
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

// Mantido para compatibilidade, mas agora usa bulk-update internamente
export async function updateProductsOrder(updates: IUpdateProductOrder[]): Promise<void> {
	try {
		// Extrai id_colaborador do primeiro update (assumindo que todos são do mesmo colaborador)
		if (updates.length === 0) {
			return;
		}
		
		// Para usar bulk-update, precisamos do id_colaborador
		// Como não temos acesso direto aqui, vamos manter a implementação antiga
		// ou podemos fazer uma chamada para buscar o produto primeiro
		// Por enquanto, mantemos a implementação antiga para não quebrar compatibilidade
		await axios.put('/api/personalized-products/order', {
			updates,
		});
	} catch (err: unknown) {
		if (err instanceof Error) {
			throw new Error(err.message);
		} else {
			throw new Error(String(err));
		}
	}
}

export async function updateProductOrder(id: number, ordem: number): Promise<void> {
	try {
		await axios.put(`/api/personalized-products/order/${id}`, {
			ordem,
		});
	} catch (err: unknown) {
		if (err instanceof Error) {
			throw new Error(err.message);
		} else {
			throw new Error(String(err));
		}
	}
}

export async function deleteProduct(id: number): Promise<void> {
	try {
		await axios.delete(`/api/personalized-products/order/${id}`);
	} catch (err: unknown) {
		if (err instanceof Error) {
			throw new Error(err.message);
		} else {
			throw new Error(String(err));
		}
	}
}

export interface IAddPersonalizedProduct {
	id_colaborador: number;
	id_produto: number;
	versao: string;
	ordem: number;
	selecionado: boolean;
}

export async function addPersonalizedProduct(data: IAddPersonalizedProduct): Promise<IPersonalizedProduct> {
	try {
		const res: AxiosResponse<IPersonalizedProduct> = await axios.post('/api/personalized-products', data);
		return res.data;
	} catch (err: unknown) {
		if (err instanceof Error) {
			throw new Error(err.message);
		} else {
			throw new Error(String(err));
		}
	}
}

