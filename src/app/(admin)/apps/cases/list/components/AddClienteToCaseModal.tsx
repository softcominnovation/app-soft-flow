'use client';

import { Modal, Button, Form } from 'react-bootstrap';
import { useState } from 'react';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { useAsyncSelect } from '@/hooks';
import type { AsyncSelectOption } from '@/hooks/useAsyncSelect';
import { assistant as fetchClientes } from '@/services/clientesAssistantServices';
import IClienteAssistant from '@/types/assistant/IClienteAssistant';
import AsyncSelectInput from '@/components/Form/AsyncSelectInput';
import { createCaseClient } from '@/services/caseServices';
import { toast } from 'react-toastify';

interface AddClienteToCaseModalProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	caseRegistro: number | null;
	onClienteAdded?: () => void;
}

export default function AddClienteToCaseModal({
	open,
	setOpen,
	caseRegistro,
	onClienteAdded,
}: AddClienteToCaseModalProps) {
	const [saving, setSaving] = useState(false);

	const {
		loadOptions,
		selectedOption,
		setSelectedOption,
		defaultOptions,
		triggerDefaultLoad,
		isLoading,
	} = useAsyncSelect<IClienteAssistant>({
		fetchItems: async (input) => fetchClientes({ search: input, per_page: 50 }),
		getOptionLabel: (cliente) => {
			if (cliente.razao_social) {
				return `${cliente.nome} - ${cliente.razao_social}`;
			}
			return cliente.nome;
		},
		getOptionValue: (cliente) => cliente.registro,
		debounceMs: 500,
	});

	const handleSave = async () => {
		if (!selectedOption || !caseRegistro) {
			toast.error('Selecione um cliente para adicionar');
			return;
		}

		setSaving(true);
		try {
			await createCaseClient(caseRegistro, parseInt(selectedOption.value));
			toast.success('Cliente adicionado ao caso com sucesso!');
			setSelectedOption(null);
			setOpen(false);
			if (onClienteAdded) {
				onClienteAdded();
			}
		} catch (error: any) {
			console.error('Erro ao adicionar cliente ao caso:', error);
			const errorData = error?.response?.data;
			const requiredPermission = errorData?.required_permission;
			
			if (requiredPermission) {
				// Se houver erro de permissão, mostra apenas a mensagem de permissão
				const permissionMessage = errorData?.message || `Acesso negado. Permissão necessária: ${requiredPermission}`;
				toast.error(permissionMessage);
			} else {
				// Para outros erros, mostra a mensagem padrão
				toast.error(errorData?.message || 'Erro ao adicionar cliente ao caso');
			}
		} finally {
			setSaving(false);
		}
	};

	const handleClose = () => {
		setSelectedOption(null);
		setOpen(false);
	};

	return (
		<>
			<style>{`
				.add-cliente-modal .modal-content {
					border: none;
					border-radius: 0.75rem;
					box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1);
					overflow: visible;
				}
				
				.add-cliente-modal .modal-dialog {
					overflow: visible;
				}
				
				.add-cliente-modal .modal-body {
					overflow: visible;
				}
				
				.add-cliente-modal .modal-header {
					background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
					border-bottom: 1px solid rgba(0, 0, 0, 0.08);
					padding: 1.5rem;
				}
				
				.add-cliente-modal .modal-body {
					padding: 2rem;
					background-color: #ffffff;
				}
				
				.add-cliente-modal .modal-footer {
					background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
					border-top: 1px solid rgba(0, 0, 0, 0.08);
					padding: 1.25rem 1.5rem;
				}
				
				.add-cliente-modal .modal-title {
					font-size: 1.25rem;
					font-weight: 600;
					color: #212529;
				}
				
				.add-cliente-modal .form-label {
					font-size: 0.9375rem;
					font-weight: 600;
					color: #495057;
					margin-bottom: 0.75rem;
				}
				
				/* Garantir que o menu do select apareça acima do modal */
				.add-cliente-modal .modal {
					z-index: 1050;
				}
				
				.add-cliente-modal .modal-backdrop {
					z-index: 1040;
				}
				
				/* Menu do react-select precisa estar acima do modal */
				#react-select-*-listbox,
				#react-select-*-list,
				[class*="react-select__menu"],
				[class*="react-select__menu-list"] {
					z-index: 9999 !important;
				}
				
				@media (max-width: 575.98px) {
					.add-cliente-modal .modal-body {
						padding: 1.5rem;
					}
					
					.add-cliente-modal .modal-header,
					.add-cliente-modal .modal-footer {
						padding: 1rem 1.25rem;
					}
				}
			`}</style>
			<Modal show={open} onHide={handleClose} centered className="add-cliente-modal">
				<Modal.Header closeButton>
					<Modal.Title className="fw-bold text-body d-flex align-items-center gap-2">
						<IconifyIcon icon="lucide:user-plus" className="text-primary" style={{ fontSize: '1.25rem' }} />
						Adicionar Cliente ao Caso
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group>
							<Form.Label className="fw-semibold d-flex align-items-center">
								<IconifyIcon icon="lucide:user" className="me-2 text-primary" style={{ fontSize: '1rem' }} />
								Cliente
							</Form.Label>
							<AsyncSelectInput<AsyncSelectOption<IClienteAssistant>>
								loadOptions={loadOptions}
								value={selectedOption}
								onChange={(option) => setSelectedOption(option as AsyncSelectOption<IClienteAssistant> | null)}
								placeholder="Digite para buscar um cliente..."
								defaultOptions={defaultOptions}
								onMenuOpen={triggerDefaultLoad}
								isLoading={isLoading}
								isClearable
								menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
								menuPosition="fixed"
								styles={{
									menuPortal: (base) => ({ ...base, zIndex: 9999 }),
								}}
								noOptionsMessage={({ inputValue }) =>
									inputValue ? 'Nenhum cliente encontrado' : 'Digite para buscar clientes'
								}
							/>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose} disabled={saving}>
						<IconifyIcon icon="lucide:x" className="me-2" />
						Cancelar
					</Button>
					<Button
						variant="primary"
						onClick={handleSave}
						disabled={!selectedOption || saving}
						style={{ backgroundColor: '#0d6efd', borderColor: '#0d6efd' }}
					>
						{saving ? (
							<>
								<span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
								Salvando...
							</>
						) : (
							<>
								<IconifyIcon icon="lucide:save" className="me-2" />
								Salvar
							</>
						)}
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}

