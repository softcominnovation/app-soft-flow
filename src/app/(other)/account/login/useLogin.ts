'use client';
import { authApi } from '@/common/api';
import { useNotificationContext } from '@/common/context';
import { useState } from 'react';
import { useAuthContext } from '@/common/context/useAuthContext';
import { useQuery } from '@/hooks';
import { buildFilterQueryString, extractCaseFiltersFromUrl, getStringValue } from '@/utils/caseFilterUtils';
import type { User } from '@/types/User';
import type { PermissoesUsuario } from '@/types/Permissions';
import { AxiosResponse } from 'axios';
import { useRouter } from 'next/navigation';
import * as yup from 'yup';

const PERMISSOES_STORAGE_KEY = 'user_permissoes';

export const loginFormSchema = yup.object({
	email: yup.string().email('Please enter valid email').required('Please enter email'),
	password: yup.string().required('Please enter password'),
});

export type LoginFormFields = yup.InferType<typeof loginFormSchema>;

export default function useLogin() {
	const [loading, setLoading] = useState(false);
	const navigate = useRouter();

	const { isAuthenticated, saveSession } = useAuthContext();
	const { showNotification } = useNotificationContext();

	const queryParams = useQuery();

	const login = async (values: LoginFormFields) => {
		setLoading(true);
		try {
			const res: AxiosResponse<{ message: string; data: any }> = await authApi.login(values);
			
			// Salva permissões no localStorage se estiverem presentes na resposta
			if (res.data?.data?.permissoes) {
				const permissoes: PermissoesUsuario = res.data.data.permissoes;
				if (typeof window !== 'undefined') {
					window.localStorage.setItem(PERMISSOES_STORAGE_KEY, JSON.stringify(permissoes));
				}
			}

			if (res.data?.data?.authorization?.token) {
				const caseId = getStringValue(
					queryParams['caseId'] || queryParams['case_id'] || queryParams['id']
				);
				const redirectTo = getStringValue(queryParams['redirectTo']);

				// Extrai filtros da URL usando utilitário centralizado
				const filters = extractCaseFiltersFromUrl(queryParams);
				const filterQueryString = buildFilterQueryString(filters);
				const filterQueryParam = filterQueryString ? `&${filterQueryString}` : '';

				// Determina o destino após login seguindo ordem de prioridade
				if (caseId) {
					navigate.push(`/apps/cases/list?caseId=${caseId}${filterQueryParam}`);
				} else if (redirectTo) {
					navigate.push(redirectTo);
				} else if (filterQueryString) {
					navigate.push(`/apps/cases/list?${filterQueryString}`);
				} else {
					navigate.push('/dashboards/analytics');
				}
			}
		} catch (error: any) {
			showNotification({ message: error.toString(), type: 'error' });
		} finally {
			setLoading(false);
		}
	};

	return { loading, login, isAuthenticated };
}
