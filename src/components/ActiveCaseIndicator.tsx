'use client';

import { useEffect, useState } from 'react';
import { Card, Spinner, Button } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import CaseDescriptionCollapse from './ActiveCaseIndicator/CaseDescriptionCollapse';
import CaseTimeControls from './ActiveCaseIndicator/CaseTimeControls';
import { ACTIVE_CASE_EVENT, ACTIVE_CASE_STORAGE_KEY, CASE_CONFLICT_MODAL_CLOSE_EVENT, CASE_RESUME_MODAL_FORCE_CLOSE_EVENT, ActiveCaseStorageData } from '@/constants/caseTimeTracker';
import CasesModalResume from '@/app/(admin)/apps/cases/list/casesModalResume';
import { ICase } from '@/types/cases/ICase';
import { findCase, finalizeCase, startTimeCase, stopTimeCase } from '@/services/caseServices';
import { toast } from 'react-toastify';
import ConfirmDialog from '@/components/ConfirmDialog';

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
	const [mounted, setMounted] = useState<boolean>(false);
	const [activeCase, setActiveCase] = useState<ActiveCaseStorageData | null>(null);
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const [modalCase, setModalCase] = useState<ICase | null>(null);
	const [opening, setOpening] = useState<boolean>(false);
	const [finalizing, setFinalizing] = useState<boolean>(false);
	const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
	const [elapsedTime, setElapsedTime] = useState<string | null>(null);
	const [caseData, setCaseData] = useState<ICase | null>(null);
	const [timeLoading, setTimeLoading] = useState<boolean>(false);
	const [isTimeRunning, setIsTimeRunning] = useState<boolean>(false);
	const [isExpanded, setIsExpanded] = useState<boolean>(false);

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
		// Garantir que o componente só renderize após a montagem no cliente
		setMounted(true);
		setActiveCase(loadActiveCase());
	}, []);

	useEffect(() => {
		const startedAt = activeCase?.startedAt;
		if (!startedAt || !isTimeRunning) {
			// Se o tempo não está rodando, não atualizar o elapsedTime
			// Mas manter o último valor se existir
			return;
		}

		const updateElapsedTime = () => {
			setElapsedTime(formatElapsedTime(startedAt));
		};

		updateElapsedTime();

		const intervalId = window.setInterval(updateElapsedTime, 1000);

		return () => {
			window.clearInterval(intervalId);
		};
	}, [activeCase?.startedAt ?? null, isTimeRunning]);

	useEffect(() => {
		const handleStorageChange = (event: StorageEvent) => {
			if (event.key !== ACTIVE_CASE_STORAGE_KEY) {
				return;
			}
			const newActiveCase = loadActiveCase();
			setActiveCase(newActiveCase);
			// Se há um caso ativo, recarregar os dados do caso para atualizar o estado do tempo
			if (newActiveCase?.caseId) {
				findCase(newActiveCase.caseId)
					.then((response) => {
						if (response?.data) {
							setCaseData(response.data);
						}
					})
					.catch((error) => {
						console.error('Erro ao obter dados do caso após mudança:', error);
					});
			} else {
				setCaseData(null);
			}
		};

		const handleCustomChange = () => {
			const newActiveCase = loadActiveCase();
			setActiveCase(newActiveCase);
			// Se há um caso ativo, recarregar os dados do caso para atualizar o estado do tempo
			if (newActiveCase?.caseId) {
				// Adicionar um pequeno delay para garantir que o backend processou a mudança
				setTimeout(() => {
					findCase(newActiveCase.caseId)
						.then((response) => {
							if (response?.data) {
								setCaseData(response.data);
							}
						})
						.catch((error) => {
							console.error('Erro ao obter dados do caso após mudança:', error);
						});
				}, 300);
			} else {
				setCaseData(null);
			}
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
		if (activeCase?.caseId) {
			// Sempre recarregar os dados quando há um caso ativo
			// Resetar o estado de expansão quando o caso muda
			setIsExpanded(false);
			findCase(activeCase.caseId)
				.then((response) => {
					if (response?.data) {
						setCaseData(response.data);
					}
				})
				.catch((error) => {
					console.error('Erro ao obter dados do caso para tempo restante:', error);
				});
		} else {
			setCaseData(null);
			setIsExpanded(false);
		}
	}, [activeCase?.caseId]);

	// Verificar se o tempo está rodando
	useEffect(() => {
		if (caseData?.caso.producao) {
			const activeEntry = caseData.caso.producao.find((entry) => !entry.datas.fechamento);
			setIsTimeRunning(Boolean(activeEntry));
		} else {
			setIsTimeRunning(false);
		}
	}, [caseData]);

	const handleFinalizeCaseClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (!activeCase?.caseId || finalizing) {
			return;
		}
		setShowConfirmDialog(true);
	};

	const handleConfirmFinalize = async () => {
		if (!activeCase?.caseId || finalizing) {
			return;
		}

		setFinalizing(true);
		setShowConfirmDialog(false);
		try {
			await finalizeCase(activeCase.caseId);
			toast.success('Caso finalizado com sucesso!');
			// Limpar caso ativo do localStorage
			if (typeof window !== 'undefined') {
				window.localStorage.removeItem(ACTIVE_CASE_STORAGE_KEY);
				window.dispatchEvent(new Event(ACTIVE_CASE_EVENT));
			}
			setActiveCase(null);
			setModalOpen(false);
			// Recarregar a página para atualizar a listagem
			window.location.reload();
		} catch (error: any) {
			console.error('Erro ao finalizar caso:', error);
			toast.error(error?.message || 'Erro ao finalizar o caso');
		} finally {
			setFinalizing(false);
		}
	};

	const handleStartTime = async (e: React.MouseEvent) => {
		e.stopPropagation();
		if (!activeCase?.caseId || timeLoading) {
			return;
		}

		setTimeLoading(true);
		try {
			const response = await startTimeCase(activeCase.caseId);
			if (response.success) {
				toast.success(response.message || 'Tempo iniciado com sucesso!');
				// Atualizar dados do caso
				const updatedCase = await findCase(activeCase.caseId);
				if (updatedCase?.data) {
					setCaseData(updatedCase.data);
				}
				// Atualizar localStorage com novo start time
				if (typeof window !== 'undefined') {
					const startTimeIso = new Date().toISOString();
					window.localStorage.setItem(
						ACTIVE_CASE_STORAGE_KEY,
						JSON.stringify({ caseId: activeCase.caseId, startedAt: startTimeIso })
					);
					window.dispatchEvent(new Event(ACTIVE_CASE_EVENT));
				}
			} else {
				toast.warning(response.message || 'Não foi possível iniciar o tempo.');
			}
		} catch (error: any) {
			console.error('Erro ao iniciar o tempo:', error);
			toast.error(error?.message || 'Falha ao iniciar o tempo.');
		} finally {
			setTimeLoading(false);
		}
	};

	const handleStopTime = async (e: React.MouseEvent) => {
		e.stopPropagation();
		if (!activeCase?.caseId || timeLoading) {
			return;
		}

		setTimeLoading(true);
		try {
			const response = await stopTimeCase(activeCase.caseId);
			if (response.success) {
				toast.success(response.message || 'Tempo parado com sucesso!');
				// Atualizar dados do caso
				const updatedCase = await findCase(activeCase.caseId);
				if (updatedCase?.data) {
					setCaseData(updatedCase.data);
				}
				// NÃO remover do localStorage - manter o card visível
				// O card permanece mesmo com o tempo pausado
			} else {
				toast.warning(response.message || 'Não foi possível parar o tempo.');
			}
		} catch (error: any) {
			console.error('Erro ao parar o tempo:', error);
			toast.error(error?.message || 'Falha ao parar o tempo.');
		} finally {
			setTimeLoading(false);
		}
	};

	const handleCloseCard = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (typeof window !== 'undefined') {
			window.localStorage.removeItem(ACTIVE_CASE_STORAGE_KEY);
			window.dispatchEvent(new Event(ACTIVE_CASE_EVENT));
		}
		setActiveCase(null);
	};

	const activeIndicator = activeCase ? (() => {
		const { caseId, startedAt } = activeCase;
		const startedLabel = new Date(startedAt).toLocaleString('pt-BR');
		const basePosition = {
			right: '1.5rem',
			bottom: '1.5rem',
			zIndex: 1080,
			cursor: opening ? 'wait' : 'pointer',
		} as const;

		const mobilePosition = {
			left: '1.5rem',
			bottom: '80px', // Mesma altura do FloatingActionButton
			zIndex: 1080,
		} as const;

		const isTimeExceeded = caseData?.caso.tempos
			? (caseData.caso.tempos.realizado_minutos ?? 0) > (caseData.caso.tempos.estimado_minutos ?? 0)
			: false;

		const cardBgClass = isTimeExceeded ? 'bg-danger' : '';
		const cardBgStyle = isTimeExceeded 
			? {} 
			: { backgroundColor: 'var(--bs-menu-bg, #1F2937)' };

		return (
			<>
				<div
					className="position-fixed d-none d-md-block"
					style={{
						...basePosition,
						maxWidth: '320px',
						width: '100%',
					}}
					role="button"
					aria-label="Abrir caso em andamento"
				>
					<Card className={`shadow-lg border-0 ${cardBgClass} text-white`} style={cardBgStyle}>
						<Card.Body className="d-flex flex-column gap-2 position-relative">
							<div className="d-flex gap-3 align-items-start">
								<Button
									variant="link"
									className="position-absolute top-0 end-0 p-2 text-white-50"
									style={{
										zIndex: 10,
										textDecoration: 'none',
										lineHeight: 1,
										minWidth: 'auto',
										width: '40px',
										height: '40px',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
									}}
									onClick={handleCloseCard}
									aria-label="Fechar card"
								>
									<IconifyIcon icon="lucide:x" style={{ fontSize: '24px' }} />
								</Button>
								<div className="flex-shrink-0 d-flex align-items-center">
									{opening ? (
										<Spinner animation="border" variant="light" size="sm" />
									) : (
										<IconifyIcon icon="lucide:timer" className="fs-3" />
									)}
								</div>
								<div className="d-flex flex-column flex-grow-1" onClick={handleOpenModal} style={{ cursor: opening ? 'wait' : 'pointer' }}>
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
							</div>
							<CaseTimeControls
								isTimeRunning={isTimeRunning}
								timeLoading={timeLoading}
								finalizing={finalizing}
								isExpanded={isExpanded}
								onStartTime={handleStartTime}
								onStopTime={handleStopTime}
								onFinalize={handleFinalizeCaseClick}
								onToggleExpand={(e) => {
									e.stopPropagation();
									setIsExpanded(!isExpanded);
								}}
							/>
							<CaseDescriptionCollapse caseData={caseData} isExpanded={isExpanded} />
						</Card.Body>
					</Card>
				</div>

				<button
					type="button"
					className={`position-fixed d-flex d-md-none flex-column align-items-center justify-content-center gap-1 rounded shadow-lg border-0 ${cardBgClass} text-white px-3 py-2`}
					style={{
						...mobilePosition,
						minWidth: '64px',
						height: '64px',
						cursor: opening ? 'wait' : 'pointer',
						...(isTimeExceeded ? {} : { backgroundColor: 'var(--bs-menu-bg, #1F2937)' }),
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

	// Não renderizar nada até que o componente esteja montado no cliente
	// Isso evita erros de hidratação
	if (!mounted) {
		return null;
	}

	return (
		<>
			{activeIndicator}
			<CasesModalResume case={modalCase} open={modalOpen} setOpen={setModalOpen} />
			{activeCase && (
				<ConfirmDialog
					show={showConfirmDialog}
					title="Finalizar Caso"
					message={`Deseja realmente finalizar o Caso #${activeCase.caseId}?`}
					confirmText="Finalizar"
					cancelText="Cancelar"
					confirmVariant="success"
					onConfirm={handleConfirmFinalize}
					onCancel={() => setShowConfirmDialog(false)}
					loading={finalizing}
				/>
			)}
		</>
	);
}
