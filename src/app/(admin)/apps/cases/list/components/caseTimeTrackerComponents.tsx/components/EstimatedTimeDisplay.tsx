import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { useTimeFormatter } from '../hooks/useTimeFormatter';
import TimeInput from './TimeInput';

interface EstimatedTimeDisplayProps {
  estimadoMinutos: number;
  timeInput: string;
  timeError?: string;
  saving: boolean;
  caseId?: string;
  isValid: boolean;
  onTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTimeKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onTimeFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
  onSave: () => void;
}

/**
 * Componente para exibir ou editar o tempo estimado
 */
export default function EstimatedTimeDisplay({
  estimadoMinutos,
  timeInput,
  timeError,
  saving,
  caseId,
  isValid,
  onTimeChange,
  onTimeKeyDown,
  onTimeFocus,
  onSave,
}: EstimatedTimeDisplayProps) {
  const { formatMinutesToHours } = useTimeFormatter();

  if (estimadoMinutos > 0) {
    return (
      <div className="d-flex align-items-center gap-2">
        <IconifyIcon icon="lucide:target" className="text-primary" />
        <span className="small fw-medium">
          Tempo estimado: <span className="text-primary">{formatMinutesToHours(estimadoMinutos)}</span>
        </span>
      </div>
    );
  }

  return (
    <div style={{ flex: '1 1 auto', minWidth: '200px' }}>
      <div className="d-flex align-items-center gap-2">
        <IconifyIcon icon="lucide:target" className="text-primary" />
        <span className="small fw-medium">Tempo estimado:</span>
      </div>
      <TimeInput
        value={timeInput}
        error={timeError}
        saving={saving}
        disabled={!caseId || !isValid}
        onChange={onTimeChange}
        onKeyDown={onTimeKeyDown}
        onFocus={onTimeFocus}
        onSave={onSave}
      />
    </div>
  );
}





