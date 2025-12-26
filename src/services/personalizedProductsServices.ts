import axios, { AxiosResponse } from 'axios';
import { IPersonalizedProductsResponse, IUpdateProductOrder } from '@/types/personalizedProducts/IPersonalizedProduct';

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

export async function updateProductsOrder(updates: IUpdateProductOrder[]): Promise<void> {
	try {
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

