import { cookies } from 'next/headers';
import axios from 'axios';
import { getBaseApiUrl } from '@/helpers/apiHelpers';
import { NextResponse } from 'next/server';

interface UpdateOrderRequest {
	ordem: number;
}

export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get('access_token');

		if (!token) {
			return NextResponse.json('Cookie não encontrado', { status: 400 });
		}

		const body: UpdateOrderRequest = await request.json();
		const { id } = await params;

		if (!id) {
			return NextResponse.json('id é obrigatório', { status: 400 });
		}

		if (body.ordem === undefined || body.ordem === null) {
			return NextResponse.json('ordem é obrigatória', { status: 400 });
		}

		await axios.put(
			`${getBaseApiUrl()}/projeto-dev-produtos-ordem/${id}`,
			{
				ordem: body.ordem,
			},
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token.value}`,
				},
			}
		);

		return NextResponse.json({ message: 'Ordem atualizada com sucesso' }, { status: 200 });
	} catch (error: any) {
		console.log(error);
		const errorMessage = error.response?.data || error.message || 'Houve um erro ao atualizar a ordem';
		return NextResponse.json(errorMessage, { status: error.response?.status || 500 });
	}
}

export async function DELETE(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get('access_token');

		if (!token) {
			return NextResponse.json('Cookie não encontrado', { status: 400 });
		}

		const { id } = await params;

		if (!id) {
			return NextResponse.json('id é obrigatório', { status: 400 });
		}

		await axios.delete(
			`${getBaseApiUrl()}/projeto-dev-produtos-ordem/${id}`,
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token.value}`,
				},
			}
		);

		return NextResponse.json({ message: 'Produto excluído com sucesso' }, { status: 200 });
	} catch (error: any) {
		console.log(error);
		const errorMessage = error.response?.data || error.message || 'Houve um erro ao excluir o produto';
		return NextResponse.json(errorMessage, { status: error.response?.status || 500 });
	}
}
