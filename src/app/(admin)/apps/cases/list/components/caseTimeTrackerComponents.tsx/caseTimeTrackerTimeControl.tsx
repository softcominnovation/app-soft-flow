"use client";
import { useMemo, useCallback } from "react";
import { Badge, Card, Col, Row } from "react-bootstrap";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { useGetTipoBadgeVariant, useGetTipoIcon } from "@/hooks/caseTimeTracker/caseTimeTrackerVarianions";
import { formatTipoLabel } from "@/hooks/caseTimeTracker/useFormatLabel";
import { useTimeFormatter } from "./hooks/useTimeFormatter";
import { useTimeInput } from "./hooks/useTimeInput";
import { updateCase } from "@/services/caseServices";
import { toast } from "react-toastify";
import EstimatedTimeDisplay from "./components/EstimatedTimeDisplay";
import TimeInfoItem from "./components/TimeInfoItem";
import TimeControlButton from "./components/TimeControlButton";

interface CaseTimeTrackerTimeControlProps {
  stopCurrentTime: (id: string, isRetry?: boolean) => Promise<void>;
  startNewTime: (id: string, isRetry?: boolean) => Promise<void>;
  isRunning: boolean;
  loading: boolean;
  currentTipo: string;
  runningStart: string | null;
  elapsedMinutes: number | null;
  caseId: string | undefined;
  estimadoMinutos: number;
  realizadoMinutos: number;
  onCaseUpdated?: () => void;
}

const BADGE_BASE_CLASS = "d-inline-flex align-items-center gap-1 text-capitalize py-1 px-2 rounded-2";

/**
 * Componente principal de controle de tempo do caso
 */
