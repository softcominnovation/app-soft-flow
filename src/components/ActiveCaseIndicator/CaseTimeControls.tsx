'use client';

import { Button, Spinner } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

interface CaseTimeControlsProps {
	isTimeRunning: boolean;
	timeLoading: boolean;
	finalizing: boolean;
	isExpanded: boolean;
	onStartTime: (e: React.MouseEvent) => void;
	onStopTime: (e: React.MouseEvent) => void;
	onFinalize: (e: React.MouseEvent) => void;
	onToggleExpand: (e: React.MouseEvent) => void;
	estimadoMinutos?: number;
	naoPlanejado?: boolean;
}

export default function CaseTimeControls({
	isTimeRunning,
	timeLoading,
	finalizing,
	isExpanded,
	onStartTime,
	onStopTime,
	onFinalize,
	onToggleExpand,
	estimadoMinutos,
	naoPlanejado = false,
}: CaseTimeControlsProps) {
	// Desabilita o botão de iniciar apenas se não tiver tempo estimado E não for não planejado
	// Se não planejado for true, o botão fica habilitado mesmo sem tempo estimado
	const shouldDisableStartButton = (!estimadoMinutos || estimadoMinutos === 0) && !naoPlanejado;
	return (
		<div className="d-flex gap-2">
			{isTimeRunning ? (
				<Button
					variant="outline-light"
					size="sm"
					className="fw-semibold flex-grow-1"
					onClick={onStopTime}
					disabled={timeLoading}
					style={{ 
						fontSize: '0.75rem',
						borderWidth: '2px',
						backgroundColor: 'rgba(255, 255, 255, 0.2)',
						borderColor: 'rgba(255, 255, 255, 0.5)',
						color: '#ffffff',
						backdropFilter: 'blur(4px)'
					}}
					onMouseEnter={(e) => {
						if (!timeLoading) {
							e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
							e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.7)';
						}
					}}
					onMouseLeave={(e) => {
						if (!timeLoading) {
							e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
							e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
						}
					}}
				>
					{timeLoading ? (
						<>
							<Spinner animation="border" size="sm" className="me-1" variant="light" />
							Parando...
						</>
					) : (
						<>
							Parar tempo
						</>
					)}
				</Button>
			) : (
				<Button
					variant="success"
					size="sm"
					className="fw-semibold flex-grow-1"
					onClick={onStartTime}
					disabled={timeLoading || shouldDisableStartButton}
					style={{ 
						fontSize: '0.75rem',
						borderWidth: '2px',
					}}
				>
					{timeLoading ? (
						<>
							<Spinner animation="border" size="sm" className="me-1" variant="light" />
							Iniciando...
						</>
					) : (
						<>
							<IconifyIcon icon="lucide:play" className="me-1" />
							Iniciar tempo
						</>
					)}
				</Button>
			)}
			<Button
				variant="outline-light"
				size="sm"
				className="fw-semibold"
				onClick={onFinalize}
				disabled={finalizing}
				style={{ 
					fontSize: '0.75rem',
					borderWidth: '2px',
					backgroundColor: 'rgba(255, 255, 255, 0.2)',
					borderColor: 'rgba(255, 255, 255, 0.5)',
					color: '#ffffff',
					backdropFilter: 'blur(4px)'
				}}
				onMouseEnter={(e) => {
					if (!finalizing) {
						e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
						e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.7)';
					}
				}}
				onMouseLeave={(e) => {
					if (!finalizing) {
						e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
						e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
					}
				}}
			>
				{finalizing ? (
					<>
						<Spinner animation="border" size="sm" className="me-1" variant="light" />
						Finalizando...
					</>
				) : (
					<>
						Finalizar
					</>
				)}
			</Button>
			<Button
				variant="outline-light"
				size="sm"
				className="fw-semibold"
				onClick={onToggleExpand}
				style={{ 
					fontSize: '0.75rem',
					borderWidth: '2px',
					backgroundColor: 'rgba(255, 255, 255, 0.2)',
					borderColor: 'rgba(255, 255, 255, 0.5)',
					color: '#ffffff',
					backdropFilter: 'blur(4px)',
					minWidth: '40px',
				}}
				onMouseEnter={(e) => {
					e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
					e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.7)';
				}}
				onMouseLeave={(e) => {
					e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
					e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
				}}
				aria-label={isExpanded ? "Recolher" : "Expandir"}
			>
				<IconifyIcon 
					icon={isExpanded ? "lucide:chevron-up" : "lucide:chevron-down"} 
					style={{ fontSize: '18px' }} 
				/>
			</Button>
		</div>
	);
}

