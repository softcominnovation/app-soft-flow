'use client';
import { Col, Row } from "react-bootstrap";
import StatusGraphic from "./statusGraphic";
import PrioritizedProducts from "./prioritizedProducts";
import Cookies from 'js-cookie';
import IAgendaDevAssistant from "@/types/assistant/IAgendaDevAssistant";
import { diaryDevAssistant } from "@/services/caseServices";
import React, { useEffect, useState, useRef } from "react";
import ProjectsSectionSkelleton from "@/app/(admin)/apps/cases/list/skelletons/projectsSectionSkelleton";
import { useCasesContext } from "@/contexts/casesContext";

export default function ProjectsSection(){
    const { currentFilters, pendingFilters } = useCasesContext();
    const [projects, setProjects] = useState<IAgendaDevAssistant[]>([]);
    const [loading, setLoading] = useState(true);
    const previousUserIdRef = useRef<string | undefined>(undefined);

    useEffect(() => {
        let cancelled = false;
        
        // Usa os filtros pendentes primeiro (atualizados imediatamente), depois os atuais
        const filters = pendingFilters || currentFilters;
        const userId = filters?.usuario_dev_id || Cookies.get('user_id');
        
        if (!userId) {
            setLoading(false);
            return;
        }

        // Só atualiza se o userId mudou
        if (previousUserIdRef.current === userId) {
            return;
        }

        previousUserIdRef.current = userId;
        setLoading(true);

        const fetchProjects = async () => {
            try {
                const data = await diaryDevAssistant(userId);
                if (!cancelled) {
                    setProjects(data ?? []);
                    setLoading(false);
                }
            } catch (err) {
                console.error('Falha ao carregar agenda do dev:', err);
                if (!cancelled) {
                    setProjects([]);
                    setLoading(false);
                }
            }
        };

        fetchProjects();

        return () => {
            cancelled = true;
        };
    }, [pendingFilters?.usuario_dev_id, currentFilters?.usuario_dev_id]);

    if (loading) return <ProjectsSectionSkelleton />;

    return (
        <Row className="gy-2 gy-lg-3">	
            <Col lg={4}>
                <StatusGraphic projects={projects} />
            </Col>
            <Col lg={8}>
                <PrioritizedProducts projects={projects}/>		
            </Col>
        </Row>
    );
}
