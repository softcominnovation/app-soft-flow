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

		const response = await axios.get(`${getBaseApiUrl()}/projeto-casos/${id}/clientes`, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token.value}`,
			},
		});

		return NextResponse.json(response.data, { status: 200 });
	} catch (error: any) {
		console.error('Erro ao buscar clientes do caso via /api/cases/[id]/clientes:', error);
		if (axios.isAxiosError(error) && error.response) {
			return NextResponse.json(
				error.response.data || { message: 'Erro ao buscar clientes na API externa' },
				{ status: error.response.status }
			);
		}
		return NextResponse.json('Houve um erro ao se conectar com a API', { status: 500 });
	}
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get('access_token');

		if (!token) {
			return NextResponse.json('Cookie não encontrado', { status: 400 });
		}

		const { id } = await params;

		if (!id) {
			return NextResponse.json('ID do caso não encontrado', { status: 400 });
		}

		const body = await request.json();
		const { cliente } = body;

		if (!cliente) {
			return NextResponse.json('ID do cliente não encontrado', { status: 400 });
		}

		const response = await axios.post(
			`${getBaseApiUrl()}/projeto-casos-clientes`,
			{
				registro: parseInt(id),
				cliente: parseInt(cliente),
			},
			{
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token.value}`,
				},
			}
		);

		return NextResponse.json(response.data, { status: 200 });
	} catch (error: any) {
		console.error('Erro ao criar cliente do caso via /api/cases/[id]/clientes:', error);
		if (axios.isAxiosError(error) && error.response) {
			return NextResponse.json(
				error.response.data || { message: 'Erro ao criar cliente do caso na API externa' },
				{ status: error.response.status }
			);
		}
		return NextResponse.json('Houve um erro ao se conectar com a API', { status: 500 });
	}
}
