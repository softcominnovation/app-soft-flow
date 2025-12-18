import CaseStepButtons from '@/app/(admin)/apps/cases/form/wizard/caseStepButtons';
import CasesDescriptionForm from '@/app/(admin)/apps/cases/form/casesDescriptionForm';
import { Form, Spinner } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { ICase } from '@/types/cases/ICase';

export default function CaseWizardStep4({ onClose }: { onClose?: () => void }) {
	const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
	const [message, setMessage] = useState<string | undefined>(undefined);

	useEffect(() => {
		// if a submission already started before mounting, set submitting
		if ((window as any).__caseSubmitting) {
			setStatus('submitting');
		}

		const onSubmitting = () => setStatus('submitting');
		const onSubmitted = (e: any) => {
			if (e?.detail?.success) {
				setStatus('success');
				setMessage('Caso adicionado com sucesso!');
			} else {
				setStatus('error');
				setMessage(e?.detail?.error ?? 'Erro ao criar o caso');
			}
		};

		window.addEventListener('case:submitting', onSubmitting as EventListener);
		window.addEventListener('case:submitted', onSubmitted as EventListener);

		return () => {
			window.removeEventListener('case:submitting', onSubmitting as EventListener);
			window.removeEventListener('case:submitted', onSubmitted as EventListener);
		};
	}, []);

	return (
		<div className={'col-md-12'}>
			<div>
				<div className="text-center">
					{status === 'submitting' && (
						<>
							<Spinner animation="border" variant="primary" />
							<h4 className="mt-3">Enviando caso...</h4>
							<p className="w-75 mb-2 mx-auto text-muted">Aguarde enquanto processamos a criação do caso.</p>
						</>
					)}

					{status === 'success' && (
						<>
							<h2 className="mt-0">
								<i className="mdi mdi-check-all text-success"></i>
							</h2>
							<h3 className="mt-0 text-success">{message ?? 'Caso adicionado com sucesso!'}</h3>
							<p className="w-75 mb-2 mx-auto">
								Você pode fechar esta janela ou continuar para ver os detalhes do caso.
							</p>
						</>
					)}

					{status === 'error' && (
						<>
							<h3 className="mt-0 text-danger">Erro ao criar o caso</h3>
							<p className="w-75 mb-2 mx-auto text-muted">{message}</p>
						</>
					)}
					{status === 'idle' && (
						<>
							<h2 className="mt-0">
								<i className="mdi mdi-check-all text-success"></i>
							</h2>
							<h3 className="mt-0 text-success">Caso adicionado com sucesso!</h3>
							<p className="w-75 mb-2 mx-auto">
								Quisque nec turpis at urna dictum luctus. Suspendisse convallis dignissim eros at
								volutpat. In egestas mattis dui. Aliquam mattis dictum aliquet.
							</p>
						</>
					)}
				</div>
			</div>
			<CaseStepButtons closeButton onClose={onClose} />
		</div>
	)
}