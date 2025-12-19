"use client";

import { Row, Col } from "react-bootstrap";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import IAgendaDevAssistant from "@/types/assistant/IAgendaDevAssistant";
import { useCasesContext } from "@/contexts/casesContext";
import ICaseFilter from "@/types/cases/ICaseFilter";
import Cookies from "js-cookie";
import classNames from "classnames";
import BottomDrawer from "@/components/BottomDrawer";

type Props = {
	show: boolean;
	onHide: () => void;
	projects: IAgendaDevAssistant[];
};

type StatusType = "abertos" | "corrigidos" | "resolvidos" | "retornos";

const mapStatusToId = (status: StatusType): number | number[] | undefined => {
	const statusMap: Record<StatusType, number | number[] | undefined> = {
		abertos: [1, 2],
		corrigidos: 3,
		resolvidos: 9,
		retornos: 4,
	};
	return statusMap[status];
};

export default function ProductsDrawer({ show, onHide, projects }: Props) {
	const { fetchCases, loading, pendingFilters, currentFilters } = useCasesContext();

	const handleStatusClick = (project: IAgendaDevAssistant, status: StatusType) => {
		const statusId = mapStatusToId(status);
		// Usa o usuario_dev_id dos filtros atuais/pendentes, se disponível, senão usa o cookie como fallback
		const selectedUserId = pendingFilters?.usuario_dev_id || currentFilters?.usuario_dev_id;
		const userId = selectedUserId || Cookies.get("user_id");
		const currentUserId = Cookies.get("user_id");

		const filters: ICaseFilter = {
			produto_id: project.id_produto,
			versao_produto: project.versao,
			usuario_dev_id: userId,
			sort_by: "prioridade",
			...(statusId && { status_id: statusId }),
		};

		try {
			const userChangedManually = sessionStorage.getItem("userFilterChangedManually");
			if (!userChangedManually && userId === currentUserId) {
				const savedData = {
					produto_id: project.id_produto,
					versao_produto: project.versao,
					status_id: statusId,
					usuario_dev_id: userId,
				};
				localStorage.setItem("lastSelectedProduct", JSON.stringify(savedData));
			}
		} catch (error) {
			console.error("Erro ao salvar no localStorage:", error);
		}

		fetchCases(filters);
		onHide(); // Fecha o drawer após selecionar
	};

	return (
		<BottomDrawer
			show={show}
			onHide={onHide}
			title="Produtos Priorizados"
			icon="lucide:package"
			subtitle={`${projects.length} ${projects.length === 1 ? 'produto' : 'produtos'}`}
		>
			{projects.length === 0 ? (
				<div className="text-center py-5">
					<div className="bg-body-tertiary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
						style={{ width: "80px", height: "80px" }}>
						<IconifyIcon icon="lucide:package-x" style={{ fontSize: "40px", opacity: 0.5 }} />
					</div>
					<p className="mb-0 text-muted fw-semibold">Nenhum produto encontrado</p>
					<p className="mb-0 text-muted small mt-1">Os produtos aparecerão aqui quando disponíveis</p>
				</div>
			) : (
				<div className="d-flex flex-column gap-3 pt-2">
							{projects.map((project, index) => (
								<div
									key={index}
									className="border rounded-4 p-4 bg-body shadow-sm"
									style={{ 
										transition: "all 0.2s ease",
										borderWidth: "1px",
									}}
								>
									{/* Header do Produto */}
									<div className="d-flex justify-content-between align-items-start mb-3">
										<div className="flex-grow-1">
											<button
												type="button"
												className="fw-bold border-0 bg-transparent p-0 text-start text-body"
												style={{ 
													cursor: loading ? "not-allowed" : "pointer", 
													fontSize: "17px",
													lineHeight: "1.4",
												}}
												onClick={() => handleStatusClick(project, "abertos")}
												disabled={loading}
											>
												{project.produto}
											</button>
											<div className="d-flex align-items-center gap-2 mt-2">
												<span className="text-muted small d-flex align-items-center gap-1">
													<IconifyIcon icon="lucide:tag" style={{ fontSize: "13px" }} />
													v{project.versao}
												</span>
												<span className="text-muted" style={{ fontSize: "10px" }}>•</span>
												<span className="text-muted small d-flex align-items-center gap-1">
													<IconifyIcon icon="lucide:hash" style={{ fontSize: "12px" }} />
													{project.id_produto}
												</span>
											</div>
										</div>
									</div>

									{/* Grid de Status */}
									<Row className="g-2">
										<Col xs={6}>
											<button
												type="button"
												className={classNames(
													"border-0 rounded-3 px-3 py-3 w-100 d-flex flex-column align-items-center justify-content-center",
													{
														"bg-warning text-dark": !loading && project.abertos && project.abertos !== "0",
														"bg-body-tertiary text-muted": loading || !project.abertos || project.abertos === "0",
													}
												)}
												style={{
													cursor:
														loading || !project.abertos || project.abertos === "0" ? "not-allowed" : "pointer",
													minHeight: "85px",
													transition: "all 0.2s ease",
												}}
												onClick={() => handleStatusClick(project, "abertos")}
												disabled={loading || !project.abertos || project.abertos === "0"}
												onMouseEnter={(e) => {
													if (!loading && project.abertos && project.abertos !== "0") {
														e.currentTarget.style.transform = "translateY(-2px)";
														e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
													}
												}}
												onMouseLeave={(e) => {
													e.currentTarget.style.transform = "translateY(0)";
													e.currentTarget.style.boxShadow = "";
												}}
											>
												<span className="fw-bold" style={{ fontSize: "24px", lineHeight: 1 }}>
													{project.abertos}
												</span>
												<span className="small mt-2 fw-semibold">Abertos</span>
											</button>
										</Col>
										<Col xs={6}>
											<button
												type="button"
												className={classNames(
													"border-0 rounded-3 px-3 py-3 w-100 d-flex flex-column align-items-center justify-content-center",
													{
														"bg-info text-white": !loading && project.corrigidos && project.corrigidos !== "0",
														"bg-body-tertiary text-muted": loading || !project.corrigidos || project.corrigidos === "0",
													}
												)}
												style={{
													cursor:
														loading || !project.corrigidos || project.corrigidos === "0" ? "not-allowed" : "pointer",
													minHeight: "85px",
													transition: "all 0.2s ease",
												}}
												onClick={() => handleStatusClick(project, "corrigidos")}
												disabled={loading || !project.corrigidos || project.corrigidos === "0"}
												onMouseEnter={(e) => {
													if (!loading && project.corrigidos && project.corrigidos !== "0") {
														e.currentTarget.style.transform = "translateY(-2px)";
														e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
													}
												}}
												onMouseLeave={(e) => {
													e.currentTarget.style.transform = "translateY(0)";
													e.currentTarget.style.boxShadow = "";
												}}
											>
												<span className="fw-bold" style={{ fontSize: "24px", lineHeight: 1 }}>
													{project.corrigidos}
												</span>
												<span className="small mt-2 fw-semibold">Corrigidos</span>
											</button>
										</Col>
										<Col xs={6}>
											<button
												type="button"
												className={classNames(
													"border-0 rounded-3 px-3 py-3 w-100 d-flex flex-column align-items-center justify-content-center",
													{
														"bg-success text-white": !loading && project.resolvidos && project.resolvidos !== "0",
														"bg-body-tertiary text-muted": loading || !project.resolvidos || project.resolvidos === "0",
													}
												)}
												style={{
													cursor:
														loading || !project.resolvidos || project.resolvidos === "0" ? "not-allowed" : "pointer",
													minHeight: "85px",
													transition: "all 0.2s ease",
												}}
												onClick={() => handleStatusClick(project, "resolvidos")}
												disabled={loading || !project.resolvidos || project.resolvidos === "0"}
												onMouseEnter={(e) => {
													if (!loading && project.resolvidos && project.resolvidos !== "0") {
														e.currentTarget.style.transform = "translateY(-2px)";
														e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
													}
												}}
												onMouseLeave={(e) => {
													e.currentTarget.style.transform = "translateY(0)";
													e.currentTarget.style.boxShadow = "";
												}}
											>
												<span className="fw-bold" style={{ fontSize: "24px", lineHeight: 1 }}>
													{project.resolvidos}
												</span>
												<span className="small mt-2 fw-semibold">Resolvidos</span>
											</button>
										</Col>
										<Col xs={6}>
											<button
												type="button"
												className={classNames(
													"border-0 rounded-3 px-3 py-3 w-100 d-flex flex-column align-items-center justify-content-center",
													{
														"bg-danger text-white": !loading && project.retornos && project.retornos !== "0",
														"bg-body-tertiary text-muted": loading || !project.retornos || project.retornos === "0",
													}
												)}
												style={{
													cursor:
														loading || !project.retornos || project.retornos === "0" ? "not-allowed" : "pointer",
													minHeight: "85px",
													transition: "all 0.2s ease",
												}}
												onClick={() => handleStatusClick(project, "retornos")}
												disabled={loading || !project.retornos || project.retornos === "0"}
												onMouseEnter={(e) => {
													if (!loading && project.retornos && project.retornos !== "0") {
														e.currentTarget.style.transform = "translateY(-2px)";
														e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
													}
												}}
												onMouseLeave={(e) => {
													e.currentTarget.style.transform = "translateY(0)";
													e.currentTarget.style.boxShadow = "";
												}}
											>
												<span className="fw-bold" style={{ fontSize: "24px", lineHeight: 1 }}>
													{project.retornos}
												</span>
												<span className="small mt-2 fw-semibold">Retornos</span>
											</button>
										</Col>
									</Row>
								</div>
							))}
				</div>
			)}
		</BottomDrawer>
	);
}

