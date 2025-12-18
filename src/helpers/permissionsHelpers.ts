import type { PermissoesUsuario } from '@/types/Permissions';

const PERMISSOES_STORAGE_KEY = 'user_permissoes';

/**
 * Verifica se todas as permissões estão habilitadas via variável de ambiente
 */
function isAllPermissionsEnabled(): boolean {
	if (typeof window === 'undefined') {
		// No servidor, verifica process.env diretamente
		return process.env.NEXT_PUBLIC_ENABLE_ALL_PERMISSIONS === 'true';
	}
	// No cliente, acessa via process.env (Next.js expõe NEXT_PUBLIC_* no cliente)
	return process.env.NEXT_PUBLIC_ENABLE_ALL_PERMISSIONS === 'true';
}

/**
 * Obtém as permissões do usuário do localStorage
 */
export function getPermissoes(): PermissoesUsuario | null {
	if (typeof window === 'undefined') {
		return null;
	}

	const stored = window.localStorage.getItem(PERMISSOES_STORAGE_KEY);
	if (!stored) {
		console.warn(`Aviso: Nenhuma permissão encontrada no localStorage sob a chave "${PERMISSOES_STORAGE_KEY}"`);
		return null;
	}

	try {
		const parsed = JSON.parse(stored);
		return parsed as PermissoesUsuario;
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
	// Se todas as permissões estão habilitadas via env, retorna true
	if (isAllPermissionsEnabled()) {
		return true;
	}

	const rawPermissoes = getPermissoes();
	if (!rawPermissoes) {
		return false;
	}

	// Normaliza a string para comparação: apenas letras e números
	const normalize = (s: any) => {
		if (typeof s !== 'string') return '';
		return s.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
	};
	
	const permissaoNormalized = normalize(permissao);

	// Tenta encontrar a lista de permissões em qualquer lugar do objeto (recursivo simples)
	const findInObject = (obj: any): boolean => {
		if (!obj || typeof obj !== 'object') return false;

		// 1. Se for um array, procura a permissão nele
		if (Array.isArray(obj)) {
			if (obj.some(p => typeof p === 'string' && normalize(p) === permissaoNormalized)) {
				return true;
			}
		}

		// 2. Se tiver a propriedade permissoes_ativas, verifica nela
		if (obj.permissoes_ativas) {
			const ativas = obj.permissoes_ativas;
			const listaAtivas = Array.isArray(ativas) ? ativas : (typeof ativas === 'object' && ativas !== null ? Object.values(ativas) : []);
			if (listaAtivas.some((p: any) => normalize(p) === permissaoNormalized)) {
				return true;
			}
		}

		// 3. Se tiver a propriedade todas_permissoes, verifica nela
		if (obj.todas_permissoes) {
			const todas = obj.todas_permissoes;
			const keys = Object.keys(todas);
			const keyMatch = keys.find(k => normalize(k) === permissaoNormalized);
			if (keyMatch) {
				const value = (todas as any)[keyMatch];
				if (value === true || value === 'true' || value === 1 || value === '1') {
					return true;
				}
			}
		}

		// 4. Procura em sub-objetos (ex: obj.permissoes ou obj.data)
		for (const key of Object.keys(obj)) {
			const val = obj[key];
			if (val && typeof val === 'object' && key !== 'todas_permissoes' && key !== 'permissoes_ativas') {
				if (findInObject(val)) return true;
			}
		}

		// 5. Caso especial: o próprio objeto tem chaves que são nomes de permissões
		const keyMatch = Object.keys(obj).find(k => normalize(k) === permissaoNormalized);
		if (keyMatch) {
			const value = obj[keyMatch];
			if (value === true || value === 'true' || value === 1 || value === '1') {
				return true;
			}
		}

		return false;
	};

	return findInObject(rawPermissoes);
}

/**
 * Verifica se o usuário tem todas as permissões especificadas
 */
export function hasTodasPermissoes(permissoesList: string[]): boolean {
	// Se todas as permissões estão habilitadas via env, retorna true
	if (isAllPermissionsEnabled()) {
		return true;
	}
	return permissoesList.every((permissao) => hasPermissao(permissao));
}

/**
 * Verifica se o usuário tem pelo menos uma das permissões especificadas
 */
export function hasQualquerPermissao(permissoesList: string[]): boolean {
	// Se todas as permissões estão habilitadas via env, retorna true
	if (isAllPermissionsEnabled()) {
		return true;
	}
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

