import { Card, Collapse, Row, Col, Form } from 'react-bootstrap';
import { TextInput } from '@/components/Form';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import AccordionToggle from './AccordionToggle';
import { Controller, useFormContext } from 'react-hook-form';
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import { ICase } from '@/types/cases/ICase';
import { useCaseFormInitialization } from '../hooks/useCaseFormInitialization';
import type { AsyncSelectOption } from '@/hooks/useAsyncSelect';
import IProductAssistant from '@/types/assistant/IProductAssistant';
import IUserAssistant from '@/types/assistant/IUserAssistant';
import IProjectAssistant from '@/types/assistant/IProjectAssistant';
import type { ICategoryAssistant } from '@/services/categoriesServices';
import { IOriginAssistant } from '@/services/originsServices';
import { IVersionAssistant } from '@/services/versionsServices';
import { IStatusAssistant } from '@/services/statusServices';
import { asyncSelectStyles, selectStyles } from '@/components/Form/asyncSelectStyles';
import { useCasePermissions } from '@/hooks/useCasePermissions';

interface CaseInfoSectionProps {
	isOpen: boolean;
	onToggle: (eventKey: string) => void;
	caseData?: ICase | null;
}

const PRIORITY_OPTIONS = Array.from({ length: 10 }, (_, i) => ({
	value: String(i + 1),
	label: String(i + 1),
}));

