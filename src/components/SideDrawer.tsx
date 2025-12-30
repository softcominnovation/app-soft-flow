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
	footer?: ReactNode;
	width?: string;
};

/**
 * Componente genérico de Drawer que aparece da direita para a esquerda
 * Pode ser usado em qualquer lugar da aplicação
 */
export default function SideDrawer({
	show,
	onHide,
	title,
	icon = "lucide:filter",
	subtitle,
	children,
	footer,
	width = "400px",
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
			placement="end"
			style={{ width, height: "100vh" }}
		>
			<Offcanvas.Header className="border-bottom pb-3 pt-3 px-4">
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
			<Offcanvas.Body className="p-0 d-flex flex-column" style={{ overflow: "hidden" }}>
				<div className="px-4 pt-3" style={{ overflowY: "auto", flex: 1 }}>
					{children}
				</div>
				{footer && (
					<div className="border-top bg-white px-4 py-3" style={{ flexShrink: 0 }}>
						{footer}
					</div>
				)}
			</Offcanvas.Body>
		</Offcanvas>
	);
}

