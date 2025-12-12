/**
 * Hook para normalizar valores de status para corresponder às opções disponíveis
 */

export type StatusOption = { value: string; label: string };

export const STATUS_OPTIONS: StatusOption[] = [
	{ value: 'ATRIBUIDO', label: 'ATRIBUIDO' },
	{ value: 'NOVO', label: 'NOVO' },
	{ value: 'AGUARDANDO TESTE', label: 'AGUARDANDO TESTE' },
	{ value: 'CONCLUIDO', label: 'CONCLUIDO' },
];

/**
 * Normaliza um valor de status para corresponder a uma das opções válidas
 */
export function normalizeStatus(statusValue: string | null | undefined): string {
	if (!statusValue) return '';

	const statusUpper = String(statusValue).toUpperCase().trim();

	// Tentar encontrar correspondência exata
	const exactMatch = STATUS_OPTIONS.find(
		opt => opt.value.toUpperCase() === statusUpper || opt.label.toUpperCase() === statusUpper
	);
	if (exactMatch) return exactMatch.value;

	// Tentar encontrar correspondência parcial
	const partialMatch = STATUS_OPTIONS.find(opt => {
		const optValue = opt.value.toUpperCase();
		return statusUpper.includes(optValue) || optValue.includes(statusUpper);
	});
	if (partialMatch) return partialMatch.value;

	// Mapeamento manual para casos comuns
	if (statusUpper.includes('ATRIBUIDO') || statusUpper.includes('ATRIBUÍDO')) {
		return 'ATRIBUIDO';
	}
	if (statusUpper.includes('NOVO')) {
		return 'NOVO';
	}
	if (statusUpper.includes('AGUARDANDO') || statusUpper.includes('TESTE')) {
		return 'AGUARDANDO TESTE';
	}
	if (statusUpper.includes('CONCLUIDO') || statusUpper.includes('CONCLUÍDO')) {
		return 'CONCLUIDO';
	}

	return statusUpper;
}

/**
 * Encontra a opção de status correspondente a um valor
 */
export function findStatusOption(value: string | null | undefined): StatusOption | null {
	if (!value) return null;
	return STATUS_OPTIONS.find(opt => 
		opt.value === value || 
		opt.value.toUpperCase() === String(value).toUpperCase() ||
		opt.label.toUpperCase() === String(value).toUpperCase()
	) || null;
}

