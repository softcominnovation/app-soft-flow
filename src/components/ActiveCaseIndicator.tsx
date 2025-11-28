'use client';

import { useEffect, useState } from 'react';
import { Card, Spinner } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { ACTIVE_CASE_EVENT, ACTIVE_CASE_STORAGE_KEY, CASE_CONFLICT_MODAL_CLOSE_EVENT, CASE_RESUME_MODAL_FORCE_CLOSE_EVENT, ActiveCaseStorageData } from '@/constants/caseTimeTracker';
import CasesModalResume from '@/app/(admin)/apps/cases/list/casesModalResume';
import { ICase } from '@/types/cases/ICase';
import { findCase } from '@/services/caseServices';
import { toast } from 'react-toastify';

const loadActiveCase = (): ActiveCaseStorageData | null => {
	if (typeof window === 'undefined') {
		return null;
	}

	try {
		const storedValue = window.localStorage.getItem(ACTIVE_CASE_STORAGE_KEY);
		if (!storedValue) {
			return null;
		}
		const parsed = JSON.parse(storedValue) as ActiveCaseStorageData;

		if (!parsed?.caseId || !parsed?.startedAt) {
			return null;
		}

		return parsed;
	} catch (error) {
		console.error('Erro ao ler o caso ativo do armazenamento local:', error);
		return null;
	}
};

const formatMinutesToHours = (minutes: number): string => {
	const hours = Math.floor(minutes / 60);
	const mins = minutes % 60;
	if (hours > 0 && mins > 0) {
		return `${hours}h ${mins}min`;
	} else if (hours > 0) {
		return `${hours}h`;
	} else {
		return `${mins}min`;
	}
};

