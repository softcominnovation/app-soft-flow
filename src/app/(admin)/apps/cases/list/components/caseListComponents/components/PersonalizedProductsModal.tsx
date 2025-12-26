'use client';
import { Modal, Button, Table } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { IPersonalizedProduct } from '@/types/personalizedProducts/IPersonalizedProduct';
import { usePersonalizedProducts } from '../hooks/usePersonalizedProducts';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

interface PersonalizedProductsModalProps {
	show: boolean;
	onHide: () => void;
}

/**
 * Componente de apresentação para item arrastável
 */
function DraggableProductRow({
	product,
	index,
}: {
	product: IPersonalizedProduct;
	index: number;
}) {
	return (
		<Draggable draggableId={product.id.toString()} index={index}>
			{(provided, snapshot) => (
				<tr
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					style={{
						...provided.draggableProps.style,
						backgroundColor: snapshot.isDragging ? '#f0f0f0' : 'transparent',
					}}
				>
					<td>{product.ordem}</td>
					<td>{product.nome_produto || `Produto ${product.id_produto}`}</td>
					<td>
						<input
							type="text"
							className="form-control form-control-sm"
							value={product.versao}
							readOnly
							style={{ width: '120px' }}
						/>
					</td>
				</tr>
			)}
		</Draggable>
	);
}

/**
 * Modal principal para editar produtos personalizados
 */
export default function PersonalizedProductsModal({ show, onHide }: PersonalizedProductsModalProps) {
	const { products, loading, error, refreshProducts, saveOrder } = usePersonalizedProducts();
	const [localProducts, setLocalProducts] = useState<IPersonalizedProduct[]>([]);
	const [saving, setSaving] = useState(false);

	// Sincroniza produtos locais quando os produtos são carregados
	useEffect(() => {
		if (products.length > 0) {
			setLocalProducts(products);
		}
	}, [products]);

	// Reseta quando o modal fecha
	useEffect(() => {
		if (!show) {
			setLocalProducts([]);
		} else {
			refreshProducts();
		}
	}, [show, refreshProducts]);

	const handleDragEnd = (result: DropResult) => {
		if (!result.destination) {
			return;
		}

		const items = Array.from(localProducts);
		const [reorderedItem] = items.splice(result.source.index, 1);
		items.splice(result.destination.index, 0, reorderedItem);

		// Atualiza a ordem dos itens
		const reordered = items.map((item, index) => ({
			...item,
			ordem: index,
		}));

		setLocalProducts(reordered);
	};

	const handleSave = async () => {
		setSaving(true);
		try {
			await saveOrder(localProducts);
			toast.success('Ordem dos produtos atualizada com sucesso!');
			onHide();
		} catch (err) {
			toast.error('Erro ao salvar ordem dos produtos');
		} finally {
			setSaving(false);
		}
	};

	return (
		<Modal show={show} onHide={onHide} size="lg" centered>
			<Modal.Header closeButton className="bg-light border-bottom flex-shrink-0">
				<div className="d-flex align-items-center w-100">
					<IconifyIcon icon="lucide:package" className="me-2 text-primary d-none d-lg-block" />
					<IconifyIcon icon="lucide:package" className="me-2 text-primary d-lg-none" style={{ fontSize: '1.25rem' }} />
					<Modal.Title className="fw-bold text-body mb-0">
						SOFTCOM - Painel do Desenvolvedor
					</Modal.Title>
				</div>
			</Modal.Header>
			<Modal.Body>
				{loading && localProducts.length === 0 ? (
					<div className="text-center py-4">
						<div className="spinner-border" role="status">
							<span className="visually-hidden">Carregando...</span>
						</div>
					</div>
				) : error ? (
					<div className="alert alert-danger">{error}</div>
				) : (
					<>
						<DragDropContext onDragEnd={handleDragEnd}>
							<div style={{ maxHeight: '400px', overflowY: 'auto' }}>
								<Table hover responsive className="mb-0">
									<thead style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 10 }}>
										<tr>
											<th>Ordem</th>
											<th>Produto</th>
											<th>Versão</th>
										</tr>
									</thead>
									<Droppable droppableId="products">
										{(provided) => (
											<tbody ref={provided.innerRef} {...provided.droppableProps}>
												{localProducts.map((product, index) => (
													<DraggableProductRow key={product.id} product={product} index={index} />
												))}
												{provided.placeholder}
											</tbody>
										)}
									</Droppable>
								</Table>
							</div>
						</DragDropContext>

						<div className="mt-3">
							<small className="text-muted">Quantidade: {localProducts.length}</small>
						</div>
					</>
				)}
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={onHide} disabled={saving}>
					Cancelar
				</Button>
				<Button variant="primary" onClick={handleSave} disabled={saving || loading || localProducts.length === 0}>
					{saving ? (
						<>
							<span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
							Salvando...
						</>
					) : (
						'Salvar'
					)}
				</Button>
			</Modal.Footer>
		</Modal>
	);
}

