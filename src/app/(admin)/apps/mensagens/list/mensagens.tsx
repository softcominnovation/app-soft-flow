import { DropdownButton, DropdownItem, Table } from 'react-bootstrap';
import { IMensagem } from '@/types/mensagens/IMensagem';
import ListSkelleton from '@/app/(admin)/apps/mensagens/list/skelletons/listSkelleton';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { useMensagensContext } from '@/contexts/mensagensContext';
import { useEffect, useRef, useState } from 'react';
import { marcarMensagemComoLida } from '@/services/mensagensServices';
import { toast } from 'react-toastify';
import Link from 'next/link';
import NotificationModal from '@/layouts/Topbar/NotificationModal';

type Props = {
	data: IMensagem[] | null;
	loading: boolean;
};

const MensagensTable = ({ data, loading }: Props) => {
	const { loadMoreMensagens, loadingMore, marcarComoLida, hasMore, fetchMensagens, currentFilters } = useMensagensContext();
	const [marcandoLida, setMarcandoLida] = useState<number | null>(null);
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

	const handleMarcarComoLida = async (msgId: number) => {
		if (marcandoLida) {
			return;
		}

		setMarcandoLida(msgId);
		try {
			await marcarComoLida(msgId);
			toast.success('Mensagem marcada como lida!');
		} catch (error: any) {
			console.error('Erro ao marcar mensagem como lida:', error);
			toast.error(error?.message || 'Erro ao marcar a mensagem como lida');
		} finally {
			setMarcandoLida(null);
		}
	};

	const formatDate = (dateString: string | null) => {
		if (!dateString) return '-';
		const date = new Date(dateString);
		return date.toLocaleDateString('pt-BR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	const handleRowClick = (msg: IMensagem) => {
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
				.mensagens-table tbody tr:hover {
					background-color: rgba(0, 0, 0, 0.05) !important;
					transition: background-color 0.2s ease;
				}
				.mensagens-table tbody tr.unread {
					background-color: rgba(0, 123, 255, 0.05) !important;
					font-weight: 500;
				}
			`}</style>
			<div className="d-none d-md-block">
				<Table
					responsive
					size="sm"
					className="table-centered table-nowrap table-sm align-middle mb-0 mensagens-table"
				>
					<thead className="table-light text-muted">
						<tr>
							<th className="py-3">Título</th>
							<th className="py-3">Enviado Por</th>
							<th className="py-3">Mensagem</th>
							<th className="py-3">Data/Hora</th>
							<th className="py-3">Status</th>
							<th className="py-3 text-center" style={{ width: '125px' }}>
								Ações
							</th>
						</tr>
					</thead>

					<tbody>
						{loading ? (
							<ListSkelleton rows={10} />
						) : (data || []).length ? (
							<>
								{(data || []).map((msg, index) => (
									<tr
										key={`${msg.id}-${index}`}
										className={`align-middle ${!msg.status_leitura.lido ? 'unread' : ''}`}
										style={{ cursor: 'pointer' }}
										onClick={() => handleRowClick(msg)}
									>
										<td className="py-2">
											<span className="text-body fw-bold">{msg.titulo}</span>
										</td>

										<td className="py-2">
											<span className="text-muted">{msg.enviado_por}</span>
										</td>

										<td className="py-2" style={{ maxWidth: 360 }}>
											<p className="mb-0 text-truncate" title={msg.msg_texto}>
												{msg.msg_texto}
											</p>
										</td>

										<td className="py-2">
											<span className="text-muted">
												{formatDate(msg.datas.hora || msg.datas.enviado)}
											</span>
										</td>

										<td className="py-2">
											{msg.status_leitura.lido ? (
												<span className="badge bg-success">Lida</span>
											) : (
												<span className="badge bg-warning">Não Lida</span>
											)}
										</td>

										<td className="py-2 text-center position-relative" onClick={(e) => e.stopPropagation()}>
											<DropdownButton
												size="sm"
												variant="light"
												title={<IconifyIcon icon={'lucide:align-left'} />}
											>
												{msg.link && (
													<DropdownItem as={Link} href={msg.link} target="_blank" className="text-center">
														<IconifyIcon icon="lucide:external-link" className="me-2" />
														Abrir Link
													</DropdownItem>
												)}
												{!msg.status_leitura.lido && (
													<DropdownItem
														className="text-center text-primary"
														onClick={() => handleMarcarComoLida(msg.id)}
														disabled={marcandoLida === msg.id}
													>
														{marcandoLida === msg.id ? (
															<>
																<span
																	className="spinner-border spinner-border-sm me-2"
																	role="status"
																	aria-hidden="true"
																></span>
																Marcando...
															</>
														) : (
															<>
																<IconifyIcon icon="lucide:check-circle" className="me-2" />
																Marcar como Lida
															</>
														)}
													</DropdownItem>
												)}
											</DropdownButton>
										</td>
									</tr>
								))}
								{loadingMore && <ListSkelleton rows={15} />}
							</>
						) : (
							<tr>
								<td colSpan={6} className="text-center text-muted py-4">
									Nenhuma mensagem encontrada.
								</td>
							</tr>
						)}
					</tbody>
				</Table>
			</div>

			<div className="d-md-none">
				{loading ? (
					<div className="text-center py-4">
						<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
					</div>
				) : (data || []).length ? (
					<>
						{(data || []).map((msg, index) => (
							<div
								key={`mobile-msg-${msg.id}-${index}`}
								className={`card mb-3 ${!msg.status_leitura.lido ? 'border-primary' : ''}`}
								style={{ cursor: 'pointer' }}
								onClick={() => handleRowClick(msg)}
							>
								<div className="card-body">
									<div className="d-flex justify-content-between align-items-start mb-2">
										<h6 className="card-title mb-0">{msg.titulo}</h6>
										{msg.status_leitura.lido ? (
											<span className="badge bg-success">Lida</span>
										) : (
											<span className="badge bg-warning">Não Lida</span>
										)}
									</div>
									<p className="card-text text-muted small mb-2">{msg.msg_texto}</p>
									<div className="d-flex justify-content-between align-items-center">
										<small className="text-muted">
											{msg.enviado_por} • {formatDate(msg.datas.hora || msg.datas.enviado)}
										</small>
										{!msg.status_leitura.lido && (
											<button
												className="btn btn-sm btn-primary"
												onClick={() => handleMarcarComoLida(msg.id)}
												disabled={marcandoLida === msg.id}
											>
												{marcandoLida === msg.id ? (
													<span className="spinner-border spinner-border-sm" role="status"></span>
												) : (
													'Marcar como Lida'
												)}
											</button>
										)}
									</div>
								</div>
							</div>
						))}
						{loadingMore && (
							<div className="text-center py-4">
								<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
							</div>
						)}
					</>
				) : (
					<p className="text-center text-muted py-4">Nenhuma mensagem encontrada.</p>
				)}
			</div>

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