export default function ActiveCaseIndicator() {
	const [activeCase, setActiveCase] = useState<ActiveCaseStorageData | null>(() => loadActiveCase());
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const [modalCase, setModalCase] = useState<ICase | null>(null);
	const [opening, setOpening] = useState<boolean>(false);
	const [elapsedTime, setElapsedTime] = useState<string | null>(null);
	const [caseData, setCaseData] = useState<ICase | null>(null);

	const formatElapsedTime = (startedAt: string) => {
		const start = new Date(startedAt).getTime();
		const now = Date.now();
		const diffMs = Math.max(now - start, 0);

		const totalSeconds = Math.floor(diffMs / 1000);
		const hours = Math.floor(totalSeconds / 3600)
			.toString()
			.padStart(2, '0');
		const minutes = Math.floor((totalSeconds % 3600) / 60)
			.toString()
			.padStart(2, '0');
		const seconds = Math.floor(totalSeconds % 60)
			.toString()
			.padStart(2, '0');

		return `${hours}:${minutes}:${seconds}`;
	};

	useEffect(() => {
		if (!activeCase?.startedAt) {
			setElapsedTime(null);
			return;
		}

		const updateElapsedTime = () => {
			setElapsedTime(formatElapsedTime(activeCase.startedAt));
		};

		updateElapsedTime();

		const intervalId = window.setInterval(updateElapsedTime, 1000);

		return () => {
			window.clearInterval(intervalId);
		};
	}, [activeCase?.startedAt]);

	useEffect(() => {
		const handleStorageChange = (event: StorageEvent) => {
			if (event.key !== ACTIVE_CASE_STORAGE_KEY) {
				return;
			}
			setActiveCase(loadActiveCase());
		};

		const handleCustomChange = () => {
			setActiveCase(loadActiveCase());
		};

		window.addEventListener('storage', handleStorageChange);
		window.addEventListener(ACTIVE_CASE_EVENT, handleCustomChange);

		return () => {
			window.removeEventListener('storage', handleStorageChange);
			window.removeEventListener(ACTIVE_CASE_EVENT, handleCustomChange);
		};
	}, []);

	useEffect(() => {
		if (typeof window === 'undefined') {
			return;
		}

		const handleForceClose = () => {
			setModalOpen(false);
		};

		window.addEventListener(CASE_RESUME_MODAL_FORCE_CLOSE_EVENT, handleForceClose);
		return () => {
			window.removeEventListener(CASE_RESUME_MODAL_FORCE_CLOSE_EVENT, handleForceClose);
		};
	}, []);

	useEffect(() => {
		if (!modalOpen) {
			setModalCase(null);
		}
	}, [modalOpen]);

	const handleOpenModal = async () => {
		if (!activeCase || opening) {
			return;
		}

		setOpening(true);
		try {
			if (typeof window !== 'undefined') {
				window.dispatchEvent(new Event(CASE_CONFLICT_MODAL_CLOSE_EVENT));
				window.dispatchEvent(new Event(CASE_RESUME_MODAL_FORCE_CLOSE_EVENT));
			}
			const response = await findCase(activeCase.caseId);
			if (response?.data) {
				setModalCase(response.data);
				setCaseData(response.data);
				setModalOpen(true);
			} else {
				toast.warning('Nao foi possivel obter os dados do caso ativo.');
			}
		} catch (error) {
			console.error('Erro ao obter dados do caso ativo:', error);
			toast.error('Falha ao carregar os dados do caso.');
		} finally {
			setOpening(false);
		}
	};

	useEffect(() => {
		if (activeCase?.caseId && !caseData) {
			findCase(activeCase.caseId)
				.then((response) => {
					if (response?.data) {
						setCaseData(response.data);
					}
				})
				.catch((error) => {
					console.error('Erro ao obter dados do caso para tempo restante:', error);
				});
		}
	}, [activeCase?.caseId, caseData]);

	const activeIndicator = activeCase ? (() => {
		const { caseId, startedAt } = activeCase;
		const startedLabel = new Date(startedAt).toLocaleString('pt-BR');
		const basePosition = {
			right: '1.5rem',
			bottom: '1.5rem',
			zIndex: 1080,
			cursor: opening ? 'wait' : 'pointer',
		} as const;

		return (
			<>
				<div
					className="position-fixed d-none d-md-block"
					style={{
						...basePosition,
						maxWidth: '320px',
						width: '100%',
					}}
					onClick={handleOpenModal}
					role="button"
					aria-label="Abrir caso em andamento"
				>
					<Card className="shadow-lg border-0 bg-primary text-white">
						<Card.Body className="d-flex gap-3 align-items-start">
							<div className="flex-shrink-0 d-flex align-items-center">
								{opening ? (
									<Spinner animation="border" variant="light" size="sm" />
								) : (
									<IconifyIcon icon="lucide:timer" className="fs-3" />
								)}
							</div>
							<div className="d-flex flex-column">
								<strong className="small text-uppercase text-white-50">Caso em andamento</strong>
								<span className="fw-semibold">Caso #{caseId}</span>
								<small className="text-white-75">Iniciado em {startedLabel}</small>
								{elapsedTime && (
									<small className="text-white-75">Tempo decorrido: {elapsedTime}</small>
								)}
								{caseData?.caso.tempos && (() => {
									const estimado = caseData.caso.tempos.estimado_minutos ?? 0;
									const realizado = caseData.caso.tempos.realizado_minutos ?? 0;
									const restante = Math.max(estimado - realizado, 0);
									return (
										<small className="text-white-75">Tempo restante: {formatMinutesToHours(restante)}</small>
									);
								})()}
								<small className="text-white-50 mt-1">Clique para visualizar</small>
							</div>
						</Card.Body>
					</Card>
				</div>

				<button
					type="button"
					className="position-fixed d-flex d-md-none flex-column align-items-center justify-content-center gap-1 rounded shadow-lg border-0 bg-primary text-white px-3 py-2"
					style={{
						...basePosition,
						minWidth: '64px',
						height: '64px',
					}}
					onClick={handleOpenModal}
					title={elapsedTime ? `Caso em andamento - ${elapsedTime}` : 'Caso em andamento'}
					aria-label="Abrir caso em andamento"
					aria-busy={opening}
				>
					{opening ? (
						<Spinner animation="border" variant="light" size="sm" />
					) : (
						<>
							<IconifyIcon icon="lucide:timer" className="fs-5" />
							{elapsedTime && <small className="text-white-75 lh-1">{elapsedTime}</small>}
						</>
					)}
					<span className="visually-hidden">Abrir caso em andamento</span>
				</button>
			</>
		);
	})() : null;

	return (
		<>
			{activeIndicator}
			<CasesModalResume case={modalCase} open={modalOpen} setOpen={setModalOpen} />
		</>
	);
}
