'use client';
import { Col, Row } from "react-bootstrap";
import StatusGraphic from "./statusGraphic";
import PrioritizedProducts from "./prioritizedProducts";
import Cookies from 'js-cookie';
import React, { useEffect } from "react";
import ProjectsSectionSkelleton from "@/app/(admin)/apps/cases/list/skelletons/projectsSectionSkelleton";
import { useCasesContext } from "@/contexts/casesContext";

type ProjectsSectionProps = {
	onOpenProductsDrawer?: () => void;
	showProductsDrawer?: boolean;
	onCloseProductsDrawer?: () => void;
	mobileOnly?: boolean;
};

export default function ProjectsSection({
	onOpenProductsDrawer,
	showProductsDrawer: externalShowProducts,
	onCloseProductsDrawer,
	mobileOnly = false
}: ProjectsSectionProps = {}){
    const { currentFilters, pendingFilters, agendaDev, agendaDevLoading, fetchAgendaDev } = useCasesContext();

    useEffect(() => {
        // Usa pendingFilters primeiro (atualizado imediatamente), depois currentFilters
        // Só faz a requisição se usuario_dev_id estiver explicitamente nos filtros
        const userId = pendingFilters?.usuario_dev_id || currentFilters?.usuario_dev_id;
        if (userId) {
            fetchAgendaDev(userId);
        }
    }, [pendingFilters?.usuario_dev_id, currentFilters?.usuario_dev_id, fetchAgendaDev]);

    if (agendaDevLoading) return <ProjectsSectionSkelleton />;

    return (
        <Row className="gy-2 gy-lg-3">	
            <Col lg={4} xs={12}>
                <StatusGraphic projects={agendaDev} />
            </Col>
            {!mobileOnly && (
                <Col lg={8}>
                    <PrioritizedProducts 
                      projects={agendaDev}
                      onOpenDrawer={onOpenProductsDrawer}
                      showDrawer={externalShowProducts}
                      onCloseDrawer={onCloseProductsDrawer}
                    />		
                </Col>
            )}
        </Row>
    );
}
