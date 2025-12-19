import { ICaseFilter } from '@/types/cases/ICaseFilter';
import { UseFormReturn } from 'react-hook-form';
import type { AsyncSelectOption } from '@/hooks/useAsyncSelect';
import IUserAssistant from '@/types/assistant/IUserAssistant';
import IStatusAssistant from '@/types/assistant/IStatusAssistant';

interface UseCaseFiltersSearchProps {
	methods: UseFormReturn<ICaseFilter>;
	selectedUser: AsyncSelectOption<IUserAssistant> | null;
	selectedStatus: AsyncSelectOption<IStatusAssistant> | null;
	fetchCases: (payload: ICaseFilter, saveToStorage?: boolean) => void;
	onClearSelectedCases?: () => void;
}

/**
 * Hook para construir payload de busca e executar pesquisa
 */
export function useCaseFiltersSearch({
	methods,
	selectedUser,
	selectedStatus,
	fetchCases,
	onClearSelectedCases,
}: UseCaseFiltersSearchProps) {
	const buildSearchPayload = (data: ICaseFilter): ICaseFilter => {
		const trimmedCaseNumber = data.numero_caso?.trim();
		const hasSelectedUser = selectedUser !== null && selectedUser !== undefined && selectedUser.value;
		const usuarioId = hasSelectedUser ? String(selectedUser.value).trim() : '';

		const hasProdutoId = data.produto_id && data.produto_id.toString().trim() !== '';
		const hasVersaoProduto = data.versao_produto && data.versao_produto.trim() !== '';
		const hasSelectedStatus =
			selectedStatus !== null && selectedStatus !== undefined && selectedStatus.value;

		return trimmedCaseNumber
			? { numero_caso: trimmedCaseNumber }
			: {
					...(hasSelectedStatus &&
						data.status_descricao &&
						data.status_descricao.trim() !== '' && { status_descricao: data.status_descricao }),
					...(hasSelectedStatus && selectedStatus.value && { status_id: selectedStatus.value }),
					...(hasProdutoId && { produto_id: data.produto_id }),
					...(data.projeto_id && data.projeto_id.toString().trim() !== '' && { projeto_id: data.projeto_id }),
					...(hasVersaoProduto && { versao_produto: data.versao_produto }),
					...(usuarioId && usuarioId !== '' ? { usuario_dev_id: usuarioId } : {}),
					sort_by: 'prioridade',
				};
	};

	const onSearch = async (data: ICaseFilter) => {
		// Limpa os casos selecionados antes de fazer a pesquisa
		if (onClearSelectedCases) {
			onClearSelectedCases();
		}

		const payload = buildSearchPayload(data);
		fetchCases(payload, true);
	};

	return {
		onSearch,
		buildSearchPayload,
	};
}

