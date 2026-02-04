import axios from 'axios';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getBaseApiUrl } from '@/helpers/apiHelpers';

export async function GET(request: Request) {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get('access_token');

		if (!token) {
			return NextResponse.json('Cookie nao encontrado', { status: 400 });
		}

		const url = new URL(request.url);
		const params = new URLSearchParams(url.search);
		const requestData = Object.fromEntries(params.entries());

		const userSetor = cookieStore.get('user_setor');
		
		console.log(userSetor);

		const response = await axios.get(`${getBaseApiUrl()}/auxiliar/projetos`, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token.value}`,
			},
			params: requestData,
		});

		return NextResponse.json(response.data, { status: 200 });
	} catch (error) {
		console.log(error);
		return NextResponse.json('Houve um erro ao se conectar com a API', { status: 500 });
	}
}

