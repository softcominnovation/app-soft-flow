'use client';

import { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, FormCheck } from 'react-bootstrap';
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import { useAsyncSelect } from '@/hooks';
import { assistant as fetchUsers } from '@/services/usersServices';
import { assistant as fetchProjects } from '@/services/projectsServices';
import { assistant as fetchVersions, IVersionAssistant } from '@/services/versionsServices';
import IUserAssistant from '@/types/assistant/IUserAssistant';
import IProjectAssistant from '@/types/assistant/IProjectAssistant';
import type { AsyncSelectOption } from '@/hooks/useAsyncSelect';
import { asyncSelectStyles } from '@/components/Form/asyncSelectStyles';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

type TransferCasesModalProps = {
	show: boolean;
	onHide: () => void;
	selectedCases: Set<string>;
};

export default function TransferCasesModal({ show, onHide, selectedCases }: TransferCasesModalProps) {
	const [duplicateCases, setDuplicateCases] = useState(false);
	const [priority, setPriority] = useState<string | null>(null);
	const [stakesPlan, setStakesPlan] = useState<string>('');

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

	// Versão (sem dependência de produto por enquanto)
	const {
		loadOptions: loadVersionOptions,
		selectedOption: selectedVersion,
		setSelectedOption: setSelectedVersion,
		defaultOptions: defaultVersionOptions,
		triggerDefaultLoad: triggerVersionDefaultLoad,
		isLoading: isLoadingVersions,
	} = useAsyncSelect<IVersionAssistant>({
		fetchItems: async (input) => fetchVersions({ search: input }),
		getOptionLabel: (version) => version.versao || 'Versão sem nome',
		getOptionValue: (version) => version.id,
		debounceMs: 800,
	});

	// Projeto
	const {
		loadOptions: loadProjectOptions,
		selectedOption: selectedProject,
		setSelectedOption: setSelectedProject,
		defaultOptions: defaultProjectOptions,
		triggerDefaultLoad: triggerProjectDefaultLoad,
		isLoading: isLoadingProjects,
	} = useAsyncSelect<IProjectAssistant>({
		fetchItems: async (input) => fetchProjects({ search: input, nome_projeto: input }),
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
			setDuplicateCases(false);
			setPriority(null);
			setStakesPlan('');
		}
	}, [show, setSelectedDev, setSelectedQA, setSelectedVersion, setSelectedProject]);

	const handleSubmit = () => {
		// TODO: Implementar lógica de transferência
		console.log('Transferir casos:', {
			selectedCases: Array.from(selectedCases),
			dev: selectedDev,
			qa: selectedQA,
			version: selectedVersion,
			project: selectedProject,
			duplicateCases,
		});
		onHide();
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
									<IconifyIcon icon="lucide:tag" className="me-1" style={{ fontSize: '16px' }} />
									Versão:
								</Form.Label>
								<AsyncSelect<AsyncSelectOption<IVersionAssistant>, false>
									cacheOptions
									defaultOptions={selectedVersion ? [selectedVersion] : defaultVersionOptions}
									loadOptions={loadVersionOptions}
									className="react-select"
									classNamePrefix="react-select"
									placeholder="Selecione a versão..."
									isClearable
									value={selectedVersion}
									onChange={(option) => setSelectedVersion(option as any)}
									onMenuOpen={() => triggerVersionDefaultLoad()}
									noOptionsMessage={() => (isLoadingVersions ? 'Carregando...' : 'Nenhuma versão encontrada')}
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
									styles={asyncSelectStyles}
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

						<Col md={6}>
							<Form.Group>
								<Form.Label className="fw-semibold text-muted mb-2">
									<IconifyIcon icon="lucide:file-text" className="me-1" style={{ fontSize: '16px' }} />
									Stakes Plan.:
								</Form.Label>
								<Form.Control
									type="text"
									placeholder="Informe o Stakes Plan..."
									className="form-control"
									value={stakesPlan}
									onChange={(e) => setStakesPlan(e.target.value)}
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
									placeholder="Selecione o projeto..."
									isClearable
									value={selectedProject}
									onChange={(option) => setSelectedProject(option as any)}
									onMenuOpen={() => triggerProjectDefaultLoad()}
									noOptionsMessage={() => (isLoadingProjects ? 'Carregando...' : 'Nenhum projeto encontrado')}
									loadingMessage={() => 'Carregando...'}
									styles={asyncSelectStyles}
								/>
							</Form.Group>
						</Col>

						<Col md={12}>
							<FormCheck
								type="checkbox"
								id="duplicateCases"
								label="Duplicar Casos:"
								checked={duplicateCases}
								onChange={(e) => setDuplicateCases(e.target.checked)}
								className="fw-semibold"
							/>
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
					disabled={selectedCasesCount === 0}
					style={{ backgroundColor: '#0d6efd', borderColor: '#0d6efd' }}
				>
					<IconifyIcon icon="lucide:check" style={{ fontSize: '18px' }} />
					Transferir
				</Button>
			</Modal.Footer>
		</Modal>
		</>
	);
}

