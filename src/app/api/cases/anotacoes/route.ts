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

		// Validação dos campos obrigatórios
		if (!body.registro) {
			return NextResponse.json({ message: 'O campo registro é obrigatório.' }, { status: 400 });
		}

		if (!body.anotacoes || (typeof body.anotacoes === 'string' && body.anotacoes.trim() === '')) {
			return NextResponse.json({ message: 'O campo anotacoes é obrigatório.' }, { status: 400 });
		}

		const response = await axios.post(
			`${getBaseApiUrl()}/projeto-casos-anotacoes`,
			{
				registro: body.registro,
				anotacoes: body.anotacoes,
			},
			{
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token.value}`,
				},
			}
		);

		return NextResponse.json(response.data, { status: response.status ?? 201 });
	} catch (error: any) {
		console.error('Erro ao criar anotação via /api/cases/anotacoes:', error);
		if (axios.isAxiosError(error) && error.response) {
			return NextResponse.json(error.response.data, { status: error.response.status });
		}
		return NextResponse.json('Houve um erro ao se conectar com a API', { status: 500 });
	}
}















