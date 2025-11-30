'use client';

import { Button, Col, Form, Row } from 'react-bootstrap';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useMensagensContext } from '@/contexts/mensagensContext';
import { useEffect } from 'react';
import { CustomDatePicker } from '@/components/Form';
import Spinner from '@/components/Spinner';
import { IMensagensFilters } from '@/services/mensagensServices';

type MensagensFilterForm = {
	mes: Date;
	lido?: boolean | number;
};

const MensagensFilters = () => {
	const methods = useForm<MensagensFilterForm>({
		defaultValues: {
			mes: new Date(), // Por padrão, mês atual
		},
	});
	const { fetchMensagens, loading } = useMensagensContext();
	const mesSelecionado = methods.watch('mes');
	const lido = methods.watch('lido');

	// Função para calcular início e fim do mês
	const getMonthRange = (date: Date) => {
		const year = date.getFullYear();
		const month = date.getMonth();
		const startDate = new Date(year, month, 1);
		const endDate = new Date(year, month + 1, 0, 23, 59, 59);

		// Formata como YYYY-MM-DD
		const formatDate = (d: Date) => {
			const year = d.getFullYear();
			const month = String(d.getMonth() + 1).padStart(2, '0');
			const day = String(d.getDate()).padStart(2, '0');
			return `${year}-${month}-${day}`;
		};

		return {
			data_msg_inicio: formatDate(startDate),
			data_msg_fim: formatDate(endDate),
		};
	};

	const onSearch = (data: MensagensFilterForm) => {
		const { data_msg_inicio, data_msg_fim } = getMonthRange(data.mes);
		const payload: IMensagensFilters = {
			data_msg_inicio,
			data_msg_fim,
			...(data.lido !== undefined ? { lido: data.lido } : {}),
		};

		fetchMensagens(payload);
	};

	// Busca inicial com o mês atual
	useEffect(() => {
		const { data_msg_inicio, data_msg_fim } = getMonthRange(new Date());
		fetchMensagens({
			data_msg_inicio,
			data_msg_fim,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Quando o mês mudar, busca automaticamente
	useEffect(() => {
		if (mesSelecionado) {
			const { data_msg_inicio, data_msg_fim } = getMonthRange(mesSelecionado);
			const payload: IMensagensFilters = {
				data_msg_inicio,
				data_msg_fim,
				...(lido !== undefined ? { lido } : {}),
			};
			fetchMensagens(payload);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [mesSelecionado, lido]);

	return (
		<FormProvider {...methods}>
			<form onSubmit={methods.handleSubmit(onSearch)} className="mb-3">
				<Row className="g-3 g-lg-4 align-items-end">
					<Col xs={12} sm={6} md={4} lg={3}>
						<Form.Label className="fw-medium text-muted small">Mês</Form.Label>
						<Controller
							name="mes"
							control={methods.control}
							render={({ field }) => (
								<CustomDatePicker
									value={field.value}
									onChange={(date) => field.onChange(date)}
									dateFormat="MMMM yyyy"
									showMonthYearPicker={true}
									hideAddon={false}
									inputClass="form-control-sm"
								/>
							)}
						/>
					</Col>
					<Col xs={12} sm={6} md={4} lg={3}>
						<Form.Label className="fw-medium text-muted small">Status de Leitura</Form.Label>
						<Controller
							name="lido"
							control={methods.control}
							render={({ field }) => (
								<select
									className="form-select form-select-sm"
									value={
										field.value === undefined
											? ''
											: field.value === true
												? 'true'
												: 'false'
									}
									onChange={(e) => {
										const value = e.target.value;
										field.onChange(value === '' ? undefined : value === 'true' ? true : false);
									}}
									onBlur={field.onBlur}
								>
									<option value="">Todos</option>
									<option value="false">Não Lidas</option>
									<option value="true">Lidas</option>
								</select>
							)}
						/>
					</Col>
					<Col xs={12} sm={6} md={4} lg={2} className="d-grid">
						<Button type="submit" variant="primary" size="sm" disabled={loading} className="filter-search-button w-100">
							{loading ? (
								<span className="text-center">
									<span style={{ marginRight: '10px' }}>Pesquisando</span>
									<Spinner className="spinner-grow-sm" tag="span" color="white" type="bordered" />
								</span>
							) : (
								'Pesquisar'
							)}
						</Button>
					</Col>
				</Row>
			</form>
		</FormProvider>
	);
};

export default MensagensFilters;

