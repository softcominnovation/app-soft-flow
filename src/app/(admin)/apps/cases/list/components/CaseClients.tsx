'use client';

import { Card, Col, Row, Button } from 'react-bootstrap';
import { useState } from 'react';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { ICaseCliente } from '@/types/cases/ICaseCliente';
import { useCaseClients } from '../hooks/useCaseClients';
import CaseClientsSkeleton from '../skelletons/CaseClientsSkeleton';
import ClienteModal from './ClienteModal';
import AddClienteToCaseModal from './AddClienteToCaseModal';
import { deleteCaseClient } from '@/services/caseServices';
import { toast } from 'react-toastify';
import ConfirmDialog from '@/components/ConfirmDialog';
import { hasPermissao } from '@/helpers/permissionsHelpers';

interface CaseClientsProps {
	registro: number | null;
}

/**
 * Componente de apresentação para exibir clientes relacionados a um caso
 * Segue o princípio de responsabilidade única - apenas renderização
 */
export default function CaseClients({ registro }: CaseClientsProps) {
	const { clients, loading, error, refetch } = useCaseClients(registro);
	const [selectedClienteId, setSelectedClienteId] = useState<number | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [deletingId, setDeletingId] = useState<number | null>(null);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [deleteSequencia, setDeleteSequencia] = useState<number | null>(null);
	
	// Verifica se o usuário tem permissão para deletar clientes
	const canDeleteCliente = hasPermissao('projeto_ver_casos_estatistica');

	const handleCardClick = (clienteId: number) => {
		setSelectedClienteId(clienteId);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setSelectedClienteId(null);
	};

	const handleOpenAddModal = () => {
		console.log('handleOpenAddModal chamado!');
		setIsAddModalOpen(true);
		console.log('Estado atualizado, isAddModalOpen deve ser true');
	};

	const handleDeleteClick = (e: React.MouseEvent, sequencia: number) => {
		e.stopPropagation(); // Previne que o click abra o modal do cliente
		setDeleteSequencia(sequencia);
		setShowDeleteDialog(true);
	};

	const handleConfirmDelete = async () => {
		if (!deleteSequencia) return;

		setDeletingId(deleteSequencia);
		try {
			await deleteCaseClient(deleteSequencia);
			toast.success('Cliente removido do caso com sucesso!');
			setShowDeleteDialog(false);
			setDeleteSequencia(null);
			refetch();
		} catch (error: any) {
			console.error('Erro ao deletar cliente do caso:', error);
			const errorData = error?.response?.data;
			const requiredPermission = errorData?.required_permission;
			
			if (requiredPermission) {
				// Se houver erro de permissão, mostra apenas a mensagem de permissão
				const permissionMessage = errorData?.message || `Acesso negado. Permissão necessária: ${requiredPermission}`;
				toast.error(permissionMessage);
			} else {
				// Para outros erros, mostra a mensagem padrão
				toast.error(errorData?.message || 'Erro ao remover cliente do caso');
			}
		} finally {
			setDeletingId(null);
		}
	};

	const formatDate = (dateString: string) => {
		try {
			const date = new Date(dateString);
			return new Intl.DateTimeFormat('pt-BR', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
			}).format(date);
		} catch {
			return dateString;
		}
	};

	// Função para renderizar o header com o botão de adicionar cliente
	const renderHeader = (count?: number) => (
		<div style={{ padding: '1.5rem' }} className="d-flex align-items-center justify-content-between">
			<h5 className="mb-0 d-flex align-items-center">
				<IconifyIcon icon="lucide:users" className="me-2 text-primary" />
				Clientes do Caso
				{count !== undefined && count > 0 && (
					<span className="badge bg-primary ms-2" style={{ fontSize: '0.65rem' }}>
						{count}
					</span>
				)}
			</h5>
			<Button
				variant="primary"
				size="sm"
				className="d-flex align-items-center gap-2"
				style={{ backgroundColor: '#0d6efd', borderColor: '#0d6efd' }}
				onClick={handleOpenAddModal}
			>
				<IconifyIcon icon="lucide:plus" style={{ fontSize: '0.875rem' }} />
				Adicionar Clientes
			</Button>
		</div>
	);

	if (loading) {
		return (
			<>
				<Card className="border-0 shadow-sm mb-0">
					<Card.Header className="bg-light border-bottom p-0">
						{renderHeader()}
					</Card.Header>
					<Card.Body style={{ padding: '1.5rem' }}>
						<CaseClientsSkeleton />
					</Card.Body>
				</Card>
				<AddClienteToCaseModal
					open={isAddModalOpen}
					setOpen={setIsAddModalOpen}
					caseRegistro={registro}
					onClienteAdded={refetch}
				/>
			</>
		);
	}

	if (error) {
		const errorData = (error as any)?.response?.data;
		const errorMessage = errorData?.message || error.message || 'Erro ao carregar clientes';
		const requiredPermission = errorData?.required_permission;
		const displayMessage = requiredPermission 
			? `${errorMessage} (Permissão necessária: ${requiredPermission})`
			: errorMessage;

		return (
			<>
				<Card className="border-0 shadow-sm mb-0">
					<Card.Header className="bg-light border-bottom p-0">
						{renderHeader()}
					</Card.Header>
					<Card.Body style={{ padding: '1.5rem' }}>
						<div className="text-center py-5 text-muted">
							<IconifyIcon icon="lucide:alert-circle" className="mb-3" style={{ fontSize: '3rem' }} />
							<p className="mb-0">{displayMessage}</p>
						</div>
					</Card.Body>
				</Card>
				<AddClienteToCaseModal
					open={isAddModalOpen}
					setOpen={setIsAddModalOpen}
					caseRegistro={registro}
					onClienteAdded={refetch}
				/>
			</>
		);
	}

	if (!clients || clients.length === 0) {
		return (
			<>
				<Card className="border-0 shadow-sm mb-0">
					<Card.Header className="bg-light border-bottom p-0">
						{renderHeader()}
					</Card.Header>
					<Card.Body style={{ padding: '1.5rem' }}>
						<div className="text-center py-5 text-muted">
							<IconifyIcon icon="lucide:users-off" className="mb-3" style={{ fontSize: '3rem' }} />
							<p className="mb-0">Nenhum cliente relacionado a este caso.</p>
						</div>
					</Card.Body>
				</Card>
				<AddClienteToCaseModal
					open={isAddModalOpen}
					setOpen={setIsAddModalOpen}
					caseRegistro={registro}
					onClienteAdded={refetch}
				/>
			</>
		);
	}

	return (
		<>
			<style>{`
				.case-clients-card .card-header {
					padding: 0 !important;
				}
				
				.case-clients-card .card-header > div {
					padding: 1.5rem;
				}
				
				.case-clients-card .card-header h5 {
					font-size: 1rem;
					font-weight: 600;
					margin: 0;
				}
				
				.case-clients-card .card-header h5 .iconify-icon {
					font-size: 1.125rem;
				}
				
				.case-clients-item-card {
					transition: transform 0.2s ease, box-shadow 0.2s ease;
					cursor: pointer;
				}
				
				.case-clients-item-card:hover {
					transform: translateY(-2px);
					box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
				}
				
				@media (max-width: 991.98px) {
					.case-clients-card .card-header > div {
						padding: 1rem !important;
					}
					
					.case-clients-card .card-body {
						padding: 1rem !important;
					}
					
					.case-clients-card .card-header h5 {
						font-size: 0.9375rem;
					}
				}
			`}</style>
			<Card className="border-0 shadow-sm mb-0 case-clients-card">
				<Card.Header className="bg-light border-bottom p-0">
					{renderHeader(clients.length)}
				</Card.Header>
				<Card.Body style={{ padding: '1.5rem' }}>
					<Row className="g-3">
						{clients.map((cliente) => (
							<Col xs={12} md={6} lg={4} key={cliente.sequencia}>
								<Card 
									className="border h-100 case-clients-item-card" 
									style={{ borderColor: 'rgba(0, 0, 0, 0.125)' }}
									onClick={() => handleCardClick(cliente.cliente)}
								>
									<Card.Body className="p-3">
										<div className="d-flex flex-column gap-3">
											{/* Header do card */}
											<div className="d-flex align-items-center justify-content-between">
												<h6 className="mb-0 fw-semibold text-body">
													{cliente.cliente_nome || `Cliente-${cliente.cliente ?? cliente.registro}`}
												</h6>
												<div className="d-flex align-items-center gap-2">
													{cliente.incidente > 0 && (
														<span className="badge bg-warning text-dark" style={{ fontSize: '0.65rem' }}>
															Incidente
														</span>
													)}
													<Button
														variant="danger"
														size="sm"
														className="p-1 d-flex align-items-center justify-content-center"
														style={{ width: '28px', height: '28px', minWidth: '28px' }}
														onClick={(e) => handleDeleteClick(e, cliente.sequencia)}
														disabled={!canDeleteCliente || deletingId === cliente.sequencia}
														title={canDeleteCliente ? "Remover cliente do caso" : "Você não tem permissão para remover clientes"}
													>
														{deletingId === cliente.sequencia ? (
															<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" style={{ width: '0.875rem', height: '0.875rem' }} />
														) : (
															<IconifyIcon icon="lucide:trash-2" style={{ fontSize: '0.875rem' }} />
														)}
													</Button>
												</div>
											</div>

											{/* Conteúdo do card */}
											<div className="d-flex flex-column gap-2">
												<div className="d-flex align-items-center gap-2">
													<IconifyIcon icon="lucide:hash" className="text-muted" style={{ fontSize: '0.875rem' }} />
													<span className="text-muted small">Sequência:</span>
													<span className="fw-semibold">{cliente.sequencia}</span>
												</div>
												<div className="d-flex align-items-center gap-2">
													<IconifyIcon icon="lucide:user" className="text-muted" style={{ fontSize: '0.875rem' }} />
													<span className="text-muted small">Cliente:</span>
													<span className="fw-semibold">{cliente.cliente_nome || cliente.cliente}</span>
												</div>
												<div className="d-flex align-items-center gap-2">
													<IconifyIcon icon="lucide:calendar" className="text-muted" style={{ fontSize: '0.875rem' }} />
													<span className="text-muted small">Data Solicitação:</span>
													<span className="fw-semibold">{formatDate(cliente.data_solicitacao)}</span>
												</div>
											</div>
										</div>
									</Card.Body>
								</Card>
							</Col>
						))}
					</Row>
				</Card.Body>
			</Card>
			<ClienteModal 
				open={isModalOpen} 
				setOpen={handleCloseModal} 
				clienteId={selectedClienteId}
			/>
			<AddClienteToCaseModal
				open={isAddModalOpen}
				setOpen={setIsAddModalOpen}
				caseRegistro={registro}
				onClienteAdded={refetch}
			/>
			<ConfirmDialog
				show={showDeleteDialog}
				title="Remover Cliente do Caso"
				message="Deseja realmente remover este cliente do caso? Esta ação não pode ser desfeita."
				confirmText="Remover"
				cancelText="Cancelar"
				confirmVariant="danger"
				onConfirm={handleConfirmDelete}
				onCancel={() => {
					setShowDeleteDialog(false);
					setDeleteSequencia(null);
				}}
				loading={deletingId !== null}
			/>
		</>
	);
}
