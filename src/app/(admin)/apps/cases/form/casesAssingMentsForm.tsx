import { Form, Card } from 'react-bootstrap';
import AsyncSelect from 'react-select/async';
import { useFormContext, Controller } from 'react-hook-form';
import { useAsyncSelect } from '@/hooks';
import { assistant as fetchProjects } from '@/services/projectsServices';
import { assistant as fetchUsers } from '@/services/usersServices';
import IUserAssistant from '@/types/assistant/IUserAssistant';
import IProjectAssistant from '@/types/assistant/IProjectAssistant';
import type { AsyncSelectOption } from '@/hooks/useAsyncSelect';
import { useEffect, useRef } from 'react';
import { asyncSelectStyles } from '@/components/Form/asyncSelectStyles';

export default function CasesAssingMentsForm() {
	const methods = useFormContext();
	const control = methods?.control;
	const getValues = methods?.getValues;

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

	const {
		loadOptions: loadRelatorOptions,
		selectedOption: selectedRelator,
		setSelectedOption: setSelectedRelator,
		defaultOptions: defaultRelatorOptions,
		triggerDefaultLoad: triggerRelatorDefaultLoad,
		isLoading: isLoadingRelators,
	} = useAsyncSelect<IUserAssistant>({
		fetchItems: async (input) => fetchUsers({ search: input, nome_suporte: input }),
		getOptionLabel: (user) => user.nome_suporte || user.setor || 'Usuario sem nome',
		getOptionValue: (user) => user.id,
		debounceMs: 800,
	});

	const {
		loadOptions: loadQaOptions,
		selectedOption: selectedQa,
		setSelectedOption: setSelectedQa,
		defaultOptions: defaultQaOptions,
		triggerDefaultLoad: triggerQaDefaultLoad,
		isLoading: isLoadingQa,
	} = useAsyncSelect<IUserAssistant>({
		fetchItems: async (input) => fetchUsers({ search: input, nome_suporte: input }),
		getOptionLabel: (user) => user.nome_suporte || user.setor || 'Usuario sem nome',
		getOptionValue: (user) => user.id,
		debounceMs: 800,
	});

	const projectOnChangeRef = useRef<((val: any) => void) | null>(null);

	const {
		loadOptions: loadProjectOptions,
		selectedOption: selectedProject,
		setSelectedOption: setSelectedProject,
		defaultOptions: defaultProjectOptions,
		triggerDefaultLoad: triggerProjectDefaultLoad,
		isLoading: isLoadingProjects,
	} = useAsyncSelect<IProjectAssistant>({
		fetchItems: async (input) => {
			if (!selectedUser) return [] as any;
			const usuarioId = (selectedUser as any).value;
			return fetchProjects({ search: input, nome_projeto: input, usuario_id: usuarioId });
		},
		getOptionLabel: (project) => project.nome_projeto || project.setor || 'Projeto sem nome',
		getOptionValue: (project) => project.id,
		debounceMs: 800,
	});

	useEffect(() => {
		if (!selectedUser) {
			setSelectedProject(null);
			projectOnChangeRef.current?.(null);
		}

		// initialize selected options from form values so values persist when switching steps
		try {
			const formValues = getValues ? getValues() : undefined;
			if (formValues) {
				if (formValues.usuario_id && !selectedUser) setSelectedUser(formValues.usuario_id as any);
				if (formValues.project && !selectedProject) setSelectedProject(formValues.project as any);
				if (formValues.relator_id && !selectedRelator) setSelectedRelator(formValues.relator_id as any);
				if (formValues.qa_id && !selectedQa) setSelectedQa(formValues.qa_id as any);
			}
		} catch (e) {
			// ignore if getValues unavailable
		}
	}, [selectedUser, setSelectedProject, selectedQa, setSelectedQa]);

	return (
		<div className="container mt-4">
			<Card className="shadow-sm rounded-3">
				<Card.Body>
					<div className="row mb-3">
						<div className="col-md-4 mb-3 mb-md-0">
							<Form.Label className="fw-semibold">Dev Atribuido</Form.Label>
							<Controller
								name={"usuario_id" as any}
								rules={{ required: 'O campo Atribuído Para (id do Usuário) é obrigatório.' }}
								control={control}
								render={({ field, fieldState }) => (
									<>
										<AsyncSelect<AsyncSelectOption<IUserAssistant>, false>
											cacheOptions
											defaultOptions={selectedUser ? [selectedUser] : defaultUserOptions}
											loadOptions={loadUserOptions}
											inputId="dev-atribuido-id"
											className={`react-select ${fieldState.error ? 'is-invalid' : ''}`}
											{...({ isInvalid: Boolean(fieldState.error) } as any)}
											classNamePrefix="react-select"
											placeholder="Pesquise um dev..."
											isClearable
											value={selectedUser}
											onChange={(option) => {
												setSelectedUser(option as any);
												field.onChange(option ? { value: (option as any).value, label: (option as any).label } : null);
											}}
											onBlur={field.onBlur}
											onMenuOpen={() => triggerUserDefaultLoad()}
											noOptionsMessage={() => (isLoadingUsers ? 'Carregando...' : 'Nenhum usuario encontrado')}
											loadingMessage={() => 'Carregando...'}
										/>
										{fieldState.error && (
											<Form.Control.Feedback type="invalid" className="d-block">
												{String(fieldState.error.message)}
											</Form.Control.Feedback>
										)}
									</>
								)}
							/>
						</div>

						<div className="col-md-4 mb-3 mb-md-0">
							<Form.Label className="fw-semibold">Projeto*</Form.Label>
							<Controller
								name="project"
								rules={{ required: 'O campo Projeto (id do Produto) é obrigatório.' }}
								control={control}
								render={({ field, fieldState }) => {
									projectOnChangeRef.current = field.onChange;
									return (
										<>
											<AsyncSelect<AsyncSelectOption<IProjectAssistant>, false>
												cacheOptions
												isDisabled={!selectedUser}
												defaultOptions={selectedProject ? [selectedProject] : defaultProjectOptions}
												loadOptions={loadProjectOptions}
												inputId="projeto-id"
												className={`react-select ${fieldState.error ? 'is-invalid' : ''}`}
												{...({ isInvalid: Boolean(fieldState.error) } as any)}
												classNamePrefix="react-select"
												styles={asyncSelectStyles}
												placeholder={selectedUser ? 'Pesquise um projeto...' : 'Selecione um Dev...'}
												isClearable
												value={selectedProject}
												onChange={(option) => {
													setSelectedProject(option as any);
													field.onChange(option ? { value: (option as any).value, label: (option as any).label } : null);
												}}
												onBlur={field.onBlur}
												onMenuOpen={() => triggerProjectDefaultLoad()}
												noOptionsMessage={() => (isLoadingProjects ? 'Carregando...' : 'Nenhum projeto encontrado')}
												loadingMessage={() => 'Carregando...'}
											/>
											{fieldState.error && (
												<Form.Control.Feedback type="invalid" className="d-block">
													{String(fieldState.error.message)}
												</Form.Control.Feedback>
											)}
										</>
									);
								}}
							/>
						</div>

						<div className="col-md-4 mb-3 mb-md-0">
							<Form.Label className="fw-semibold">Relator</Form.Label>
							<Controller
								name={"relator_id" as any}
								rules={{ required: 'O campo Relator (id do Usuário) é obrigatório.' }}
								control={control}
								render={({ field, fieldState }) => (
									<>
										<AsyncSelect<AsyncSelectOption<IUserAssistant>, false>
											cacheOptions
											defaultOptions={selectedRelator ? [selectedRelator] : defaultRelatorOptions}
											loadOptions={loadRelatorOptions}
											inputId="relator-id"
											className={`react-select ${fieldState.error ? 'is-invalid' : ''}`}
											{...({ isInvalid: Boolean(fieldState.error) } as any)}
											classNamePrefix="react-select"
											placeholder="Pesquise um relator..."
											isClearable
											value={selectedRelator}
											onChange={(option) => {
												setSelectedRelator(option as any);
												field.onChange(option ? { value: (option as any).value, label: (option as any).label } : null);
											}}
											onBlur={field.onBlur}
											onMenuOpen={() => triggerRelatorDefaultLoad()}
											noOptionsMessage={() => (isLoadingRelators ? 'Carregando...' : 'Nenhum relator encontrado')}
											loadingMessage={() => 'Carregando...'}
										/>
										{fieldState.error && (
											<Form.Control.Feedback type="invalid" className="d-block">
												{String(fieldState.error.message)}
											</Form.Control.Feedback>
										)}
									</>
								)}
							/>
						</div>
					</div>
					<div className="row mb-3">
						<div className="col-md-4 mb-3 mb-md-0">
							<Form.Label className="fw-semibold">QA</Form.Label>
							<Controller
								name={"qa_id" as any}
								control={control}
								render={({ field }) => (
									<>
										<AsyncSelect<AsyncSelectOption<IUserAssistant>, false>
											cacheOptions
											defaultOptions={selectedQa ? [selectedQa] : defaultQaOptions}
											loadOptions={loadQaOptions}
											inputId="qa-id"
											className="react-select"
											classNamePrefix="react-select"
											placeholder="Pesquise um QA..."
											isClearable
											styles={asyncSelectStyles}
											value={selectedQa}
											onChange={(option) => {
												setSelectedQa(option as any);
												field.onChange(option ? { value: (option as any).value, label: (option as any).label } : undefined);
											}}
											onBlur={field.onBlur}
											onMenuOpen={() => triggerQaDefaultLoad()}
											noOptionsMessage={() => (isLoadingQa ? 'Carregando...' : 'Nenhum QA encontrado')}
											loadingMessage={() => 'Carregando...'}
										/>
									</>
								)}
							/>
						</div>
					</div>
				</Card.Body>
			</Card>
		</div>
	);
}
