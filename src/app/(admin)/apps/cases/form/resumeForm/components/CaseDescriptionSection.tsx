import { Card, Collapse, Row, Form } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import AccordionToggle from './AccordionToggle';
import { ICase } from '@/types/cases/ICase';
import { useState, useImperativeHandle, forwardRef, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { TextAreaInput, TextInput } from '@/components/Form';
import { updateCase } from '@/services/caseServices';
import { toast } from 'react-toastify';
import { createUpdatedCase } from '../utils/caseUpdateUtils';
import { useCasePermissions } from '@/hooks/useCasePermissions';

interface CaseDescriptionSectionProps {
	caseData: ICase;
	isOpen: boolean;
	onToggle: (eventKey: string) => void;
	onCaseUpdated?: (updatedCase: ICase) => void;
}

export interface CaseDescriptionSectionRef {
	save: () => Promise<void>;
	isSaving: boolean;
}

/**
 * Componente responsável por exibir e editar a descrição e informações adicionais do caso
 */
const CaseDescriptionSection = forwardRef<CaseDescriptionSectionRef, CaseDescriptionSectionProps>(
	({ caseData, isOpen, onToggle, onCaseUpdated }, ref) => {
		const eventKey = '1';
		const { getValues, watch } = useFormContext();
		const [isSaving, setIsSaving] = useState(false);
		const permissions = useCasePermissions(caseData);
		const anexoValue = watch('anexo') || '';
		const isAnexoDisabled = !permissions.canEditAnexo;

	/**
	 * Prepara os dados para atualização do caso
	 */
	const prepareUpdateData = useCallback(() => {
		const values = getValues();
		
		// Função auxiliar para converter valores para string, mantendo vazio se não existir
		const toString = (value: any): string => {
			if (value === null || value === undefined) return '';
			if (typeof value === 'string') return value;
			if (typeof value === 'number') return String(value);
			if (typeof value === 'object' && value !== null) {
				// Se for um objeto (como do react-select), extrai o value
				return value.value ? String(value.value) : '';
			}
			return String(value);
		};
		
		// Extrai o valor do status (pode ser objeto ou string)
		let statusValue = '';
		if (values.status) {
			if (typeof values.status === 'object' && values.status !== null) {
				statusValue = toString(values.status.value ?? values.status);
			} else {
				statusValue = toString(values.status);
			}
		}
		
		// Sempre inclui todos os campos no payload, mesmo que vazios
		// Mapeamento dos campos do formulário para os campos da API
		// Para Categoria: sempre usa categoria_id (deve ser um número), nunca o texto
		
		
		return {
			Anexo: toString(values.anexo),
			AtribuidoPara: toString(values.desenvolvedor_id),
			Categoria: toString(values.categoria_id),
			Cronograma_id: toString(values.projeto_id), // projeto_id é o Cronograma_id
			DescricaoCompleta: toString(values.descricao_completa),
			DescricaoResumo: toString(values.resumo),
			Id_Origem: toString(values.origem_id),
			InformacoesAdicionais: toString(values.informacoes_adicionais),
			Prioridade: toString(values.prioridade),
			Projeto: toString(values.produto_id), // produto_id é o Projeto (id do Produto)
			QaId: toString(values.qa_id),
			Relator: toString(values.relator_id || values.desenvolvedor_id), // Relator pode ser o desenvolvedor se não houver relator específico
			Status: statusValue,
			VersaoProduto: toString(values.versao),
		};
	}, [getValues]);

		/**
		 * Salva as alterações do formulário
		 */
		const handleSave = useCallback(async () => {
			if (isSaving) return;

			setIsSaving(true);
			try {
				const values = getValues();
				const updateData = prepareUpdateData();

				console.log('🔍 Valores do formulário:', values);
				console.log('📤 Payload enviado para API:', updateData);
				console.log('📊 Total de campos no payload:', Object.keys(updateData).length);

				await updateCase(caseData.caso.id.toString(), updateData);
				toast.success('Campos atualizados com sucesso!');

				if (onCaseUpdated) {
					const updatedCase = createUpdatedCase(caseData, values);
					onCaseUpdated(updatedCase);
				}
			} catch (error: any) {
				console.error('Erro ao atualizar caso:', error);
				toast.error(error?.response?.data?.message || 'Erro ao atualizar os campos');
			} finally {
				setIsSaving(false);
			}
		}, [isSaving, getValues, caseData, prepareUpdateData, onCaseUpdated]);

		// Expõe a função de salvamento através da ref
		useImperativeHandle(
			ref,
			() => ({
				save: handleSave,
				isSaving,
			}),
			[handleSave, isSaving]
		);

		return (
			<Card className="border-0 shadow-sm mb-0">
				<Card.Header className="bg-light border-bottom p-0">
					<AccordionToggle eventKey={eventKey} className="p-3" isOpen={isOpen} onToggle={onToggle}>
						<h5 className="mb-0 d-flex align-items-center text-body">
							<IconifyIcon icon="lucide:file-text" className="me-2 text-primary" />
							Descrição / Resumo
						</h5>
					</AccordionToggle>
				</Card.Header>
				<Collapse in={isOpen}>
					<div>
						<Card.Body style={{ padding: '1.5rem' }}>
							<Row>
								<Form.Group style={{ marginBottom: '24px' }}>
									<Form.Label className="fw-semibold mb-2">Resumo do Caso</Form.Label>
									<TextAreaInput 
										name="resumo" 
										placeholder="Descrição resumida do caso" 
										rows={2}
										disabled={!permissions.canEditDescricaoResumo}
									/>
								</Form.Group>
								<Form.Group style={{ marginBottom: '24px' }}>
									<Form.Label className="fw-semibold mb-2">Descrição Completa</Form.Label>
									<TextAreaInput 
										name="descricao_completa" 
										placeholder="Descrição Completa" 
										rows={6}
										disabled={!permissions.canEditDescricaoCompleta}
									/>
								</Form.Group>
								<Form.Group style={{ marginBottom: '24px' }}>
									<Form.Label className="fw-semibold mb-2">Anexo</Form.Label>
									{isAnexoDisabled && anexoValue ? (
										<div className="form-control" style={{ 
											backgroundColor: 'var(--bs-tertiary-bg, #e9ecef)',
											borderColor: 'var(--bs-border-color, #dee2e6)',
											cursor: 'not-allowed',
											display: 'flex',
											alignItems: 'center',
											padding: '0.375rem 0.75rem'
										}}>
											<a 
												href={anexoValue.startsWith('http://') || anexoValue.startsWith('https://') ? anexoValue : `https://${anexoValue}`}
												target="_blank"
												rel="noopener noreferrer"
												className="text-primary text-decoration-underline d-flex align-items-center"
												style={{ 
													color: 'var(--bs-link-color, #0d6efd)',
													textDecoration: 'underline',
													cursor: 'pointer',
													pointerEvents: 'auto'
												}}
												onClick={(e) => e.stopPropagation()}
											>
												<IconifyIcon icon="lucide:external-link" className="me-1" style={{ fontSize: '1rem' }} />
												{anexoValue}
											</a>
										</div>
									) : (
										<TextInput 
											type="text" 
											name="anexo" 
											placeholder="URL ou texto do anexo"
											disabled={isAnexoDisabled}
										/>
									)}
								</Form.Group>
								<Form.Group style={{ marginBottom: '0' }}>
									<Form.Label className="fw-semibold mb-2">Informações Adicionais</Form.Label>
									<TextAreaInput
										name="informacoes_adicionais"
										placeholder="Informações adicionais do caso"
										rows={2}
										disabled={!permissions.canEditInformacoesAdicionais}
									/>
								</Form.Group>
							</Row>
						</Card.Body>
					</div>
				</Collapse>
			</Card>
		);
	}
);

CaseDescriptionSection.displayName = 'CaseDescriptionSection';

export default CaseDescriptionSection;
