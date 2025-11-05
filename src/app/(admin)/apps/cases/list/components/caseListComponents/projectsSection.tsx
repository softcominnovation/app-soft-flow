'use client';
import { Col, Row } from "react-bootstrap";
import StatusGraphic from "./statusGraphic";
import PrioritizedProducts from "./prioritizedProducts";
import Cookies from 'js-cookie';
import IAgendaDevAssistant from "@/types/assistant/IAgendaDevAssistant";
import { diaryDevAssistant } from "@/services/caseServices";
import React, { useEffect, useState } from "react";
import ProjectsSectionSkelleton from "@/app/(admin)/apps/cases/list/skelletons/projectsSectionSkelleton";

export default function ProjectsSection(){

    const [projects, setProjects] = useState<IAgendaDevAssistant[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {

        let cancelled = false;
        const userId = Cookies.get('user_id');
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
    }, []);

    if (loading) return <ProjectsSectionSkelleton />;

    return (
        <Row className="gy-3">	
            <Col lg={4}>
                <StatusGraphic projects={projects} />
            </Col>
            <Col lg={8}>
                <PrioritizedProducts projects={projects}/>		
            </Col>
        </Row>
    );
}
