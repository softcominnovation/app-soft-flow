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
		const caseId = url.pathname.split('/').pop();

		if (!caseId) {
			return NextResponse.json('ID não encontrado', { status: 400 });
		}

		const response = await axios.get(`${getBaseApiUrl()}/projeto-memoria/${caseId}`, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token.value}`,
			}
		});

		return NextResponse.json(response.data, { status: 200 });
	} catch (error) {
		console.log(error);
		return NextResponse.json('Houve um erro ao se conectar com a API', { status: 500 });
	}
}

export async function PUT(request: Request) {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get('access_token');

		if (!token) {
			return NextResponse.json('Cookie não encontrado', { status: 400 });
		}

		const url = new URL(request.url);
		const caseId = url.pathname.split('/').pop();

		if (!caseId) {
			return NextResponse.json('ID não encontrado', { status: 400 });
		}

		const body = await request.json();

		const response = await axios.put(
			`${getBaseApiUrl()}/projeto-casos/${caseId}`,
			body,
			{
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token.value}`,
				},
			}
		);

		return NextResponse.json(response.data, { status: response.status ?? 200 });
	} catch (error: any) {
		console.error('Erro ao atualizar caso via /api/cases/[id]:', error);
		if (axios.isAxiosError(error) && error.response) {
			return NextResponse.json(error.response.data, { status: error.response.status });
		}
		return NextResponse.json('Houve um erro ao se conectar com a API', { status: 500 });
	}
}

export async function PATCH(request: Request) {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get('access_token');

		if (!token) {
			return NextResponse.json('Cookie não encontrado', { status: 400 });
		}

		const url = new URL(request.url);
		const caseId = url.pathname.split('/').pop();

		if (!caseId) {
			return NextResponse.json('ID não encontrado', { status: 400 });
		}

		const body = await request.json();

		const response = await axios.patch(
			`${getBaseApiUrl()}/projeto-casos/${caseId}`,
			body,
			{
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token.value}`,
				},
			}
		);

		return NextResponse.json(response.data, { status: response.status ?? 200 });
	} catch (error: any) {
		console.error('Erro ao atualizar caso via /api/cases/[id]:', error);
		if (axios.isAxiosError(error) && error.response) {
			return NextResponse.json(error.response.data, { status: error.response.status });
		}
		return NextResponse.json('Houve um erro ao se conectar com a API', { status: 500 });
	}
}

export async function DELETE(request: Request) {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get('access_token');

		if (!token) {
			return NextResponse.json('Cookie não encontrado', { status: 400 });
		}

		const url = new URL(request.url);
		const caseId = url.pathname.split('/').pop();

		if (!caseId) {
			return NextResponse.json('ID não encontrado', { status: 400 });
		}

		const response = await axios.delete(
			`${getBaseApiUrl()}/projeto-casos/${caseId}`,
			{
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token.value}`,
				},
			}
		);

		return NextResponse.json(
			{ success: true, message: 'Caso excluído com sucesso' },
			{ status: 200 }
		);
	} catch (error: any) {
		console.error('Erro ao excluir caso via /api/cases/[id]:', error);
		if (axios.isAxiosError(error) && error.response) {
			return NextResponse.json(error.response.data, { status: error.response.status });
		}
		return NextResponse.json('Houve um erro ao se conectar com a API', { status: 500 });
	}
}