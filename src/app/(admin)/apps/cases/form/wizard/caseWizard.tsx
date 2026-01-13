import { Wizard } from "react-use-wizard";
import CaseWizardStep1 from "./caseWizardStep1";
import CaseWizardHeader from "./caseWizardHeader";
import CaseWizardStep2 from '@/app/(admin)/apps/cases/form/wizard/caseWizardStep2';
import CaseWizardStep3 from '@/app/(admin)/apps/cases/form/wizard/caseWizardStep3';
import CaseWizardStep4 from '@/app/(admin)/apps/cases/form/wizard/caseWizardStep4';
import { FormProvider, useForm } from 'react-hook-form';
import ICasePost from '@/types/cases/ICasePost';
import { createCase } from '@/services/caseServices';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { normalizeLineBreaksToCrlf } from '@/utils/lineBreaks';
import { ESTIMATED_POINTS_REQUIRED_MESSAGE, shouldBlockEstimatedCaseSave } from '@/utils/caseTime';

export default function CaseWizard({ onClose }: { onClose?: () => void }) {
    const methods = useForm<ICasePost>({
        mode: 'onChange',
        // keep inputs registered even when their components unmount so trigger() validates across wizard steps
        shouldUnregister: false,
		defaultValues: {
			product: undefined,
			version: undefined,
			priority: undefined,
			project: undefined,
		}
    });

    // Pre-register fields that may not mount before finishing, so trigger() validates them
    useEffect(() => {
        const { register } = methods as any;
        try {
            register('product', { required: 'O campo Projeto (id do Produto) é obrigatório.' });
            register('priority', { required: 'O campo Prioridade (1,2,3,4,5,6,7,8,9,10) é obrigatório.' });
            register('version', { required: 'O campo Versão do Produto é obrigatório.' });
            register('Id_Origem', { required: 'O campo ID Origem é obrigatório.' });
            register('modulo', { required: 'O campo Módulo é obrigatório.' });
            register('status', { required: 'O campo Status é obrigatório.' });
            register('category', { required: 'O campo Categoria é obrigatório.' });

            register('descricao_resumo', { required: 'O campo Descrição Resumo é obrigatório.' });
            register('descricao_completa', { required: 'O campo Descrição Completa é obrigatório.' });

            register('usuario_id', { required: 'O campo Atribuído Para (id do Usuário) é obrigatório.' });
            register('project', { required: 'O campo Projeto (id do projeto) é obrigatório.' });
            register('relator_id', { required: 'O campo Relator é obrigatório.' });
        } catch {}
    }, [methods]);

	const submit = async (data: any) => {
		const resolve = (...keys: string[]) => {
			for (const k of keys) {
				if (k in data && data[k] !== undefined && data[k] !== null) return data[k];
			}
			return undefined;
		};

		const descricaoResumoRaw = resolve('descricao_resumo', 'description-resumo', 'descriptionSummary', 'descricaoResumo', 'description_resumo');
		const descricaoCompletaRaw = resolve('descricao_completa', 'description-completa', 'description', 'description-resumo');

		const descricaoResumo =
			descricaoResumoRaw === undefined || descricaoResumoRaw === null
				? undefined
				: normalizeLineBreaksToCrlf(String(descricaoResumoRaw));
		const descricaoCompleta =
			descricaoCompletaRaw === undefined || descricaoCompletaRaw === null
				? undefined
				: normalizeLineBreaksToCrlf(String(descricaoCompletaRaw));

		// Função auxiliar para converter valores booleanos para número inteiro (0 ou 1)
		const toInt = (value: any): number => {
			if (value === null || value === undefined) return 0;
			if (typeof value === 'boolean') return value ? 1 : 0;
			if (typeof value === 'string') return value === 'true' || value === '1' ? 1 : 0;
			if (typeof value === 'number') return value !== 0 ? 1 : 0;
			return Boolean(value) ? 1 : 0;
		};

		const resolveTimeInput = () => {
			const candidates = [data.TempoEstimado, data.tempo_estimado, data.tempoEstimado];
			for (const candidate of candidates) {
				if (typeof candidate === 'string' && /^\d{2}:\d{2}$/.test(candidate)) {
					return candidate;
				}
			}
			return null;
		};

		const resolveEstimatedMinutes = () => {
			const candidates = [
				data.tempo_estimado_minutos,
				data.tempoEstimadoMinutos,
				data.tempoEstimadoMin,
			];
			for (const candidate of candidates) {
				if (typeof candidate === 'number') {
					return candidate;
				}
			}
			return null;
		};

		const resolvePoints = () => {
			const candidates = [data.tamanho_pontos, data.pontos, data.tamanhoPontos];
			for (const candidate of candidates) {
				if (typeof candidate === 'number') {
					return candidate;
				}
			}
			return null;
		};

		const resolveTamanhoId = () => {
			const candidates = [data.tamanhoId, data.tamanho_id, data.tamanho];
			for (const candidate of candidates) {
				if (typeof candidate === 'number') {
					return candidate;
				}
			}
			return undefined;
		};

		const shouldBlock = shouldBlockEstimatedCaseSave({
			timeInput: resolveTimeInput(),
			estimadoMinutos: resolveEstimatedMinutes(),
			pontos: resolvePoints(),
			tamanhoId: resolveTamanhoId(),
			naoPlanejado: Boolean(data.nao_planejado ?? data.NaoPlanejado ?? data.naoPlanejado ?? false),
		});
		if (shouldBlock) {
			toast.error(ESTIMATED_POINTS_REQUIRED_MESSAGE);
			return;
		}

        const payload: any = {
            Projeto: data.product?.value ?? data.product ?? null,
            AtribuidoPara: data.usuario_id?.value ?? data.usuario_id ?? null,
            Relator: data.relator_id?.value ?? data.relator_id ?? data.usuario_id?.value ?? data.usuario_id ?? null,
            Prioridade: data.priority ?? (data.priority?.value ?? undefined),
            Cronograma_id: data.project?.value ?? data.project ?? null,
            VersaoProduto: data.version?.raw?.versao ?? data.version?.label ?? data.version ?? null,
            Categoria: data.category?.value ?? data.category ?? undefined,
            status: data.status?.value ?? data.status ?? undefined,
            DescricaoResumo: descricaoResumo ?? undefined,
            DescricaoCompleta: descricaoCompleta ?? undefined,
            Anexo: data.anexo ?? undefined,
            Id_Origem: (data as any).Id_Origem?.value ?? (data as any).Id_Origem ?? (data as any).id_origem ?? undefined,
            Modulo: data.modulo ?? undefined,
            QaId: (data as any).qa_id?.value ?? (data as any).qa_id ?? undefined,
            Id_Usuario_AberturaCaso: data.Id_Usuario_AberturaCaso ?? Cookies.get('user_id') ?? undefined,
            // Campos de Viabilidade
            Viabilidade: toInt(data.viabilidade),
            Viabilidade_Entendido: toInt(data.entendivel),
            Viabilidade_Realizavel: toInt(data.realizavel),
            Viabilidade_Completo: toInt(data.completo),
            Liberacao: toInt(data.liberacao),
            entregue: toInt(data.entregue),
            atualizacao_automatica: toInt(data.atualizacao_auto),
        };

		console.log('Payload to API:', payload);

		window.dispatchEvent(new CustomEvent('case:submitting'));

		try {
			const res = await createCase(payload);
			toast.success('Caso criado com sucesso');
			console.log('Create case response:', res);
			(window as any).__caseSubmitting = false;
			window.dispatchEvent(new CustomEvent('case:submitted', { detail: { success: true, data: res } }));
		} catch (err: any) {
			console.error(err);
			toast.error('Erro ao criar o caso');
			(window as any).__caseSubmitting = false;
			window.dispatchEvent(new CustomEvent('case:submitted', { detail: { success: false, error: err?.message ?? err } }));
		}
	}

	return (
		<FormProvider {...methods}>
			<form id={"form-add-case"} onSubmit={methods.handleSubmit(submit)}>
				<Wizard header={<CaseWizardHeader />}>
					<CaseWizardStep1 control={methods.control} />
					<CaseWizardStep2 />
					<CaseWizardStep3 />
					<CaseWizardStep4 onClose={onClose} />
				</Wizard>
			</form>
		</FormProvider>
	);
}
