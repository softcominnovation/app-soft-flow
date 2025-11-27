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
		
		// Preserva arrays de parâmetros (ex: status_id[]=1&status_id[]=2 ou status_id=1&status_id=2)
		const requestData: Record<string, any> = {};
		const seenKeys = new Set<string>();
		
		for (const key of params.keys()) {
			// Remove [] do final da chave se existir (status_id[] -> status_id)
			const cleanKey = key.replace(/\[\]$/, '');
			
			if (seenKeys.has(cleanKey)) continue;
			seenKeys.add(cleanKey);
			
			// Verifica se há múltiplos valores para esta chave
			const allValues = params.getAll(key);
			requestData[cleanKey] = allValues.length > 1 ? allValues : allValues[0];
		}
		
		const response = await axios.get(`${getBaseApiUrl()}/projeto-memoria`, {
			headers: {
				'Content-Type': 'application/json',
				"Authorization": `Bearer ${token.value}`,
			},
			params: requestData,
		});

		return NextResponse.json(response.data, { status: 200 });
	} catch (error) {
		console.log(error);
		return NextResponse.json('Houve um erro ao se conectar com a API', { status: 500 });
	}
}

export async function POST(request: Request) {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get('access_token');

		if (!token) {
			return NextResponse.json('Cookie não encontrado', { status: 400 });
		}

		const body = await request.json();

			// server-side validation: require all fields except Anexo
			const requiredFields: { key: string; message: string }[] = [
				{ key: 'Projeto', message: 'O campo Projeto (id do Produto) é obrigatório.' },
				{ key: 'AtribuidoPara', message: 'O campo Atribuído Para (id do Usuário) é obrigatório.' },
				{ key: 'Relator', message: 'O campo Relator (id do Usuário) é obrigatório.' },
				{ key: 'Prioridade', message: 'O campo Prioridade (1,2,3,4,5,6,7,8,9,10) é obrigatório.' },
				{ key: 'VersaoProduto', message: 'O campo Versão do Produto é obrigatório.' },
				{ key: 'DescricaoResumo', message: 'O campo Descrição Resumo é obrigatório.' },
				{ key: 'DescricaoCompleta', message: 'O campo Descrição Completa é obrigatório.' },
				{ key: 'Cronograma_id', message: 'O campo Cronograma (id do projeto) é obrigatório.' },
				{ key: 'Id_Origem', message: 'O campo ID Origem é obrigatório.' },
				{ key: 'Id_Usuario_AberturaCaso', message: 'O campo ID Usuário Abertura Caso é obrigatório.' },
			];

			const errors: Record<string, string[]> = {};
			for (const f of requiredFields) {
				const val = body[f.key];
				if (val === undefined || val === null || (typeof val === 'string' && String(val).trim() === '')) {
					errors[f.key] = [f.message];
				}
			}

			if (Object.keys(errors).length > 0) {
				return NextResponse.json({ message: 'Validation failed', errors }, { status: 400 });
			}

		const response = await axios.post(`${getBaseApiUrl()}/projeto-casos`, body, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token.value}`,
			},
		});

		return NextResponse.json(response.data, { status: response.status ?? 200 });
	} catch (error: any) {
		console.error('Erro ao criar caso via /api/cases:', error);
		if (axios.isAxiosError(error) && error.response) {
			return NextResponse.json(error.response.data, { status: error.response.status });
		}
		return NextResponse.json('Houve um erro ao se conectar com a API', { status: 500 });
	}
}
