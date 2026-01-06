export interface IClienteProdutoEnderecoUrl {
	seq: number;
	registro: number;
	produto_id: number;
	produto_nome: string;
	url: string;
	usuario: string | null;
	senha: string | null;
	observacao: string | null;
	alteracao_usuario: string;
	alteracao_datahora: string;
}

export interface IClienteProdutoEnderecoUrlResponse {
	data: IClienteProdutoEnderecoUrl[];
	total: number;
}

