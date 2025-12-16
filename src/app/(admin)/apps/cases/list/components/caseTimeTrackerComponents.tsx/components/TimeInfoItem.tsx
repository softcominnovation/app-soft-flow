import IconifyIcon from '@/components/wrappers/IconifyIcon';

interface TimeInfoItemProps {
  icon: string;
  label: string;
  value: string;
  valueClassName?: string;
}

/**
 * Componente reutilizável para exibir informações de tempo
 */
export default function TimeInfoItem({ icon, label, value, valueClassName }: TimeInfoItemProps) {
  return (
    <>
      <style>{`
        @media (max-width: 991.98px) {
          .time-info-item {
            width: 100%;
          }
          
          .time-info-item .iconify-icon {
            font-size: 1.1rem;
          }
          
          .time-info-item span {
            font-size: 0.875rem;
          }
        }
      `}</style>
      <div className="d-flex align-items-center gap-2 time-info-item">
        <IconifyIcon icon={icon} className={valueClassName} />
        <span className="small fw-medium">
          {label}: <span className={valueClassName}>{value}</span>
        </span>
      </div>
    </>
  );
}







