export interface ICase {
	caso: Caso;
	produto: ProdutoCaso | null;
	projeto: ProjetoCaso | null;
	anotacoes?: Anotacao[] | null;
}

interface Caso {
	id: number;
	campos_adicionais: CamposAdicionais;
	caracteristicas: Caracteristicas;
	datas: DatasCaso;
	flags: FlagsCaso;
	flags_adicionais?: FlagsAdicionais;
	producao: Producao[] | null;
	quantidades_apontadas: QuantidadesApontadas;
	relacionamentos: RelacionamentosCaso;
	status: StatusCaso;
	tempos: TemposCaso;
	textos: TextosCaso;
	usuarios: UsuariosCaso;
	viabilidade?: Viabilidade;
	anotacoes?: Anotacao[] | null;
}

interface CamposAdicionais {
	usuario: string;
	versao_produto: string;
	modulo: string | null;
	equivalencia: string | null;
	tamanho: number | null;
	descricao_commit: string | null;
	liberacao: boolean;
	mostrar_teste: boolean;
	passos_para_reproduzir: string;
	prazo_conclusao: string | null;
}

interface Caracteristicas {
	tamanho_pontos: number | null;
	prioridade: string;
	categoria: number | null;
	tipo_categoria: "BUG" | "MELHORIA" | "TAREFA" | string | null;
	modulo: string | null;
	equivalencia: string | null;
	id_origem: number;
	tipo_origem: string | null;
	versao_produto: string;
}

interface DatasCaso {
	abertura: string;
	conclusao_dev: string | null;
	conclusao_qa: string | null;
	prazo_conclusao: string | null;
}

interface FlagsCaso {
	bloqueado: boolean;
	entregue: boolean;
	liberacao: boolean;
	mostrar_teste: boolean;
	nao_planejado: boolean;
	sinc: boolean;
}

interface FlagsAdicionais {
	lacrar?: boolean;
	reducao_chamados?: boolean;
	atualizacao_automatica?: boolean;
}

interface Viabilidade {
	viabilidade: boolean;
	entendido: boolean;
	realizavel: boolean;
	completo: boolean;
}

interface QuantidadesApontadas {
	retorno: number;
	testando: number;
	desenvolvendo: number;
	producao: number;
}

interface RelacionamentosCaso {
	dev_casos_id: number | null;
	faq_id: number | null;
	id_caso_pai: number | null;
	id_origem: number;
	relator: number;
	reuso_id: number | null;
	teste_faq_id: number | null;
	teste_valeu: number | null;
	tipo_origem: string | null;
	valeu_caso: number;
}

interface StatusCaso {
	id: string;
	codigo: string;
	descricao: string;
	estado: string;
	resolucao: string;
	status_id: string;
	status_tempo: string;
	status_tipo: string | null;
	tempo_status: string;
}

interface TemposCaso {
	estimado_minutos: number;
	realizado_minutos: number;
	retorno_minutos: number;
	testando_minutos: number;
	desenvolvendo_minutos: number;
	medio_faq_minutos: number | null;
	nao_planejado_minutos: number;
	status_tempo: string;
	tempo_status: string;
}

interface TextosCaso {
	descricao_resumo: string;
	descricao_completa: string;
	anexo: string;
	passos_para_reproduzir: string;
	descricao_commit: string | null;
	informacoes_adicionais?: string | null;
}

interface UsuariosCaso {
	abertura: Usuario;
	desenvolvimento: Usuario;
	qa: Usuario;
}

interface Usuario {
	id: number | string;
	nome: string | null;
}

interface ProdutoCaso {
	id: number | null;
	nome?: string | null;
	versao?: string | null;
}

interface ProjetoCaso {
	id: number | null;
	descricao?: string | null;
	datas: {
		inicial: string | null;
		final: string | null;
	};
}

export interface Producao {
	sequencia: number;
	registro: number;
	datas: {
		abertura: string;
		producao: string;
		fechamento: string;
	};
	tipo: string;
	usuario_id: number;
	usuario_nome: string | null;
	projeto_id: number;
	valeu_usuario_id: number;
	valeu_usuario_nome: string | null;
}

export interface ICaseResponse {
	data: ICase[];
	pagination: {
		has_more: boolean
		next_cursor: "string" 
		per_page: number
		prev_cursor: number | null
	}
}

export interface ICaseEspecifiedResponse {
	data: ICase;
}

export interface Anotacao {
	sequencia: number;
	registro: number;
	data_anotacao: string;
	anotacoes: string | null;
	usuario: string | null;
}

export interface ICreateAnotacaoResponse {
	message: string;
	data: {
		sequencia: number;
		registro: number;
		data_anotacao: string;
		usuario: string;
		anotacoes: string;
	};
}

export interface IUpdateAnotacaoResponse {
	message: string;
	data: {
		sequencia: number;
		registro: number;
		data_anotacao: string;
		usuario: string;
		anotacoes: string;
	};
}

export interface IDeleteAnotacaoResponse {
	message: string;
}