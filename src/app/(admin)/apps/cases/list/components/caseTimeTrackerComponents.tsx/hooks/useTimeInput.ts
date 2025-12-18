import { useState, useEffect, useCallback } from 'react';
import { useTimeFormatter } from './useTimeFormatter';

interface UseTimeInputProps {
  initialMinutes: number;
  onSave: (time: string) => Promise<void>;
}

/**
 * Hook customizado para gerenciar o input de tempo com máscara e validação
 */
export const useTimeInput = ({ initialMinutes, onSave }: UseTimeInputProps) => {
  const { validateTime } = useTimeFormatter();
  
  // Função local para converter minutos para tempo (evita dependência instável)
  const minutesToTime = useCallback((minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  }, []);

  const [timeInput, setTimeInput] = useState<string>(() => minutesToTime(initialMinutes));
  const [saving, setSaving] = useState<boolean>(false);
  const [timeError, setTimeError] = useState<string>('');

  useEffect(() => {
    setTimeInput(minutesToTime(initialMinutes));
  }, [initialMinutes, minutesToTime]);

  const applyTimeMask = useCallback((value: string): string => {
    const numbers = value.replace(/\D/g, '');
    const limited = numbers.slice(0, 4);

    if (limited.length === 0) return '';
    if (limited.length <= 2) return limited;
    return `${limited.slice(0, 2)}:${limited.slice(2, 4)}`;
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    setTimeError('');

    if (rawValue === '') {
      setTimeInput('');
      return;
    }

    const maskedValue = applyTimeMask(rawValue);
    setTimeInput(maskedValue);

    if (maskedValue.length === 5) {
      const [hours, minutes] = maskedValue.split(':').map(Number);

      if (hours > 23) {
        setTimeError('Hora inválida. Use 00-23');
        return;
      }

      if (minutes > 59) {
        setTimeError('Minutos inválidos. Use 00-59');
        return;
      }
    }
  }, [applyTimeMask]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = [8, 9, 27, 13, 46, 37, 38, 39, 40];
    const isAllowedKey = allowedKeys.includes(e.keyCode) ||
      (e.keyCode === 65 && e.ctrlKey) || // Ctrl+A
      (e.keyCode === 67 && e.ctrlKey) || // Ctrl+C
      (e.keyCode === 86 && e.ctrlKey) || // Ctrl+V
      (e.keyCode === 88 && e.ctrlKey);   // Ctrl+X

    if (isAllowedKey) return;

    const isNumber = (e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105);
    if (!isNumber) {
      e.preventDefault();
    }
  }, []);

  const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    if (timeInput === '00:00' || timeInput === '0000' || timeInput === '') {
      e.target.select();
    }
  }, [timeInput]);

  const handleSave = useCallback(async () => {
    if (!validateTime(timeInput)) {
      setTimeError('Por favor, insira um horário válido (HH:MM, máximo 23:59)');
      return;
    }

    const [hours, minutes] = timeInput.split(':').map(Number);
    if (hours > 23 || (hours === 23 && minutes > 59)) {
      setTimeError('Hora máxima permitida é 23:59');
      return;
    }

    setSaving(true);
    setTimeError('');

    try {
      await onSave(timeInput);
    } catch (error: any) {
      setTimeError(error?.message || 'Erro ao salvar tempo estimado');
      throw error;
    } finally {
      setSaving(false);
    }
  }, [timeInput, validateTime, onSave]);

  return {
    timeInput,
    timeError,
    saving,
    handleChange,
    handleKeyDown,
    handleFocus,
    handleSave,
    setTimeInput,
  };
};

