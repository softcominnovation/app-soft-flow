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
			<div className="row g-2 totalizadores-row">
				{Array.from({ length: 5 }).map((_, index) => (
					<div key={`skeleton-${index}`} className="col-6 col-sm-4 col-md-2-4 col-lg-2-4">
						<Card 
							className="shadow-sm h-100 border-0 totalizador-card" 
							style={{ 
								background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.02) 0%, rgba(0, 0, 0, 0.01) 100%)',
							}}
						>
							<CardBody className="text-center p-2 d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '100%' }}>
								{/* Ícone skeleton */}
								<Placeholder as="div" animation="glow" className="mb-1">
									<Placeholder 
										style={{ 
											width: '16px', 
											height: '16px'
										}} 
									/>
								</Placeholder>
								{/* Valor skeleton */}
								<Placeholder as="div" animation="glow" className="mb-0">
									<Placeholder 
										style={{ 
											width: '50px', 
											height: '13px'
										}} 
									/>
								</Placeholder>
								{/* Label skeleton */}
								<Placeholder as="div" animation="glow" className="mt-1">
									<Placeholder 
										style={{ 
											width: '70px', 
											height: '10px'
										}} 
									/>
								</Placeholder>
							</CardBody>
						</Card>
					</div>
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
				.col-md-2-4 {
					flex: 0 0 auto;
					width: 20%;
				}
				.col-lg-2-4 {
					flex: 0 0 auto;
					width: 20%;
				}
				@media (max-width: 767.98px) {
					.col-md-2-4 {
						width: 50%;
					}
					/* Último card (5º) ocupa toda a largura no mobile quando sozinho */
					.totalizadores-row > div:nth-child(5) {
						width: 100% !important;
						flex: 0 0 100% !important;
					}
				}
				@media (min-width: 768px) and (max-width: 991.98px) {
					.col-md-2-4 {
						width: 33.333333%;
					}
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
			<div className="row g-2 totalizadores-row">
				<div className="col-6 col-sm-4 col-md-2-4 col-lg-2-4">
					<Card 
						className="shadow-sm h-100 border-0 totalizador-card totalizador-card-primary" 
						style={{ 
							background: 'linear-gradient(135deg, rgba(13, 110, 253, 0.08) 0%, rgba(13, 110, 253, 0.03) 100%)',
						}}
					>
					<CardBody className="text-center p-2 d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '100%' }}>
						<i className="ri-time-line text-primary mb-1" style={{ fontSize: '16px' }}></i>
						<h6 className="mb-0 totalizador-title" style={{ fontSize: '13px', fontWeight: '600' }}>
							{formatMinutes(totalizadores.tempo_total_estimado_minutos)}
						</h6>
						<p className="text-muted mb-0 mt-1" style={{ fontSize: '10px' }}>Tempo Estimado</p>
					</CardBody>
					</Card>
				</div>

				<div className="col-6 col-sm-4 col-md-2-4 col-lg-2-4">
					<Card 
						className="shadow-sm h-100 border-0 totalizador-card totalizador-card-success" 
						style={{ 
							background: 'linear-gradient(135deg, rgba(25, 135, 84, 0.08) 0%, rgba(25, 135, 84, 0.03) 100%)',
						}}
					>
					<CardBody className="text-center p-2 d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '100%' }}>
						<i className="ri-timer-line text-success mb-1" style={{ fontSize: '16px' }}></i>
						<h6 className="mb-0 totalizador-title" style={{ fontSize: '13px', fontWeight: '600' }}>
							{formatMinutes(totalizadores.tempo_total_realizado_minutos)}
						</h6>
						<p className="text-muted mb-0 mt-1" style={{ fontSize: '10px' }}>Tempo Realizado</p>
					</CardBody>
					</Card>
				</div>

				<div className="col-6 col-sm-4 col-md-2-4 col-lg-2-4">
					<Card 
						className="shadow-sm h-100 border-0 totalizador-card totalizador-card-warning" 
						style={{ 
							background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.08) 0%, rgba(255, 193, 7, 0.03) 100%)',
						}}
					>
					<CardBody className="text-center p-2 d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '100%' }}>
						<i className="ri-stack-line text-warning mb-1" style={{ fontSize: '16px' }}></i>
						<h6 className="mb-0 totalizador-title" style={{ fontSize: '13px', fontWeight: '600' }}>
							{formatNumber(totalizadores.total_pontos)}
						</h6>
						<p className="text-muted mb-0 mt-1" style={{ fontSize: '10px' }}>Total Pontos</p>
					</CardBody>
					</Card>
				</div>

				<div className="col-6 col-sm-4 col-md-2-4 col-lg-2-4">
					<Card 
						className="shadow-sm h-100 border-0 totalizador-card totalizador-card-info" 
						style={{ 
							background: 'linear-gradient(135deg, rgba(13, 202, 240, 0.08) 0%, rgba(13, 202, 240, 0.03) 100%)',
						}}
					>
					<CardBody className="text-center p-2 d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '100%' }}>
						<i className="ri-price-tag-line text-info mb-1" style={{ fontSize: '16px' }}></i>
						<h6 className="mb-0 totalizador-title" style={{ fontSize: '13px', fontWeight: '600' }}>
							{formatNumber(totalizadores.custo_estimado_ponto)}
						</h6>
						<p className="text-muted mb-0 mt-1" style={{ fontSize: '10px' }}>Custo Est. Ponto</p>
					</CardBody>
					</Card>
				</div>

				<div className="col-6 col-sm-4 col-md-2-4 col-lg-2-4">
					<Card 
						className="shadow-sm h-100 border-0 totalizador-card totalizador-card-purple" 
						style={{ 
							background: 'linear-gradient(135deg, rgba(111, 66, 193, 0.08) 0%, rgba(111, 66, 193, 0.03) 100%)',
						}}
					>
					<CardBody className="text-center p-2 d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '100%' }}>
						<i className="ri-bar-chart-box-line mb-1" style={{ fontSize: '16px', color: '#6f42c1' }}></i>
						<h6 className="mb-0 totalizador-title" style={{ fontSize: '13px', fontWeight: '600' }}>
							{formatNumber(totalizadores.custo_real_ponto)}
						</h6>
						<p className="text-muted mb-0 mt-1" style={{ fontSize: '10px' }}>Custo Real Ponto</p>
					</CardBody>
					</Card>
				</div>
			</div>
		</>
	);
}

