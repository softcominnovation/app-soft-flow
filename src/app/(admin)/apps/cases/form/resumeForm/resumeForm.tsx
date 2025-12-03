import FormResumeSkelleton from '@/app/(admin)/apps/cases/list/skelletons/formResumeSkelleton';
import { FormProvider, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { ICase } from '@/types/cases/ICase';
import CaseInfoSection from './components/CaseInfoSection';
import CaseDescriptionSection from './components/CaseDescriptionSection';

interface ResumeFormProps {
	caseData: ICase | null;
}

export default function ResumeForm({ caseData }: ResumeFormProps) {
	const [activeKeys, setActiveKeys] = useState<string[]>(['1']);

	const methods = useForm();

	const handleToggle = (eventKey: string) => {
		setActiveKeys((prev) => {
			if (prev.includes(eventKey)) {
				return prev.filter((key) => key !== eventKey);
			} else {
				return [...prev, eventKey];
			}
		});
	};

	useEffect(() => {
		if (caseData) {
			methods.reset({
				codigo: caseData.caso.id,
				produto: caseData.produto?.nome || '',
				versao: caseData.produto?.versao || "-",
				prioridade: caseData.caso.caracteristicas.prioridade || '',
				desenvolvedor: caseData.caso.usuarios.desenvolvimento?.nome || '',
				resumo: caseData.caso.textos.descricao_resumo || '',
				descricao_completa: caseData.caso.textos.descricao_completa || '',
				anexo: caseData.caso.textos.anexo || '',
				status: caseData.caso.status.status_tipo || '',
			});
		}
	}, [caseData, methods]);


	return (
		<FormProvider {...methods}>
			{
				!caseData ? (
					<FormResumeSkelleton />
				) : (
					<div className="d-flex flex-column" style={{ gap: '1.5rem' }}>
						<CaseInfoSection 
							isOpen={activeKeys.includes('0')}
							onToggle={handleToggle}
						/>
						<CaseDescriptionSection 
							caseData={caseData}
							isOpen={activeKeys.includes('1')}
							onToggle={handleToggle}
						/>
					</div>
				)
			}
		</FormProvider>
	);
}
