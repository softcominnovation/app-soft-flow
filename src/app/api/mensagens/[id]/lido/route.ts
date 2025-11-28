import { cookies } from 'next/headers';
import axios from 'axios';
import { getBaseApiUrl } from '@/helpers/apiHelpers';
import { NextResponse } from 'next/server';

export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get('access_token');

		if (!token) {
			return NextResponse.json({ success: false, message: 'Cookie não encontrado' }, { status: 400 });
		}

		const { id } = await params;
		const msgId = id;

		if (!msgId) {
			return NextResponse.json({ success: false, message: 'ID da mensagem não encontrado' }, { status: 400 });
		}

		const response = await axios.put(
			`${getBaseApiUrl()}/mensagens/${msgId}/lido`,
			{},
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token.value}`,
				},
			}
		);

		return NextResponse.json(response.data, { status: 200 });
	} catch (error: any) {
		console.log(error);
		if (error.response?.status === 404) {
			return NextResponse.json(
				{ success: false, message: error.response?.data?.message || 'Mensagem não encontrada' },
				{ status: 404 }
			);
		}
		return NextResponse.json(
			{ success: false, message: 'Houve um erro ao se conectar com a API' },
			{ status: 500 }
		);
	}
}

export async function PATCH(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	// PATCH funciona igual ao PUT
	return PUT(request, { params });
}

