import type { PermissoesUsuario } from '@/types/Permissions';

const PERMISSOES_STORAGE_KEY = 'user_permissoes';

/**
 * Obtém as permissões do usuário do localStorage
 */
export function getPermissoes(): PermissoesUsuario | null {
	if (typeof window === 'undefined') {
		return null;
	}

	const stored = window.localStorage.getItem(PERMISSOES_STORAGE_KEY);
	if (!stored) {
		return null;
	}

	try {
		return JSON.parse(stored) as PermissoesUsuario;
	} catch (error) {
		console.error('Erro ao fazer parse das permissões:', error);
		return null;
	}
}

/**
 * Verifica se o usuário tem uma permissão específica
 * @param permissao - Nome da permissão a verificar (ex: "cli", "tel", "sof")
 */
export function hasPermissao(permissao: string): boolean {
	const permissoes = getPermissoes();
	if (!permissoes) {
		return false;
	}

	// Verifica nas permissões ativas (array)
	if (permissoes.permissoes_ativas?.includes(permissao)) {
		return true;
	}

	// Verifica no objeto todas_permissoes
	if (permissoes.todas_permissoes?.[permissao] === true) {
		return true;
	}

	return false;
}

/**
 * Verifica se o usuário tem todas as permissões especificadas
 */
export function hasTodasPermissoes(permissoesList: string[]): boolean {
	return permissoesList.every((permissao) => hasPermissao(permissao));
}

/**
 * Verifica se o usuário tem pelo menos uma das permissões especificadas
 */
export function hasQualquerPermissao(permissoesList: string[]): boolean {
	return permissoesList.some((permissao) => hasPermissao(permissao));
}

/**
 * Remove as permissões do localStorage (útil no logout)
 */
export function removePermissoes(): void {
	if (typeof window !== 'undefined') {
		window.localStorage.removeItem(PERMISSOES_STORAGE_KEY);
	}
}

