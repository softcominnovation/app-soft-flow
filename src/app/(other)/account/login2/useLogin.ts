'use client';
import { authApi } from '@/common/api';
import { useNotificationContext } from '@/common/context';
import { useState } from 'react';
import { useAuthContext } from '@/common/context/useAuthContext';
import type { User } from '@/types/User';
import { AxiosResponse } from 'axios';
import { useRouter } from 'next/navigation';
import * as yup from 'yup';
import { useQuery } from '@/hooks';

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
			const res: AxiosResponse<User> = await authApi.login(values);
			showNotification({message: "Usuário logado com sucesso", type: 'success'});
			saveSession(true);
			
			const caseId = queryParams['caseId'] || queryParams['case_id'] || queryParams['id'];
			const redirectTo = queryParams['redirectTo'];
			
			// Se houver um ID de caso, redireciona para a página de casos com o ID
			if (caseId) {
				navigate.push(`/apps/cases/list?caseId=${caseId}`);
			} else if (redirectTo) {
				navigate.push(redirectTo);
			} else {
				navigate.push('/apps/cases/list');
			}
		} catch (error: any) {
			saveSession(true);
			showNotification({ message: "Usuário inválido", type: 'error' });
		} finally {
			setLoading(false);
		}
	};

	return { loading, login, isAuthenticated };
}
