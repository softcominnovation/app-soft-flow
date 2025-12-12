import FormResumeSkelleton from '@/app/(admin)/apps/cases/list/skelletons/formResumeSkelleton';
import { FormProvider, useForm } from 'react-hook-form';
import { useEffect, useState, useImperativeHandle, forwardRef, useRef, useMemo } from 'react';
import { ICase } from '@/types/cases/ICase';
import CaseInfoSection from './components/CaseInfoSection';
import CaseDescriptionSection, { CaseDescriptionSectionRef } from './components/CaseDescriptionSection';
import { normalizeStatus } from './hooks/useStatusNormalization';

interface ResumeFormProps {
	caseData: ICase | null;
	onCaseUpdated?: (updatedCase: ICase) => void;
}

export interface ResumeFormRef {
	save: () => Promise<void>;
	isSaving: boolean;
}

/**
 * Componente principal do formulário de resumo de caso
 * Gerencia o estado do formulário e coordena as seções de informações e descrição
 */
const ResumeForm = forwardRef<ResumeFormRef, ResumeFormProps>(({ caseData, onCaseUpdated }, ref) => {
	const [activeKeys, setActiveKeys] = useState<string[]>(['1']);
	const caseDescriptionRef = useRef<CaseDescriptionSectionRef>(null);
	const methods = useForm();

	useImperativeHandle(ref, () => ({
		save: async () => {
			if (caseDescriptionRef.current) {
				await caseDescriptionRef.current.save();
			}
		},
		get isSaving() {
			return caseDescriptionRef.current?.isSaving || false;
		},
	}));

	const handleToggle = (eventKey: string) => {
		setActiveKeys((prev) => {
			if (prev.includes(eventKey)) {
				return prev.filter((key) => key !== eventKey);
			} else {
				return [...prev, eventKey];
			}
		});
	};

	/**
	 * Prepara os valores iniciais do formulário a partir dos dados do caso
	 */
	const initialFormValues = useMemo(() => {
		if (!caseData) return null;

		// Processa o anexo: remove # do início e fim se existirem
		let anexoValue = caseData.caso.textos.anexo || '';
		if (anexoValue && anexoValue.startsWith('#') && anexoValue.endsWith('#')) {
			anexoValue = anexoValue.slice(1, -1).trim();
		}

		// Normaliza o status
		const statusTipo = caseData.caso.status.status_tipo || '';
		const statusDescricao = caseData.caso.status.descricao || '';
		const statusValue = statusTipo || statusDescricao;
		const normalizedStatus = normalizeStatus(statusValue);

		// Obter a versão
		const versaoValue = caseData.produto?.versao || caseData.caso.caracteristicas.versao_produto || '';

		return {
			codigo: caseData.caso.id,
			produto: caseData.produto?.nome || '',
			produto_id: caseData.produto?.id?.toString() || '',
			versao: versaoValue,
			prioridade: caseData.caso.caracteristicas.prioridade || '',
			desenvolvedor: caseData.caso.usuarios.desenvolvimento?.nome || '',
			desenvolvedor_id: caseData.caso.usuarios.desenvolvimento?.id?.toString() || '',
			qa: (caseData.caso.usuarios.qa?.id && caseData.caso.usuarios.qa.id !== '0' && caseData.caso.usuarios.qa.id !== 0) 
				? (caseData.caso.usuarios.qa?.nome || '') 
				: '',
			qa_id: (caseData.caso.usuarios.qa?.id && caseData.caso.usuarios.qa.id !== '0' && caseData.caso.usuarios.qa.id !== 0)
				? caseData.caso.usuarios.qa.id.toString()
				: '',
			projeto: caseData.projeto?.descricao || '',
			projeto_id: caseData.projeto?.id?.toString() || '',
			categoria: caseData.caso.caracteristicas.tipo_categoria || '',
			categoria_id: '',
			origem: caseData.caso.caracteristicas.tipo_origem || '',
			origem_id: caseData.caso.caracteristicas.id_origem?.toString() || '',
			resumo: caseData.caso.textos.descricao_resumo || '',
			descricao_completa: caseData.caso.textos.descricao_completa || '',
			anexo: anexoValue,
			status: normalizedStatus,
			informacoes_adicionais: caseData.caso.textos.informacoes_adicionais || '',
		};
	}, [caseData]);

	// Inicializa o formulário quando os dados do caso mudarem
	useEffect(() => {
		if (initialFormValues) {
			methods.reset(initialFormValues);
		}
	}, [initialFormValues, methods]);

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
							caseData={caseData}
						/>
						<CaseDescriptionSection 
							ref={caseDescriptionRef}
							caseData={caseData}
							isOpen={activeKeys.includes('1')}
							onToggle={handleToggle}
							onCaseUpdated={onCaseUpdated}
						/>
					</div>
				)
			}
		</FormProvider>
	);
});

ResumeForm.displayName = 'ResumeForm';

export default ResumeForm;
