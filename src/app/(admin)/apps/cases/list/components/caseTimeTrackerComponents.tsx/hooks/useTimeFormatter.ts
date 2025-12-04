import { useCallback } from 'react';

/**
 * Hook utilitário para formatação de tempo
 */
export const useTimeFormatter = () => {
  const formatMinutesToHours = useCallback((minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) {
      return `${hours}h ${mins}min`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${mins}min`;
    }
  }, []);

  const minutesToTime = useCallback((minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  }, []);

  const timeToMinutes = useCallback((time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return (hours || 0) * 60 + (minutes || 0);
  }, []);

  const validateTime = useCallback((time: string): boolean => {
    const timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
    return timeRegex.test(time);
  }, []);

  return {
    formatMinutesToHours,
    minutesToTime,
    timeToMinutes,
    validateTime,
  };
};

