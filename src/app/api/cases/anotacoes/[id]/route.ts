import { cookies } from 'next/headers';
import axios from 'axios';
import { getBaseApiUrl } from '@/helpers/apiHelpers';
import { NextResponse } from 'next/server';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get('access_token');

		if (!token) {
			return NextResponse.json('Cookie não encontrado', { status: 400 });
		}

		const { id } = await params;
		const body = await request.json();

		// Validação do campo obrigatório
		if (!body.anotacoes || (typeof body.anotacoes === 'string' && body.anotacoes.trim() === '')) {
			return NextResponse.json({ message: 'O campo anotacoes é obrigatório.' }, { status: 400 });
		}

		const response = await axios.put(
			`${getBaseApiUrl()}/projeto-casos-anotacoes/${id}`,
			{
				anotacoes: body.anotacoes,
			},
			{
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token.value}`,
				},
			}
		);

		return NextResponse.json(response.data, { status: response.status ?? 200 });
	} catch (error: any) {
		console.error('Erro ao atualizar anotação via /api/cases/anotacoes/[id]:', error);
		if (axios.isAxiosError(error) && error.response) {
			return NextResponse.json(error.response.data, { status: error.response.status });
		}
		return NextResponse.json('Houve um erro ao se conectar com a API', { status: 500 });
	}
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get('access_token');

		if (!token) {
			return NextResponse.json('Cookie não encontrado', { status: 400 });
		}

		const { id } = await params;
		const body = await request.json();

		// Validação do campo obrigatório
		if (!body.anotacoes || (typeof body.anotacoes === 'string' && body.anotacoes.trim() === '')) {
			return NextResponse.json({ message: 'O campo anotacoes é obrigatório.' }, { status: 400 });
		}

		const response = await axios.patch(
			`${getBaseApiUrl()}/projeto-casos-anotacoes/${id}`,
			{
				anotacoes: body.anotacoes,
			},
			{
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token.value}`,
				},
			}
		);

		return NextResponse.json(response.data, { status: response.status ?? 200 });
	} catch (error: any) {
		console.error('Erro ao atualizar anotação via /api/cases/anotacoes/[id]:', error);
		if (axios.isAxiosError(error) && error.response) {
			return NextResponse.json(error.response.data, { status: error.response.status });
		}
		return NextResponse.json('Houve um erro ao se conectar com a API', { status: 500 });
	}
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get('access_token');

		if (!token) {
			return NextResponse.json('Cookie não encontrado', { status: 400 });
		}

		const { id } = await params;

		const response = await axios.delete(
			`${getBaseApiUrl()}/projeto-casos-anotacoes/${id}`,
			{
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token.value}`,
				},
			}
		);

		return NextResponse.json(response.data, { status: response.status ?? 200 });
	} catch (error: any) {
		console.error('Erro ao deletar anotação via /api/cases/anotacoes/[id]:', error);
		if (axios.isAxiosError(error) && error.response) {
			return NextResponse.json(error.response.data, { status: error.response.status });
		}
		return NextResponse.json('Houve um erro ao se conectar com a API', { status: 500 });
	}
}

