"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "react-bootstrap";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import classNames from "classnames";

type ActionItem = {
	icon: string;
	label: string;
	onClick: () => void;
	variant?: "primary" | "secondary" | "success" | "danger" | "warning" | "info";
};

type Props = {
	actions: ActionItem[];
	mainIcon?: string;
	mainLabel?: string;
};

/**
 * Componente de Botão de Ações Flutuantes (FAB)
 * Expande para mostrar múltiplas ações quando clicado
 */
export default function FloatingActionButton({ actions, mainIcon = "lucide:plus", mainLabel = "Ações" }: Props) {
	const [isOpen, setIsOpen] = useState(false);
	const fabRef = useRef<HTMLDivElement>(null);

	// Fecha o FAB quando clicar fora
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (fabRef.current && !fabRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen]);

	const toggleFAB = () => {
		setIsOpen(!isOpen);
	};

	const handleActionClick = (onClick: () => void) => {
		onClick();
		setIsOpen(false);
	};

	return (
		<div 
			ref={fabRef} 
			className="position-fixed d-flex flex-column align-items-end"
			style={{ 
				bottom: "80px", 
				right: "32px", 
				zIndex: 1050,
			}}
		>
			{/* Ações expandidas */}
			<div
				className={classNames("d-flex flex-column gap-2 mb-2", {
					"opacity-0 invisible": !isOpen,
					"opacity-100 visible": isOpen,
				})}
				style={{
					transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
					transform: isOpen ? "translateY(0)" : "translateY(20px)",
					pointerEvents: isOpen ? "auto" : "none",
				}}
			>
				{actions.map((action, index) => (
					<div
						key={index}
						className="d-flex align-items-center justify-content-end gap-2"
						style={{
							transition: "all 0.2s ease",
							transitionDelay: `${index * 0.05}s`,
							transform: isOpen ? "scale(1)" : "scale(0.8)",
							opacity: isOpen ? 1 : 0,
						}}
					>
						<span
							className="bg-body text-body px-3 py-2 rounded-pill shadow-sm fw-semibold small border"
							style={{
								whiteSpace: "nowrap",
								fontSize: "14px",
							}}
						>
							{action.label}
						</span>
						<Button
							variant="primary"
							className="rounded-circle p-0 d-flex align-items-center justify-content-center"
							style={{
								width: "56px",
								height: "56px",
								boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
							}}
							onClick={() => handleActionClick(action.onClick)}
						>
							<IconifyIcon icon={action.icon} style={{ fontSize: "24px" }} />
						</Button>
					</div>
				))}
			</div>

			{/* Botão principal */}
			<Button
				variant="primary"
				className="rounded-circle p-0 d-flex align-items-center justify-content-center shadow-lg"
				style={{
					width: "64px",
					height: "64px",
					transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
					transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
				}}
				onClick={toggleFAB}
				aria-label={mainLabel}
			>
				<IconifyIcon icon={isOpen ? "lucide:x" : mainIcon} style={{ fontSize: "28px" }} />
			</Button>
		</div>
	);
}