export default function CaseTimeTrackerTimeControl({
  caseId,
  stopCurrentTime,
  startNewTime,
  isRunning,
  loading,
  currentTipo,
  runningStart,
  elapsedMinutes,
  estimadoMinutos,
  realizadoMinutos,
  onCaseUpdated,
}: CaseTimeTrackerTimeControlProps) {
  const { formatMinutesToHours, validateTime } = useTimeFormatter();

  const handleSaveTime = useCallback(async (time: string) => {
    if (!caseId) {
      throw new Error('ID do caso não encontrado');
    }

    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const tempoEstimado = `${year}-${month}-${day} ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;

    await updateCase(caseId, { TempoEstimado: tempoEstimado });
    toast.success('Tempo estimado atualizado com sucesso!');

    if (onCaseUpdated) {
      onCaseUpdated();
    }
  }, [caseId, onCaseUpdated]);

  const {
    timeInput,
    timeError,
    saving,
    handleChange,
    handleKeyDown,
    handleFocus,
    handleSave,
  } = useTimeInput({
    initialMinutes: estimadoMinutos,
    onSave: handleSaveTime,
  });

  const handleStartTime = useCallback(() => {
    if (caseId) {
      startNewTime(caseId);
    }
  }, [caseId, startNewTime]);

  const handleStopTime = useCallback(() => {
    if (caseId) {
      stopCurrentTime(caseId);
    }
  }, [caseId, stopCurrentTime]);

  const tempoRestante = useMemo(
    () => Math.max(estimadoMinutos - realizadoMinutos, 0),
    [estimadoMinutos, realizadoMinutos]
  );

  const runningStatusText = useMemo(() => {
    if (isRunning) {
      return runningStart ? `Iniciado em: ${runningStart}` : 'Tempo em andamento';
    }
    return 'Nenhum tempo em andamento';
  }, [isRunning, runningStart]);

  return (
    <>
      <style>{`
        .case-time-control-card .card-header {
          padding: 0.75rem 1rem !important;
        }
        
        .case-time-control-card .card-header h5 {
          font-size: 1rem;
          font-weight: 600;
          margin: 0;
        }
        
        .case-time-control-card .card-header .iconify-icon {
          font-size: 1.125rem;
        }
        
        @media (max-width: 991.98px) {
          .case-time-control-card .card-header {
            padding: 0.625rem 0.875rem !important;
          }
          
          .case-time-control-card .card-header h5 {
            font-size: 0.9375rem;
          }
          
          .case-time-control-card .card-body {
            padding: 1rem !important;
          }
          
          .case-time-control-badges {
            flex-wrap: wrap;
            gap: 0.5rem !important;
          }
          
          .case-time-control-badges .badge {
            font-size: 0.75rem !important;
            padding: 0.375rem 0.625rem !important;
          }
          
          .case-time-control-status {
            font-size: 0.8125rem !important;
            margin-top: 0.5rem;
          }
          
          .case-time-control-elapsed {
            font-size: 0.8125rem !important;
            margin-top: 0.25rem;
          }
          
          .case-time-control-info {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 0.875rem !important;
            padding-top: 1rem !important;
            margin-top: 0.75rem;
          }
          
          .case-time-control-button {
            min-height: 48px !important;
            font-size: 0.9375rem !important;
            padding: 0.75rem 1rem !important;
          }
        }
      `}</style>
      <div className="d-flex flex-column" style={{ gap: '1.5rem' }}>
        <Card className="border-0 shadow-sm mb-0 case-time-control-card">
          <Card.Header className="bg-light border-bottom p-0">
            <div className="p-2">
              <h5 className="mb-0 d-flex align-items-center text-body">
                <IconifyIcon icon="lucide:clock" className="me-2 text-primary" />
                Controle de Tempo
              </h5>
            </div>
          </Card.Header>
          <Card.Body style={{ padding: '1.5rem' }}>
            <Row className="align-items-start g-3">
              <Col xs={12}>
                <div className="d-flex flex-column gap-3">
                  {/* Badges de Status */}
                  <div className="d-flex flex-wrap align-items-center gap-2 case-time-control-badges">
                    <Badge
                      bg={isRunning ? 'success' : 'secondary'}
                      className={BADGE_BASE_CLASS}
                      style={{ fontSize: '0.78rem' }}
                    >
                      <IconifyIcon icon={isRunning ? 'lucide:play' : 'lucide:pause'} />
                      {isRunning ? 'Em andamento' : 'Pausado'}
                    </Badge>
                    <Badge
                      bg={useGetTipoBadgeVariant(currentTipo)}
                      className={BADGE_BASE_CLASS}
                      style={{ fontSize: '0.78rem' }}
                    >
                      <IconifyIcon icon={useGetTipoIcon(currentTipo)} />
                      {formatTipoLabel(currentTipo)}
                    </Badge>
                  </div>

                  {/* Status do Tempo */}
                  <div className="text-muted d-flex align-items-center gap-2 case-time-control-status">
                    <IconifyIcon icon={isRunning ? 'lucide:timer' : 'lucide:pause'} />
                    <span className="small mb-0">{runningStatusText}</span>
                  </div>

                  {/* Tempo Corrido */}
                  {isRunning && elapsedMinutes !== null && (
                    <div className="text-muted small case-time-control-elapsed">
                      Tempo corrido: {elapsedMinutes} {elapsedMinutes === 1 ? 'minuto' : 'minutos'}
                    </div>
                  )}

                  {/* Informações de Tempo */}
                  <div className="d-flex flex-wrap align-items-center gap-3 pt-3 border-top case-time-control-info">
                    <EstimatedTimeDisplay
                      estimadoMinutos={estimadoMinutos}
                      timeInput={timeInput}
                      timeError={timeError}
                      saving={saving}
                      caseId={caseId}
                      isValid={validateTime(timeInput)}
                      onTimeChange={handleChange}
                      onTimeKeyDown={handleKeyDown}
                      onTimeFocus={handleFocus}
                      onSave={handleSave}
                    />
                    <TimeInfoItem
                      icon="lucide:clock"
                      label="Tempo total"
                      value={formatMinutesToHours(realizadoMinutos)}
                      valueClassName="text-info"
                    />
                    <TimeInfoItem
                      icon="lucide:hourglass"
                      label="Tempo restante"
                      value={formatMinutesToHours(tempoRestante)}
                      valueClassName="text-warning"
                    />
                  </div>
                </div>
              </Col>

              {/* Botão de Controle */}
              <Col xs={12}>
                <div className="d-grid">
                  {isRunning ? (
                    <TimeControlButton
                      variant="danger"
                      icon="lucide:square"
                      label="Parar tempo"
                      loading={loading}
                      disabled={loading || !caseId}
                      onClick={handleStopTime}
                    />
                  ) : (
                    <TimeControlButton
                      variant="success"
                      icon="lucide:play"
                      label="Iniciar tempo"
                      loading={loading}
                      disabled={loading || !caseId}
                      onClick={handleStartTime}
                    />
                  )}
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}
