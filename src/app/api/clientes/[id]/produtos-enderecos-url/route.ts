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
			return NextResponse.json('ID do cliente não encontrado', { status: 400 });
		}

		const { searchParams } = new URL(request.url);
		const registro = searchParams.get('registro');

		let url = `${getBaseApiUrl()}/clientes-produtos-enderecos-url`;
		if (registro) {
			url += `?registro=${registro}`;
		}

		const response = await axios.get(url, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token.value}`,
			},
		});

		return NextResponse.json(response.data, { status: 200 });
	} catch (error: any) {
		console.error('Erro ao buscar produtos/endereços/URLs do cliente via /api/clientes/[id]/produtos-enderecos-url:', error);
		if (axios.isAxiosError(error) && error.response) {
			return NextResponse.json(
				error.response.data || { message: 'Erro ao buscar produtos/endereços/URLs na API externa' },
				{ status: error.response.status }
			);
		}
		return NextResponse.json('Houve um erro ao se conectar com a API', { status: 500 });
	}
}

