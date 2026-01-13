export interface ICaseCliente {
	sequencia: number;
	registro: number;
	data_solicitacao: string;
	cliente: number;
	cliente_nome?: string;
	incidente: number;
}

export interface ICaseClienteResponse {
	data: ICaseCliente[];
	total: number;
}

