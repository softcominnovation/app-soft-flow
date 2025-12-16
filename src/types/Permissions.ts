export interface PermissoesUsuario {
	permissoes_ativas: string[];
	todas_permissoes: Record<string, boolean>;
	nome_suporte?: string;
	total_ativas?: number;
	total_permissoes?: number;
}



