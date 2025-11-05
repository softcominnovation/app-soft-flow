import { Form, Card } from 'react-bootstrap';
import Select from 'react-select';
import { TextAreaInput, TextInput } from '@/components/Form';

export default function CasesDescriptionForm() {
	return (
		<div className="container mt-4">
			<Card className="shadow-sm rounded-3">
				<Card.Body>
					<div className={'row col-md-12 mt-2'}>
						<TextInput id={'descricao_resumo'} type={'text'} name={'descricao_resumo'} label={'Resumo da descrição'} register={{ required: 'O campo Descrição Resumo é obrigatório.' }} />
					</div>
					<div className={'row col-md-12 mt-2'}>
						<TextAreaInput id={'descricao_completa'} name={'descricao_completa'} label={'Descrição Completa'} register={{ required: 'O campo Descrição Completa é obrigatório.' }} />
					</div>
					<div className={'row col-md-12 mt-2'}>
						<TextInput type={'text'} name={'anexo'} label={'Anexo'}/>
					</div>
				</Card.Body>
			</Card>
		</div>
	);
}
