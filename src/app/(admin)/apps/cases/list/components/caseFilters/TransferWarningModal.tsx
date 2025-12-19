import { Button, Modal } from 'react-bootstrap';

interface TransferWarningModalProps {
	show: boolean;
	onHide: () => void;
}

/**
 * Modal de aviso para transferência de casos de produtos diferentes
 */
export default function TransferWarningModal({ show, onHide }: TransferWarningModalProps) {
	return (
		<Modal
			show={show}
			onHide={onHide}
			centered
			contentClassName="border-0"
			dialogStyle={{ maxWidth: '500px' }}
		>
			<div className="modal-filled bg-warning">
				<Modal.Body className="p-4">
					<div className="text-center">
						<i className="mdi mdi-alert-circle h1 mb-3"></i>
						<h4 className="mt-2 mb-3">Atenção</h4>
						<p className="mt-3 mb-0">
							Não é possível transferir casos de produtos diferentes. Por favor, selecione apenas casos do
							mesmo produto.
						</p>
						<Button variant="light" className="my-3" onClick={onHide}>
							Entendi
						</Button>
					</div>
				</Modal.Body>
			</div>
		</Modal>
	);
}

