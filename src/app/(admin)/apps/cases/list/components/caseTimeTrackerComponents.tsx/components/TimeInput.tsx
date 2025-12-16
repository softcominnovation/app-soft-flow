import { Form, InputGroup, Button, Spinner } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

interface TimeInputProps {
  value: string;
  error?: string;
  saving: boolean;
  disabled: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
  onSave: () => void;
}

/**
 * Componente de input de tempo com máscara e botão de salvar
 */
export default function TimeInput({
  value,
  error,
  saving,
  disabled,
  onChange,
  onKeyDown,
  onFocus,
  onSave,
}: TimeInputProps) {
  return (
    <>
      <style>{`
        @media (max-width: 991.98px) {
          .time-input-container {
            margin-top: 0.5rem;
          }
          
          .time-input-container .input-group {
            width: 100%;
          }
          
          .time-input-container .form-control {
            max-width: 100% !important;
            min-height: 44px;
            font-size: 1rem;
            padding: 0.625rem 0.75rem;
          }
          
          .time-input-container .btn {
            min-height: 44px;
            font-size: 0.9375rem;
            padding: 0.625rem 1rem;
            white-space: nowrap;
          }
          
          .time-input-container .btn .iconify-icon {
            font-size: 1rem;
          }
        }
      `}</style>
      <div className="mt-2 time-input-container">
        <InputGroup size="sm">
          <Form.Control
            type="text"
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            onFocus={onFocus}
            placeholder="00:00"
            maxLength={5}
            isInvalid={!!error}
            style={{ maxWidth: '100px' }}
          />
          <Button
            variant="primary"
            size="sm"
            onClick={onSave}
            disabled={disabled || saving || !!error}
            className="d-flex align-items-center gap-1"
          >
            {saving ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                variant="light"
              />
            ) : (
              <IconifyIcon icon="lucide:save" style={{ fontSize: '0.875rem' }} />
            )}
            Salvar
          </Button>
        </InputGroup>
        {error && (
          <Form.Control.Feedback type="invalid" className="d-block mt-1" style={{ fontSize: '0.75rem' }}>
            {error}
          </Form.Control.Feedback>
        )}
      </div>
    </>
  );
}







