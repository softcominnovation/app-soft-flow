import { Card, Col, Row } from 'react-bootstrap';
import { IMensagem } from '@/types/mensagens/IMensagem';
import { useMensagensContext } from '@/contexts/mensagensContext';
import { useEffect, useRef, useState } from 'react';
import NotificationModal from '@/layouts/Topbar/NotificationModal';

type Props = {
	data: IMensagem[] | null;
	loading: boolean;
};

const MensagensTable = ({ data, loading }: Props) => {
	const { loadMoreMensagens, loadingMore, marcarComoLida, hasMore, fetchMensagens, currentFilters } = useMensagensContext();
	const [showModal, setShowModal] = useState(false);
	const [selectedMensagem, setSelectedMensagem] = useState<IMensagem | null>(null);
	const sentinelRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const node = sentinelRef.current;

		if (!node || loadingMore || !hasMore) {
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						loadMoreMensagens();
					}
				});
			},
			{
				root: null,
				rootMargin: '200px 0px 0px 0px',
				threshold: 0,
			}
		);

		observer.observe(node);

		return () => {
			observer.disconnect();
		};
	}, [loadMoreMensagens, loadingMore, hasMore]);

	// Função para truncar texto
	const truncateText = (text: string, maxLength: number = 120): string => {
		if (!text || text.length <= maxLength) return text;
		return text.substring(0, maxLength).trim() + '...';
	};

	const formatDate = (dateString: string | null) => {
		if (!dateString) return '-';
		const date = new Date(dateString);
		// Formato similar ao da imagem: "March 27, 2018 10:00 PM"
		const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
		const month = months[date.getMonth()];
		const day = date.getDate();
		const year = date.getFullYear();
		const hours = date.getHours();
		const minutes = date.getMinutes();
		const ampm = hours >= 12 ? 'PM' : 'AM';
		const displayHours = hours % 12 || 12;
		const displayMinutes = minutes.toString().padStart(2, '0');
		return `${month} ${day}, ${year} ${displayHours}:${displayMinutes} ${ampm}`;
	};

	const handleCardClick = (msg: IMensagem) => {
		setSelectedMensagem(msg);
		setShowModal(true);
	};

	const handleMarcarLida = async (msgId: number) => {
		await marcarComoLida(msgId);
		// Atualiza a lista após marcar como lida usando os filtros atuais
		if (currentFilters) {
			fetchMensagens(currentFilters);
		}
	};

	return (
		<>
			<style>{`
				.notification-card {
					cursor: pointer;
					transition: transform 0.2s ease, box-shadow 0.2s ease;
					border: 1px solid #e9ecef;
					height: 100%;
				}
				.notification-card:hover {
					transform: translateY(-4px);
					box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
				}
				
				.notification-status-badge {
					 display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: fit-content;
                    border-radius: 4px;
                    padding: 2px 6px; /* menor */
                    font-size: 0.65rem; /* menor */
                    font-weight: 600;
                    margin-bottom: 8px;
				}
				.notification-title {
					font-weight: 600;
					color: #212529;
					margin-bottom: 8px;
					font-size: 1rem;
					line-height: 1.3;
				}
				.notification-date {
					color: #6c757d;
					font-size: 0.8125rem;
					margin-bottom: 12px;
				}
				.notification-message {
					color: #6c757d;
					font-size: 0.875rem;
					line-height: 1.5;
					margin-bottom: 12px;
					display: -webkit-box;
					-webkit-line-clamp: 20;
					-webkit-box-orient: vertical;
					overflow: hidden;
					text-overflow: ellipsis;
				}
				.notification-author {
					color: #6c757d;
					font-size: 0.8125rem;
					margin-top: auto;
				}
				.notification-author-label {
					font-weight: 500;
					color: #6c757d;
				}
				.notification-author-value {
					color: #495057;
				}
			`}</style>
			
			{loading ? (
				<Row className="g-3">
					{Array.from({ length: 8 }).map((_, index) => (
						<Col key={index} xs={12} sm={6} md={4} lg={3}>
							<Card className="notification-card">
								<Card.Body>
									<div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
										<span className="spinner-border spinner-border-sm text-primary" role="status"></span>
									</div>
								</Card.Body>
							</Card>
						</Col>
					))}
				</Row>
			) : (data || []).length ? (
				<>
					<Row className="g-3">
						{(data || []).map((msg, index) => (
							<Col key={`notification-${msg.id}-${index}`} xs={12} sm={6} md={4} lg={3}>
								<Card 
									className={`notification-card ${!msg.status_leitura.lido ? 'unread' : ''}`}
									onClick={() => handleCardClick(msg)}
								>
									<Card.Body className="d-flex flex-column" style={{ minHeight: '200px' }}>
										<span 
											className={`notification-status-badge ${
												msg.status_leitura.lido 
													? 'bg-success text-white' 
													: 'bg-warning text-dark'
											}`}
										>
											{msg.status_leitura.lido ? 'Lida' : 'Não lida'}
										</span>
										
										<h6 className="notification-title">{msg.titulo}</h6>
										
										<div className="notification-date">
											{formatDate(msg.datas.hora || msg.datas.enviado)}
										</div>
										
										<p className="notification-message" title={msg.msg_texto}>
											{truncateText(msg.msg_texto, 120)}
										</p>
										
										<div className="notification-author mt-auto">
											<span className="notification-author-label">Enviado por: </span>
											<span className="notification-author-value">{msg.enviado_por || 'N/A'}</span>
										</div>
									</Card.Body>
								</Card>
							</Col>
						))}
					</Row>
					
					{loadingMore && (
						<Row className="g-3 mt-2">
							{Array.from({ length: 4 }).map((_, index) => (
								<Col key={`loading-${index}`} xs={12} sm={6} md={4} lg={3}>
									<Card className="notification-card">
										<Card.Body>
											<div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
												<span className="spinner-border spinner-border-sm text-primary" role="status"></span>
											</div>
										</Card.Body>
									</Card>
								</Col>
							))}
						</Row>
					)}
				</>
			) : (
				<div className="text-center text-muted py-5">
					<p className="mb-0">Nenhuma mensagem encontrada.</p>
				</div>
			)}

			{(data || []).length > 0 && (
				<div
					ref={sentinelRef}
					style={{
						height: 1,
						width: '100%',
					}}
				/>
			)}
			<NotificationModal
				show={showModal}
				mensagem={selectedMensagem}
				onHide={() => {
					setShowModal(false);
					setSelectedMensagem(null);
				}}
				onMarcarLida={handleMarcarLida}
			/>
		</>
	);
};

export default MensagensTable;

