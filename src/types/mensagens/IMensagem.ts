export interface IMensagemDatas {
	msg: string | null;
	hora: string | null;
	enviado: string | null;
	inicio: string | null;
	prazo_limite: string | null;
	endo_inicial: string | null;
	endo_final: string | null;
}

export interface IMensagemStatusLeitura {
	lido: boolean;
	auto: boolean;
	data_lido: string | null;
}

export interface IMensagem {
	id: number;
	datas: IMensagemDatas;
	enviado_por: string;
	titulo: string;
	link: string | null;
	msg_texto: string;
	id_tipo: number;
	endo_imagem: string | null;
	status_leitura: IMensagemStatusLeitura;
}

export interface IMensagensResponse {
	success: boolean;
	data: IMensagem[];
	total: number;
}





