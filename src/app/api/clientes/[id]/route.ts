import { cookies } from 'next/headers';
import axios from 'axios';
import { getBaseApiUrl } from '@/helpers/apiHelpers';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get('access_token');

		if (!token) {
			return NextResponse.json('Cookie não encontrado', { status: 400 });
		}

		const { id } = await params;

		if (!id) {
			return NextResponse.json('ID não encontrado', { status: 400 });
		}

		const response = await axios.get(`${getBaseApiUrl()}/clientes/${id}`, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token.value}`,
			},
		});

		return NextResponse.json(response.data, { status: 200 });
	} catch (error: any) {
		console.error('Erro ao buscar cliente via /api/clientes/[id]:', error);
		if (axios.isAxiosError(error) && error.response) {
			return NextResponse.json(
				error.response.data || { message: 'Erro ao buscar cliente na API externa' },
				{ status: error.response.status }
			);
		}
		return NextResponse.json('Houve um erro ao se conectar com a API', { status: 500 });
	}
}

