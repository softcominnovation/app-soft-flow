import { Card, Collapse, Form, Row, Col, Badge } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { IClienteProdutoEnderecoUrl } from '@/types/clientes/IClienteProdutoEnderecoUrl';
import { useClienteProdutosEnderecosUrl } from '../hooks/useClienteProdutosEnderecosUrl';
import useToggle from '@/hooks/useToggle';
import ClienteProdutosEnderecosUrlSkeleton from '../skelletons/clienteProdutosEnderecosUrlSkeleton';

interface ClienteProdutosEnderecosUrlProps {
	registro: number | null;
}

export default function ClienteProdutosEnderecosUrl({ registro }: ClienteProdutosEnderecosUrlProps) {
	const [isOpen, toggle] = useToggle(false);
	const { produtos, loading, error, refetch } = useClienteProdutosEnderecosUrl(registro);

	const handleToggle = () => {
		toggle();
		if (!isOpen && registro) {
			// Quando expandir, busca os dados
			refetch();
		}
	};

	const formatDate = (dateString: string) => {
		if (!dateString) return '-';
		try {
			const date = new Date(dateString);
			return date.toLocaleString('pt-BR', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
			});
		} catch {
			return dateString;
		}
	};

	return (
		<Card className="border-0 shadow-sm">
			<Card.Header
				className="bg-light border-bottom"
				style={{ cursor: 'pointer' }}
				onClick={handleToggle}
			>
				<h5 className="mb-0 fw-semibold d-flex align-items-center justify-content-between gap-2" style={{ fontSize: '1rem' }}>
					<div className="d-flex align-items-center gap-2">
						<IconifyIcon icon="lucide:globe" className="text-primary" />
						Produtos / Endereços / URLs
					</div>
					<div className="d-flex align-items-center gap-2">
						{produtos.length > 0 && (
							<Badge bg="primary" style={{ fontSize: '0.65rem' }}>
								{produtos.length}
							</Badge>
						)}
						<IconifyIcon
							icon={isOpen ? 'lucide:chevron-up' : 'lucide:chevron-down'}
							className="text-body"
							style={{ fontSize: '1rem' }}
						/>
					</div>
				</h5>
			</Card.Header>
			<Collapse in={isOpen}>
				<div>
					<Card.Body>
						{loading && <ClienteProdutosEnderecosUrlSkeleton />}

						{error && (
							<div className="alert alert-danger mb-0" role="alert">
								<IconifyIcon icon="lucide:alert-circle" className="me-2" />
								Erro ao carregar produtos/endereços/URLs: {error.message}
							</div>
						)}

						{!loading && !error && produtos.length === 0 && (
							<div className="text-center text-muted py-3">
								<IconifyIcon icon="lucide:inbox" className="mb-2" style={{ fontSize: '2rem' }} />
								<p className="mb-0 small">Nenhum produto/endereço/URL encontrado</p>
							</div>
						)}

						{!loading && !error && produtos.length > 0 && (
							<div className="d-flex flex-column gap-3">
								{produtos.map((produto) => (
									<Card key={produto.seq} className="border">
										<Card.Body className="p-3">
											<div className="d-flex flex-column gap-2">
												<div>
													<h5 className="mb-0 fw-bold text-body" style={{ fontSize: '1.125rem' }}>{produto.produto_nome}</h5>
												</div>

												<Row className="g-2">
													<Col xs={12}>
														<Form.Group>
															<Form.Label className="fw-semibold d-flex align-items-center gap-2 small">
																<IconifyIcon icon="lucide:link" className="text-primary" style={{ fontSize: '0.875rem' }} />
																URL
															</Form.Label>
															<Form.Control type="text" value={produto.url || ''} disabled />
														</Form.Group>
													</Col>
													<Col xs={12} md={6}>
														<Form.Group>
															<Form.Label className="fw-semibold d-flex align-items-center gap-2 small">
																<IconifyIcon icon="lucide:user" className="text-primary" style={{ fontSize: '0.875rem' }} />
																Usuário
															</Form.Label>
															<Form.Control type="text" value={produto.usuario || '-'} disabled />
														</Form.Group>
													</Col>
													<Col xs={12} md={6}>
														<Form.Group>
															<Form.Label className="fw-semibold d-flex align-items-center gap-2 small">
																<IconifyIcon icon="lucide:lock" className="text-primary" style={{ fontSize: '0.875rem' }} />
																Senha
															</Form.Label>
															<Form.Control type="text" value={produto.senha || '-'} disabled />
														</Form.Group>
													</Col>
													{produto.observacao && (
														<Col xs={12}>
															<Form.Group>
																<Form.Label className="fw-semibold d-flex align-items-center gap-2 small">
																	<IconifyIcon icon="lucide:file-text" className="text-primary" style={{ fontSize: '0.875rem' }} />
																	Observação
																</Form.Label>
																<Form.Control as="textarea" rows={2} value={produto.observacao} disabled />
															</Form.Group>
														</Col>
													)}
													<Col xs={12}>
														<div className="d-flex flex-column gap-1">
															<small className="text-muted d-flex align-items-center gap-2">
																<IconifyIcon icon="lucide:user-check" className="text-muted" style={{ fontSize: '0.75rem' }} />
																Alterado por: <strong>{produto.alteracao_usuario}</strong>
															</small>
															<small className="text-muted d-flex align-items-center gap-2">
																<IconifyIcon icon="lucide:calendar" className="text-muted" style={{ fontSize: '0.75rem' }} />
																Alterado em: <strong>{formatDate(produto.alteracao_datahora)}</strong>
															</small>
														</div>
													</Col>
												</Row>
											</div>
										</Card.Body>
									</Card>
								))}
							</div>
						)}
					</Card.Body>
				</div>
			</Collapse>
		</Card>
	);
}

