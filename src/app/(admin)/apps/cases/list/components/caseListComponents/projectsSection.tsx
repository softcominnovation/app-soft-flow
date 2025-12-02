'use client';
import { Col, Row } from "react-bootstrap";
import StatusGraphic from "./statusGraphic";
import PrioritizedProducts from "./prioritizedProducts";
import Cookies from 'js-cookie';
import IAgendaDevAssistant from "@/types/assistant/IAgendaDevAssistant";
import { diaryDevAssistant } from "@/services/caseServices";
import React, { useEffect, useState } from "react";
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
    const { currentFilters, pendingFilters } = useCasesContext();
    const [projects, setProjects] = useState<IAgendaDevAssistant[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        // Usa pendingFilters primeiro (atualizado imediatamente), depois currentFilters
        const userId = pendingFilters?.usuario_dev_id || currentFilters?.usuario_dev_id || Cookies.get('user_id');
        if (!userId) {
            setLoading(false);
            return;
        }

        const fetchProjects = async () => {
            try {
                const data = await diaryDevAssistant(userId);
                if (!cancelled) setProjects(data ?? []);
            } catch (err) {
                console.error('Falha ao carregar agenda do dev:', err);
                if (!cancelled) setProjects([]);
            }
            if (!cancelled) setLoading(false);
        };

        fetchProjects();

        return () => {
            cancelled = true;
        };
    }, [pendingFilters?.usuario_dev_id, currentFilters?.usuario_dev_id]);

    if (loading) return <ProjectsSectionSkelleton />;

    return (
        <Row className="gy-2 gy-lg-3">	
            <Col lg={4} xs={12}>
                <StatusGraphic projects={projects} />
            </Col>
            {!mobileOnly && (
                <Col lg={8}>
                    <PrioritizedProducts 
                      projects={projects}
                      onOpenDrawer={onOpenProductsDrawer}
                      showDrawer={externalShowProducts}
                      onCloseDrawer={onCloseProductsDrawer}
                    />		
                </Col>
            )}
        </Row>
    );
}
