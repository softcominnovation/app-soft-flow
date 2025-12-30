'use client';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { IPersonalizedProduct } from '@/types/personalizedProducts/IPersonalizedProduct';
import { usePersonalizedProducts } from '../hooks/usePersonalizedProducts';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { useAsyncSelect } from '@/hooks';
import type { AsyncSelectOption } from '@/hooks/useAsyncSelect';
import IProductAssistant from '@/types/assistant/IProductAssistant';
import { assistant as fetchProducts } from '@/services/productsServices';
import { assistant as fetchVersions, IVersionAssistant } from '@/services/versionsServices';
import AsyncSelect from 'react-select/async';
import { getAsyncSelectStyles } from '@/components/Form/asyncSelectStyles';
import Cookies from 'js-cookie';
import { updateProductOrder, deleteProduct, addPersonalizedProduct, bulkUpdateProductsOrder } from '@/services/personalizedProductsServices';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useThemeContext } from '@/common/context';

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
	onDelete,
	isDarkMode,
}: {
	product: IPersonalizedProduct;
	index: number;
	onDelete: (productId: number) => void;
	isDarkMode: boolean;
}) {
	return (
		<Draggable draggableId={product.id.toString()} index={index}>
			{(provided, snapshot) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					style={{
						...provided.draggableProps.style,
					}}
					className={`mb-3 ${snapshot.isDragging ? 'opacity-75' : ''}`}
				>
					<div
						className={`d-flex align-items-center p-3 rounded-3 bg-body border ${snapshot.isDragging ? 'border-primary border-2' : ''}`}
						style={{
							boxShadow: snapshot.isDragging
								? '0 8px 24px rgba(13, 110, 253, 0.25)'
								: '0 2px 8px rgba(0, 0, 0, 0.08)',
							transition: 'all 0.2s ease',
							cursor: 'grab',
							gap: '16px',
						}}
					>
						<div className="d-flex align-items-center" style={{ gap: '12px', flexShrink: 0 }}>
							<div
								className="d-flex align-items-center justify-content-center bg-secondary bg-opacity-25"
								style={{
									width: '40px',
									height: '40px',
									borderRadius: '10px',
									flexShrink: 0,
								}}
							>
								<IconifyIcon 
									icon="lucide:grip-vertical" 
									className="text-muted"
									style={{ fontSize: '20px' }}
								/>
							</div>
							
							<div
								className={`d-flex align-items-center justify-content-center ${isDarkMode ? 'bg-primary' : 'bg-primary bg-opacity-10'} text-white`}
								style={{
									width: '36px',
									height: '36px',
									borderRadius: '8px',
									fontWeight: '600',
									fontSize: '14px',
									flexShrink: 0,
								}}
							>
								{Number(product.ordem) + 1}
							</div>
						</div>

						<div 
							className="flex-grow-1 text-body" 
							style={{ 
								minWidth: 0,
								fontSize: '15px',
								fontWeight: '500',
							}}
						>
							{product.produto_nome || product.nome_produto || `Produto ${product.id_produto}`}
						</div>

						<div className="d-flex align-items-center flex-shrink-0">
							<IconifyIcon 
								icon="lucide:tag" 
								className="text-muted me-1"
								style={{ fontSize: '14px' }}
							/>
							<span
								className="px-2 py-1 rounded bg-secondary bg-opacity-25 text-body-emphasis border"
								style={{
									fontSize: '13px',
									fontFamily: 'monospace',
								}}
							>
								{product.versao}
							</span>
						</div>

						<div className="d-flex align-items-center flex-shrink-0" style={{ gap: '4px', marginLeft: '8px' }}>
						<button
							type="button"
							className="btn btn-link text-danger flex-shrink-0 p-2"
							style={{
								minWidth: 'auto',
								textDecoration: 'none',
							}}
							onClick={(e) => {
								e.stopPropagation();
									onDelete(product.id);
							}}
							title="Excluir produto"
						>
							<IconifyIcon 
								icon="lucide:trash-2" 
								style={{ fontSize: '18px' }}
							/>
						</button>
						</div>
					</div>
				</div>
			)}
		</Draggable>
	);
}

