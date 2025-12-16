"use client";
import { useState, useEffect } from "react";
import { Modal, Form, Row, Col, Button } from "react-bootstrap";
import AsyncSelect from 'react-select/async';
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { Producao, ICase } from "@/types/cases/ICase";
import { useGetTipoBadgeVariant as getTipoBadgeVariant, useGetTipoIcon as getTipoIcon } from "@/hooks/caseTimeTracker/caseTimeTrackerVarianions";
import { formatTipoLabel } from "@/hooks/caseTimeTracker/useFormatLabel";
import getAberturaFechamentoDuration from "@/hooks/caseTimeTracker/useGetAberturaFechamentoDuration";
import { updateProducao } from "@/services/caseServices";
import { toast } from "react-toastify";
import Spinner from "@/components/Spinner";
import { useAsyncSelect } from "@/hooks";
import { assistant as fetchUsers } from "@/services/usersServices";
import IUserAssistant from "@/types/assistant/IUserAssistant";
import type { AsyncSelectOption } from "@/hooks/useAsyncSelect";
import { asyncSelectStyles } from "@/components/Form/asyncSelectStyles";
import { useCasePermissions } from "@/hooks/useCasePermissions";

interface ProductionDetailsModalProps {
	show: boolean;
	onHide: () => void;
	production: Producao | null;
	caseId?: number;
	caseData?: ICase | null;
	onUpdated?: () => void;
}

const TIPO_OPTIONS = [
	{ value: 'desenvolvendo', label: 'Desenvolvendo' },
	{ value: 'testando', label: 'Testando' },
	{ value: 'retorno', label: 'Retorno' },
	{ value: 'nao_planejado', label: 'Não Planejado' }
];

