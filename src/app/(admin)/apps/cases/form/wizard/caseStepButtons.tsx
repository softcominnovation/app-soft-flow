import { useWizard } from 'react-use-wizard';
import { Button } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
type Props = {
	nextStepButton?: boolean,
	prevStepButton?: boolean,
	finishButton?: boolean,
	closeButton?: boolean,
}

export default function CaseStepButtons({prevStepButton, nextStepButton, finishButton, closeButton}: Props) {
	const {previousStep, nextStep, goToStep, activeStep} = useWizard() as any;
	const { trigger, setFocus, getFieldState } = useFormContext();

	const handleNextStep = async (e: React.FormEvent) => {
		e.preventDefault();

		if (finishButton) {
			// validate all fields first using react-hook-form's trigger
			try {
				const valid = await trigger();
				if (valid) {
					const form = document.getElementById('form-add-case') as HTMLFormElement | null;
					if (form) {
						if (typeof (form as any).requestSubmit === 'function') {
							(form as any).requestSubmit();
						} else {
							form.submit();
						}
					}

					// Navigate to final step so user sees loading UI
					nextStep();
				} else {
					// keep user on current step so validation errors are visible
					try {
						// Validate groups of fields to find which step contains the first error
						const headerFields = ['product', 'priority', 'version', 'Id_Origem'];
						const assignmentFields = ['usuario_id', 'project', 'relator_id'];
						const descriptionFields = ['descricao_resumo', 'descricao_completa'];

						// Trigger each group and use getFieldState to identify the actual failing field
						await trigger(headerFields);
						const headerError = headerFields.find((k) => !!getFieldState(k).error);
						if (headerError) {
							goToStep?.(0);
							try { setFocus(headerError as any); } catch {}
							const idMap: Record<string, string> = {
								product: 'produto-id',
								priority: 'priority',
								version: 'versao-id',
								Id_Origem: 'origem-id'
							};
							const fallbackEl = document.getElementById(idMap[headerError]) || document.getElementById('produto-id');
							if (fallbackEl) { fallbackEl.focus?.(); fallbackEl.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
							return;
						}

						await trigger(assignmentFields);
						const assignmentError = assignmentFields.find((k) => !!getFieldState(k).error);
						if (assignmentError) {
							// assignments are step index 2
							goToStep?.(2);
							try { setFocus(assignmentError as any); } catch {}
							const idMap: Record<string, string> = {
								usuario_id: 'dev-atribuido-id',
								project: 'projeto-id',
								relator_id: 'relator-id'
							};
							const fallbackEl = document.getElementById(idMap[assignmentError]) || document.getElementById('projeto-id');
							if (fallbackEl) { fallbackEl.focus?.(); fallbackEl.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
							return;
						}

						await trigger(descriptionFields);
						const descriptionError = descriptionFields.find((k) => !!getFieldState(k).error);
						if (descriptionError) {
							// description is step index 1
							goToStep?.(1);
							try { setFocus(descriptionError as any); } catch {}
							const idMap: Record<string, string> = {
								descricao_resumo: 'descricao_resumo',
								descricao_completa: 'descricao_completa'
							};
							const fallbackEl = document.getElementById(idMap[descriptionError]) || document.getElementById('descricao_resumo');
							if (fallbackEl) { fallbackEl.focus?.(); fallbackEl.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
							return;
						}
					} catch (err) {
						// ignore focus/navigation errors
					}
				}
			} catch (e) {
				console.error('Validation error on trigger:', e);
			}
		} else {
			// validate only the fields of the current step before advancing
			const headerFields = ['product', 'priority', 'version', 'Id_Origem'];
			const descriptionFields = ['descricao_resumo', 'descricao_completa'];
			const assignmentFields = ['usuario_id', 'project', 'relator_id'];

			let fieldsToValidate: string[] = [];
			if (activeStep === 0) fieldsToValidate = headerFields;
			else if (activeStep === 1) fieldsToValidate = descriptionFields;
			else if (activeStep === 2) fieldsToValidate = assignmentFields;

			if (fieldsToValidate.length > 0) {
				const valid = await trigger(fieldsToValidate);
				if (!valid) {
					const firstError = fieldsToValidate.find((k) => !!getFieldState(k).error);
					if (firstError) {
						try { setFocus(firstError as any); } catch {}
						const idMap: Record<string, string> = {
							product: 'produto-id',
							priority: 'priority',
							version: 'versao-id',
							Id_Origem: 'origem-id',
							descricao_resumo: 'descricao_resumo',
							descricao_completa: 'descricao_completa',
							usuario_id: 'dev-atribuido-id',
							project: 'projeto-id',
							relator_id: 'relator-id'
						};
						const fallbackEl = document.getElementById(idMap[firstError]);
						if (fallbackEl) { fallbackEl.focus?.(); fallbackEl.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
					}
					return; // do not move forward
				}
			}

			nextStep();
		}
	};


	return (
		<ul className="list-inline wizard mb-0">
			{prevStepButton &&
				<li className="previous list-inline-item">
					<Button onClick={previousStep} variant="info">
						Voltar
					</Button>
				</li>
			}
			{nextStepButton && (
				<li className="next list-inline-item float-end">
					<Button
						type="submit"
						onClick={handleNextStep}
						variant="success"
					>
						{finishButton ? 'Finalizar' : 'Próximo'}
					</Button>
				</li>
			)}
			{
				closeButton &&
				<li className="next list-inline-item float-end">
					<Button  onClick={nextStep} variant="secondary">
						Fechar
					</Button>
				</li>
			}
		</ul>
	)

}
