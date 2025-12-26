import { cookies } from 'next/headers';
import axios from 'axios';
import { getBaseApiUrl } from '@/helpers/apiHelpers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get('access_token');

		if (!token) {
			return NextResponse.json('Cookie não encontrado', { status: 400 });
		}

		const url = new URL(request.url);
		const params = new URLSearchParams(url.search);
		const idColaborador = params.get('id_colaborador');

		if (!idColaborador) {
			return NextResponse.json('id_colaborador é obrigatório', { status: 400 });
		}

		const response = await axios.get(`${getBaseApiUrl()}/projeto-dev-produtos-ordem`, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token.value}`,
			},
			params: {
				id_colaborador: idColaborador,
			},
		});

		return NextResponse.json(response.data, { status: 200 });
	} catch (error: any) {
		console.log(error);
		const errorMessage = error.response?.data || error.message || 'Houve um erro ao se conectar com a API';
		return NextResponse.json(errorMessage, { status: error.response?.status || 500 });
	}
}

