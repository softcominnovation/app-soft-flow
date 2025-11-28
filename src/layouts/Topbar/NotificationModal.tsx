'use client';
import { Modal, Button } from 'react-bootstrap';
import { IMensagem } from '@/types/mensagens/IMensagem';
import { marcarMensagemComoLida } from '@/services/mensagensServices';
import dayjs from 'dayjs';
import { useState } from 'react';
import 'dayjs/locale/pt-br';

dayjs.locale('pt-br');

interface NotificationModalProps {
	show: boolean;
	mensagem: IMensagem | null;
	onHide: () => void;
	onMarcarLida?: (msgId: number) => void;
}

export default function NotificationModal({ show, mensagem, onHide, onMarcarLida }: NotificationModalProps) {
	const [loading, setLoading] = useState(false);

	if (!mensagem) {
		return null;
	}

	const handleMarcarLida = async () => {
		if (mensagem.status_leitura?.lido) {
			onHide();
			return;
		}

		setLoading(true);
		try {
			await marcarMensagemComoLida(mensagem.id);
			if (onMarcarLida) {
				onMarcarLida(mensagem.id);
			}
			onHide();
		} catch (error) {
			console.error('Erro ao marcar mensagem como lida:', error);
			// Mesmo com erro, fecha o modal
			onHide();
		} finally {
			setLoading(false);
		}
	};

	const formatDate = (dateString: string | null | undefined) => {
		if (!dateString) return null;
		try {
			return dayjs(dateString).format('DD/MM/YYYY [às] HH:mm');
		} catch {
			return null;
		}
	};

	return (
		<Modal show={show} onHide={onHide} size="lg" centered>
			<Modal.Header closeButton className="bg-light border-bottom">
				<Modal.Title className="fw-bold">
					<i className="mdi mdi-bell-outline me-2"></i>
					{mensagem.titulo}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body className="p-4">
				<div className="mb-3">
					{mensagem.enviado_por && (
						<div className="text-muted d-block mb-2" style={{ fontSize: '0.95rem' }}>
							<i className="mdi mdi-account-outline me-1"></i>
							<strong style={{ fontSize: '1rem' }}>Enviado por:</strong> {mensagem.enviado_por}
						</div>
					)}
					{(mensagem.datas?.enviado || mensagem.datas?.msg || mensagem.datas?.hora) && (
						<div className="text-muted d-block mb-2" style={{ fontSize: '0.95rem' }}>
							<i className="mdi mdi-clock-outline me-1"></i>
							<strong style={{ fontSize: '1rem' }}>Data de envio:</strong> {
								formatDate(mensagem.datas?.enviado || mensagem.datas?.msg || mensagem.datas?.hora)
							}
						</div>
					)}
					{mensagem.datas?.prazo_limite && (
						<div className="text-muted d-block mb-2" style={{ fontSize: '0.95rem' }}>
							<i className="mdi mdi-calendar-clock me-1"></i>
							<strong style={{ fontSize: '1rem' }}>Prazo limite:</strong> {formatDate(mensagem.datas.prazo_limite)}
						</div>
					)}
					{mensagem.status_leitura && (
						<div className={`d-block mb-2 ${mensagem.status_leitura.lido ? 'text-success' : 'text-warning'}`} style={{ fontSize: '0.95rem' }}>
							<i className={`mdi ${mensagem.status_leitura.lido ? 'mdi-check-circle' : 'mdi-alert-circle'} me-1`}></i>
							<strong style={{ fontSize: '1rem' }}>Status:</strong> {mensagem.status_leitura.lido ? 'Lida' : 'Não lida'}
						</div>
					)}
				</div>

				<hr />

				<div className="mt-3">
					<h6 className="mb-2 fw-semibold" style={{ fontSize: '1.1rem' }}>Mensagem:</h6>
					<div 
						className="p-3 bg-light rounded border"
						style={{ 
							maxHeight: '400px', 
							overflowY: 'auto',
							whiteSpace: 'pre-wrap', 
							wordBreak: 'break-word'
						}}
					>
						<p className="mb-0">
							{mensagem.msg_texto || mensagem.titulo}
						</p>
					</div>
				</div>

				{mensagem.endo_imagem && (
					<div className="mt-3">
						<h6 className="mb-2 fw-semibold" style={{ fontSize: '1.1rem' }}>Imagem Anexada:</h6>
						<img 
							src={mensagem.endo_imagem} 
							alt="Anexo da mensagem" 
							className="img-fluid rounded border"
							style={{ maxHeight: '300px', objectFit: 'contain' }}
						/>
					</div>
				)}

				{mensagem.link && (
					<div className="mt-3">
						<h6 className="mb-2 fw-semibold" style={{ fontSize: '1.1rem' }}>Anexo (Link):</h6>
						<div className="p-2 bg-light rounded border d-flex align-items-center justify-content-between">
							<div className="d-flex align-items-center">
								<i className="mdi mdi-link text-primary me-2"></i>
								<a 
									href={mensagem.link} 
									target="_blank" 
									rel="noopener noreferrer"
									className="text-decoration-none"
									style={{ wordBreak: 'break-all' }}
								>
									{mensagem.link}
								</a>
							</div>
							<Button 
								variant="link" 
								size="sm"
								className="p-0 ms-2"
								onClick={() => {
									window.open(mensagem.link!, '_blank');
								}}
							>
								<i className="mdi mdi-open-in-new"></i>
							</Button>
						</div>
					</div>
				)}
			</Modal.Body>
			<Modal.Footer>
				{!mensagem.status_leitura?.lido && (
					<Button 
						variant="primary" 
						onClick={handleMarcarLida}
						disabled={loading}
					>
						{loading ? (
							<>
								<span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
								Marcando...
							</>
						) : (
							<>
								<i className="mdi mdi-check-circle me-1"></i>
								Marcar como Lida
							</>
						)}
					</Button>
				)}
				<Button variant="secondary" onClick={onHide} disabled={loading}>
					Fechar
				</Button>
			</Modal.Footer>
		</Modal>
	);
}

