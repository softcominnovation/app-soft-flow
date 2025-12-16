import { Button, Spinner } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

interface TimeControlButtonProps {
  variant: 'success' | 'danger';
  icon: string;
  label: string;
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
}

/**
 * Componente reutilizável para botões de controle de tempo
 */
export default function TimeControlButton({
  variant,
  icon,
  label,
  loading,
  disabled,
  onClick,
}: TimeControlButtonProps) {
  return (
    <>
      <style>{`
        @media (max-width: 991.98px) {
          .time-control-button {
            min-height: 48px !important;
            font-size: 0.9375rem !important;
            padding: 0.75rem 1rem !important;
            font-weight: 500;
          }
          
          .time-control-button .iconify-icon {
            font-size: 1.2rem;
          }
        }
      `}</style>
      <Button
        disabled={disabled}
        variant={variant}
        onClick={onClick}
        className="d-flex align-items-center justify-content-center gap-2 time-control-button"
        style={{ padding: '0.625rem 1rem' }}
      >
        <IconifyIcon icon={icon} />
        {loading ? (
          <span className="d-flex align-items-center gap-2">
            <span>{label}</span>
            <Spinner
              as="span"
              animation="border"
              variant="light"
              size="sm"
            />
          </span>
        ) : (
          label
        )}
      </Button>
    </>
  );
}







