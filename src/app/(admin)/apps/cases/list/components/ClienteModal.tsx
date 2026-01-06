'use client';

import { Modal, Row, Col, Placeholder, Form, Button, Card } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { useCliente } from '../hooks/useCliente';
import { useModalScroll } from '../hooks/useModalScroll';
import ClienteContactColumn from './ClienteContactColumn';
import ClienteModalSkeleton from '../skelletons/clienteModalSkeleton';
import ClienteModalDesktopSkeleton from '../skelletons/clienteModalDesktopSkeleton';
import ClienteProdutosEnderecosUrl from './ClienteProdutosEnderecosUrl';

interface ClienteModalProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	clienteId: number | null;
}

/**
 * Componente de modal para exibir detalhes de um cliente
 * Segue o princípio de responsabilidade única - apenas apresentação
 */
export default function ClienteModal({ open, setOpen, clienteId }: ClienteModalProps) {
	const { cliente, loading, error } = useCliente(clienteId);

	// Prevenir scroll do body quando modal está aberto
	useModalScroll(open);

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

	const formatPhone = (phone: string) => {
		if (!phone) return '-';
		return phone;
	};

	const formatCNPJ = (cnpj: string) => {
		if (!cnpj) return '-';
		return cnpj;
	};

	const formatCEP = (cep: string) => {
		if (!cep) return '-';
		return cep;
	};

	return (
		<>
			<style>{`
				.modal-fullscreen-cliente {
					position: fixed !important;
					top: 0 !important;
					left: 0 !important;
					right: 0 !important;
					bottom: 0 !important;
					margin: 0 !important;
					max-width: 100% !important;
					width: 100% !important;
					height: 100% !important;
				}

				.modal-fullscreen-cliente .modal-dialog {
					margin: 0 !important;
					max-width: 100% !important;
					width: 100% !important;
					height: 100% !important;
					display: flex !important;
					flex-direction: column !important;
				}

				.modal-fullscreen-cliente .modal-content {
					height: 100% !important;
					border: 0 !important;
					border-radius: 0 !important;
					display: flex !important;
					flex-direction: column !important;
				}
				
				.modal-fullscreen-cliente .modal-body {
					padding: 1.5rem;
					flex: 1 1 auto;
					overflow-y: auto;
					overflow-x: hidden;
					min-height: 0;
				}

				@media (max-width: 991.98px) {
					.modal-fullscreen-cliente .modal-body {
						padding: 1rem;
					}
					
					.modal-fullscreen-cliente .modal-header {
						padding: 0.75rem 1rem;
					}
					
					.modal-fullscreen-cliente .modal-title {
						font-size: 1.1rem;
					}
				}
			`}</style>
			<Modal 
				show={open} 
				onHide={() => setOpen(false)} 
				backdrop="static" 
				fullscreen={true}
				className="modal-fullscreen-cliente"
			>
				<Modal.Header closeButton className="bg-light border-bottom flex-shrink-0">
					<Modal.Title className="fw-bold text-body d-flex align-items-center gap-2">
						<IconifyIcon icon="lucide:user" className="d-none d-lg-block text-primary" />
						<IconifyIcon icon="lucide:user" className="d-lg-none text-primary" style={{ fontSize: '1.25rem' }} />
						{cliente ? `Cliente #${cliente.registro}` : 'Detalhes do Cliente'}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body className="p-0 d-flex flex-column" style={{ flex: '1 1 auto', overflow: 'hidden', minHeight: 0 }}>
					{/* Layout Mobile: Tudo empilhado */}
					<div className="d-flex d-lg-none flex-column h-100" style={{ minHeight: 0 }}>
						<div className="custom-scrollbar px-3 px-lg-4 py-3 py-lg-4" style={{ flex: '1 1 auto', overflowY: 'auto', overflowX: 'hidden', minHeight: 0, maxHeight: '100%' }}>
							{loading && <ClienteModalSkeleton />}

							{error && (
								<div className="text-center py-5 text-muted">
									<IconifyIcon icon="lucide:alert-circle" className="mb-3" style={{ fontSize: '3rem' }} />
									<p className="mb-0">Erro ao carregar dados do cliente. Tente novamente mais tarde.</p>
								</div>
							)}

								{!loading && !error && cliente && (
									<div className="d-flex flex-column gap-4">
									{/* Header com nome e status */}
									<div className="border-bottom pb-2">
										<div className="d-flex align-items-center gap-2 mb-1">
											<h5 className="mb-0 fw-bold text-body">{cliente.nome}</h5>
											{cliente.desativado ? (
												<span className="badge bg-danger">Desativado</span>
											) : (
												<span className="badge bg-success">Ativo</span>
											)}
										</div>
										{cliente.razao_social && (
											<p className="text-muted mb-0 small">{cliente.razao_social}</p>
										)}
									</div>

									{/* Informações principais */}
									<Card className="border-0 shadow-sm">
										<Card.Header className="bg-light border-bottom">
											<h5 className="mb-0 fw-semibold d-flex align-items-center gap-2" style={{ fontSize: '1rem' }}>
												<IconifyIcon icon="lucide:info" className="text-primary" />
												Informações Principais
											</h5>
										</Card.Header>
										<Card.Body>
											<Row className="g-3">
												<Col xs={12} md={4}>
													<Form.Group>
														<Form.Label className="fw-semibold d-flex align-items-center gap-2 small">
															<IconifyIcon icon="lucide:hash" className="text-primary" style={{ fontSize: '0.875rem' }} />
															Registro
														</Form.Label>
														<Form.Control type="text" value={cliente.registro} disabled />
													</Form.Group>
												</Col>
												<Col xs={12} md={4}>
													<Form.Group>
														<Form.Label className="fw-semibold d-flex align-items-center gap-2 small">
															<IconifyIcon icon="lucide:file-text" className="text-primary" style={{ fontSize: '0.875rem' }} />
															CNPJ
														</Form.Label>
														<Form.Control type="text" value={formatCNPJ(cliente.cnpj)} disabled />
													</Form.Group>
												</Col>
												<Col xs={12} md={4}>
													<Form.Group>
														<Form.Label className="fw-semibold d-flex align-items-center gap-2 small">
															<IconifyIcon icon="lucide:calendar" className="text-primary" style={{ fontSize: '0.875rem' }} />
															Data de Cadastro
														</Form.Label>
														<Form.Control type="text" value={formatDate(cliente.data_cadastro)} disabled />
													</Form.Group>
												</Col>
											</Row>
										</Card.Body>
									</Card>

									{/* Produtos / Endereços / URLs - Seção colapsável */}
									<ClienteProdutosEnderecosUrl registro={cliente.registro} />

									{/* Endereço */}
									<Card className="border-0 shadow-sm">
										<Card.Header className="bg-light border-bottom">
											<h5 className="mb-0 fw-semibold d-flex align-items-center gap-2" style={{ fontSize: '1rem' }}>
												<IconifyIcon icon="lucide:map-pin" className="text-primary" />
												Endereço
											</h5>
										</Card.Header>
										<Card.Body>
											<Row className="g-3">
												<Col xs={12}>
													<Form.Group>
														<Form.Label className="fw-semibold d-flex align-items-center gap-2 small">
															<IconifyIcon icon="lucide:home" className="text-primary" style={{ fontSize: '0.875rem' }} />
															Endereço
														</Form.Label>
														<Form.Control type="text" value={cliente.endereco || ''} disabled />
													</Form.Group>
												</Col>
												<Col xs={12} md={6}>
													<Form.Group>
														<Form.Label className="fw-semibold d-flex align-items-center gap-2 small">
															<IconifyIcon icon="lucide:map" className="text-primary" style={{ fontSize: '0.875rem' }} />
															Bairro
														</Form.Label>
														<Form.Control type="text" value={cliente.bairro || ''} disabled />
													</Form.Group>
												</Col>
												<Col xs={12} md={6}>
													<Form.Group>
														<Form.Label className="fw-semibold d-flex align-items-center gap-2 small">
															<IconifyIcon icon="lucide:building" className="text-primary" style={{ fontSize: '0.875rem' }} />
															Cidade / UF
														</Form.Label>
														<Form.Control 
															type="text" 
															value={`${cliente.cidade || ''} ${cliente.uf ? `/${cliente.uf}` : ''}`.trim() || ''} 
															disabled 
														/>
													</Form.Group>
												</Col>
												<Col xs={12} md={6}>
													<Form.Group>
														<Form.Label className="fw-semibold d-flex align-items-center gap-2 small">
															<IconifyIcon icon="lucide:hash" className="text-primary" style={{ fontSize: '0.875rem' }} />
															CEP
														</Form.Label>
														<Form.Control type="text" value={formatCEP(cliente.cep)} disabled />
													</Form.Group>
												</Col>
											</Row>
										</Card.Body>
									</Card>

									{/* Contatos no mobile */}
									<Card className="border-0 shadow-sm">
										<Card.Header className="bg-light border-bottom">
											<h5 className="mb-0 fw-semibold d-flex align-items-center gap-2" style={{ fontSize: '1rem' }}>
												<IconifyIcon icon="lucide:phone" className="text-primary" />
												Contatos
											</h5>
										</Card.Header>
										<Card.Body>
											<Row className="g-3">
												<Col xs={12}>
													<Form.Group>
														<Form.Label className="fw-semibold d-flex align-items-center gap-2 small">
															<IconifyIcon icon="lucide:phone-call" className="text-primary" style={{ fontSize: '0.875rem' }} />
															Telefone Residencial
														</Form.Label>
														<Form.Control type="text" value={formatPhone(cliente.fone_resid)} disabled />
													</Form.Group>
												</Col>
												<Col xs={12}>
													<Form.Group>
														<Form.Label className="fw-semibold d-flex align-items-center gap-2 small">
															<IconifyIcon icon="lucide:phone" className="text-primary" style={{ fontSize: '0.875rem' }} />
															Telefone Comercial
														</Form.Label>
														<Form.Control type="text" value={formatPhone(cliente.fone_com)} disabled />
													</Form.Group>
												</Col>
											</Row>
										</Card.Body>
									</Card>
								</div>
							)}
						</div>
					</div>

					{/* Layout Desktop: Duas colunas com contatos sempre visíveis à direita */}
					<div className="d-none d-lg-flex h-100" style={{ minHeight: 0 }}>
						{/* Coluna esquerda - Conteúdo principal */}
						<div className="d-flex flex-column" style={{ flex: '1 1 auto', minWidth: 0 }}>
							<div className="custom-scrollbar px-4 py-4" style={{ flex: '1 1 auto', overflowY: 'auto', overflowX: 'hidden', minHeight: 0, maxHeight: '100%' }}>
								{loading && <ClienteModalDesktopSkeleton />}

								{error && (
									<div className="text-center py-5 text-muted">
										<IconifyIcon icon="lucide:alert-circle" className="mb-3" style={{ fontSize: '3rem' }} />
										<p className="mb-0">Erro ao carregar dados do cliente. Tente novamente mais tarde.</p>
									</div>
								)}

								{!loading && !error && cliente && (
									<div className="d-flex flex-column gap-4">
										{/* Header com nome e status */}
										<div className="border-bottom pb-2">
											<div className="d-flex align-items-center gap-2 mb-1">
												<h5 className="mb-0 fw-bold text-body">{cliente.nome}</h5>
												{cliente.desativado ? (
													<span className="badge bg-danger">Desativado</span>
												) : (
													<span className="badge bg-success">Ativo</span>
												)}
											</div>
											{cliente.razao_social && (
												<p className="text-muted mb-0 small">{cliente.razao_social}</p>
											)}
										</div>

										{/* Informações principais */}
										<Card className="border-0 shadow-sm">
											<Card.Header className="bg-light border-bottom">
												<h5 className="mb-0 fw-semibold d-flex align-items-center gap-2" style={{ fontSize: '1rem' }}>
													<IconifyIcon icon="lucide:info" className="text-primary" />
													Informações Principais
												</h5>
											</Card.Header>
											<Card.Body>
												<Row className="g-3">
													<Col xs={12} md={4}>
														<Form.Group>
															<Form.Label className="fw-semibold d-flex align-items-center gap-2 small">
																<IconifyIcon icon="lucide:hash" className="text-primary" style={{ fontSize: '0.875rem' }} />
																Registro
															</Form.Label>
															<Form.Control type="text" value={cliente.registro} disabled />
														</Form.Group>
													</Col>
													<Col xs={12} md={4}>
														<Form.Group>
															<Form.Label className="fw-semibold d-flex align-items-center gap-2 small">
																<IconifyIcon icon="lucide:file-text" className="text-primary" style={{ fontSize: '0.875rem' }} />
																CNPJ
															</Form.Label>
															<Form.Control type="text" value={formatCNPJ(cliente.cnpj)} disabled />
														</Form.Group>
													</Col>
													<Col xs={12} md={4}>
														<Form.Group>
															<Form.Label className="fw-semibold d-flex align-items-center gap-2 small">
																<IconifyIcon icon="lucide:calendar" className="text-primary" style={{ fontSize: '0.875rem' }} />
																Data de Cadastro
															</Form.Label>
															<Form.Control type="text" value={formatDate(cliente.data_cadastro)} disabled />
														</Form.Group>
													</Col>
												</Row>
											</Card.Body>
										</Card>

										{/* Produtos / Endereços / URLs - Seção colapsável */}
										<ClienteProdutosEnderecosUrl registro={cliente.registro} />

										{/* Endereço */}
										<Card className="border-0 shadow-sm">
											<Card.Header className="bg-light border-bottom">
												<h5 className="mb-0 fw-semibold d-flex align-items-center gap-2" style={{ fontSize: '1rem' }}>
													<IconifyIcon icon="lucide:map-pin" className="text-primary" />
													Endereço
												</h5>
											</Card.Header>
											<Card.Body>
												<Row className="g-3">
													<Col xs={12}>
														<Form.Group>
															<Form.Label className="fw-semibold d-flex align-items-center gap-2 small">
																<IconifyIcon icon="lucide:home" className="text-primary" style={{ fontSize: '0.875rem' }} />
																Endereço
															</Form.Label>
															<Form.Control type="text" value={cliente.endereco || ''} disabled />
														</Form.Group>
													</Col>
													<Col xs={12} md={6}>
														<Form.Group>
															<Form.Label className="fw-semibold d-flex align-items-center gap-2 small">
																<IconifyIcon icon="lucide:map" className="text-primary" style={{ fontSize: '0.875rem' }} />
																Bairro
															</Form.Label>
															<Form.Control type="text" value={cliente.bairro || ''} disabled />
														</Form.Group>
													</Col>
													<Col xs={12} md={6}>
														<Form.Group>
															<Form.Label className="fw-semibold d-flex align-items-center gap-2 small">
																<IconifyIcon icon="lucide:building" className="text-primary" style={{ fontSize: '0.875rem' }} />
																Cidade / UF
															</Form.Label>
															<Form.Control 
																type="text" 
																value={`${cliente.cidade || ''} ${cliente.uf ? `/${cliente.uf}` : ''}`.trim() || ''} 
																disabled 
															/>
														</Form.Group>
													</Col>
													<Col xs={12} md={6}>
														<Form.Group>
															<Form.Label className="fw-semibold d-flex align-items-center gap-2 small">
																<IconifyIcon icon="lucide:hash" className="text-primary" style={{ fontSize: '0.875rem' }} />
																CEP
															</Form.Label>
															<Form.Control type="text" value={formatCEP(cliente.cep)} disabled />
														</Form.Group>
													</Col>
												</Row>
											</Card.Body>
										</Card>
									</div>
								)}
							</div>
						</div>

						{/* Coluna direita - Contatos (sempre visível) */}
						<>
							{/* Separador vertical sutil */}
							<div className="border-start border-secondary" style={{ width: '1px', margin: '12px 0', opacity: 0.3 }} />

							{/* Coluna direita - Contatos */}
							<div className="d-flex flex-column" style={{ width: '400px', minWidth: '400px', maxWidth: '400px' }}>
								<div className="custom-scrollbar px-4 py-4" style={{ flex: '1 1 auto', overflowY: 'auto', overflowX: 'hidden' }}>
									<ClienteContactColumn cliente={cliente} loading={loading} />
								</div>
							</div>
						</>
					</div>
				</Modal.Body>
				<Modal.Footer className="bg-light border-top flex-shrink-0">
					<div className="w-100 d-flex justify-content-end">
						<Button 
							variant="secondary" 
							onClick={() => setOpen(false)}
						>
							<IconifyIcon icon="lucide:x" className="me-2" />
							Fechar
						</Button>
					</div>
				</Modal.Footer>
			</Modal>
		</>
	);
}

