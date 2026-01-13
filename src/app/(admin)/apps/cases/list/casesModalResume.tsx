"use client";
import { Modal } from "react-bootstrap";
import { ICase } from '@/types/cases/ICase';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useCasePermissions } from '@/hooks/useCasePermissions';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useModalScroll } from './hooks/useModalScroll';
import { useCaseModalActions } from './hooks/useCaseModalActions';
import CaseModalHeader from './components/CaseModalHeader';
import CaseModalStyles from './components/CaseModalStyles';
import CaseModalTabs from './components/CaseModalTabs';
import CaseModalTabsMobile from './components/CaseModalTabsMobile';
import CaseModalTimeColumn from './components/CaseModalTimeColumn';
import CaseModalActionButtons from './components/CaseModalActionButtons';
import { ResumeFormRef } from '@/app/(admin)/apps/cases/form/resumeForm/resumeForm';
import type { CaseTimeDraft } from '@/utils/caseTime';

interface Props {
	open: boolean;
	setOpen: (open: boolean) => void;
	case: ICase | null;
	setCase?: (caseData: ICase | null) => void;
	openModal?: (caseData: ICase) => void;
}

export default function CasesModalResume({ setOpen, open, case: caseData, setCase, openModal }: Props) {
	const [localCaseData, setLocalCaseData] = useState<ICase | null>(caseData);
	const [timeDraft, setTimeDraft] = useState<CaseTimeDraft | null>(null);
	
	// Calcula displayCaseData antes de usar no hook de permissões
	const displayCaseData = localCaseData || caseData;
	const permissions = useCasePermissions(displayCaseData);

	const handleTimeDraftChange = useCallback((draft: CaseTimeDraft) => {
		setTimeDraft(draft);
	}, []);

	// Atualizar estado local quando caseData mudar
	useEffect(() => {
		setLocalCaseData(caseData);
	}, [caseData]);

	// Prevenir scroll do body quando modal está aberto
	useModalScroll(open);

	// Hook para gerenciar todas as ações do caso
	const {
		resumeFormRef,
		finalizing,
		deleting,
		saving,
		cloning,
		showConfirmDialog,
		showDeleteDialog,
		setShowConfirmDialog,
		setShowDeleteDialog,
		handleAnotacaoCreated,
		handleSave,
		handleFinalizeCaseClick,
		handleConfirmFinalize,
		handleCloneCase,
		handleShareCase,
		handleDeleteCaseClick,
		handleConfirmDelete,
		handleClose,
	} = useCaseModalActions({
		caseData: displayCaseData,
		timeDraft,
		setCase,
		setLocalCaseData,
		onClose: () => setOpen(false),
		openModal,
	});

	const handleCaseUpdated = (updatedCase: ICase) => {
		setLocalCaseData(updatedCase);
		if (setCase) {
			setCase(updatedCase);
		}
	};

	const hasAnotacoes = useMemo(
		() => Boolean(displayCaseData?.caso.anotacoes && displayCaseData.caso.anotacoes.length > 0),
		[displayCaseData?.caso.anotacoes]
	);

	return (
		<>
			<CaseModalStyles hasAnotacoes={hasAnotacoes} />
			<Modal show={open} onHide={handleClose} backdrop="static" fullscreen={true}>
				<CaseModalHeader caseData={displayCaseData} />
				<Modal.Body className="p-0 d-flex flex-column" style={{ flex: '1 1 auto', overflow: 'hidden', minHeight: 0 }}>
					{/* Layout Mobile: Abas incluindo Tempo */}
					<div className="d-flex d-lg-none flex-column h-100" style={{ minHeight: 0 }}>
						<CaseModalTabsMobile
							caseData={displayCaseData}
							hasAnotacoes={hasAnotacoes}
							resumeFormRef={resumeFormRef as React.RefObject<ResumeFormRef | null>}
							onCaseUpdated={handleCaseUpdated}
							onAnotacaoCreated={handleAnotacaoCreated}
							onTimeDraftChange={handleTimeDraftChange}
						/>
					</div>

					{/* Layout Desktop: Duas colunas com tempo sempre visível */}
					<div className="d-none d-lg-flex h-100" style={{ minHeight: 0 }}>
						{/* Coluna esquerda - Conteúdo principal (Abas) */}
						<div className="d-flex flex-column" style={{ flex: '1 1 auto', minWidth: 0 }}>
							<CaseModalTabs
								caseData={displayCaseData}
								hasAnotacoes={hasAnotacoes}
								resumeFormRef={resumeFormRef as React.RefObject<ResumeFormRef | null>}
								onCaseUpdated={handleCaseUpdated}
								onAnotacaoCreated={handleAnotacaoCreated}
							/>
						</div>

						{/* Coluna direita - Tempo (sempre visível) */}
						<CaseModalTimeColumn
							caseData={displayCaseData}
							onCaseUpdated={handleCaseUpdated}
							onTimeDraftChange={handleTimeDraftChange}
						/>
					</div>
				</Modal.Body>
				<Modal.Footer className="bg-light border-top">
					<CaseModalActionButtons
						caseData={displayCaseData}
						permissions={permissions}
						saving={saving}
						deleting={deleting}
						cloning={cloning}
						finalizing={finalizing}
						onSave={handleSave}
						onDelete={handleDeleteCaseClick}
						onClone={handleCloneCase}
						onShare={handleShareCase}
						onFinalize={handleFinalizeCaseClick}
						variant="mobile"
					/>
					<CaseModalActionButtons
						caseData={displayCaseData}
						permissions={permissions}
						saving={saving}
						deleting={deleting}
						cloning={cloning}
						finalizing={finalizing}
						onSave={handleSave}
						onDelete={handleDeleteCaseClick}
						onClone={handleCloneCase}
						onShare={handleShareCase}
						onFinalize={handleFinalizeCaseClick}
						variant="desktop"
					/>
				</Modal.Footer>
			</Modal>
			{displayCaseData && (
				<>
					<ConfirmDialog
						show={showConfirmDialog}
						title="Finalizar Caso"
						message={`Deseja realmente finalizar o Caso #${displayCaseData.caso.id}?`}
						confirmText="Finalizar"
						cancelText="Cancelar"
						confirmVariant="success"
						onConfirm={handleConfirmFinalize}
						onCancel={() => setShowConfirmDialog(false)}
						loading={finalizing}
					/>
					<ConfirmDialog
						show={showDeleteDialog}
						title="Excluir Caso"
						message={`Deseja realmente excluir o Caso #${displayCaseData.caso.id}? Esta ação não pode ser desfeita.`}
						confirmText="Excluir"
						cancelText="Cancelar"
						confirmVariant="danger"
						onConfirm={handleConfirmDelete}
						onCancel={() => setShowDeleteDialog(false)}
						loading={deleting}
					/>
				</>
			)}
		</>
	);
}
