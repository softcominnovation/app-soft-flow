import { NextResponse } from 'next/server';
import axios from 'axios';
import { getBaseApiUrl } from '@/helpers/apiHelpers';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
	const data: { email: string, password: string } = await request.json();

	try {

		const response = await axios.post(`${getBaseApiUrl()}/auth/login`, {
			"usuario": data.email,
			"senha": data.password,
		}, {
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (!response.data || !response.data.authorization || !response.data.user) {
			return NextResponse.json({ message: "Dados de resposta inválidos" }, { status: 400 });
		}

		const cookieStore = await cookies();

		const setCookie = (name: string, value: string, httpOnly: boolean = false) => {
			cookieStore.set(name, value, {
				httpOnly: httpOnly,
				path: '/',
				maxAge: 60 * 60 * 24, // 24 horas (86400 segundos) - tempo de expiração da sessão
			});
		};

		setCookie('access_token', response.data.authorization.token, true);
		setCookie('user_name', response.data.user.nome);
		setCookie('user_id', response.data.user.id.toString());
		setCookie('user_email', data.email);

		return NextResponse.json({ message: "Usuário logado com sucesso!" }, { status: 200 });
	} catch (error: any) {
		console.log(error)
		const errorMessage = error.response?.data || error.message || "Erro desconhecido";
		console.error('Erro durante a requisição de login:', errorMessage);
		return NextResponse.json({ message: "Erro durante o login", error: errorMessage }, { status: 500 });
	}
}
