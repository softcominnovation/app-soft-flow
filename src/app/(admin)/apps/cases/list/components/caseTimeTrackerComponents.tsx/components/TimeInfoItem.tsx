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
    <div className="d-flex align-items-center gap-2">
      <IconifyIcon icon={icon} className={valueClassName} />
      <span className="small fw-medium">
        {label}: <span className={valueClassName}>{value}</span>
      </span>
    </div>
  );
}






