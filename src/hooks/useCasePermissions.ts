import { useMemo } from 'react';
import { ICase } from '@/types/cases/ICase';
import { hasPermissao } from '@/helpers/permissionsHelpers';

export interface CasePermissions {
	// Bloqueios principais
	bloq: boolean; // Caso bloqueado
	bloqAdm: boolean; // Bloqueio administrativo
	bloqEstado: boolean; // Bloqueio de estado
	bloqAbrirCaso: boolean; // Bloqueio para abrir caso
	
	// Permissões de campos específicos
	canEditProjeto: boolean;
	canEditVersaoProduto: boolean;
	canEditCategoria: boolean;
	canEditRelator: boolean;
	canEditPrioridade: boolean;
	canEditModulo: boolean;
	canEditCronograma: boolean;
	canEditDescricaoResumo: boolean;
	canEditDescricaoCompleta: boolean;
	canEditAnexo: boolean;
	canEditInformacoesAdicionais: boolean;
	canEditResolucao: boolean;
	canEditEstado: boolean;
	canEditAtribuidoPara: boolean;
	canEditValeuCaso: boolean;
	canEditTesteFaqID: boolean;
	canEditTesteValeu: boolean;
	canEditProducao: boolean;
	
	// Permissões de botões
	canSave: boolean;
	canFinalize: boolean;
	canDelete: boolean;
	canDuplicate: boolean;
	canDetail: boolean;
}

/**
 * Hook para calcular permissões de edição de caso baseado na lógica do Access/VBA
 * @param caseData - Dados do caso
 * @returns Objeto com todas as permissões calculadas
 */
