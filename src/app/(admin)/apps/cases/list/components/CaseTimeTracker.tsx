"use client";
import { useState, useEffect, useCallback } from 'react';
import { ICase } from '@/types/cases/ICase';
import { startTimeCase, stopTimeCase, findCase } from '@/services/caseServices';
import { toast } from 'react-toastify';
import TimetrackerSkelleton from '../skelletons/timetrackerSkelleton';
import { ACTIVE_CASE_EVENT, ACTIVE_CASE_STORAGE_KEY, CASE_CONFLICT_MODAL_CLOSE_EVENT, ActiveCaseStorageData } from '@/constants/caseTimeTracker';
import CaseActiveTimeConflictModal from './CaseActiveTimeConflictModal';
import CaseTimeTrackerHistory from './caseTimeTrackerComponents.tsx/caseTimeTrackerHistory';
import CaseTimeTrackerTimeControl from './caseTimeTrackerComponents.tsx/caseTimeTrackerTimeControl';

interface CaseTimeTrackerProps {
	caseData?: ICase | null;
	onCaseUpdated?: (updatedCase: ICase) => void;
}

type PendingAction = {
	type: 'start' | 'stop';
	caseId: string;
};

export default function CaseTimeTracker({ caseData, onCaseUpdated }: CaseTimeTrackerProps) {
	const [loading, setLoading] = useState<boolean>(false);
	const [localCase, setLocalCase] = useState<ICase | null>(caseData ?? null);
	const [elapsedMinutes, setElapsedMinutes] = useState<number | null>(null);
	const [conflictModalOpen, setConflictModalOpen] = useState(false);
	const [conflictCaseId, setConflictCaseId] = useState<string | null>(null);
	const [conflictMessage, setConflictMessage] = useState<string | null>(null);
	const [conflictLoading, setConflictLoading] = useState(false);
	const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

	const handleCaseUpdate = useCallback(async () => {
		const currentCase = localCase ?? caseData ?? null;
		if (!currentCase?.caso.id) return;
		
		try {
			const response = await findCase(currentCase.caso.id.toString());
			if (response?.data) {
				setLocalCase(response.data);
				if (onCaseUpdated) {
					onCaseUpdated(response.data);
				}
			}
		} catch (error) {
			console.error('Erro ao recarregar dados do caso:', error);
		}
	}, [localCase, caseData, onCaseUpdated]);

	const closeConflictModalState = useCallback((options?: { preservePendingAction?: boolean }) => {
		setConflictModalOpen(false);
		setConflictCaseId(null);
		setConflictMessage(null);
		setConflictLoading(false);
		if (!options?.preservePendingAction) {
			setPendingAction(null);
		}
	}, []);

	useEffect(() => {
		setLocalCase(caseData ?? null);
	}, [caseData]);

	useEffect(() => {
		if (typeof window === 'undefined') {
			return;
		}

		const handleExternalClose = () => {
			closeConflictModalState();
			setLoading(false);
		};

		window.addEventListener(CASE_CONFLICT_MODAL_CLOSE_EVENT, handleExternalClose);
		return () => {
			window.removeEventListener(CASE_CONFLICT_MODAL_CLOSE_EVENT, handleExternalClose);
		};
	}, [closeConflictModalState]);

	const applyStopToCurrentCase = (stopTimeIso: string) => {
		setLocalCase((prev) => {
			if (!prev) {
				return prev;
			}
			let closed = false;
			const updatedEntries = (prev.caso.producao ?? []).map((entry) => {
				if (!closed && !entry.datas.fechamento) {
					closed = true;
					return {
						...entry,
						datas: {
							...entry.datas,
							fechamento: stopTimeIso,
						},
					};
				}
				return entry;
			});

			return {
				...prev,
				caso: {
					...prev.caso,
					producao: updatedEntries,
				},
			};
		});
		setElapsedMinutes(null);
	};

	const formatTime = (timeString: string) => {
		return new Date(timeString).toLocaleString('pt-BR');
	};

	const startNewTime = async (id: string, isRetry = false) => {
		if (!id) {
			toast.error('Identificador do caso nao encontrado.');
			return;
		}

		if (!isRetry) {
			setPendingAction({ type: 'start', caseId: id });
		}

		setLoading(true);
		let shouldAddEntry = false;
		let conflictDetected = false;
		let startTimeIso: string | null = null;

		try {
			const response = await startTimeCase(id);
			if (response.success) {
				shouldAddEntry = true;
				startTimeIso = new Date().toISOString();
				toast.success(response.message || 'Tempo iniciado com sucesso!');
			} else if (response.caso_aberto) {
				conflictDetected = true;
				setConflictCaseId(String(response.caso_aberto));
				setConflictMessage(
					response.message ?? 'Existe um caso com tempo em andamento. Deseja parar esse tempo agora?'
				);
				setConflictModalOpen(true);
			} else {
				toast.warning(response.message || 'Nao foi possivel iniciar o tempo.');
			}
		} catch (error) {
			console.error('Erro ao iniciar o tempo:', error);
			toast.error('Falha ao iniciar o tempo.');
		} finally {
			if (shouldAddEntry && startTimeIso) {
				if (typeof window !== 'undefined') {
					try {
						window.localStorage.setItem(
							ACTIVE_CASE_STORAGE_KEY,
							JSON.stringify({ caseId: id, startedAt: startTimeIso })
						);
					} catch (error) {
						console.error('Erro ao armazenar o caso ativo no localStorage:', error);
					}
					window.dispatchEvent(new Event(ACTIVE_CASE_EVENT));
				}
				setElapsedMinutes(0);
				// @ts-expect-error - cloning nested case entries keeps existing optional fields even if undefined
				setLocalCase((prev) => {
					if (!prev) {
						return prev;
					}
					const existingEntries = prev.caso.producao ? [...prev.caso.producao] : [];
					const nextSequence = existingEntries.reduce((max, entry) => Math.max(max, entry.sequencia), 0) + 1;
					const referenceEntry = existingEntries[0];
					const defaultTipo = referenceEntry?.tipo ?? 'Desenvolvimento';
					const newEntry = {
						sequencia: nextSequence,
						registro: referenceEntry?.registro ?? Date.now(),
						datas: {
							abertura: startTimeIso,
							producao: startTimeIso,
							fechamento: null,
						},
						tipo: defaultTipo,
						usuario_id: referenceEntry?.usuario_id ?? Number(prev.caso.usuarios?.desenvolvimento?.id ?? 0),
						projeto_id: referenceEntry?.projeto_id ?? (prev.projeto?.id ?? null),
						valeu_usuario_id: referenceEntry?.valeu_usuario_id ?? null,
					};

					return {
						...prev,
						caso: {
							...prev.caso,
							producao: [newEntry, ...existingEntries],
						},
					};
				});
			}
			if (!conflictDetected) {
				setPendingAction(null);
			}
			setLoading(false);
		}
	};

	const stopCurrentTime = async (id: string, isRetry = false) => {
		if (!id) {
			toast.error('Identificador do caso nao encontrado.');
			return;
		}

		if (!isRetry) {
			setPendingAction({ type: 'stop', caseId: id });
		}

		setLoading(true);
		let shouldCloseEntry = false;
		let conflictDetected = false;
		let stopTimeIso: string | null = null;

		try {
			const response = await stopTimeCase(id);
			if (response.success) {
				shouldCloseEntry = true;
				stopTimeIso = new Date().toISOString();
				toast.success(response.message || 'Tempo parado com sucesso!');
			} else if (response.caso_aberto) {
				conflictDetected = true;
				setConflictCaseId(String(response.caso_aberto));
				setConflictMessage(
					response.message ?? 'Existe um caso com tempo em andamento. Deseja parar esse tempo agora?'
				);
				setConflictModalOpen(true);
			} else {
				toast.warning(response.message || 'Nao foi possivel parar o tempo.');
			}
		} catch (error) {
			console.error('Erro ao parar o tempo:', error);
			toast.error('Falha ao parar o tempo.');
		} finally {
			if (shouldCloseEntry && stopTimeIso) {
				if (typeof window !== 'undefined') {
					try {
						window.localStorage.removeItem(ACTIVE_CASE_STORAGE_KEY);
					} catch (error) {
						console.error('Erro ao remover o caso ativo do localStorage:', error);
					}
					window.dispatchEvent(new Event(ACTIVE_CASE_EVENT));
				}
				applyStopToCurrentCase(stopTimeIso);
			}
			if (!conflictDetected) {
				setPendingAction(null);
			}
			setLoading(false);
		}
	};

	const handleCloseConflictModal = () => {
		if (conflictLoading) {
			return;
		}
		closeConflictModalState();
		setLoading(false);
	};

	const retryPendingAction = async () => {
		if (!pendingAction) {
			return;
		}

		if (pendingAction.type === 'start') {
			await startNewTime(pendingAction.caseId, true);
		} else {
			await stopCurrentTime(pendingAction.caseId, true);
		}
	};

	const handleStopOpenCase = async () => {
		if (!conflictCaseId) {
			return;
		}

		setConflictLoading(true);
		try {
			const response = await stopTimeCase(conflictCaseId);
			if (response.success) {
				toast.success(response.message || 'Tempo parado com sucesso!');
				const stopTimeIso = new Date().toISOString();
				const pending = pendingAction;

				if (typeof window !== 'undefined') {
					try {
						const storedValue = window.localStorage.getItem(ACTIVE_CASE_STORAGE_KEY);
						if (!storedValue) {
							window.localStorage.removeItem(ACTIVE_CASE_STORAGE_KEY);
						} else {
							try {
								const parsed = JSON.parse(storedValue) as ActiveCaseStorageData;
								if (!parsed.caseId || String(parsed.caseId) === conflictCaseId) {
									window.localStorage.removeItem(ACTIVE_CASE_STORAGE_KEY);
								}
							} catch (error) {
								window.localStorage.removeItem(ACTIVE_CASE_STORAGE_KEY);
							}
						}
					} catch (error) {
						console.error('Erro ao limpar o caso ativo do localStorage:', error);
					}
					window.dispatchEvent(new Event(ACTIVE_CASE_EVENT));
				}

				const currentTrackedCaseId = localCase?.caso?.id
					? String(localCase.caso.id)
					: caseData?.caso?.id
						? String(caseData.caso.id)
						: null;

				if (currentTrackedCaseId && currentTrackedCaseId === conflictCaseId) {
					applyStopToCurrentCase(stopTimeIso);
				}

				closeConflictModalState({ preservePendingAction: true });

				if (pending && pending.caseId === conflictCaseId && pending.type === 'stop') {
					setPendingAction(null);
					setLoading(false);
				} else {
					await retryPendingAction();
				}
			} else {
				toast.warning(response.message || 'Nao foi possivel parar o tempo do caso aberto.');
				if (response.caso_aberto) {
					setConflictCaseId(String(response.caso_aberto));
				}
				setConflictMessage(
					response.message ?? 'Existe um caso com tempo em andamento. Deseja tentar novamente?'
				);
			}
		} catch (error) {
			console.error('Erro ao parar o tempo do caso aberto:', error);
			toast.error('Falha ao parar o tempo do caso aberto.');
		} finally {
			setConflictLoading(false);
		}
	};

	const currentCase = localCase ?? caseData ?? null;
	const caseId = currentCase?.caso.id ? String(currentCase.caso.id) : undefined;
	const timeEntries = currentCase?.caso.producao ?? [];
	const activeEntry = timeEntries.find((entry) => !entry.datas.fechamento);
	const historyEntries = timeEntries.filter((entry) => entry.datas.fechamento);
	const currentTipo = activeEntry?.tipo ?? historyEntries[0]?.tipo ?? 'desenvolvendo';
	const runningStart = activeEntry?.datas.abertura ? formatTime(activeEntry.datas.abertura) : null;
	const isRunning = Boolean(activeEntry);

	useEffect(() => {
		if (typeof window === 'undefined') {
			return;
		}

		const storedValue = window.localStorage.getItem(ACTIVE_CASE_STORAGE_KEY);

		if (isRunning && caseId && activeEntry?.datas.abertura) {
			const payload = { caseId, startedAt: activeEntry.datas.abertura };
			let shouldUpdate = true;

			if (storedValue) {
				try {
					const parsed = JSON.parse(storedValue) as ActiveCaseStorageData;
					if (parsed.caseId === payload.caseId && parsed.startedAt === payload.startedAt) {
						shouldUpdate = false;
					}
				} catch (error) {
					console.error('Erro ao interpretar dados do caso ativo no localStorage:', error);
				}
			}

			if (shouldUpdate) {
				try {
					window.localStorage.setItem(ACTIVE_CASE_STORAGE_KEY, JSON.stringify(payload));
				} catch (error) {
					console.error('Erro ao sincronizar o caso ativo no localStorage:', error);
				}
				window.dispatchEvent(new Event(ACTIVE_CASE_EVENT));
			}
		} else if (!isRunning && storedValue) {
			try {
				const parsed = JSON.parse(storedValue) as ActiveCaseStorageData;
				if (parsed.caseId === caseId) {
					window.localStorage.removeItem(ACTIVE_CASE_STORAGE_KEY);
					window.dispatchEvent(new Event(ACTIVE_CASE_EVENT));
				}
			} catch (error) {
				console.error('Erro ao interpretar dados do caso ativo no localStorage:', error);
			}
		}
	}, [activeEntry?.datas.abertura, caseId, isRunning]);

	useEffect(() => {
		if (!isRunning || !activeEntry?.datas.abertura) {
			setElapsedMinutes(null);
			return;
		}

		const startTime = new Date(activeEntry.datas.abertura);
		if (Number.isNaN(startTime.getTime())) {
			setElapsedMinutes(null);
			return;
		}

		const updateElapsed = () => {
			const diffMs = Math.max(Date.now() - startTime.getTime(), 0);
			const totalMinutes = Math.floor(diffMs / (1000 * 60));
			setElapsedMinutes(totalMinutes);
		};

		updateElapsed();
		const intervalId = window.setInterval(updateElapsed, 60000);

		return () => {
			window.clearInterval(intervalId);
		};
	}, [activeEntry?.datas.abertura, isRunning]);

	if (!currentCase) {
		return <TimetrackerSkelleton />;
	}

	const tempos = currentCase?.caso.tempos;
	const estimadoMinutos = tempos?.estimado_minutos ?? 0;
	const realizadoMinutos = tempos?.realizado_minutos ?? 0;
	const tamanhoPontos = currentCase?.caso.caracteristicas?.tamanho_pontos;

	return (
		<>
			<div className="d-flex flex-column gap-4">
				<CaseTimeTrackerTimeControl 
					caseId={caseId}
					currentTipo={currentTipo}
					elapsedMinutes={elapsedMinutes}
					isRunning={isRunning}
					loading={loading}
					runningStart={runningStart}
					startNewTime={startNewTime}
					stopCurrentTime={stopCurrentTime}
					estimadoMinutos={estimadoMinutos}
					realizadoMinutos={realizadoMinutos}
					tamanhoPontos={tamanhoPontos}
					onCaseUpdated={handleCaseUpdate}
				/>
				<CaseTimeTrackerHistory 
					historyEntries={historyEntries} 
					caseId={caseId ? Number(caseId) : undefined}
					caseData={currentCase}
					onUpdated={handleCaseUpdate}
				/>
			</div>
			<CaseActiveTimeConflictModal
				show={conflictModalOpen}
				caseId={conflictCaseId}
				message={conflictMessage}
				loading={conflictLoading}
				onCancel={handleCloseConflictModal}
				onConfirm={handleStopOpenCase}
			/>
		</>
	);
}

