import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { useTimeFormatter } from '../hooks/useTimeFormatter';
import TimeInput from './TimeInput';
import { hasPermissao } from '@/helpers/permissionsHelpers';

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
  canEdit?: boolean;
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
  canEdit,
}: EstimatedTimeDisplayProps) {
  const { formatMinutesToHours } = useTimeFormatter();

  // Se tem permissão de edição, sempre mostra o input
  // Se não tem permissão, só mostra o input quando não tem tempo estimado
  const shouldShowInput = canEdit || estimadoMinutos === 0;

  if (!shouldShowInput) {
    return (
      <>
        <style>{`
          @media (max-width: 991.98px) {
            .estimated-time-display {
              width: 100%;
            }
            
            .estimated-time-display .iconify-icon {
              font-size: 1.1rem;
            }
            
            .estimated-time-display span {
              font-size: 0.875rem;
            }
          }
        `}</style>
        <div className="d-flex align-items-center gap-2 estimated-time-display">
          <IconifyIcon icon="lucide:target" className="text-primary" />
          <span className="small fw-medium">
            Tempo estimado: <span className="text-primary">{formatMinutesToHours(estimadoMinutos)}</span>
          </span>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @media (max-width: 991.98px) {
          .estimated-time-input-container {
            width: 100% !important;
            min-width: 100% !important;
          }
            
          .estimated-time-input-container .iconify-icon {
            font-size: 1.1rem;
          }
            
          .estimated-time-input-container span {
            font-size: 0.875rem;
            margin-bottom: 0.5rem;
          }
        }
      `}</style>
      <div className="estimated-time-input-container" style={{ flex: '1 1 auto', minWidth: '200px' }}>
        <div className="d-flex align-items-center gap-2">
          <IconifyIcon icon="lucide:target" className="text-primary" />
          <span className="small fw-medium">Tempo estimado:</span>
        </div>
        <div className="mt-1">
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
      </div>
    </>
  );
}







