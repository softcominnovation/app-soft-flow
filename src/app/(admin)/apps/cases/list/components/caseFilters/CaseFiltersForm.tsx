import { Control } from 'react-hook-form';
import { Row, Col, Button, Form } from 'react-bootstrap';
import Spinner from '@/components/Spinner';
import ICaseFilter from '@/types/cases/ICaseFilter';
import CaseFilterField from './CaseFilterField';
import type { AsyncSelectOption } from '@/hooks/useAsyncSelect';
import IProductAssistant from '@/types/assistant/IProductAssistant';
import IProjectAssistant from '@/types/assistant/IProjectAssistant';
import IUserAssistant from '@/types/assistant/IUserAssistant';
import { IVersionAssistant } from '@/services/versionsServices';
import { IStatusAssistant } from '@/services/statusServices';

interface CaseFiltersFormProps {
	control: Control<ICaseFilter>;
	// Produtos
	loadProductOptions: (input: string) => Promise<AsyncSelectOption<IProductAssistant>[]>;
	selectedProduct: AsyncSelectOption<IProductAssistant> | null;
	setSelectedProduct: (option: AsyncSelectOption<IProductAssistant> | null) => void;
	defaultProductOptions: AsyncSelectOption<IProductAssistant>[];
	triggerProductDefaultLoad: () => void;
	isLoadingProducts: boolean;
	// Versões
	loadVersionOptions: (input: string) => Promise<AsyncSelectOption<IVersionAssistant>[]>;
	selectedVersion: AsyncSelectOption<IVersionAssistant> | null;
	setSelectedVersion: (option: AsyncSelectOption<IVersionAssistant> | null) => void;
	defaultVersionOptions: AsyncSelectOption<IVersionAssistant>[];
	triggerVersionDefaultLoad: () => void;
	isLoadingVersions: boolean;
	produtoId: string | number | undefined;
	// Projetos
	loadProjectOptions: (input: string) => Promise<AsyncSelectOption<IProjectAssistant>[]>;
	selectedProject: AsyncSelectOption<IProjectAssistant> | null;
	setSelectedProject: (option: AsyncSelectOption<IProjectAssistant> | null) => void;
	defaultProjectOptions: AsyncSelectOption<IProjectAssistant>[];
	triggerProjectDefaultLoad: () => void;
	isLoadingProjects: boolean;
	// Usuários
	loadUserOptions: (input: string) => Promise<AsyncSelectOption<IUserAssistant>[]>;
	selectedUser: AsyncSelectOption<IUserAssistant> | null;
	setSelectedUser: (option: AsyncSelectOption<IUserAssistant> | null) => void;
	defaultUserOptions: AsyncSelectOption<IUserAssistant>[];
	triggerUserDefaultLoad: () => void;
	isLoadingUsers: boolean;
	// Status
	loadStatusOptions: (input: string) => Promise<AsyncSelectOption<IStatusAssistant>[]>;
	selectedStatus: AsyncSelectOption<IStatusAssistant> | null;
	setSelectedStatus: (option: AsyncSelectOption<IStatusAssistant> | null) => void;
	defaultStatusOptions: AsyncSelectOption<IStatusAssistant>[];
	triggerStatusDefaultLoad: () => void;
	isLoadingStatus: boolean;
	// Outros
	loading: boolean;
	loadingRegistro: boolean;
	onSubmit: () => void;
	methods: any; // UseFormReturn - precisa para setValue
	isMobile?: boolean;
	onCloseDrawer?: () => void;
}

/**
 * Formulário de filtros reutilizável para desktop e mobile
 */
