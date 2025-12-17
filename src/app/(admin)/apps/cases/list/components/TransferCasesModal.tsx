'use client';

import { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import { useAsyncSelect } from '@/hooks';
import { assistant as fetchUsers } from '@/services/usersServices';
import { assistant as fetchProjects } from '@/services/projectsServices';
import { assistant as fetchVersions, IVersionAssistant } from '@/services/versionsServices';
import { bulkUpdateCases } from '@/services/caseServices';
import IUserAssistant from '@/types/assistant/IUserAssistant';
import IProjectAssistant from '@/types/assistant/IProjectAssistant';
import type { AsyncSelectOption } from '@/hooks/useAsyncSelect';
import { asyncSelectStyles } from '@/components/Form/asyncSelectStyles';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { toast } from 'react-toastify';
import { useCasesContext } from '@/contexts/casesContext';
import { ICase } from '@/types/cases/ICase';
import Cookies from 'js-cookie';

type TransferCasesModalProps = {
	show: boolean;
	onHide: () => void;
	selectedCases: Set<string>;
	cases?: ICase[] | null;
};

export default function TransferCasesModal({ show, onHide, selectedCases, cases }: TransferCasesModalProps) {
	const [priority, setPriority] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { fetchCases } = useCasesContext();

	// Obtém o produto_id dos casos selecionados
	const selectedCasesData = (cases || []).filter(caseItem => 
		selectedCases.has(caseItem.caso.id.toString())
	);
	
	const casesWithProduct = selectedCasesData.filter(caseItem => 
		caseItem.produto && caseItem.produto.id !== null && caseItem.produto.id !== undefined
	);
	
	const produtoId = casesWithProduct.length > 0 ? String(casesWithProduct[0].produto?.id) : null;

	// Dev (usuário de desenvolvimento)
	const {
		loadOptions: loadDevOptions,
		selectedOption: selectedDev,
		setSelectedOption: setSelectedDev,
		defaultOptions: defaultDevOptions,
		triggerDefaultLoad: triggerDevDefaultLoad,
		isLoading: isLoadingDev,
	} = useAsyncSelect<IUserAssistant>({
		fetchItems: async (input) => fetchUsers({ search: input, nome_suporte: input }),
		getOptionLabel: (user) => user.nome_suporte || user.setor || 'Usuario sem nome',
		getOptionValue: (user) => user.id,
		debounceMs: 800,
	});

	// QA (usuário QA)
	const {
		loadOptions: loadQAOptions,
		selectedOption: selectedQA,
		setSelectedOption: setSelectedQA,
		defaultOptions: defaultQAOptions,
		triggerDefaultLoad: triggerQADefaultLoad,
		isLoading: isLoadingQA,
	} = useAsyncSelect<IUserAssistant>({
		fetchItems: async (input) => fetchUsers({ search: input, nome_suporte: input }),
		getOptionLabel: (user) => user.nome_suporte || user.setor || 'Usuario sem nome',
		getOptionValue: (user) => user.id,
		debounceMs: 800,
	});

	// Versão (depende do produto_id dos casos selecionados)
	const {
		loadOptions: loadVersionOptions,
		selectedOption: selectedVersion,
		setSelectedOption: setSelectedVersion,
		defaultOptions: defaultVersionOptions,
		triggerDefaultLoad: triggerVersionDefaultLoad,
		isLoading: isLoadingVersions,
	} = useAsyncSelect<IVersionAssistant>({
		fetchItems: async (input) => {
			if (!produtoId) {
				return [];
			}
			return fetchVersions({ produto_id: produtoId, search: input });
		},
		getOptionLabel: (version) => version.versao || 'Versão sem nome',
		getOptionValue: (version) => version.id,
		debounceMs: 800,
	});

	// Obtém o usuario_id do usuário logado
	const loggedUserId = Cookies.get('user_id');

	// Projeto (depende do usuário logado)
	const {
		loadOptions: loadProjectOptions,
		selectedOption: selectedProject,
		setSelectedOption: setSelectedProject,
		defaultOptions: defaultProjectOptions,
		triggerDefaultLoad: triggerProjectDefaultLoad,
		isLoading: isLoadingProjects,
	} = useAsyncSelect<IProjectAssistant>({
		fetchItems: async (input) => {
			return fetchProjects({
				search: input,
				nome_projeto: input,
				...(loggedUserId && loggedUserId !== '' ? { usuario_id: loggedUserId } : {}),
			});
		},
		getOptionLabel: (project) => project.nome_projeto || project.setor || 'Projeto sem nome',
		getOptionValue: (project) => project.id,
		debounceMs: 800,
	});

	// Opções de prioridade (1 a 10)
	const priorityOptions = Array.from({ length: 10 }, (_, i) => ({
		value: String(i + 1),
		label: String(i + 1),
	}));

	// Limpa os campos quando o modal é fechado
	useEffect(() => {
		if (!show) {
			setSelectedDev(null);
			setSelectedQA(null);
			setSelectedVersion(null);
			setSelectedProject(null);
			setPriority(null);
		}
	}, [show, setSelectedDev, setSelectedQA, setSelectedVersion, setSelectedProject]);

	// Limpa a versão quando o produto_id muda
	useEffect(() => {
		if (!produtoId) {
			setSelectedVersion(null);
		}
	}, [produtoId, setSelectedVersion]);

	const handleSubmit = async () => {
		if (selectedCases.size === 0) {
			toast.warning('Selecione pelo menos um caso para transferir');
			return;
		}

		// Converte os IDs dos casos selecionados para números
		const caseIds = Array.from(selectedCases).map(id => parseInt(id, 10));

		// Prepara o payload para atualização em lote
		const payload: any = {
			ids: caseIds,
		};

		// Adiciona Dev se selecionado
		if (selectedDev && selectedDev.value) {
			payload.AtribuidoPara = parseInt(String(selectedDev.value), 10);
		}

		// Adiciona prioridade se selecionada
		if (priority) {
			payload.Prioridade = parseInt(priority, 10);
		}

		// Adiciona projeto (cronograma_id) se selecionado
		if (selectedProject && selectedProject.value) {
			payload.cronograma_id = parseInt(String(selectedProject.value), 10);
		}

		// Adiciona versão se selecionada
		if (selectedVersion && selectedVersion.raw?.versao) {
			payload.VersaoProduto = selectedVersion.raw.versao;
		}

		// Adiciona QA se selecionado
		if (selectedQA && selectedQA.value) {
			payload.atribuido_qa = parseInt(String(selectedQA.value), 10);
		}

		setIsSubmitting(true);

		try {
			const response = await bulkUpdateCases(payload);

			if (response.success) {
				const successMessage = response.not_found && response.not_found.length > 0
					? `${response.updated} caso(s) transferido(s) com sucesso. ${response.not_found.length} caso(s) não encontrado(s).`
					: `${response.updated} caso(s) transferido(s) com sucesso.`;

				toast.success(successMessage);

				// Atualiza a lista de casos com os filtros atuais
				await fetchCases(undefined, false);

				// Fecha o modal
				onHide();
			} else {
				toast.error(response.message || 'Erro ao transferir casos');
			}
		} catch (error: any) {
			console.error('Erro ao transferir casos:', error);
			const errorMessage = error?.message || 'Erro ao transferir casos. Tente novamente.';
			toast.error(errorMessage);
		} finally {
			setIsSubmitting(false);
		}
	};

	const selectedCasesCount = selectedCases.size;

	return (
		<>
			<style>{`
				.modal-dialog-top {
					margin-top: 5vh !important;
					margin-bottom: auto !important;
				}
			`}</style>
			<Modal
				show={show}
				onHide={onHide}
				size="lg"
				backdrop="static"
				dialogClassName="modal-dialog-top"
			>
			<Modal.Header closeButton className="bg-light border-bottom">
				<Modal.Title className="fw-bold text-primary d-flex align-items-center gap-2">
					<IconifyIcon icon="lucide:move-right" style={{ fontSize: '24px' }} />
					Transferir Casos
				</Modal.Title>
			</Modal.Header>

			<Modal.Body className="p-4">
				{selectedCasesCount > 0 && (
					<div className="alert alert-info mb-4 d-flex align-items-center gap-2">
						<IconifyIcon icon="lucide:info" style={{ fontSize: '20px' }} />
						<span>
							<strong>{selectedCasesCount}</strong> {selectedCasesCount === 1 ? 'caso selecionado' : 'casos selecionados'} para transferência
						</span>
					</div>
				)}

				<Form>
					<Row className="g-3">
						<Col md={6}>
							<Form.Group>
								<Form.Label className="fw-semibold text-muted mb-2">
									<IconifyIcon icon="lucide:user" className="me-1" style={{ fontSize: '16px' }} />
									Dev:
								</Form.Label>
								<AsyncSelect<AsyncSelectOption<IUserAssistant>, false>
									cacheOptions
									defaultOptions={selectedDev ? [selectedDev] : defaultDevOptions}
									loadOptions={loadDevOptions}
									className="react-select"
									classNamePrefix="react-select"
									placeholder="Selecione o desenvolvedor..."
									isClearable
									value={selectedDev}
									onChange={(option) => setSelectedDev(option as any)}
									onMenuOpen={() => triggerDevDefaultLoad()}
									noOptionsMessage={() => (isLoadingDev ? 'Carregando...' : 'Nenhum desenvolvedor encontrado')}
									loadingMessage={() => 'Carregando...'}
									styles={asyncSelectStyles}
								/>
							</Form.Group>
						</Col>

						<Col md={6}>
							<Form.Group>
								<Form.Label className="fw-semibold text-muted mb-2">
									<IconifyIcon icon="lucide:folder" className="me-1" style={{ fontSize: '16px' }} />
									Projeto:
								</Form.Label>
								<AsyncSelect<AsyncSelectOption<IProjectAssistant>, false>
									cacheOptions
									defaultOptions={selectedProject ? [selectedProject] : defaultProjectOptions}
									loadOptions={loadProjectOptions}
									className="react-select"
									classNamePrefix="react-select"
									placeholder="Pesquise um projeto..."
									isClearable
									value={selectedProject}
									onChange={(option) => setSelectedProject(option as any)}
									onMenuOpen={() => {
										triggerProjectDefaultLoad();
									}}
									noOptionsMessage={() => (isLoadingProjects ? 'Carregando...' : 'Nenhum projeto encontrado')}
									loadingMessage={() => 'Carregando...'}
									styles={asyncSelectStyles}
								/>
							</Form.Group>
						</Col>

						<Col md={6}>
							<Form.Group>
								<Form.Label className="fw-semibold text-muted mb-2">
									<IconifyIcon icon="lucide:tag" className="me-1" style={{ fontSize: '16px' }} />
									Versão:
								</Form.Label>
								<AsyncSelect<AsyncSelectOption<IVersionAssistant>, false>
									cacheOptions
									defaultOptions={selectedVersion ? [selectedVersion] : defaultVersionOptions}
									loadOptions={loadVersionOptions}
									className="react-select"
									classNamePrefix="react-select"
									placeholder={!produtoId ? 'Selecione casos com produto primeiro' : 'Pesquise uma versão...'}
									isClearable
									isDisabled={!produtoId}
									value={selectedVersion}
									onChange={(option) => setSelectedVersion(option as any)}
									onMenuOpen={() => {
										if (produtoId) {
											triggerVersionDefaultLoad();
										}
									}}
									noOptionsMessage={() => (isLoadingVersions ? 'Carregando...' : !produtoId ? 'Selecione casos com produto primeiro' : 'Nenhuma versão encontrada')}
									loadingMessage={() => 'Carregando...'}
									styles={asyncSelectStyles}
								/>
							</Form.Group>
						</Col>

						<Col md={6}>
							<Form.Group>
								<Form.Label className="fw-semibold text-muted mb-2">
									<IconifyIcon icon="lucide:alert-circle" className="me-1" style={{ fontSize: '16px' }} />
									Importância:
								</Form.Label>
								<Select
									className="react-select"
									classNamePrefix="react-select"
									options={priorityOptions}
									placeholder="Selecione a importância (1-10)"
									isClearable
									value={priority ? priorityOptions.find(o => o.value === priority) : null}
									onChange={(option) => setPriority(option ? option.value : null)}
								/>
							</Form.Group>
						</Col>

						<Col md={6}>
							<Form.Group>
								<Form.Label className="fw-semibold text-muted mb-2">
									<IconifyIcon icon="lucide:check-circle-2" className="me-1" style={{ fontSize: '16px' }} />
									QA:
								</Form.Label>
								<AsyncSelect<AsyncSelectOption<IUserAssistant>, false>
									cacheOptions
									defaultOptions={selectedQA ? [selectedQA] : defaultQAOptions}
									loadOptions={loadQAOptions}
									className="react-select"
									classNamePrefix="react-select"
									placeholder="Selecione o QA..."
									isClearable
									value={selectedQA}
									onChange={(option) => setSelectedQA(option as any)}
									onMenuOpen={() => triggerQADefaultLoad()}
									noOptionsMessage={() => (isLoadingQA ? 'Carregando...' : 'Nenhum QA encontrado')}
									loadingMessage={() => 'Carregando...'}
									styles={asyncSelectStyles}
								/>
							</Form.Group>
						</Col>
					</Row>
				</Form>
			</Modal.Body>

			<Modal.Footer className="border-top bg-light">
				<Button variant="outline-secondary" onClick={onHide} className="d-flex align-items-center gap-2">
					<IconifyIcon icon="lucide:x" style={{ fontSize: '18px' }} />
					Fechar
				</Button>
				<Button
					variant="primary"
					onClick={handleSubmit}
					className="d-flex align-items-center gap-2"
					disabled={selectedCasesCount === 0 || isSubmitting}
					style={{ backgroundColor: '#0d6efd', borderColor: '#0d6efd' }}
				>
					{isSubmitting ? (
						<>
							<span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
							Transferindo...
						</>
					) : (
						<>
							<IconifyIcon icon="lucide:check" style={{ fontSize: '18px' }} />
							Transferir
						</>
					)}
				</Button>
			</Modal.Footer>
		</Modal>
		</>
	);
}

