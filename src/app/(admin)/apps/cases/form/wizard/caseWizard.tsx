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

export default function CaseWizard() {
	const methods = useForm<ICasePost>();

	const submit = async (data: any) => {
		// Mapear campos do formulário para o payload esperado pela API
		const payload: any = {
			// mapeamentos solicitados pelo usuário
			Projeto: data.product?.value ?? data.product ?? null,
			AtribuidoPara: data.usuario_id?.value ?? (data.usuario_id ?? null),
			Relator: data.relator_id?.value ?? data.usuario_id?.value ?? (data.usuario_id ?? null),
			Cronograma_id: data.project?.value ?? data.project ?? null,
			VersaoProduto: data.version?.value ?? data.version ?? null,
			// manter alguns campos básicos se existirem
			Categoria: data.category?.value ?? data.category ?? undefined,
			// campos textuais do restante do wizard (se existirem)
			DescricaoResumo: data.descricao_resumo ?? data.descriptionSummary ?? undefined,
			DescricaoCompleta: data.descricao_completa ?? data.description ?? undefined,
		};

		console.log('Payload to API:', payload);

		try {
			const res = await createCase(payload);
			toast.success('Caso criado com sucesso');
			console.log('Create case response:', res);
		} catch (err) {
			console.error(err);
			toast.error('Erro ao criar o caso');
		}
	}

	return (
		<FormProvider {...methods}>
			<form id={"form-add-case"} onSubmit={methods.handleSubmit(submit)}>
				<Wizard header={<CaseWizardHeader />}>
					<CaseWizardStep1 control={methods.control} />
					<CaseWizardStep2 />
					<CaseWizardStep3 />
					<CaseWizardStep4 />
				</Wizard>
			</form>
		</FormProvider>
	);
}