export function useCasePermissions(caseData: ICase | null): CasePermissions {
	return useMemo(() => {
		if (!caseData) {
			// Se não houver caso, tudo bloqueado
			return {
				bloq: true,
				bloqAdm: true,
				bloqEstado: true,
				bloqAbrirCaso: true,
				canEditProjeto: false,
				canEditVersaoProduto: false,
				canEditCategoria: false,
				canEditRelator: false,
				canEditPrioridade: false,
				canEditModulo: false,
				canEditCronograma: false,
				canEditDescricaoResumo: false,
				canEditDescricaoCompleta: false,
				canEditAnexo: false,
				canEditInformacoesAdicionais: false,
				canEditResolucao: false,
				canEditEstado: false,
				canEditAtribuidoPara: false,
				canEditValeuCaso: false,
				canEditTesteFaqID: false,
				canEditTesteValeu: false,
				canEditProducao: false,
				canSave: false,
				canFinalize: false,
				canDelete: false,
				canDuplicate: false,
				canDetail: false,
			};
		}

		// Verifica permissões do usuário
		const projetoAdm = hasPermissao('ProjetoAdm');
		const projetoVerCasosEstatistica = hasPermissao('ProjetoVerCasosEstatistica');
		const projetoEstado = hasPermissao('Projeto_Estado');
		const projetoCadastroProduto = hasPermissao('ProjetoCadastroProduto');
		const projetoRelatarCasos = hasPermissao('Projeto_RelatarCasos');
		const casosAbaTestador = hasPermissao('Casos_AbaTestador');

		// Flags do caso
		const bloqueado = caseData.caso.flags.bloqueado;
		// Nota: Não encontrei campo "Lacrar" no tipo ICase, assumindo que não existe ou está em outro lugar
		// Se existir, deve ser verificado aqui: const lacrar = caseData.caso.flags.lacrar || 0;
		const resolucao = caseData.caso.status.resolucao;

		// Calcula bloqueios principais (baseado na lógica VBA)
		let bloq = bloqueado;
		const bloqAbrirCaso = false; // Sempre false conforme código comentado no VBA
		
		// Se o caso estiver lacrado (se existir), tudo fica bloqueado
		// Por enquanto, assumindo que não existe campo lacrar
		const lacrar = false; // TODO: Verificar se existe campo lacrar no caso
		
		let bloqAdm: boolean;
		let bloqEstado: boolean;

		if (lacrar) {
			// Se lacrado, tudo bloqueado
			bloq = true;
			bloqAdm = true;
			bloqEstado = true;
		} else {
			// Calcula Bloq_Adm
			// Se (ProjetoAdm = 0 And ProjetoVerCasosEstatistica = 0) Or Me.Bloqueado <> 0
			if ((!projetoAdm && !projetoVerCasosEstatistica) || bloqueado) {
				bloqAdm = true;
			} else {
				bloqAdm = false;
			}

			// Calcula Bloq_Estado
			// Se (Projeto_Estado <> 0 Or ProjetoVerCasosEstatistica <> 0) Or Me.Bloqueado <> 0
			// Então Bloq_Estado = False, senão True
			if ((projetoEstado || projetoVerCasosEstatistica) || bloqueado) {
				bloqEstado = false;
			} else {
				bloqEstado = true;
			}
		}

		// Calcula permissões de campos específicos
		// Baseado na lógica: Me.Campo.Locked = condição
		const canEditProjeto = !bloqAdm;
		const canEditVersaoProduto = !bloq;
		const canEditCategoria = !bloqAdm && !bloqAbrirCaso;
		const canEditRelator = !bloqAdm && !bloqAbrirCaso;
		const canEditPrioridade = !bloqAdm;
		const canEditModulo = !bloqAdm && !bloqAbrirCaso;
		const canEditCronograma = !bloqAdm && !bloqAbrirCaso;
		const canEditDescricaoResumo = !bloqAdm && !bloqAbrirCaso;
		const canEditDescricaoCompleta = !bloqAdm && !bloqAbrirCaso;
		const canEditAnexo = !bloqAdm && !bloqAbrirCaso;
		const canEditInformacoesAdicionais = !bloq;
		const canEditResolucao = !bloq;
		const canEditEstado = !bloqEstado;
		const canEditAtribuidoPara = !bloq && !bloqAbrirCaso;
		const canEditValeuCaso = !bloq;
		const canEditTesteFaqID = !bloq;
		const canEditTesteValeu = !bloq;
		// Me.Projeto_CasosProducao.Form!btn_producao_editar.Enabled = Not Bloq_Adm
		const canEditProducao = !bloqAdm;

		// Permissões de botões
		const canDetail = projetoCadastroProduto;
		const canDuplicate = projetoRelatarCasos;
		// BtnProducao.Enabled = Not Me.Bloqueado (sempre habilitado se não bloqueado)
		// BtnExcluir.Enabled = Not Bloq_Adm
		const canDelete = !bloqAdm;
		// Comando123.Enabled = Not Bloq_Adm (assumindo que é similar a excluir)
		
		// Permissão de salvar: pode salvar se tiver permissão para editar pelo menos um campo
		const canSave = canEditProjeto || canEditVersaoProduto || canEditCategoria || 
			canEditPrioridade || canEditDescricaoResumo || canEditDescricaoCompleta;
		
		// Permissão de finalizar: baseado em permissões administrativas
		const canFinalize = !bloqAdm;

		return {
			bloq,
			bloqAdm,
			bloqEstado,
			bloqAbrirCaso,
			canEditProjeto,
			canEditVersaoProduto,
			canEditCategoria,
			canEditRelator,
			canEditPrioridade,
			canEditModulo,
			canEditCronograma,
			canEditDescricaoResumo,
			canEditDescricaoCompleta,
			canEditAnexo,
			canEditInformacoesAdicionais,
			canEditResolucao,
			canEditEstado,
			canEditAtribuidoPara,
			canEditValeuCaso,
			canEditTesteFaqID,
			canEditTesteValeu,
			canEditProducao,
			canSave,
			canFinalize,
			canDelete,
			canDuplicate,
			canDetail,
		};
	}, [caseData]);
}

