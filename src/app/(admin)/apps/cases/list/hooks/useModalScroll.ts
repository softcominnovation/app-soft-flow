import { useEffect } from 'react';

/**
 * Hook para prevenir scroll do body quando modal está aberto
 * Especialmente útil no mobile
 */
export function useModalScroll(isOpen: boolean) {
	useEffect(() => {
		if (isOpen) {
			// Salvar a posição atual do scroll
			const scrollY = window.scrollY;
			document.body.style.position = 'fixed';
			document.body.style.top = `-${scrollY}px`;
			document.body.style.width = '100%';
			document.body.style.overflow = 'hidden';
			
			return () => {
				// Restaurar o scroll quando o modal fechar
				document.body.style.position = '';
				document.body.style.top = '';
				document.body.style.width = '';
				document.body.style.overflow = '';
				window.scrollTo(0, scrollY);
			};
		}
	}, [isOpen]);
}