export default function CaseInfoSection({ isOpen, onToggle, caseData }: CaseInfoSectionProps) {
	const eventKey = '0';
	const methods = useFormContext();
	const produtoId = methods.watch('produto_id');
	const permissions = useCasePermissions(caseData || null);

	const {
		// Produto
		loadProductOptions,
		selectedProduct,
		setSelectedProduct,
		defaultProductOptions,
		triggerProductDefaultLoad,
		isLoadingProducts,
		// Versão
		loadVersionOptions,
		selectedVersion,
		setSelectedVersion,
		defaultVersionOptions,
		triggerVersionDefaultLoad,
		isLoadingVersions,
		// Status
		loadStatusOptions,
		selectedStatus,
		setSelectedStatus,
		defaultStatusOptions,
		triggerStatusDefaultLoad,
		isLoadingStatus,
		// Usuário (Desenvolvedor)
		loadUserOptions,
		selectedUser,
		setSelectedUser,
		defaultUserOptions,
		triggerUserDefaultLoad,
		isLoadingUsers,
		// QA
		loadQaOptions,
		selectedQa,
		setSelectedQa,
		defaultQaOptions,
		triggerQaDefaultLoad,
		isLoadingQa,
		// Projeto
		loadProjectOptions,
		selectedProject,
		setSelectedProject,
		defaultProjectOptions,
		triggerProjectDefaultLoad,
		isLoadingProjects,
		// Origem
		loadOriginOptions,
		selectedOrigin,
		setSelectedOrigin,
		defaultOriginOptions,
		triggerOriginDefaultLoad,
		isLoadingOrigins,
		// Categoria
		loadCategoryOptions,
		selectedCategory,
		setSelectedCategory,
		defaultCategoryOptions,
		triggerCategoryDefaultLoad,
		isLoadingCategories,
	} = useCaseFormInitialization({
		caseData: caseData || null,
		methods,
		produtoId,
	});

	const handleProductChange = (option: AsyncSelectOption<IProductAssistant> | null) => {
		setSelectedProduct(option);
		methods.setValue('produto_id', option?.value ?? '');
		methods.setValue('produto', option?.raw?.nome_projeto || option?.raw?.setor || '');
	};

	const handleVersionChange = (option: AsyncSelectOption<IVersionAssistant> | null) => {
		setSelectedVersion(option);
		methods.setValue('versao', option?.raw?.versao ?? '');
	};

	const handleUserChange = (option: AsyncSelectOption<IUserAssistant> | null) => {
		setSelectedUser(option);
		methods.setValue('desenvolvedor_id', option?.value ?? '');
		methods.setValue('desenvolvedor', option?.raw?.nome_suporte || option?.raw?.setor || '');
	};

	const handleQaChange = (option: AsyncSelectOption<IUserAssistant> | null) => {
		setSelectedQa(option);
		methods.setValue('qa_id', option?.value ?? '');
		methods.setValue('qa', option?.raw?.nome_suporte || option?.raw?.setor || '');
	};

	const handleProjectChange = (option: AsyncSelectOption<IProjectAssistant> | null) => {
		setSelectedProject(option);
		methods.setValue('projeto_id', option?.value ?? '');
		methods.setValue('projeto', option?.raw?.nome_projeto || '');
	};

	const handleOriginChange = (option: AsyncSelectOption<IOriginAssistant> | null) => {
		setSelectedOrigin(option);
		methods.setValue('origem_id', option?.value ?? '');
		methods.setValue('origem', option?.raw?.nome || '');
	};

	const handleCategoryChange = (option: AsyncSelectOption<ICategoryAssistant> | null) => {
		setSelectedCategory(option);
		methods.setValue('categoria_id', option?.value ?? '');
		methods.setValue('categoria', option?.raw?.tipo_categoria || '');
	};

	return (
		<Card className="border-0 shadow-sm mb-0">
			<Card.Header className="bg-light border-bottom p-0">
				<AccordionToggle eventKey={eventKey} className="p-2" isOpen={isOpen} onToggle={onToggle}>
					<h6 className="mb-0 d-flex align-items-center text-body fw-semibold" style={{ fontSize: '0.95rem' }}>
						<IconifyIcon icon="lucide:info" className="me-2 text-primary" style={{ fontSize: '1rem' }} />
						Informações do Caso
					</h6>
				</AccordionToggle>
			</Card.Header>
			<Collapse in={isOpen}>
				<div>
					<Card.Body style={{ padding: '1.5rem' }}>
						<Row className="g-3">
							{/* Primeira linha: Código, Status, Prioridade */}
							<Col xs={12} md={4}>
								<Form.Group>
									<Form.Label className="fw-semibold d-flex align-items-center">
										<IconifyIcon icon="lucide:hash" className="me-2 text-muted" />
										Código
									</Form.Label>
									<TextInput
										type="text"
										name="codigo"
										placeholder="Código"
										disabled
										className="bg-light"
									/>
								</Form.Group>
							</Col>
							<Col xs={12} md={4}>
								<Form.Group>
									<Form.Label className="fw-semibold d-flex align-items-center">
										<IconifyIcon icon="lucide:activity" className="me-2 text-muted" />
										Status
									</Form.Label>
									<Controller
										name="status"
										control={methods.control}
										render={({ field, fieldState }) => (
											<>
												<AsyncSelect<AsyncSelectOption<IStatusAssistant>, false>
													cacheOptions
													defaultOptions={selectedStatus ? [selectedStatus] : defaultStatusOptions}
													loadOptions={loadStatusOptions}
													inputId="status-descricao"
													className={`react-select ${fieldState.error ? 'is-invalid' : ''}`}
													{...({ isInvalid: Boolean(fieldState.error) } as any)}
													classNamePrefix="react-select"
													placeholder="Pesquise um status..."
													isClearable
													isDisabled={!permissions.canEditEstado}
													styles={asyncSelectStyles}
													value={selectedStatus}
													onChange={(option) => {
														setSelectedStatus(option as any);
														field.onChange(option ? { value: (option as any).value, label: (option as any).label } : null);
													}}
													onBlur={field.onBlur}
													onMenuOpen={() => triggerStatusDefaultLoad()}
													noOptionsMessage={() => (isLoadingStatus ? 'Carregando...' : 'Nenhum status encontrado')}
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
								</Form.Group>
							</Col>
							<Col xs={12} md={4}>
								<Form.Group>
									<Form.Label className="fw-semibold d-flex align-items-center">
										<IconifyIcon icon="lucide:alert-triangle" className="me-2 text-muted" />
										Prioridade
									</Form.Label>
									<Controller
										name="prioridade"
										control={methods.control}
										render={({ field }) => (
											<Select
												inputId="prioridade-id"
												className="react-select case-status-select"
												classNamePrefix="react-select"
												options={PRIORITY_OPTIONS}
												placeholder="Selecione uma prioridade..."
												isDisabled={!permissions.canEditPrioridade}
												styles={selectStyles as any}
												value={PRIORITY_OPTIONS.find((opt) => opt.value === field.value) || null}
												onChange={(option) => {
													field.onChange(option?.value ?? '');
												}}
												onBlur={field.onBlur}
											/>
										)}
									/>
								</Form.Group>
							</Col>

							{/* Segunda linha: Projeto, Categoria, Origem */}
							<Col xs={12} md={4}>
								<Form.Group>
									<Form.Label className="fw-semibold d-flex align-items-center">
										<IconifyIcon icon="lucide:folder" className="me-2 text-muted" />
										Projeto
									</Form.Label>
									<Controller
										name="projeto_id"
										control={methods.control}
										render={({ field }) => (
											<AsyncSelect<AsyncSelectOption<IProjectAssistant>, false>
												cacheOptions
												defaultOptions={selectedProject ? [selectedProject] : defaultProjectOptions}
												loadOptions={loadProjectOptions}
												inputId="projeto-id"
												className="react-select case-status-select"
												classNamePrefix="react-select"
												placeholder="Pesquise um projeto..."
												isClearable
												isDisabled={!permissions.canEditCronograma}
												styles={asyncSelectStyles}
												value={selectedProject}
												onChange={(option) => {
													handleProjectChange(option);
													field.onChange(option?.value ?? '');
												}}
												onBlur={field.onBlur}
												onMenuOpen={triggerProjectDefaultLoad}
												noOptionsMessage={() =>
													isLoadingProjects ? 'Carregando...' : 'Nenhum projeto encontrado'
												}
												loadingMessage={() => 'Carregando...'}
											/>
										)}
									/>
								</Form.Group>
							</Col>
							<Col xs={12} md={4}>
								<Form.Group>
									<Form.Label className="fw-semibold d-flex align-items-center">
										<IconifyIcon icon="lucide:tag" className="me-2 text-muted" />
										Categoria
									</Form.Label>
									<Controller
										name="categoria_id"
										control={methods.control}
										render={({ field }) => (
											<AsyncSelect<AsyncSelectOption<ICategoryAssistant>, false>
												cacheOptions
												defaultOptions={selectedCategory ? [selectedCategory] : defaultCategoryOptions}
												loadOptions={loadCategoryOptions}
												inputId="categoria-id"
												className="react-select case-status-select"
												classNamePrefix="react-select"
												placeholder="Pesquise uma categoria..."
												isClearable
												isDisabled={!permissions.canEditCategoria}
												styles={asyncSelectStyles}
												value={selectedCategory}
												onChange={(option) => {
													handleCategoryChange(option);
													field.onChange(option?.value ?? '');
												}}
												onBlur={field.onBlur}
												onMenuOpen={triggerCategoryDefaultLoad}
												noOptionsMessage={() =>
													isLoadingCategories ? 'Carregando...' : 'Nenhuma categoria encontrada'
												}
												loadingMessage={() => 'Carregando...'}
											/>
										)}
									/>
								</Form.Group>
							</Col>
							<Col xs={12} md={4}>
								<Form.Group>
									<Form.Label className="fw-semibold d-flex align-items-center">
										<IconifyIcon icon="lucide:arrow-right" className="me-2 text-muted" />
										Origem
									</Form.Label>
									<Controller
										name="origem_id"
										control={methods.control}
										render={({ field }) => (
											<AsyncSelect<AsyncSelectOption<IOriginAssistant>, false>
												cacheOptions
												defaultOptions={selectedOrigin ? [selectedOrigin] : defaultOriginOptions}
												loadOptions={loadOriginOptions}
												inputId="origem-id"
												className="react-select case-status-select"
												classNamePrefix="react-select"
												placeholder="Pesquise uma origem..."
												isClearable
												value={selectedOrigin}
												onChange={(option) => {
													handleOriginChange(option);
													field.onChange(option?.value ?? '');
												}}
												onBlur={field.onBlur}
												onMenuOpen={triggerOriginDefaultLoad}
												noOptionsMessage={() =>
													isLoadingOrigins ? 'Carregando...' : 'Nenhuma origem encontrada'
												}
												loadingMessage={() => 'Carregando...'}
											/>
										)}
									/>
								</Form.Group>
							</Col>
							{/* Terceira linha: Produto, Versão, Desenvolvedor, QA */}
							<Col xs={12} md={3}>
								<Form.Group>
									<Form.Label className="fw-semibold d-flex align-items-center">
										<IconifyIcon icon="lucide:package" className="me-2 text-muted" />
										Produto
									</Form.Label>
									<Controller
										name="produto_id"
										control={methods.control}
										render={({ field }) => (
											<AsyncSelect<AsyncSelectOption<IProductAssistant>, false>
												cacheOptions
												defaultOptions={selectedProduct ? [selectedProduct] : defaultProductOptions}
												loadOptions={loadProductOptions}
												inputId="produto-id"
												className="react-select case-status-select"
												classNamePrefix="react-select"
												placeholder="Pesquise um produto..."
												isClearable
												isDisabled={!permissions.canEditProjeto}
												styles={asyncSelectStyles}
												value={selectedProduct}
												onChange={(option) => {
													handleProductChange(option);
													field.onChange(option?.value ?? '');
												}}
												onBlur={field.onBlur}
												onMenuOpen={triggerProductDefaultLoad}
												noOptionsMessage={() =>
													isLoadingProducts ? 'Carregando...' : 'Nenhum produto encontrado'
												}
												loadingMessage={() => 'Carregando...'}
											/>
										)}
									/>
								</Form.Group>
							</Col>
							<Col xs={12} md={3}>
								<Form.Group>
									<Form.Label className="fw-semibold d-flex align-items-center">
										<IconifyIcon icon="lucide:tag" className="me-2 text-muted" />
										Versão
									</Form.Label>
									<Controller
										name="versao"
										control={methods.control}
										render={({ field }) => (
											<AsyncSelect<AsyncSelectOption<IVersionAssistant>, false>
												cacheOptions
												defaultOptions={selectedVersion ? [selectedVersion] : defaultVersionOptions}
												loadOptions={loadVersionOptions}
												inputId="versao-produto-id"
												className="react-select case-status-select"
												classNamePrefix="react-select"
												styles={asyncSelectStyles}
												placeholder={!produtoId ? 'Selecione um produto primeiro' : 'Pesquise uma versão...'}
												isClearable
												isDisabled={!produtoId || !permissions.canEditVersaoProduto}
												value={selectedVersion}
												onChange={(option) => {
													handleVersionChange(option);
													field.onChange(option?.raw?.versao ?? '');
												}}
												onBlur={field.onBlur}
												onMenuOpen={() => {
													if (produtoId) {
														triggerVersionDefaultLoad();
													}
												}}
												noOptionsMessage={() =>
													isLoadingVersions ? 'Carregando...' : 'Nenhuma versão encontrada'
												}
												loadingMessage={() => 'Carregando...'}
											/>
										)}
									/>
								</Form.Group>
							</Col>
							<Col xs={12} md={3}>
								<Form.Group>
									<Form.Label className="fw-semibold d-flex align-items-center">
										<IconifyIcon icon="lucide:user" className="me-2 text-muted" />
										Desenvolvedor
									</Form.Label>
									<Controller
										name="desenvolvedor_id"
										control={methods.control}
										render={({ field }) => (
											<AsyncSelect<AsyncSelectOption<IUserAssistant>, false>
												cacheOptions
												defaultOptions={selectedUser ? [selectedUser] : defaultUserOptions}
												loadOptions={loadUserOptions}
												inputId="usuario-id"
												className="react-select case-status-select"
												classNamePrefix="react-select"
												placeholder="Pesquise um desenvolvedor..."
												isClearable
												isDisabled={!permissions.canEditAtribuidoPara}
												styles={asyncSelectStyles}
												value={selectedUser}
												onChange={(option) => {
													handleUserChange(option);
													field.onChange(option?.value ?? '');
												}}
												onBlur={field.onBlur}
												onMenuOpen={triggerUserDefaultLoad}
												noOptionsMessage={() =>
													isLoadingUsers ? 'Carregando...' : 'Nenhum desenvolvedor encontrado'
												}
												loadingMessage={() => 'Carregando...'}
											/>
										)}
									/>
								</Form.Group>
							</Col>
							<Col xs={12} md={3}>
								<Form.Group>
									<Form.Label className="fw-semibold d-flex align-items-center">
										<IconifyIcon icon="lucide:test-tube" className="me-2 text-muted" />
										QA
									</Form.Label>
									<Controller
										name="qa_id"
										control={methods.control}
										render={({ field }) => (
											<AsyncSelect<AsyncSelectOption<IUserAssistant>, false>
												cacheOptions
												defaultOptions={selectedQa ? [selectedQa] : defaultQaOptions}
												loadOptions={loadQaOptions}
												inputId="qa-id"
												className="react-select case-status-select"
												classNamePrefix="react-select"
												placeholder="Pesquise um QA..."
												isClearable
												value={selectedQa}
												onChange={(option) => {
													handleQaChange(option);
													field.onChange(option?.value ?? '');
												}}
												onBlur={field.onBlur}
												onMenuOpen={triggerQaDefaultLoad}
												noOptionsMessage={() =>
													isLoadingQa ? 'Carregando...' : 'Nenhum QA encontrado'
												}
												loadingMessage={() => 'Carregando...'}
											/>
										)}
									/>
								</Form.Group>
							</Col>
						</Row>
					</Card.Body>
				</div>
			</Collapse>
		</Card>
	);
}
