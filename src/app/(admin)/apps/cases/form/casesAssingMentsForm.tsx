import { Form, Card } from 'react-bootstrap';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import { useFormContext, Controller } from 'react-hook-form';
import { TextInput } from '@/components/Form';
import { useAsyncSelect } from '@/hooks';
import { assistant as fetchProjects } from '@/services/projectsServices';
import { assistant as fetchUsers } from '@/services/usersServices';
import IUserAssistant from '@/types/assistant/IUserAssistant';
import IProjectAssistant from '@/types/assistant/IProjectAssistant';
import type { AsyncSelectOption } from '@/hooks/useAsyncSelect';
import { useEffect, useRef } from 'react';

export default function CasesAssingMentsForm() {
	const methods = useFormContext();
	const control = methods?.control;

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
	}, [selectedUser, setSelectedProject]);

	return (
		<div className="container mt-4">
			<Card className="shadow-sm rounded-3">
				<Card.Body>
					<div className="row mb-3">
						<div className="col-md-4">
							<Form.Label className="fw-semibold">Dev Atribuido</Form.Label>
							<Controller
								name={"usuario_id" as any}
								control={control}
								render={({ field }) => (
									<AsyncSelect<AsyncSelectOption<IUserAssistant>, false>
										cacheOptions
										defaultOptions={selectedUser ? [selectedUser] : defaultUserOptions}
										loadOptions={loadUserOptions}
										inputId="dev-atribuido-id"
										className="react-select"
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
								)}
							/>
						</div>
						
<div className="col-md-4">
							<Form.Label className="fw-semibold">Projeto*</Form.Label>
							<Controller
								name="project"
								control={control}
								render={({ field }) => {
									projectOnChangeRef.current = field.onChange;
									return (
										<AsyncSelect<AsyncSelectOption<IProjectAssistant>, false>
											cacheOptions
											isDisabled={!selectedUser}
											defaultOptions={selectedProject ? [selectedProject] : defaultProjectOptions}
											loadOptions={loadProjectOptions}
											inputId="projeto-id"
											className="react-select"
											classNamePrefix="react-select"
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
									);
								}}
							/>
						</div>

						<div className="col-md-4">
							<Form.Label className="fw-semibold">Relator</Form.Label>
							<Controller
								name={"relator_id" as any}
								control={control}
								render={({ field }) => (
									<AsyncSelect<AsyncSelectOption<IUserAssistant>, false>
										cacheOptions
										defaultOptions={selectedRelator ? [selectedRelator] : defaultRelatorOptions}
										loadOptions={loadRelatorOptions}
										inputId="relator-id"
										className="react-select"
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
								)}
							/>
						</div>

						
					</div>

					{/* Linha com Origem e Versão */}
					<div className="row mb-3">
						<div className="col-md-6 mb-3 mb-md-0">
							<Form.Label className="fw-semibold">Tamanho</Form.Label>
							<Select
								className="react-select"
								placeholder="Selecione a versão"
								classNamePrefix="react-select"
								options={[
									{ value: 'softcomshop', label: 'Softcomshop' },
									{ value: 'softshop', label: 'Softshop' },
									{ value: 'pdv', label: 'PDV' },
								]}
							/>
						</div>

						<div className="col-md-6">
							<TextInput type='text' name={'size'} label="Tamanho" placeholder='00:00'/>
						</div>
					</div>
				</Card.Body>
			</Card>
		</div>
	);
}
