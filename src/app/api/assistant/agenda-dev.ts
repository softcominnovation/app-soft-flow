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
    const params = new URLSearchParams(url.search);
    const id_colaborador = params.get('id_colaborador');

    if (!id_colaborador || String(id_colaborador).trim() === '') {
      return NextResponse.json('id_colaborador é obrigatório', { status: 400 });
    }

    const response = await axios.get(`${getBaseApiUrl()}/auxiliar/agenda-dev`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.value}`,
      },
      params: { id_colaborador },
    });

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar /auxiliar/agenda-dev:', error);
    return NextResponse.json('Houve um erro ao se conectar com a API', { status: 500 });
  }
}
