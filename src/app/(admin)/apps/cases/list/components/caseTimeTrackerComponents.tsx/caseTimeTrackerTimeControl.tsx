"use client";
import { useMemo, useCallback, useState, useEffect } from "react";
import { Badge, Card, Col, Row, Form, Spinner } from "react-bootstrap";
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
import AsyncSelectInput from "@/components/Form/AsyncSelectInput";
import useAsyncSelect, { AsyncSelectOption } from "@/hooks/useAsyncSelect";
import { getTamanhos, ITamanho } from "@/services/tamanhosServices";
import { hasPermissao } from "@/helpers/permissionsHelpers";
import { useThemeContext } from "@/common/context";
import { getAsyncSelectStyles } from "@/components/Form/asyncSelectStyles";

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
  tamanhoPontos?: number | null;
  naoPlanejado?: boolean;
  onCaseUpdated?: () => void;
  canEditTempoEstimado?: boolean;
  canEditPontos?: boolean;
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
  tamanhoPontos,
  naoPlanejado = false,
  onCaseUpdated,
  canEditTempoEstimado,
  canEditPontos,
}: CaseTimeTrackerTimeControlProps) {
  const { settings } = useThemeContext();
  const isDarkMode = settings.theme === 'dark';
  const { formatMinutesToHours, validateTime } = useTimeFormatter();

  const handleSaveTime = useCallback(async (time: string, tamanhoId?: number, naoPlanejadoValue?: boolean) => {
    if (!caseId) {
      throw new Error('ID do caso não encontrado');
    }

    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const tempoEstimado = `${year}-${month}-${day} ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;

    const updateData: any = { TempoEstimado: tempoEstimado };
    if (tamanhoId) {
      updateData.tamanho = tamanhoId;
    }
    if (naoPlanejadoValue !== undefined) {
      updateData.NaoPlanejado = naoPlanejadoValue ? 1 : 0;
    }

    await updateCase(caseId, updateData);
    toast.success('Tempo estimado atualizado com sucesso!');

    if (onCaseUpdated) {
      onCaseUpdated();
    }
  }, [caseId, onCaseUpdated]);

  const [naoPlanejadoValue, setNaoPlanejadoValue] = useState<boolean>(naoPlanejado);
  const [naoPlanejadoLoading, setNaoPlanejadoLoading] = useState<boolean>(false);

  useEffect(() => {
    setNaoPlanejadoValue(naoPlanejado);
  }, [naoPlanejado]);

  const handleNaoPlanejadoChange = useCallback(async (checked: boolean) => {
    setNaoPlanejadoValue(checked);
    if (caseId) {
      setNaoPlanejadoLoading(true);
      try {
        await updateCase(caseId, { NaoPlanejado: checked ? 1 : 0 });
        toast.success('Campo atualizado com sucesso!');
        if (onCaseUpdated) {
          onCaseUpdated();
        }
      } catch (error) {
        setNaoPlanejadoValue(!checked);
        toast.error('Erro ao atualizar campo');
      } finally {
        setNaoPlanejadoLoading(false);
      }
    }
  }, [caseId, onCaseUpdated]);

  const [selectedTamanhoId, setSelectedTamanhoId] = useState<number | undefined>();

  const {
    timeInput,
    timeError,
    saving,
    handleChange,
    handleKeyDown,
    handleFocus,
    handleSave,
    setTimeInput,
  } = useTimeInput({
    initialMinutes: estimadoMinutos,
    onSave: (time) => handleSaveTime(time, selectedTamanhoId),
  });

  const { loadOptions, isLoading, defaultOptions, setSelectedOption, selectedOption } = useAsyncSelect<ITamanho>({
    fetchItems: getTamanhos,
    getOptionLabel: (item) => `${item.tamanho} | ${item.tempo.split(' ')[1].slice(0, 5)} | ${item.descricao}`,
    getOptionValue: (item) => item.id,
  });

  // Efeito para selecionar o ponto inicial baseado no caso carregado
  useEffect(() => {
    if (tamanhoPontos && defaultOptions.length > 0) {
      const initialOption = defaultOptions.find(
        opt => opt.raw.tamanho === String(tamanhoPontos)
      );
      if (initialOption) {
        setSelectedOption(initialOption);
        setSelectedTamanhoId(initialOption.raw.id);
      }
    }
  }, [tamanhoPontos, defaultOptions, setSelectedOption]);

  const handleTamanhoChange = useCallback((option: AsyncSelectOption<ITamanho> | null) => {
    setSelectedOption(option);
    if (option && option.raw) {
      const tamanho = option.raw;
      setSelectedTamanhoId(tamanho.id);
      // tempo: "1899-12-30 01:00:00.000"
      const timePart = tamanho.tempo.split(' ')[1]; // "01:00:00.000"
      if (timePart) {
        const [hours, minutes] = timePart.split(':');
        setTimeInput(`${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`);
      }
    } else {
      setSelectedTamanhoId(undefined);
    }
  }, [setTimeInput, setSelectedOption]);

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

  const shouldShowPointsInput = canEditPontos || !tamanhoPontos;

  // Desabilita o botão de iniciar apenas se não tiver tempo estimado E não for não planejado
  // Se não planejado for true, o botão fica habilitado mesmo sem tempo estimado
  const shouldDisableStartButton = useMemo(() => {
    return (!estimadoMinutos || estimadoMinutos === 0) && !naoPlanejadoValue;
  }, [estimadoMinutos, naoPlanejadoValue]);

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

        .points-display {
          flex: 1 1 auto;
          min-width: 200px;
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

          .points-selector-container {
            width: 100% !important;
          }

          .points-display {
            width: 100%;
          }
          
          .points-display .iconify-icon {
            font-size: 1.1rem;
          }
          
          .points-display span {
            font-size: 0.875rem;
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
                  <div className="d-flex flex-wrap align-items-start gap-3 pt-3 border-top case-time-control-info">
                    {/* Checkbox Não Planejado */}
                    <div className="d-flex align-items-center gap-2" style={{ flex: '0 0 auto' }}>
                      <Form.Check
                        type="checkbox"
                        id="nao-planejado-time-checkbox"
                        checked={naoPlanejadoValue}
                        onChange={(e) => handleNaoPlanejadoChange(e.target.checked)}
                        disabled={naoPlanejadoLoading}
                        className="mb-0"
                        style={{ 
                          cursor: naoPlanejadoLoading ? 'wait' : 'pointer',
                          accentColor: 'var(--bs-primary)',
                          marginTop: '0.125rem',
                          opacity: naoPlanejadoLoading ? 0.6 : 1
                        }}
                      />
                      <Form.Label 
                        htmlFor="nao-planejado-time-checkbox"
                        className="mb-0 d-flex align-items-center gap-1"
                        style={{ 
                          cursor: naoPlanejadoLoading ? 'wait' : 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: naoPlanejadoValue ? '600' : '500',
                          color: naoPlanejadoValue ? 'var(--bs-primary)' : '#6c757d',
                          transition: 'all 0.2s ease',
                          userSelect: 'none',
                          margin: 0
                        }}
                      >
                        {naoPlanejadoLoading ? (
                          <Spinner
                            animation="border"
                            size="sm"
                            style={{ 
                              width: '0.875rem',
                              height: '0.875rem',
                              borderWidth: '0.125rem'
                            }}
                          />
                        ) : (
                          <IconifyIcon 
                            icon="lucide:calendar-x" 
                            style={{ 
                              fontSize: '0.875rem',
                              color: naoPlanejadoValue ? 'var(--bs-primary)' : '#6c757d'
                            }} 
                          />
                        )}
                        <span>Não Planejado</span>
                      </Form.Label>
                    </div>

                    {shouldShowPointsInput ? (
                      <div className="points-selector-container" style={{ flex: '1 1 auto', minWidth: '220px', zIndex: 1001 }}>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <IconifyIcon icon="lucide:gauge" className="text-primary" />
                          <span className="small fw-medium">Pontos:</span>
                        </div>
                        <AsyncSelectInput
                          placeholder="Selecione os pontos..."
                          loadOptions={loadOptions}
                          isLoading={isLoading}
                          value={selectedOption}
                          onChange={handleTamanhoChange}
                          defaultOptions
                          noOptionsMessage={() => "Nenhum tamanho encontrado"}
                          loadingMessage={() => "Carregando..."}
                          menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
                          styles={{
                            ...getAsyncSelectStyles(isDarkMode),
                            control: (base, state) => {
                              const baseStyles = getAsyncSelectStyles(isDarkMode);
                              const baseControl = baseStyles.control?.(base, state) || base;
                              return {
                                ...baseControl,
                                minHeight: '38px',
                                fontSize: '0.875rem'
                              };
                            },
                            menuPortal: (base) => ({ ...base, zIndex: 9999 })
                          }}
                        />
                      </div>
                    ) : (
                      <div className="d-flex align-items-center gap-2 points-display">
                        <IconifyIcon icon="lucide:gauge" className="text-primary" />
                        <span className="small fw-medium">
                          Pontos: <span className="text-primary">{tamanhoPontos}</span>
                        </span>
                      </div>
                    )}

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
                      canEdit={canEditTempoEstimado}
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
                      disabled={loading || !caseId || shouldDisableStartButton}
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
