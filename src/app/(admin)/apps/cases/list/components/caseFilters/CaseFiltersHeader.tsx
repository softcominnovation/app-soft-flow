import { Button, Form } from 'react-bootstrap';
import Spinner from '@/components/Spinner';
import CasesModal from '../../casesModal';

interface CaseFiltersHeaderProps {
	registroValue: string;
	onRegistroChange: (value: string) => void;
	onRegistroKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
	loadingRegistro: boolean;
	showFiltersDesktop: boolean;
	onToggleFiltersDesktop: () => void;
	onToggleFiltersMobile: () => void;
	loading: boolean;
	onSubmit: () => void;
	selectedCases: Set<string>;
	onOpenTransferModal: () => void;
	onClearAllFilters?: () => void;
}

/**
 * Cabeçalho dos filtros com input de registro e botões de ação
 */
export default function CaseFiltersHeader({
	registroValue,
	onRegistroChange,
	onRegistroKeyPress,
	loadingRegistro,
	showFiltersDesktop,
	onToggleFiltersDesktop,
	onToggleFiltersMobile,
	loading,
	onSubmit,
	selectedCases,
	onOpenTransferModal,
	onClearAllFilters,
}: CaseFiltersHeaderProps) {
	return (
		<div className="d-flex flex-wrap flex-sm-nowrap align-items-center gap-2 mb-0 mb-lg-3">
			<div className="d-flex align-items-center gap-2 w-100 w-sm-auto flex-grow-1">
				{/* Input de Registro - Desktop */}
				<div className="d-none d-lg-flex align-items-center">
					<Form.Control
						type="text"
						value={registroValue}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => onRegistroChange(e.target.value)}
						onKeyPress={onRegistroKeyPress}
						placeholder="Digite o número do caso"
						className="form-control-sm"
						style={{ width: '200px' }}
						disabled={loadingRegistro}
					/>
				</div>

				{/* Input de Registro - Mobile */}
				<div className="d-flex d-lg-none align-items-center">
					<Form.Control
						type="text"
						value={registroValue}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => onRegistroChange(e.target.value)}
						onKeyPress={onRegistroKeyPress}
						placeholder="Digite o número do caso"
						className="form-control-sm"
						disabled={loadingRegistro}
					/>
				</div>

				{/* Desktop: mantém Collapse */}
				<Button
					type="button"
					variant="outline-secondary"
					size="sm"
					onClick={onToggleFiltersDesktop}
					className="d-none d-lg-inline-flex"
				>
					<i className="uil uil-search" />
				</Button>

				{/* Mobile: botão para abrir drawer */}
				<Button
					type="button"
					variant="outline-secondary"
					size="sm"
					onClick={onToggleFiltersMobile}
					className="d-inline-flex d-lg-none"
				>
					<i className="uil uil-search" />
				</Button>

				{!showFiltersDesktop && (
					<>
						{/* Desktop e telas >= sm: comportamento antigo (sem expandir) */}
						<Button
							type="submit"
							variant="primary"
							size="sm"
							disabled={loading}
							className="d-none d-sm-inline-flex"
							onClick={onSubmit}
						>
							{loading ? 'Pesquisando...' : 'Pesquisar'}
						</Button>
					</>
				)}

				{/* Botão para limpar todos os filtros - aparece quando os filtros estão fechados */}
				{!showFiltersDesktop && onClearAllFilters && (
					<Button
						type="button"
						variant="outline-danger"
						size="sm"
						disabled={loading}
						onClick={onClearAllFilters}
						className="d-inline-flex align-items-center gap-1"
						title="Limpar todos os filtros"
					>
						<i className="mdi mdi-filter-off" />
						<span className="d-none d-sm-inline">Limpar Filtros</span>
					</Button>
				)}
			</div>
			{/* Desktop: mostra botões de adicionar e transferir casos */}
			<div className="d-none d-lg-flex gap-2 align-items-center flex-shrink-0">
				<Button
					variant="outline-primary"
					size="sm"
					className="d-inline-flex align-items-center justify-content-center gap-1 transfer-cases-btn"
					disabled={selectedCases.size === 0}
					onClick={onOpenTransferModal}
				>
					<i className="mdi mdi-swap-horizontal"></i>
					<span>Transferir Casos</span>
				</Button>
				<CasesModal
					containerClassName=""
					buttonProps={{
						size: 'sm',
					}}
				/>
			</div>
		</div>
	);
}

