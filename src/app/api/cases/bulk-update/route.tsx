import { cookies } from 'next/headers';
import axios from 'axios';
import { getBaseApiUrl } from '@/helpers/apiHelpers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get('access_token');

		if (!token) {
			return NextResponse.json('Cookie não encontrado', { status: 400 });
		}

		const body = await request.json();

		// Validação: ids é obrigatório
		if (!body.ids || !Array.isArray(body.ids) || body.ids.length === 0) {
			return NextResponse.json(
				{ message: 'O campo ids (array) é obrigatório e deve conter pelo menos um ID.' },
				{ status: 400 }
			);
		}

		const response = await axios.post(
			`${getBaseApiUrl()}/projeto-casos/bulk-update`,
			body,
			{
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token.value}`,
				},
			}
		);

		return NextResponse.json(response.data, { status: 200 });
	} catch (error: any) {
		console.error('Erro ao atualizar casos em lote via /api/cases/bulk-update:', error);

		if (axios.isAxiosError(error) && error.response) {
			console.error('Resposta da API:', error.response.data);
			console.error('Status da API:', error.response.status);
			return NextResponse.json(
				error.response.data || { message: 'Erro ao atualizar casos na API externa' },
				{ status: error.response.status }
			);
		}

		return NextResponse.json(
			{ message: 'Houve um erro ao se conectar com a API', error: error.message },
			{ status: 500 }
		);
	}
}




