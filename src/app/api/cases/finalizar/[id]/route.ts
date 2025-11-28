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

		const url = new URL(request.url);
		const caseId = url.pathname.split('/').pop();

		if (!caseId) {
			return NextResponse.json('ID não encontrado', { status: 400 });
		}

		const response = await axios.post(
			`${getBaseApiUrl()}/projeto-casos/finalizar-caso/${caseId}`,
			{},
			{
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token.value}`,
				},
			}
		);

		return NextResponse.json(response.data, { status: 200 });
	} catch (error) {
		if (error instanceof axios.AxiosError && error.response) {
			if (error.status === 400) {
				return NextResponse.json(error.response.data, { status: 200 });
			}
		}
		return NextResponse.json('Houve um erro ao se conectar com a API', { status: 500 });
	}
}

