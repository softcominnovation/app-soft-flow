export interface IPersonalizedProduct {
	id: number;
	id_colaborador: number;
	id_produto: number;
	versao: string;
	ordem: number;
	selecionado: boolean;
	produto_nome?: string; // Nome do produto retornado pela API
	nome_produto?: string; // Mantido para compatibilidade
}

export interface IPersonalizedProductsResponse {
	data: IPersonalizedProduct[];
	pagination: {
		current_page: number;
		last_page: number;
		per_page: number;
		total: number;
	};
}

export interface IUpdateProductOrder {
	id: number;
	ordem: number;
}

