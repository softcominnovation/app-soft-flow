"use client"
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { Anotacao } from "@/types/cases/ICase";
import { Card, ListGroup, Form, Button } from "react-bootstrap";
import { useState } from "react";
import { createAnotacao, updateAnotacao, deleteAnotacao } from "@/services/caseServices";
import { toast } from "react-toastify";
import ConfirmDialog from "@/components/ConfirmDialog";

type Props = {
    anotacoes: Anotacao[] | null | undefined;
    registro: number;
    onAnotacaoCreated?: () => void;
}

export default function CaseAnnotations({ anotacoes, registro, onAnotacaoCreated }: Props) {
    const [anotacaoText, setAnotacaoText] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editText, setEditText] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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

    const handleSave = async () => {
        if (!anotacaoText.trim()) {
            toast.error('Por favor, digite uma anotação antes de salvar.');
            return;
        }

        setIsSaving(true);
        try {
            await createAnotacao(registro, anotacaoText.trim());
            toast.success('Anotação criada com sucesso!');
            setAnotacaoText("");
            if (onAnotacaoCreated) {
                onAnotacaoCreated();
            }
        } catch (error: any) {
            console.error('Erro ao criar anotação:', error);
            toast.error(error?.message || 'Erro ao criar anotação. Tente novamente.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleEdit = (anotacao: Anotacao) => {
        setEditingId(anotacao.sequencia);
        setEditText(anotacao.anotacoes || "");
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditText("");
    };

    const handleUpdate = async (id: number) => {
        if (!editText.trim()) {
            toast.error('Por favor, digite uma anotação antes de salvar.');
            return;
        }

        setIsUpdating(true);
        try {
            await updateAnotacao(id, editText.trim());
            toast.success('Anotação atualizada com sucesso!');
            setEditingId(null);
            setEditText("");
            if (onAnotacaoCreated) {
                onAnotacaoCreated();
            }
        } catch (error: any) {
            console.error('Erro ao atualizar anotação:', error);
            toast.error(error?.message || 'Erro ao atualizar anotação. Tente novamente.');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDeleteClick = (id: number) => {
        setDeleteId(id);
        setShowDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        if (!deleteId) return;

        setIsDeleting(true);
        try {
            await deleteAnotacao(deleteId);
            toast.success('Anotação excluída com sucesso!');
            setShowDeleteDialog(false);
            setDeleteId(null);
            if (onAnotacaoCreated) {
                onAnotacaoCreated();
            }
        } catch (error: any) {
            console.error('Erro ao excluir anotação:', error);
            toast.error(error?.message || 'Erro ao excluir anotação. Tente novamente.');
        } finally {
            setIsDeleting(false);
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
        <>
            <style>{`
                .case-annotations-card .card-header {
                    padding: 0 !important;
                }
                
                .case-annotations-card .card-header > div {
                    padding: 1.5rem;
                }
                
                .case-annotations-card .card-header h5 {
                    font-size: 1rem;
                    font-weight: 600;
                    margin: 0;
                }
                
                .case-annotations-card .card-header h5 .iconify-icon {
                    font-size: 1.125rem;
                }
                
                @media (max-width: 991.98px) {
                    .case-annotations-card .card-header > div {
                        padding: 1rem !important;
                    }
                    
                    .case-annotations-card .card-body {
                        padding: 1rem !important;
                    }
                    
                    .case-annotations-card .card-header h5 {
                        font-size: 0.9375rem;
                    }
                    
                    .case-annotations-form-section {
                        padding: 1rem !important;
                    }
                    
                    .case-annotations-form-label {
                        font-size: 0.875rem;
                        margin-bottom: 0.625rem;
                    }
                    
                    .case-annotations-textarea {
                        font-size: 1rem !important;
                        min-height: 100px;
                        padding: 0.75rem !important;
                        line-height: 1.5;
                    }
                    
                    .case-annotations-save-button {
                        min-height: 48px !important;
                        font-size: 0.9375rem !important;
                        padding: 0.75rem 1.25rem !important;
                        width: 100%;
                        justify-content: center;
                    }
                    
                    .case-annotations-save-button .iconify-icon {
                        font-size: 1.1rem;
                    }
                    
                    .case-annotations-item {
                        padding: 1rem !important;
                    }
                    
                    .case-annotations-user-info {
                        flex-direction: column;
                        align-items: flex-start !important;
                        gap: 0.5rem !important;
                    }
                    
                    .case-annotations-user-name {
                        font-size: 0.875rem;
                    }
                    
                    .case-annotations-date {
                        font-size: 0.8125rem;
                    }
                    
                    .case-annotations-content {
                        margin-top: 0.75rem !important;
                        padding: 0.875rem !important;
                        font-size: 0.9375rem;
                        line-height: 1.6;
                    }
                    
                    .case-annotations-empty {
                        padding: 2rem 1rem !important;
                    }
                    
                    .case-annotations-empty .iconify-icon {
                        font-size: 2rem !important;
                    }
                    
                    .case-annotations-empty p {
                        font-size: 0.875rem;
                    }
                }
            `}</style>
            <Card className="border-0 shadow-sm mb-0 case-annotations-card">
                <Card.Header className="bg-light border-bottom p-0">
                    <div style={{ padding: '1.5rem' }}>
                        <h5 className="mb-0 d-flex align-items-center">
                            <IconifyIcon icon="lucide:sticky-note" className="me-2 text-primary" />
                            Anotações do Caso
                        </h5>
                    </div>
                </Card.Header>
                <Card.Body style={{ padding: '1.5rem' }}>
                    <div className="p-3 border-bottom case-annotations-form-section">
                        <Form.Group>
                            <Form.Label className="fw-semibold mb-2 case-annotations-form-label">Nova Anotação</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                placeholder="Digite sua anotação aqui..."
                                style={{ resize: 'vertical' }}
                                value={anotacaoText}
                                onChange={(e) => setAnotacaoText(e.target.value)}
                                disabled={isSaving}
                                className="case-annotations-textarea"
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-end mt-3">
                            <Button 
                                variant="success" 
                                className="d-flex align-items-center case-annotations-save-button"
                                onClick={handleSave}
                                disabled={isSaving || !anotacaoText.trim()}
                            >
                                {isSaving ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Salvando...
                                    </>
                                ) : (
                                    <>
                                        <IconifyIcon icon="lucide:save" className="me-2" />
                                        Salvar
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                    <ListGroup variant="flush" className="border-top">
                        {sortedAnotacoes.length > 0 ? (
                            sortedAnotacoes.map((anotacao, index) => (
                                <ListGroup.Item
                                    key={anotacao.sequencia || index}
                                    className="py-3 px-3 border-bottom case-annotations-item"
                                >
                                    <div className="d-flex flex-column gap-2">
                                        <div className="d-flex flex-column gap-1 case-annotations-user-info">
                                            {anotacao.usuario && (
                                                <div className="d-flex align-items-center gap-2">
                                                    <IconifyIcon icon="lucide:user" className="text-muted" style={{ fontSize: '0.875rem' }} />
                                                    <span className="fw-semibold text-primary case-annotations-user-name">{anotacao.usuario}</span>
                                                </div>
                                            )}
                                            <small className="text-muted d-flex align-items-center gap-1 case-annotations-date">
                                                <IconifyIcon icon="lucide:calendar" className="text-muted" style={{ fontSize: '0.75rem' }} />
                                                {formatDate(anotacao.data_anotacao)}
                                            </small>
                                        </div>
                                        {editingId === anotacao.sequencia ? (
                                            <>
                                                <Form.Group className="mt-2">
                                                    <Form.Control
                                                        as="textarea"
                                                        rows={4}
                                                        value={editText}
                                                        onChange={(e) => setEditText(e.target.value)}
                                                        disabled={isUpdating}
                                                        className="case-annotations-textarea"
                                                    />
                                                </Form.Group>
                                                <div className="d-flex justify-content-end gap-1 mt-2">
                                                    <Button
                                                        variant="success"
                                                        size="sm"
                                                        onClick={() => handleUpdate(anotacao.sequencia)}
                                                        disabled={isUpdating}
                                                        className="d-flex align-items-center"
                                                    >
                                                        {isUpdating ? (
                                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                        ) : (
                                                            <>
                                                                <IconifyIcon icon="lucide:check" className="me-1" style={{ fontSize: '0.875rem' }} />
                                                                Salvar
                                                            </>
                                                        )}
                                                    </Button>
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        onClick={handleCancelEdit}
                                                        disabled={isUpdating}
                                                        className="d-flex align-items-center"
                                                    >
                                                        <IconifyIcon icon="lucide:x" className="me-1" style={{ fontSize: '0.875rem' }} />
                                                        Cancelar
                                                    </Button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                {anotacao.anotacoes && (
                                                    <div className="mt-2 p-3 bg-light rounded border-start border-primary border-3 case-annotations-content">
                                                        <p className="mb-0 text-dark" style={{ whiteSpace: 'pre-wrap' }}>
                                                            {anotacao.anotacoes}
                                                        </p>
                                                    </div>
                                                )}
                                                {!anotacao.anotacoes && (
                                                    <div className="mt-2 p-3 bg-light rounded border-start border-secondary border-3 case-annotations-content">
                                                        <p className="mb-0 text-muted fst-italic">
                                                            Anotação sem conteúdo
                                                        </p>
                                                    </div>
                                                )}
                                                <div className="d-flex justify-content-end gap-1 mt-2">
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        onClick={() => handleEdit(anotacao)}
                                                        disabled={isSaving || isUpdating || isDeleting || editingId !== null}
                                                        className="d-flex align-items-center"
                                                        title="Editar anotação"
                                                    >
                                                        <IconifyIcon icon="lucide:pencil" style={{ fontSize: '0.875rem' }} />
                                                    </Button>
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={() => handleDeleteClick(anotacao.sequencia)}
                                                        disabled={isSaving || isUpdating || isDeleting || editingId !== null}
                                                        className="d-flex align-items-center"
                                                        title="Excluir anotação"
                                                    >
                                                        <IconifyIcon icon="lucide:trash-2" style={{ fontSize: '0.875rem' }} />
                                                    </Button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </ListGroup.Item>
                            ))
                        ) : (
                            <ListGroup.Item className="py-5 text-center text-muted case-annotations-empty">
                                <IconifyIcon icon="lucide:sticky-note-off" className="mb-2" style={{ fontSize: '2.5rem' }} />
                                <p className="mb-0">Nenhuma anotação registrada para este caso.</p>
                            </ListGroup.Item>
                        )}
                    </ListGroup>
                </Card.Body>
            </Card>
            <ConfirmDialog
                show={showDeleteDialog}
                title="Excluir Anotação"
                message="Deseja realmente excluir esta anotação? Esta ação não pode ser desfeita."
                confirmText="Excluir"
                cancelText="Cancelar"
                confirmVariant="danger"
                onConfirm={handleConfirmDelete}
                onCancel={() => {
                    setShowDeleteDialog(false);
                    setDeleteId(null);
                }}
                loading={isDeleting}
            />
        </>
    );
}












