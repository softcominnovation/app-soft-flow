import { cookies } from 'next/headers';
import axios from 'axios';
import { getBaseApiUrl } from '@/helpers/apiHelpers';
import { NextResponse } from 'next/server';

interface UpdateOrderRequest {
	updates: Array<{
		id: number;
		ordem: number;
	}>;
}

export async function PUT(request: Request) {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get('access_token');

		if (!token) {
			return NextResponse.json('Cookie não encontrado', { status: 400 });
		}

		const body: UpdateOrderRequest = await request.json();

		if (!body.updates || !Array.isArray(body.updates) || body.updates.length === 0) {
			return NextResponse.json('updates é obrigatório e deve ser um array não vazio', { status: 400 });
		}

		// Atualiza cada produto individualmente
		const updatePromises = body.updates.map((update) =>
			axios.patch(
				`${getBaseApiUrl()}/projeto-dev-produtos-ordem/${update.id}`,
				{
					ordem: update.ordem,
				},
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token.value}`,
					},
				}
			)
		);

		await Promise.all(updatePromises);

		return NextResponse.json({ message: 'Ordem atualizada com sucesso' }, { status: 200 });
	} catch (error: any) {
		console.log(error);
		const errorMessage = error.response?.data || error.message || 'Houve um erro ao atualizar a ordem';
		return NextResponse.json(errorMessage, { status: error.response?.status || 500 });
	}
}

