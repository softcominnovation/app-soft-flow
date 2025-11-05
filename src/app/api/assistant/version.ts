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
        const requestData = Object.fromEntries(params.entries());

        // Validar se produto_id foi fornecido
        if (!requestData.produto_id) {
            return NextResponse.json('produto_id é obrigatório', { status: 400 });
        }
        
        const response = await axios.get(`${getBaseApiUrl()}/auxiliar/versoes`, {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token.value}`,
            },
            params: requestData,
        });

        return NextResponse.json(response.data, { status: 200 });
    } catch (error) {
        console.error('Erro ao buscar versões:', error);
        return NextResponse.json('Houve um erro ao se conectar com a API', { status: 500 });
    }
}