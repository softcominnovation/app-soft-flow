"use client";

import { useEffect, ReactNode } from "react";
import { Offcanvas, Button } from "react-bootstrap";
import IconifyIcon from "@/components/wrappers/IconifyIcon";

type Props = {
	show: boolean;
	onHide: () => void;
	title: string;
	icon?: string;
	subtitle?: string;
	children: ReactNode;
	maxHeight?: string;
	handleDrag?: boolean;
};

/**
 * Componente genérico de Drawer que aparece de baixo para cima
 * Pode ser usado em qualquer lugar da aplicação
 */
export default function BottomDrawer({
	show,
	onHide,
	title,
	icon = "lucide:package",
	subtitle,
	children,
	maxHeight = "90vh",
	handleDrag = true,
}: Props) {
	// Garante que o scroll seja restaurado quando o drawer fecha
	useEffect(() => {
		if (!show) {
			// Força a restauração do scroll quando o drawer fecha
			// Usa setTimeout para garantir que execute após a animação do Bootstrap
			const timer = setTimeout(() => {
				// Remove todos os estilos de overflow que possam estar bloqueando
				document.body.style.removeProperty("overflow");
				document.body.style.removeProperty("overflow-x");
				document.body.style.removeProperty("overflow-y");
				// Remove também do html se necessário
				document.documentElement.style.removeProperty("overflow");
			}, 350); // Tempo suficiente para a animação do Offcanvas completar

			return () => clearTimeout(timer);
		}
	}, [show]);

	return (
		<Offcanvas
			show={show}
			onHide={onHide}
			placement="bottom"
			className="h-auto"
			style={{ maxHeight, borderTopLeftRadius: "20px", borderTopRightRadius: "20px" }}
		>
			{/* Handle de arrastar melhorado */}
			{handleDrag && (
				<div className="d-flex justify-content-center pt-3 pb-2">
					<div
						className="bg-secondary rounded-pill"
						style={{
							width: "50px",
							height: "5px",
							cursor: "grab",
							opacity: 0.5,
						}}
					/>
				</div>
			)}

			<Offcanvas.Header className="border-bottom pb-3 pt-1 px-4">
				<div className="d-flex align-items-center gap-2 flex-grow-1">
					{icon && (
						<div className="bg-primary bg-opacity-10 rounded-circle p-2 d-flex align-items-center justify-content-center">
							<IconifyIcon icon={icon} className="text-primary" style={{ fontSize: "22px" }} />
						</div>
					)}
					<div>
						<Offcanvas.Title className="mb-0 fw-bold" style={{ fontSize: "18px" }}>
							{title}
						</Offcanvas.Title>
						{subtitle && <small className="text-muted">{subtitle}</small>}
					</div>
				</div>
				<Button
					variant="link"
					className="text-muted p-1 rounded-circle"
					onClick={onHide}
					style={{
						fontSize: "20px",
						lineHeight: 1,
						width: "32px",
						height: "32px",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<IconifyIcon icon="lucide:x" />
				</Button>
			</Offcanvas.Header>
			<Offcanvas.Body className="p-0">
				<div className="px-4 pb-4" style={{ maxHeight: `calc(${maxHeight} - 120px)`, overflowY: "auto" }}>
					{children}
				</div>
			</Offcanvas.Body>
		</Offcanvas>
	);
}





















