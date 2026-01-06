export interface ICaseCliente {
	sequencia: number;
	registro: number;
	data_solicitacao: string;
	cliente: number;
	incidente: number;
}

export interface ICaseClienteResponse {
	data: ICaseCliente[];
	total: number;
}