export default function ProductionDetailsModal({ show, onHide, production, caseId, caseData, onUpdated }: ProductionDetailsModalProps) {
	const [tipo, setTipo] = useState<string>('');
	const [dataInicio, setDataInicio] = useState<string>('');
	const [dataFim, setDataFim] = useState<string>('');
	const [saving, setSaving] = useState(false);
	const permissions = useCasePermissions(caseData ?? null);

	const {
		loadOptions: loadUserOptions,
		selectedOption: selectedUser,
		setSelectedOption: setSelectedUser,
		defaultOptions: defaultUserOptions,
		triggerDefaultLoad: triggerUserDefaultLoad,
		isLoading: isLoadingUsers,
	} = useAsyncSelect<IUserAssistant>({
		fetchItems: async (input) => fetchUsers({ search: input, nome_suporte: input }),
		getOptionLabel: (user) => user.nome_suporte || user.setor || 'Usuario sem nome',
		getOptionValue: (user) => user.id,
		debounceMs: 800,
	});

	const formatDateForInput = (dateString: string | null) => {
		if (!dateString) return '';
		const date = new Date(dateString);
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');
		return `${year}-${month}-${day}T${hours}:${minutes}`;
	};

	useEffect(() => {
		if (production) {
			setTipo(production.tipo || '');
			setDataInicio(formatDateForInput(production.datas.abertura));
			setDataFim(formatDateForInput(production.datas.fechamento || null));
			
			// Configurar usuário selecionado se existir
			if (production.usuario_id && production.usuario_nome) {
				const userOption: AsyncSelectOption<IUserAssistant> = {
					value: String(production.usuario_id),
					label: production.usuario_nome,
					raw: {
						id: String(production.usuario_id),
						nome_suporte: production.usuario_nome,
						setor: '',
					} as IUserAssistant,
				};
				setSelectedUser(userOption);
			} else {
				setSelectedUser(null);
			}
		}
	}, [production, setSelectedUser]);

	if (!production) return null;

	// Calcular duração baseado nas datas editadas
	const duration = getAberturaFechamentoDuration(
		dataInicio ? new Date(dataInicio).toISOString() : production.datas.abertura,
		dataFim ? new Date(dataFim).toISOString() : (production.datas.fechamento || undefined)
	);

	// Formatar datas para exibição
	const formatDate = (dateString: string | null) => {
		if (!dateString) return "-";
		const date = new Date(dateString);
		return date.toLocaleString('pt-BR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		});
	};


	const convertToApiFormat = (dateString: string) => {
		if (!dateString) return '';
		const date = new Date(dateString);
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');
		const seconds = String(date.getSeconds()).padStart(2, '0');
		return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
	};

	const handleSave = async () => {
		if (!production?.sequencia) {
			toast.error('Sequência não encontrada');
			return;
		}

		if (!caseId) {
			toast.error('ID do caso não encontrado');
			return;
		}

		if (!selectedUser) {
			toast.error('Por favor, selecione um usuário');
			return;
		}

		setSaving(true);
		try {
			if (!caseId) {
				toast.error('ID do caso não encontrado');
				return;
			}

			const sequencia = production.sequencia;
			console.log('Sequencia sendo usada:', sequencia, 'Production completo:', production);

			if (!selectedUser) {
				toast.error('Por favor, selecione um usuário');
				return;
			}

			const updateData: { tipo_producao: string; hora_abertura: string; hora_fechamento?: string; usuario_id: number } = {
				tipo_producao: tipo,
				hora_abertura: convertToApiFormat(dataInicio),
				usuario_id: Number(selectedUser.value)
			};

			// Sempre enviar hora_fechamento se existir
			if (dataFim) {
				updateData.hora_fechamento = convertToApiFormat(dataFim);
			}
			const response = await updateProducao(sequencia.toString(), updateData);
			
			// Exibir mensagem do retorno se existir, senão usar mensagem padrão
			const message = response?.message || 'Produção atualizada com sucesso!';
			toast.success(message);
			
			if (onUpdated) {
				onUpdated();
			}
			onHide();
		} catch (error: any) {
			console.error('Erro ao atualizar produção:', error);
			toast.error(error?.message || 'Erro ao atualizar produção');
		} finally {
			setSaving(false);
		}
	};
	return (
		<Modal
			show={show}
			onHide={onHide}
			size="lg"
			backdrop={true}
			backdropClassName="modal-backdrop"
			keyboard={true}
			contentClassName="shadow-lg"
		>
			<Modal.Header closeButton className="bg-light border-bottom">
				<Modal.Title className="fw-bold text-primary d-flex align-items-center gap-2">
					<IconifyIcon icon="lucide:clock" />
					Produção - Editar
				</Modal.Title>
			</Modal.Header>
			<Modal.Body style={{ padding: '1.5rem' }}>
				<Form>
					<Row>
						<Col md={6} className="mb-3">
							<Form.Group>
								<Form.Label className="fw-semibold">Tipo</Form.Label>
								<Form.Select
									value={tipo}
									onChange={(e) => setTipo(e.target.value)}
								>
									{TIPO_OPTIONS.map((option) => (
										<option key={option.value} value={option.value}>
											{option.label}
										</option>
									))}
								</Form.Select>
							</Form.Group>
						</Col>
						<Col md={6} className="mb-3">
							<Form.Group>
								<Form.Label className="fw-semibold">Usuário</Form.Label>
								<AsyncSelect<AsyncSelectOption<IUserAssistant>, false>
									cacheOptions
									defaultOptions={selectedUser ? [selectedUser] : defaultUserOptions}
									loadOptions={loadUserOptions}
									inputId="usuario-producao-id"
									className="react-select"
									classNamePrefix="react-select"
									styles={asyncSelectStyles}
									placeholder="Pesquise um usuário..."
									isClearable
									value={selectedUser}
									onChange={(option) => {
										setSelectedUser(option as any);
									}}
									onMenuOpen={() => triggerUserDefaultLoad()}
									noOptionsMessage={() => (isLoadingUsers ? 'Carregando...' : 'Nenhum usuário encontrado')}
									loadingMessage={() => 'Carregando...'}
								/>
							</Form.Group>
						</Col>
					</Row>

					<Row>
						<Col md={6} className="mb-3">
							<Form.Group>
								<Form.Label className="fw-semibold">Abertura</Form.Label>
								<Form.Control
									type="datetime-local"
									value={dataInicio}
									onChange={(e) => setDataInicio(e.target.value)}
								/>
							</Form.Group>
						</Col>
						<Col md={6} className="mb-3">
							<Form.Group>
								<Form.Label className="fw-semibold">Fechamento</Form.Label>
								<Form.Control
									type="datetime-local"
									value={dataFim}
									onChange={(e) => setDataFim(e.target.value)}
								/>
							</Form.Group>
						</Col>
					</Row>

					<Row>
						<Col md={6} className="mb-3">
							<Form.Group>
								<Form.Label className="fw-semibold">Tempo Decorrido</Form.Label>
								<Form.Control
									type="text"
									value={duration || "-"}
									readOnly
									className="bg-light"
								/>
							</Form.Group>
						</Col>
					</Row>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button
					onClick={handleSave}
					disabled={saving || !permissions.canEditProducao}
					className="d-flex align-items-center gap-2"
					style={{ backgroundColor: '#0d6efd', borderColor: '#0d6efd' }}
				>
					{saving ? (
						<>
							<Spinner className="spinner-grow-sm" tag="span" color="white" type="bordered" />
							Salvando...
						</>
					) : (
						<>
							<IconifyIcon icon="lucide:save" />
							Salvar
						</>
					)}
				</Button>
				<Button
					variant="secondary"
					onClick={onHide}
					disabled={saving}
				>
					Cancelar
				</Button>
			</Modal.Footer>
		</Modal>
	);
}
