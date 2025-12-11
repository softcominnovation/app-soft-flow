'use client';
const useQuery = () => {
	if (typeof window === 'undefined') {
		return {};
	}
	
	const urlSearchParams = new URLSearchParams(window.location.search);
	const result: Record<string, string | string[]> = {};
	const seenKeys = new Set<string>();
	
	// Itera sobre todas as chaves
	for (const key of urlSearchParams.keys()) {
		// Remove [] do final da chave se existir (status_id[] -> status_id)
		const cleanKey = key.replace(/\[\]$/, '');
		
		if (seenKeys.has(cleanKey)) continue;
		seenKeys.add(cleanKey);
		
		// Obtém todos os valores para esta chave
		const allValues = urlSearchParams.getAll(key);
		
		// Se houver múltiplos valores, mantém como array, senão como string
		result[cleanKey] = allValues.length > 1 ? allValues : allValues[0];
	}
	
	return result;
};

export default useQuery;
