import BottomDrawer from '@/components/BottomDrawer';
import CaseFiltersForm from './CaseFiltersForm';
import { Control } from 'react-hook-form';
import ICaseFilter from '@/types/cases/ICaseFilter';
import type { AsyncSelectOption } from '@/hooks/useAsyncSelect';
import IProductAssistant from '@/types/assistant/IProductAssistant';
import IProjectAssistant from '@/types/assistant/IProjectAssistant';
import IUserAssistant from '@/types/assistant/IUserAssistant';
import { IVersionAssistant } from '@/services/versionsServices';
import { IStatusAssistant } from '@/services/statusServices';

interface CaseFiltersMobileProps {
	show: boolean;
	onHide: () => void;
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
	methods: any;
}

/**
 * Versão mobile dos filtros com BottomDrawer
 */
export default function CaseFiltersMobile({
	show,
	onHide,
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
}: CaseFiltersMobileProps) {
	return (
		<div className="d-lg-none">
			<BottomDrawer
				show={show}
				onHide={onHide}
				title="Filtros de Casos"
				icon="lucide:filter"
				maxHeight="90vh"
			>
				<CaseFiltersForm
					control={control}
					loadProductOptions={loadProductOptions}
					selectedProduct={selectedProduct}
					setSelectedProduct={setSelectedProduct}
					defaultProductOptions={defaultProductOptions}
					triggerProductDefaultLoad={triggerProductDefaultLoad}
					isLoadingProducts={isLoadingProducts}
					loadVersionOptions={loadVersionOptions}
					selectedVersion={selectedVersion}
					setSelectedVersion={setSelectedVersion}
					defaultVersionOptions={defaultVersionOptions}
					triggerVersionDefaultLoad={triggerVersionDefaultLoad}
					isLoadingVersions={isLoadingVersions}
					produtoId={produtoId}
					loadProjectOptions={loadProjectOptions}
					selectedProject={selectedProject}
					setSelectedProject={setSelectedProject}
					defaultProjectOptions={defaultProjectOptions}
					triggerProjectDefaultLoad={triggerProjectDefaultLoad}
					isLoadingProjects={isLoadingProjects}
					loadUserOptions={loadUserOptions}
					selectedUser={selectedUser}
					setSelectedUser={setSelectedUser}
					defaultUserOptions={defaultUserOptions}
					triggerUserDefaultLoad={triggerUserDefaultLoad}
					isLoadingUsers={isLoadingUsers}
					loadStatusOptions={loadStatusOptions}
					selectedStatus={selectedStatus}
					setSelectedStatus={setSelectedStatus}
					defaultStatusOptions={defaultStatusOptions}
					triggerStatusDefaultLoad={triggerStatusDefaultLoad}
					isLoadingStatus={isLoadingStatus}
					loading={loading}
					loadingRegistro={loadingRegistro}
					onSubmit={onSubmit}
					methods={methods}
					isMobile={true}
					onCloseDrawer={onHide}
				/>
			</BottomDrawer>
		</div>
	);
}

