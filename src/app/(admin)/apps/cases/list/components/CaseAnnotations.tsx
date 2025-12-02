"use client"
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { Anotacao } from "@/types/cases/ICase";
import { Card, ListGroup } from "react-bootstrap";

type Props = {
    anotacoes: Anotacao[] | null | undefined;
}

export default function CaseAnnotations({ anotacoes }: Props) {
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }).format(date);
        } catch {
            return dateString;
        }
    };

    const sortedAnotacoes = anotacoes 
        ? [...anotacoes].sort((a, b) => {
            // Ordena por data mais recente primeiro
            const dateA = new Date(a.data_anotacao).getTime();
            const dateB = new Date(b.data_anotacao).getTime();
            return dateB - dateA;
        })
        : [];

    return (
        <Card className="border-0 shadow-sm">
            <Card.Header className="bg-light border-bottom">
                <h5 className="mb-0 d-flex align-items-center">
                    <IconifyIcon icon="lucide:sticky-note" className="me-2 text-primary" />
                    Anotações do Caso
                </h5>
            </Card.Header>
            <Card.Body className="p-0">
                <ListGroup variant="flush">
                    {sortedAnotacoes.length > 0 ? (
                        sortedAnotacoes.map((anotacao, index) => (
                            <ListGroup.Item
                                key={anotacao.sequencia || index}
                                className="py-3 px-3 border-bottom"
                            >
                                <div className="d-flex flex-column gap-2">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div className="d-flex flex-column gap-1">
                                            {anotacao.usuario && (
                                                <div className="d-flex align-items-center gap-2">
                                                    <IconifyIcon icon="lucide:user" className="text-muted" style={{ fontSize: '0.875rem' }} />
                                                    <span className="fw-semibold text-primary">{anotacao.usuario}</span>
                                                </div>
                                            )}
                                            <small className="text-muted d-flex align-items-center gap-1">
                                                <IconifyIcon icon="lucide:calendar" className="text-muted" style={{ fontSize: '0.75rem' }} />
                                                {formatDate(anotacao.data_anotacao)}
                                            </small>
                                        </div>
                                    </div>
                                    {anotacao.anotacoes && (
                                        <div className="mt-2 p-3 bg-light rounded border-start border-primary border-3">
                                            <p className="mb-0 text-dark" style={{ whiteSpace: 'pre-wrap' }}>
                                                {anotacao.anotacoes}
                                            </p>
                                        </div>
                                    )}
                                    {!anotacao.anotacoes && (
                                        <div className="mt-2 p-3 bg-light rounded border-start border-secondary border-3">
                                            <p className="mb-0 text-muted fst-italic">
                                                Anotação sem conteúdo
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </ListGroup.Item>
                        ))
                    ) : (
                        <ListGroup.Item className="py-5 text-center text-muted">
                            <IconifyIcon icon="lucide:sticky-note-off" className="mb-2" style={{ fontSize: '2.5rem' }} />
                            <p className="mb-0">Nenhuma anotação registrada para este caso.</p>
                        </ListGroup.Item>
                    )}
                </ListGroup>
            </Card.Body>
        </Card>
    );
}







