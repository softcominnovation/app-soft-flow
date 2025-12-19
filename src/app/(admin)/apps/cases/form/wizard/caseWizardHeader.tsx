'use client'

import { useWizard } from "react-use-wizard"
import classNames from "classnames";
import { useFormContext, useWatch } from 'react-hook-form';

export default function CaseWizardHeader() {

    const { goToStep, activeStep } = useWizard()
    const form = useFormContext();
    const { getFieldState, getValues, control } = form ?? ({} as any);

    // watch relevant fields so header recomputes validity when they change
    useWatch({ control, name: ['product','priority','status','version','Id_Origem','modulo','category','descricao_resumo','descricao_completa','usuario_id','project','relator_id'] as any });

    const hasError = (fields: string[]) => fields.some((k) => Boolean(getFieldState?.(k)?.error));
    const hasValue = (field: any) => {
        if (!field) return false;
        if (typeof field === 'string') return field.trim().length > 0;
        if (typeof field === 'number') return true;
        if (typeof field === 'object') return 'value' in field ? Boolean((field as any).value) : Object.keys(field).length > 0;
        return Boolean(field);
    };
    const values = getValues?.() || {};
    const fieldsHeader = ['product','priority','status','version','Id_Origem','modulo','category'];
    const fieldsDescription = ['descricao_resumo','descricao_completa'];
    const fieldsAssignments = ['usuario_id','project','relator_id'];

    const headerValid = !hasError(fieldsHeader) && fieldsHeader.every((f) => hasValue(values[f]));
    const descriptionValid = !hasError(fieldsDescription) && fieldsDescription.every((f) => hasValue(values[f]));
    const assignmentsValid = !hasError(fieldsAssignments) && fieldsAssignments.every((f) => hasValue(values[f]));

	return (
		<ul className="nav nav-pills nav-justified mb-4">
            <li className="nav-item">
                <button
                    type="button"
                    onClick={headerValid ? () => goToStep(0) : undefined}
                    title={headerValid ? '' : 'Preencha e valide para habilitar'}
                    style={{ pointerEvents: headerValid ? 'auto' : 'none' }}
                    className={classNames('nav-link rounded-0 py-2', activeStep === 0 && 'active')}>
                    <i className="mdi mdi-pencil-circle font-18 align-middle me-1"></i>
                    <span className="d-none d-sm-inline">Cabeçalho</span>
                </button>
            </li>
            <li className="nav-item">
                <button
                    type="button"
                    onClick={descriptionValid ? () => goToStep(1) : undefined}
                    title={descriptionValid ? '' : 'Preencha e valide para habilitar'}
                    style={{ pointerEvents: descriptionValid ? 'auto' : 'none' }}
                    className={classNames('nav-link rounded-0 py-2', activeStep === 1 && 'active')}>
                    <i className="mdi mdi-pencil-circle font-18 align-middle me-1"></i>
                    <span className="d-none d-sm-inline">Descrição</span>
                </button>
            </li>
            <li className="nav-item">
                <button
                    type="button"
                    onClick={assignmentsValid ? () => goToStep(2) : undefined}
                    title={assignmentsValid ? '' : 'Preencha e valide para habilitar'}
                    style={{ pointerEvents: assignmentsValid ? 'auto' : 'none' }}
                    className={classNames('nav-link rounded-0 py-2', activeStep === 2 && 'active')}>
                    <i className="mdi  mdi-account-circle font-18 align-middle me-1"></i>
                    <span className="d-none d-sm-inline">Atribuições</span>
                </button>
            </li>
		</ul>
	)
}
