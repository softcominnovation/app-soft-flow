import { useState } from 'react';
import { findCase } from '@/services/caseServices';
import { ICase } from '@/types/cases/ICase';
import { toast } from 'react-toastify';

/**
 * Hook para gerenciar busca de caso por registro
 */
export function useCaseSearchByRegistro(onOpenCaseModal?: (caseData: ICase) => void) {
	const [registroValue, setRegistroValue] = useState('');
	const [loadingRegistro, setLoadingRegistro] = useState(false);

	const searchByRegistro = async (registro: string) => {
		const trimmedRegistro = registro.trim();
		if (!trimmedRegistro) {
			return;
		}

		if (!onOpenCaseModal) {
			toast.warning('Caso não encontrado');
			return;
		}

		setLoadingRegistro(true);
		try {
			const response = await findCase(trimmedRegistro);
			if (response?.data) {
				onOpenCaseModal(response.data);
				setRegistroValue('');
			} else {
				toast.warning('Caso não encontrado');
			}
		} catch (error: any) {
			console.error('Erro ao buscar caso:', error);
			toast.warning('Caso não encontrado');
		} finally {
			setLoadingRegistro(false);
		}
	};

	return {
		registroValue,
		setRegistroValue,
		loadingRegistro,
		searchByRegistro,
	};
}

