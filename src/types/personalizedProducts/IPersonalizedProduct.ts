export interface IPersonalizedProduct {
	id: number;
	id_colaborador: number;
	id_produto: number;
	versao: string;
	ordem: number;
	selecionado: boolean;
	nome_produto?: string; // Placeholder para quando a API retornar
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

