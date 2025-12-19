export const useGetTipoBadgeVariant = (tipo: string) => {
    const normalizedTipo = tipo.toLowerCase().replace(/\s+/g, '_');
    const variants = {
        'desenvolvendo': 'primary',
        'desenvolvimento': 'primary',
        'testando': 'warning',
        'retorno': 'info',
        'nao_planejado': 'danger',
        'concluido': 'success',
        'concluído': 'success'
    };
    return variants[normalizedTipo as keyof typeof variants] || 'secondary';
};

export const useGetTipoIcon = (tipo: string) => {
    const normalizedTipo = tipo.toLowerCase().replace(/\s+/g, '_');
    const icons = {
        'desenvolvimento': 'lucide:code',
        'desenvolvendo': 'lucide:code',
        'testando': 'lucide:test-tube',
        'retorno': 'lucide:rotate-ccw',
        'nao_planejado': 'lucide:alert-circle',
        'concluido': 'lucide:check-circle',
        'concluído': 'lucide:check-circle'
    };
    return icons[normalizedTipo as keyof typeof icons] || 'lucide:clock';
};