/**
 * Modal principal para editar produtos personalizados
 */
export default function PersonalizedProductsModal({ show, onHide }: PersonalizedProductsModalProps) {
	const { settings } = useThemeContext();
	const isDarkMode = settings.theme === 'dark';
	const { products, loading, error, refreshProducts, saveOrder } = usePersonalizedProducts();
	const [localProducts, setLocalProducts] = useState<IPersonalizedProduct[]>([]);
	const [saving, setSaving] = useState(false);
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);
	const [productToDelete, setProductToDelete] = useState<number | null>(null);
	const [deleting, setDeleting] = useState(false);
	const [updatingOrder, setUpdatingOrder] = useState(false);
	const [addingProduct, setAddingProduct] = useState(false);
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	// Autocomplete de Produto
	const {
		loadOptions: loadProductOptions,
		selectedOption: selectedProduct,
		setSelectedOption: setSelectedProduct,
		defaultOptions: defaultProductOptions,
		triggerDefaultLoad: triggerProductDefaultLoad,
		isLoading: isLoadingProducts,
	} = useAsyncSelect<IProductAssistant>({
		fetchItems: async (input) => fetchProducts({ search: input, nome: input }),
		getOptionLabel: (product) => product.nome_projeto || product.setor || 'Produto sem nome',
		getOptionValue: (product) => product.id,
		debounceMs: 800,
	});

	// Autocomplete de Versão (dependente do produto)
	const {
		loadOptions: loadVersionOptions,
		selectedOption: selectedVersion,
		setSelectedOption: setSelectedVersion,
		defaultOptions: defaultVersionOptions,
		triggerDefaultLoad: triggerVersionDefaultLoad,
		isLoading: isLoadingVersions,
	} = useAsyncSelect<IVersionAssistant>({
		fetchItems: async (input) => {
			if (!selectedProduct) return [];
			const productId = selectedProduct.value;
			return fetchVersions({ produto_id: productId, search: input });
		},
		getOptionLabel: (version) => version.versao || version.sequencia || 'Sem versão',
		getOptionValue: (version) => version.id,
		debounceMs: 800,
	});

	// Limpa versão quando produto muda
	useEffect(() => {
		setSelectedVersion(null);
	}, [selectedProduct, setSelectedVersion]);

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

	const handleDragEnd = async (result: DropResult) => {
		if (!result.destination) {
			return;
		}

		// Salva a posição do scroll antes de atualizar
		const scrollTop = scrollContainerRef.current?.scrollTop || 0;

		const items = Array.from(localProducts);
		const [reorderedItem] = items.splice(result.source.index, 1);
		items.splice(result.destination.index, 0, reorderedItem);

		// Atualiza a ordem dos itens
		const reordered = items.map((item, index) => ({
			...item,
			ordem: index,
		}));

		setLocalProducts(reordered);

		// Restaura a posição do scroll após a atualização
		setTimeout(() => {
			if (scrollContainerRef.current) {
				scrollContainerRef.current.scrollTop = scrollTop;
			}
		}, 0);

		// Atualiza a ordem de todos os produtos que mudaram de posição
		setUpdatingOrder(true);
		try {
			// Obtém id_colaborador do cookie
			const colaboradorId = Number(Cookies.get('user_id') || '0');
			if (!colaboradorId) {
				throw new Error('ID do colaborador não encontrado');
			}

			// Extrai os IDs na ordem correta (a ordem dos IDs define a ordenação)
			const ids = reordered.map((item) => item.id);

			// Faz POST para atualizar a ordem em lote
			await bulkUpdateProductsOrder(colaboradorId, ids, 0);
		} catch (error) {
			console.error('Erro ao atualizar ordem dos produtos:', error);
			toast.error('Erro ao atualizar ordem dos produtos');
			// Reverte a mudança em caso de erro
			refreshProducts();
		} finally {
			setUpdatingOrder(false);
		}
	};

	const handleDeleteClick = (productId: number) => {
		setProductToDelete(productId);
		setShowConfirmDialog(true);
	};

	const handleConfirmDelete = async () => {
		if (!productToDelete) return;

		setDeleting(true);
		try {
			await deleteProduct(productToDelete);
			
			// Remove o produto da lista local e atualiza a ordem
			const remainingProducts = localProducts
				.filter(p => p.id !== productToDelete)
				.map((item, index) => ({
					...item,
					ordem: index,
				}));
			
			setLocalProducts(remainingProducts);

			// Atualiza a ordem dos produtos restantes usando bulk-update
			if (remainingProducts.length > 0) {
				const colaboradorId = Number(Cookies.get('user_id') || '0');
				if (colaboradorId) {
					const ids = remainingProducts.map((item) => item.id);
					await bulkUpdateProductsOrder(colaboradorId, ids, 0);
				}
			}

			// Recarrega os produtos do servidor
			await refreshProducts();
			toast.success('Produto excluído com sucesso');
		} catch (error) {
			console.error('Erro ao excluir produto:', error);
			toast.error('Erro ao excluir produto');
		} finally {
			setDeleting(false);
			setShowConfirmDialog(false);
			setProductToDelete(null);
		}
	};

	const handleCancelDelete = () => {
		setShowConfirmDialog(false);
		setProductToDelete(null);
	};

	const handleAddProduct = async () => {
		if (!selectedProduct || !selectedVersion) {
			toast.warning('Selecione um produto e uma versão');
			return;
		}

		const productId = Number(selectedProduct.value);
		const versionString = selectedVersion.raw.versao || '';

		// Verifica se o produto já está na lista
		const productExists = localProducts.some(
			(p) => p.id_produto === productId && p.versao === versionString
		);

		if (productExists) {
			toast.warning('Este produto já está na lista');
			return;
		}

		setAddingProduct(true);
		try {
		// Obtém id_colaborador do cookie (mesmo usado no hook)
		const colaboradorId = Number(Cookies.get('user_id') || '0');

			// A ordem sempre será a última (tamanho atual da lista)
			const novaOrdem = localProducts.length;

			// Faz POST para adicionar o produto
			const newProduct = await addPersonalizedProduct({
			id_colaborador: colaboradorId,
			id_produto: productId,
			versao: versionString,
				ordem: novaOrdem,
			selecionado: false,
			});

			// Recarrega os produtos do servidor para garantir sincronização
			await refreshProducts();

		setSelectedProduct(null);
		setSelectedVersion(null);
		toast.success('Produto adicionado à lista');
		} catch (error) {
			console.error('Erro ao adicionar produto:', error);
			toast.error('Erro ao adicionar produto');
		} finally {
			setAddingProduct(false);
		}
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

	// Ajusta posicionamento e tamanho do modal quando abre
	useEffect(() => {
		if (show) {
			// Previne scroll no body
			document.body.style.overflow = 'hidden';
			
			// Adiciona estilo global para garantir que seja aplicado
			const styleId = 'personalized-products-modal-style';
			let styleElement = document.getElementById(styleId) as HTMLStyleElement;
			if (!styleElement) {
				styleElement = document.createElement('style');
				styleElement.id = styleId;
				document.head.appendChild(styleElement);
			}
			const scrollbarThumbColor = isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)';
			const scrollbarThumbHoverColor = isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)';
			styleElement.textContent = `
				.modal.show:not(.confirm-dialog-wrapper) .modal-content {
					height: 90vh !important;
					max-height: 90vh !important;
					display: flex !important;
					flex-direction: column !important;
				}
				.modal.show:not(.confirm-dialog-wrapper) .modal-dialog {
					margin-top: 5vh !important;
					transform: none !important;
					display: flex !important;
					flex-direction: column !important;
				}
				.products-scroll-container::-webkit-scrollbar {
					width: 6px;
				}
				.products-scroll-container::-webkit-scrollbar-track {
					background: transparent;
				}
				.products-scroll-container::-webkit-scrollbar-thumb {
					background-color: ${scrollbarThumbColor};
					border-radius: 3px;
				}
				.products-scroll-container::-webkit-scrollbar-thumb:hover {
					background-color: ${scrollbarThumbHoverColor};
				}
			`;

			return () => {
				// Remove o estilo quando fecha
				const style = document.getElementById(styleId);
				if (style) {
					style.remove();
				}
				document.body.style.overflow = '';
			};
		} else {
			// Restaura scroll no body quando fecha
			document.body.style.overflow = '';
			const styleId = 'personalized-products-modal-style';
			const style = document.getElementById(styleId);
			if (style) {
				style.remove();
			}
		}

		return () => {
			// Cleanup: restaura scroll no body quando componente desmonta
			document.body.style.overflow = '';
			const styleId = 'personalized-products-modal-style';
			const style = document.getElementById(styleId);
			if (style) {
				style.remove();
			}
		};
	}, [show, isDarkMode]);

	return (
		<>
		<Modal 
			show={show} 
			onHide={onHide} 
			size="lg"
            style={{ height: '98vh', overflow: 'hidden' }}
			backdrop="static"
		>
			<Modal.Header closeButton className="bg-light border-bottom flex-shrink-0">
				<div className="d-flex align-items-center w-100">
					<IconifyIcon icon="lucide:package" className="me-2 text-primary d-none d-lg-block" />
					<IconifyIcon icon="lucide:package" className="me-2 text-primary d-lg-none" style={{ fontSize: '1.25rem' }} />
					<Modal.Title className="fw-bold text-body mb-0">
						Painel do Desenvolvedor
					</Modal.Title>
				</div>
			</Modal.Header>
			<Modal.Body style={{ 
				overflow: 'hidden',
				display: 'flex',
				flexDirection: 'column',
				flex: 1,
				minHeight: 0,
			}}>
				{loading && localProducts.length === 0 ? (
					<div className="text-center py-4">
						<div className="spinner-border" role="status">
							<span className="visually-hidden">Carregando...</span>
						</div>
					</div>
				) : error ? (
					<div className="alert alert-danger">{error}</div>
				) : (
					<div style={{ 
						display: 'flex',
						flexDirection: 'column',
						flex: 1,
						minHeight: 0,
					}}>
						<div style={{ padding: '0 4px' }}>
						<div className="alert alert-info d-flex align-items-center mb-3" style={{ borderRadius: '8px', padding: '12px 16px' }}>
							<IconifyIcon 
								icon="lucide:info" 
								className="me-2 flex-shrink-0"
								style={{ fontSize: '18px' }}
							/>
							<div style={{ lineHeight: '1.5' }}>
								<strong>Como usar:</strong> Arraste os cards para reordenar os produtos na lista.
							</div>
						</div>

						{/* Formulário para adicionar produto */}
						<div className="mb-4 p-3 rounded-3 bg-body-tertiary border">
							<Row className="g-3 align-items-end">
								<Col xs={12} md={5}>
									<label className="form-label fw-semibold small mb-2">
										<IconifyIcon icon="lucide:package" className="me-1" style={{ fontSize: '14px' }} />
										Produto
									</label>
									<AsyncSelect<AsyncSelectOption<IProductAssistant>, false>
										cacheOptions
										defaultOptions={defaultProductOptions}
										loadOptions={loadProductOptions}
										inputId="add-product-id"
										className="react-select"
										classNamePrefix="react-select"
										placeholder="Pesquise um produto..."
										isClearable
										styles={getAsyncSelectStyles(isDarkMode)}
										value={selectedProduct}
										onChange={(option) => {
											setSelectedProduct(option);
										}}
										onMenuOpen={() => triggerProductDefaultLoad()}
										isLoading={isLoadingProducts}
										loadingMessage={() => 'Carregando...'}
										noOptionsMessage={() => 
											isLoadingProducts ? 'Carregando...' : 'Nenhum produto encontrado'
										}
									/>
								</Col>
								<Col xs={12} md={4}>
									<label className="form-label fw-semibold small mb-2">
										<IconifyIcon icon="lucide:tag" className="me-1" style={{ fontSize: '14px' }} />
										Versão
									</label>
									<AsyncSelect<AsyncSelectOption<IVersionAssistant>, false>
										cacheOptions
										defaultOptions={defaultVersionOptions}
										loadOptions={loadVersionOptions}
										inputId="add-version-id"
										className="react-select"
										classNamePrefix="react-select"
										placeholder="Pesquise uma versão..."
										isClearable
										isDisabled={!selectedProduct}
										styles={getAsyncSelectStyles(isDarkMode)}
										value={selectedVersion}
										onChange={(option) => {
											setSelectedVersion(option);
										}}
										onMenuOpen={() => triggerVersionDefaultLoad()}
										isLoading={isLoadingVersions}
										loadingMessage={() => 'Carregando...'}
										noOptionsMessage={() => {
											if (!selectedProduct) return 'Selecione um produto primeiro';
											return isLoadingVersions ? 'Carregando...' : 'Nenhuma versão encontrada';
										}}
									/>
								</Col>
								<Col xs={12} md={3}>
									<Button 
										variant="primary" 
										onClick={handleAddProduct}
										disabled={!selectedProduct || !selectedVersion || addingProduct}
										className="w-100"
									>
										{addingProduct ? (
											<>
												<span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
												Adicionando...
											</>
										) : (
											<>
										<IconifyIcon icon="lucide:plus" className="me-1" style={{ fontSize: '16px' }} />
										Adicionar
											</>
										)}
									</Button>
								</Col>
							</Row>
						</div>
						</div>
						{updatingOrder && (
							<div className="d-flex align-items-center justify-content-center mb-3" style={{ padding: '0 4px' }}>
								<div className="spinner-border spinner-border-sm text-primary me-2" role="status">
									<span className="visually-hidden">Atualizando ordem...</span>
								</div>
								<small className="text-muted">Atualizando ordem...</small>
							</div>
						)}
						<DragDropContext onDragEnd={handleDragEnd}>
							<div 
								ref={scrollContainerRef}
								className="products-scroll-container"
								style={{ 
									flex: 1,
									overflowY: 'auto',
									overflowX: 'hidden',
									minHeight: 0,
									scrollbarWidth: 'thin',
									scrollbarColor: isDarkMode ? 'rgba(255, 255, 255, 0.2) transparent' : 'rgba(0, 0, 0, 0.2) transparent',
									opacity: updatingOrder ? 0.5 : 1,
									transition: 'opacity 0.2s ease',
								}}
							>
								<Droppable droppableId="products">
									{(provided, snapshot) => (
										<div
											ref={provided.innerRef}
											{...provided.droppableProps}
											className={`rounded-3 p-2 ${snapshot.isDraggingOver ? 'bg-body-secondary' : ''}`}
											style={{
												minHeight: '100px',
												transition: 'background-color 0.2s ease',
											}}
										>
											{localProducts.length === 0 ? (
												<div className="text-center py-5 text-muted">
													<IconifyIcon icon="lucide:package-x" className="mb-2" style={{ fontSize: '48px', opacity: 0.3 }} />
													<p className="mb-0">Nenhum produto cadastrado</p>
												</div>
											) : (
												localProducts.map((product, index) => (
													<DraggableProductRow 
														key={product.id} 
														product={product} 
														index={index} 
														onDelete={handleDeleteClick}
														isDarkMode={isDarkMode}
													/>
												))
											)}
											{provided.placeholder}
										</div>
									)}
								</Droppable>
							</div>
						</DragDropContext>

						<div className="mt-3 pt-2 border-top">
							<small className="text-muted d-flex align-items-center">
								<IconifyIcon icon="lucide:package" className="me-1" style={{ fontSize: '14px' }} />
								Quantidade: <strong className="ms-1">{localProducts.length}</strong>
							</small>
						</div>
					</div>
				)}
			</Modal.Body>
		</Modal>
		<ConfirmDialog
			show={showConfirmDialog}
			title="Excluir produto"
			message="Tem certeza que deseja excluir este produto da lista?"
			confirmText="Excluir"
			cancelText="Cancelar"
			confirmVariant="danger"
			onConfirm={handleConfirmDelete}
			onCancel={handleCancelDelete}
			loading={deleting}
		/>
		</>
	);
}

