import IconifyIcon from '@/components/wrappers/IconifyIcon';

interface AccordionToggleProps {
	eventKey: string;
	children: React.ReactNode;
	className?: string;
	isOpen: boolean;
	onToggle: (eventKey: string) => void;
}

export default function AccordionToggle({ 
	eventKey, 
	children, 
	className, 
	isOpen, 
	onToggle 
}: AccordionToggleProps) {
	return (
		<button
			type="button"
			className={`w-100 text-start border-0 bg-transparent p-0 d-flex align-items-center justify-content-between ${className || ''}`}
			onClick={() => onToggle(eventKey)}
			aria-expanded={isOpen}
		>
			{children}
			<IconifyIcon 
				icon={isOpen ? "lucide:chevron-up" : "lucide:chevron-down"} 
				className="ms-auto"
				style={{ fontSize: '18px' }}
			/>
		</button>
	);
}
