export default function CaseFiltersForm({
	control,
	loadProductOptions,
	selectedProduct,
	setSelectedProduct,
	defaultProductOptions,
	triggerProductDefaultLoad,
	isLoadingProducts,
	loadVersionOptions,
	selectedVersion,
	setSelectedVersion,
	defaultVersionOptions,
	triggerVersionDefaultLoad,
	isLoadingVersions,
	produtoId,
	loadProjectOptions,
	selectedProject,
	setSelectedProject,
	defaultProjectOptions,
	triggerProjectDefaultLoad,
	isLoadingProjects,
	loadUserOptions,
	selectedUser,
	setSelectedUser,
	defaultUserOptions,
	triggerUserDefaultLoad,
	isLoadingUsers,
	loadStatusOptions,
	selectedStatus,
	setSelectedStatus,
	defaultStatusOptions,
	triggerStatusDefaultLoad,
	isLoadingStatus,
	loading,
	loadingRegistro,
	onSubmit,
	methods,
	isMobile = false,
	onCloseDrawer,
}: CaseFiltersFormProps) {
	const handleSubmit = () => {
		onSubmit();
		if (isMobile && onCloseDrawer) {
			onCloseDrawer();
		}
	};

	return (
		<Row className={isMobile ? 'g-3 align-items-end' : 'g-3 g-lg-4 align-items-end'}>
			<CaseFilterField<IProductAssistant>
				name="produto_id"
				control={control}
				label="Produto"
				loadOptions={loadProductOptions}
				selectedOption={selectedProduct}
				onChange={setSelectedProduct}
				defaultOptions={defaultProductOptions}
				triggerDefaultLoad={triggerProductDefaultLoad}
				isLoading={isLoadingProducts}
				placeholder="Pesquise um produto..."
				inputId="produto-id"
				colSize={isMobile ? { xs: 12 } : { xs: 12, sm: 6, md: 6, lg: 3 }}
			/>

			<CaseFilterField<IVersionAssistant>
				name="versao_produto"
				control={control}
				label="Versões"
				loadOptions={loadVersionOptions}
				selectedOption={selectedVersion}
				onChange={setSelectedVersion}
				defaultOptions={defaultVersionOptions}
				triggerDefaultLoad={triggerVersionDefaultLoad}
				isLoading={isLoadingVersions}
				placeholder={!produtoId ? 'Selecione um produto primeiro' : 'Pesquise uma versão...'}
				inputId="versao-produto-id"
				isDisabled={!produtoId}
				useCustomStyles
				getValue={(option) => option?.raw?.versao || undefined}
				colSize={isMobile ? { xs: 12 } : { xs: 12, sm: 6, md: 6, lg: 3 }}
			/>

			<CaseFilterField<IProjectAssistant>
				name="projeto_id"
				control={control}
				label="Projeto"
				loadOptions={loadProjectOptions}
				selectedOption={selectedProject}
				onChange={setSelectedProject}
				defaultOptions={defaultProjectOptions}
				triggerDefaultLoad={triggerProjectDefaultLoad}
				isLoading={isLoadingProjects}
				placeholder="Pesquise um projeto..."
				inputId="projeto-id"
				colSize={isMobile ? { xs: 12 } : { xs: 12, sm: 6, md: 6, lg: 3 }}
			/>

			<CaseFilterField<IUserAssistant>
				name="usuario_id"
				control={control}
				label="Usuario"
				loadOptions={loadUserOptions}
				selectedOption={selectedUser}
				onChange={(option) => {
					setSelectedUser(option);
					if (!option) {
						methods.setValue('usuario_id', '');
					}
				}}
				defaultOptions={defaultUserOptions}
				triggerDefaultLoad={triggerUserDefaultLoad}
				isLoading={isLoadingUsers}
				placeholder="Pesquise um usuario..."
				inputId="usuario-id"
				getValue={(option) => (option ? option.value : '')}
				colSize={isMobile ? { xs: 12 } : { xs: 12, sm: 6, md: 6, lg: 3 }}
			/>

			<CaseFilterField<IStatusAssistant>
				name="status_descricao"
				control={control}
				label="Status"
				loadOptions={loadStatusOptions}
				selectedOption={selectedStatus}
				onChange={(option) => {
					setSelectedStatus(option);
					methods.setValue('status_id', option?.value ?? '');
				}}
				defaultOptions={defaultStatusOptions}
				triggerDefaultLoad={triggerStatusDefaultLoad}
				isLoading={isLoadingStatus}
				placeholder="Pesquise um status..."
				inputId="status-descricao"
				useCustomStyles
				getValue={(option) => option?.raw?.descricao ?? ''}
				colSize={isMobile ? { xs: 12 } : { xs: 12, sm: 6, md: 6, lg: 3 }}
			/>

			<Col
				xs={12}
				sm={isMobile ? 12 : 6}
				md={isMobile ? 12 : 4}
				lg={isMobile ? 12 : 2}
				className="d-grid"
			>
				<Button
					type="submit"
					variant="primary"
					size="sm"
					disabled={loading || loadingRegistro}
					className={isMobile ? 'w-100' : 'filter-search-button w-100'}
					onClick={handleSubmit}
				>
					{loading || loadingRegistro ? (
						<span className={isMobile ? 'text-center d-flex align-items-center justify-content-center gap-2' : 'text-center'}>
							<span style={isMobile ? {} : { marginRight: '10px' }}>Pesquisando</span>
							<Spinner className="spinner-grow-sm" tag="span" color="white" type="bordered" />
						</span>
					) : (
						'Pesquisar'
					)}
				</Button>
			</Col>
		</Row>
	);
}

