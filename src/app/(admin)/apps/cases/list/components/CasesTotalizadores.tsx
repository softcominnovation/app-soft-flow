'use client';
import { Card, CardBody, Placeholder } from 'react-bootstrap';
import { ICaseResponse } from '@/types/cases/ICase';

interface CasesTotalizadoresProps {
	totalizadores: ICaseResponse['totalizadores'] | null;
	loading?: boolean;
}

/**
 * Componente que exibe os totalizadores dos casos
 */
export default function CasesTotalizadores({ totalizadores, loading = false }: CasesTotalizadoresProps) {
	// Se estiver carregando, mostra skeletons
	if (loading) {
		return (
			<div className="d-flex gap-2 align-items-stretch">
				{Array.from({ length: 5 }).map((_, index) => (
					<Card 
						key={`skeleton-${index}`}
						className="shadow-sm flex-fill border-0 totalizador-card" 
						style={{ 
							background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.02) 0%, rgba(0, 0, 0, 0.01) 100%)',
						}}
					>
						<CardBody className="text-center p-2">
							{/* Ícone skeleton */}
							<Placeholder as="div" animation="glow" className="mb-2">
								<Placeholder 
									style={{ 
										width: '16px', 
										height: '16px', 
										margin: '0 auto',
										borderRadius: '50%'
									}} 
								/>
							</Placeholder>
							{/* Valor skeleton */}
							<Placeholder as="div" animation="glow" className="mb-1">
								<Placeholder 
									style={{ 
										width: '60px', 
										height: '13px', 
										margin: '0 auto',
										borderRadius: '4px'
									}} 
								/>
							</Placeholder>
							{/* Label skeleton */}
							<Placeholder as="div" animation="glow">
								<Placeholder 
									style={{ 
										width: '80px', 
										height: '10px', 
										margin: '0 auto',
										borderRadius: '4px'
									}} 
								/>
							</Placeholder>
						</CardBody>
					</Card>
				))}
			</div>
		);
	}

	if (!totalizadores) {
		return null;
	}

	// Função para formatar minutos em horas e minutos
	const formatMinutes = (minutes: number): string => {
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		if (hours > 0 && mins > 0) {
			return `${hours}h ${mins}min`;
		} else if (hours > 0) {
			return `${hours}h`;
		}
		return `${mins}min`;
	};

	// Função para formatar números (sem moeda)
	const formatNumber = (value: number): string => {
		return new Intl.NumberFormat('pt-BR', {
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(value);
	};

	return (
		<>
			<style>{`
				.totalizador-card {
					transition: all 0.3s ease;
				}
				.totalizador-card:hover {
					transform: translateY(-2px);
					box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
				}
				[data-bs-theme="dark"] .totalizador-card-primary {
					background: linear-gradient(135deg, rgba(13, 110, 253, 0.15) 0%, rgba(13, 110, 253, 0.08) 100%) !important;
				}
				[data-bs-theme="dark"] .totalizador-card-success {
					background: linear-gradient(135deg, rgba(25, 135, 84, 0.15) 0%, rgba(25, 135, 84, 0.08) 100%) !important;
				}
				[data-bs-theme="dark"] .totalizador-card-warning {
					background: linear-gradient(135deg, rgba(255, 193, 7, 0.15) 0%, rgba(255, 193, 7, 0.08) 100%) !important;
				}
				[data-bs-theme="dark"] .totalizador-card-info {
					background: linear-gradient(135deg, rgba(13, 202, 240, 0.15) 0%, rgba(13, 202, 240, 0.08) 100%) !important;
				}
				[data-bs-theme="dark"] .totalizador-card-purple {
					background: linear-gradient(135deg, rgba(111, 66, 193, 0.15) 0%, rgba(111, 66, 193, 0.08) 100%) !important;
				}
				[data-bs-theme="dark"] .totalizador-title {
					color: var(--bs-body-color) !important;
				}
			`}</style>
			<div className="d-flex gap-2 align-items-stretch">
				<Card 
					className="shadow-sm flex-fill border-0 totalizador-card totalizador-card-primary" 
					style={{ 
						background: 'linear-gradient(135deg, rgba(13, 110, 253, 0.08) 0%, rgba(13, 110, 253, 0.03) 100%)',
					}}
				>
					<CardBody className="text-center p-2">
						<i className="ri-time-line text-primary" style={{ fontSize: '16px' }}></i>
						<h6 className="mb-0 mt-1 totalizador-title" style={{ fontSize: '13px', fontWeight: '600' }}>
							{formatMinutes(totalizadores.tempo_total_estimado_minutos)}
						</h6>
						<p className="text-muted mb-0" style={{ fontSize: '10px' }}>Tempo Estimado</p>
					</CardBody>
				</Card>

				<Card 
					className="shadow-sm flex-fill border-0 totalizador-card totalizador-card-success" 
					style={{ 
						background: 'linear-gradient(135deg, rgba(25, 135, 84, 0.08) 0%, rgba(25, 135, 84, 0.03) 100%)',
					}}
				>
					<CardBody className="text-center p-2">
						<i className="ri-timer-line text-success" style={{ fontSize: '16px' }}></i>
						<h6 className="mb-0 mt-1 totalizador-title" style={{ fontSize: '13px', fontWeight: '600' }}>
							{formatMinutes(totalizadores.tempo_total_realizado_minutos)}
						</h6>
						<p className="text-muted mb-0" style={{ fontSize: '10px' }}>Tempo Realizado</p>
					</CardBody>
				</Card>

				<Card 
					className="shadow-sm flex-fill border-0 totalizador-card totalizador-card-warning" 
					style={{ 
						background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.08) 0%, rgba(255, 193, 7, 0.03) 100%)',
					}}
				>
					<CardBody className="text-center p-2">
						<i className="ri-stack-line text-warning" style={{ fontSize: '16px' }}></i>
						<h6 className="mb-0 mt-1 totalizador-title" style={{ fontSize: '13px', fontWeight: '600' }}>
							{formatNumber(totalizadores.total_pontos)}
						</h6>
						<p className="text-muted mb-0" style={{ fontSize: '10px' }}>Total Pontos</p>
					</CardBody>
				</Card>

				<Card 
					className="shadow-sm flex-fill border-0 totalizador-card totalizador-card-info" 
					style={{ 
						background: 'linear-gradient(135deg, rgba(13, 202, 240, 0.08) 0%, rgba(13, 202, 240, 0.03) 100%)',
					}}
				>
					<CardBody className="text-center p-2">
						<i className="ri-price-tag-line text-info" style={{ fontSize: '16px' }}></i>
						<h6 className="mb-0 mt-1 totalizador-title" style={{ fontSize: '13px', fontWeight: '600' }}>
							{formatNumber(totalizadores.custo_estimado_ponto)}
						</h6>
						<p className="text-muted mb-0" style={{ fontSize: '10px' }}>Custo Est. Ponto</p>
					</CardBody>
				</Card>

				<Card 
					className="shadow-sm flex-fill border-0 totalizador-card totalizador-card-purple" 
					style={{ 
						background: 'linear-gradient(135deg, rgba(111, 66, 193, 0.08) 0%, rgba(111, 66, 193, 0.03) 100%)',
					}}
				>
					<CardBody className="text-center p-2">
						<i className="ri-bar-chart-box-line" style={{ fontSize: '16px', color: '#6f42c1' }}></i>
						<h6 className="mb-0 mt-1 totalizador-title" style={{ fontSize: '13px', fontWeight: '600' }}>
							{formatNumber(totalizadores.custo_real_ponto)}
						</h6>
						<p className="text-muted mb-0" style={{ fontSize: '10px' }}>Custo Real Ponto</p>
					</CardBody>
				</Card>
			</div>
		</>
	);
}

