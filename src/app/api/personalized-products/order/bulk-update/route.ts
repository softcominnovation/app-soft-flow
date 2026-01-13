import { cookies } from 'next/headers';
import axios from 'axios';
import { getBaseApiUrl } from '@/helpers/apiHelpers';
import { NextResponse } from 'next/server';

interface BulkUpdateOrderRequest {
	id_colaborador: number;
	ids: number[];
	start_at: number;
}

export async function POST(request: Request) {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get('access_token');

		if (!token) {
			return NextResponse.json('Cookie não encontrado', { status: 400 });
		}

		const body: BulkUpdateOrderRequest = await request.json();

		if (!body.id_colaborador || !body.ids || !Array.isArray(body.ids) || body.ids.length === 0) {
			return NextResponse.json(
				'id_colaborador e ids (array não vazio) são obrigatórios',
				{ status: 400 }
			);
		}

		const response = await axios.post(
			`${getBaseApiUrl()}/projeto-dev-produtos-ordem/bulk-update-ordem`,
			{
				id_colaborador: body.id_colaborador,
				ids: body.ids,
				start_at: body.start_at ?? 0,
			},
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token.value}`,
				},
			}
		);

		return NextResponse.json(response.data, { status: 200 });
	} catch (error: any) {
		console.error('Erro ao atualizar ordem em lote:', error);
		const errorMessage = error.response?.data || error.message || 'Houve um erro ao atualizar a ordem em lote';
		return NextResponse.json(errorMessage, { status: error.response?.status || 500 });
	}
}





