'use client';
import { Card, Row, Col, CardBody } from 'react-bootstrap';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import CardTitle from '@/components/CardTitle';
import IAgendaDevAssistant from '@/types/assistant/IAgendaDevAssistant';

ChartJS.register(ArcElement, Tooltip, Legend);

type Props = { projects: IAgendaDevAssistant[] };

const StatusGraphic = ({ projects }: Props) => {
	// Totais agregados
	const toNum = (v: string | null | undefined) => parseInt(String(v ?? '0'), 10) || 0;
	const totals = projects.reduce(
		(acc, p) => {
			acc.abertos += toNum(p.abertos);
			acc.corrigidos += toNum(p.corrigidos);
			acc.resolvidos += toNum(p.resolvidos);
			acc.retornos += toNum(p.retornos);
			return acc;
		},
		{ abertos: 0, corrigidos: 0, resolvidos: 0, retornos: 0 }
	);

	const labels = ['Abertos', 'Corrigidos', 'Resolvidos', 'Retornos'];
	const colors = ['#4A5568', '#0dcaf0', '#0acf97', '#fa5c7c'];
	const donutChartData = {
		labels,
		datasets: [
			{
				data: [totals.abertos, totals.corrigidos, totals.resolvidos, totals.retornos],
				backgroundColor: colors,
				borderColor: 'transparent',
				borderWidth: 3,
			},
		],
	};

	const donutChartOpts = {
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: false,
			},
		},
		cutout: '80%',
	};

	return (
		<Card className="d-lg-block">
			<CardBody>
				<CardTitle
					containerClass="d-flex align-items-center justify-content-between mb-3"
					title="Status dos Produtos"
				/>

				<div className="my-3 chartjs-chart" style={{ height: 'clamp(180px, 45vw, 200px)', minHeight: '180px' }}>
					<Doughnut data={donutChartData} options={donutChartOpts} />
				</div>

				<Row className="text-center mt-2 py-2 g-2">
					<Col xs={6} sm={3}>
						<div className="my-1 my-sm-0">
							<i className="mdi mdi-folder-open-outline text-warning mt-1 fs-5"></i>
							<h5 className="fw-normal mb-0 mt-1">
								<span>{totals.abertos}</span>
							</h5>
							<p className="text-muted mb-0 small">Abertos</p>
						</div>
					</Col>

					<Col xs={6} sm={3}>
						<div className="my-1 my-sm-0">
							<i className="mdi mdi-folder-check-outline text-info mt-1 fs-5"></i>
							<h5 className="fw-normal mb-0 mt-1">
								<span>{totals.corrigidos}</span>
							</h5>
							<p className="text-muted mb-0 small">Corrigidos</p>
						</div>
					</Col>

					<Col xs={6} sm={3}>
						<div className="my-1 my-sm-0">
							<i className="mdi mdi-check-circle-outline text-success mt-1 fs-5"></i>
							<h5 className="fw-normal mb-0 mt-1">
								<span>{totals.resolvidos}</span>
							</h5>
							<p className="text-muted mb-0 small">Resolvidos</p>
						</div>
					</Col>

					<Col xs={6} sm={3}>
						<div className="my-1 my-sm-0">
							<i className="mdi mdi-backup-restore text-danger mt-1 fs-5"></i>
							<h5 className="fw-normal mb-0 mt-1">
								<span>{totals.retornos}</span>
							</h5>
							<p className="text-muted mb-0 small">Retornos</p>
						</div>
					</Col>
				</Row>
			</CardBody>
		</Card>
	);
};

export default StatusGraphic;
