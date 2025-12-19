import { ICase } from '@/types/cases/ICase';

/**
 * Interface para os valores do formulário que serão usados para atualizar o caso
 */
export interface CaseFormValues {
	projeto_id?: string;
	projeto?: string;
	prioridade?: string;
	versao?: string;
	categoria?: string;
	categoria_id?: string;
	origem_id?: string;
	origem?: string;
	modulo?: string;
	status?: {
		value?: string;
		label?: string;
	} | string | null;
	qa_id?: string;
	qa?: string;
	resumo?: string;
	descricao_completa?: string;
	informacoes_adicionais?: string;
	anexo?: string;
}

/**
 * Cria um objeto de caso atualizado com os novos valores do formulário
 * 
 * Esta função segue o princípio de responsabilidade única (SRP) do SOLID,
 * sendo responsável apenas pela transformação de dados do formulário em um objeto ICase atualizado.
 * 
 * @param caseData - Dados originais do caso
 * @param values - Valores do formulário que serão aplicados ao caso
 * @returns Objeto ICase atualizado com os novos valores
 */
export function createUpdatedCase(caseData: ICase, values: CaseFormValues): ICase {
	return {
		...caseData,
		produto: caseData.produto,
		projeto: values.projeto_id
			? {
					id: Number(values.projeto_id),
					descricao: values.projeto || caseData.projeto?.descricao || null,
					datas: {
						inicial: caseData.projeto?.datas?.inicial || null,
						final: caseData.projeto?.datas?.final || null,
					},
				}
			: caseData.projeto,
		caso: {
			...caseData.caso,
			caracteristicas: {
				...caseData.caso.caracteristicas,
				prioridade: values.prioridade || caseData.caso.caracteristicas.prioridade,
				versao_produto: values.versao || caseData.caso.caracteristicas.versao_produto,
				categoria: values.categoria_id ? Number(values.categoria_id) : (caseData.caso.caracteristicas.categoria || null),
				tipo_categoria: values.categoria || caseData.caso.caracteristicas.tipo_categoria,
				id_origem: values.origem_id ? Number(values.origem_id) : caseData.caso.caracteristicas.id_origem,
				tipo_origem: values.origem || caseData.caso.caracteristicas.tipo_origem,
				modulo: values.modulo || caseData.caso.caracteristicas.modulo,
			},
			status: {
				...caseData.caso.status,
				status_tipo: (() => {
					if (typeof values.status === 'object' && values.status !== null) {
						return values.status.value ?? caseData.caso.status.status_tipo;
					}
					if (typeof values.status === 'string') {
						return values.status;
					}
					return caseData.caso.status.status_tipo;
				})(),
				...(typeof values.status === 'object' && values.status !== null && values.status.value && { 
					registro: Number(values.status.value) 
				}),
			},
			usuarios: {
				...caseData.caso.usuarios,
				...(values.qa_id && {
					qa: {
						id: values.qa_id,
						nome: values.qa || caseData.caso.usuarios.qa?.nome || null,
					},
				}),
			},
			textos: {
				...caseData.caso.textos,
				descricao_resumo: values.resumo || '',
				descricao_completa: values.descricao_completa || '',
				informacoes_adicionais: values.informacoes_adicionais || '',
				anexo: values.anexo || '',
			},
		},
	};
}

