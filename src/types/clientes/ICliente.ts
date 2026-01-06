export interface ICliente {
	registro: number;
	nome: string;
	razao_social: string;
	cnpj: string;
	endereco: string;
	bairro: string;
	cidade: string;
	uf: string;
	cep: string;
	fone_resid: string;
	fone_com: string;
	email: string;
	data_cadastro: string;
	desativado: boolean;
}

export interface IClienteResponse {
	success: boolean;
	data: ICliente;
}

