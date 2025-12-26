import { useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import { getPersonalizedProducts, updateProductsOrder } from '@/services/personalizedProductsServices';
import { IPersonalizedProduct } from '@/types/personalizedProducts/IPersonalizedProduct';

interface UsePersonalizedProductsReturn {
	products: IPersonalizedProduct[];
	loading: boolean;
	error: string | null;
	refreshProducts: () => Promise<void>;
	saveOrder: (orderedProducts: IPersonalizedProduct[]) => Promise<void>;
}

/**
 * Hook para gerenciar produtos personalizados do colaborador
 */
export function usePersonalizedProducts(): UsePersonalizedProductsReturn {
	const [products, setProducts] = useState<IPersonalizedProduct[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const loadProducts = useCallback(async () => {
		const colaboradorId = Cookies.get('user_id');
		if (!colaboradorId) {
			setError('Usuário não encontrado');
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const response = await getPersonalizedProducts(Number(colaboradorId));
			// Ordena por ordem
			const sortedProducts = [...response.data].sort((a, b) => a.ordem - b.ordem);
			setProducts(sortedProducts);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar produtos';
			setError(errorMessage);
			console.error('Erro ao carregar produtos personalizados:', err);
		} finally {
			setLoading(false);
		}
	}, []);

	const saveOrder = useCallback(async (orderedProducts: IPersonalizedProduct[]) => {
		setLoading(true);
		setError(null);

		try {
			const updates = orderedProducts.map((product, index) => ({
				id: product.id,
				ordem: index,
			}));

			await updateProductsOrder(updates);
			setProducts(orderedProducts);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Erro ao salvar ordem';
			setError(errorMessage);
			console.error('Erro ao salvar ordem dos produtos:', err);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadProducts();
	}, [loadProducts]);

	return {
		products,
		loading,
		error,
		refreshProducts: loadProducts,
		saveOrder,
	};
}

