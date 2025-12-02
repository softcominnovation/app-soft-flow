'use client';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@/hooks';
import { CASE_CONFLICT_MODAL_CLOSE_EVENT, CASE_RESUME_MODAL_FORCE_CLOSE_EVENT } from '@/constants/caseTimeTracker';

interface UseCaseModalFromUrlOptions {
	fetchEspecifiedCases: (id: string) => Promise<any>;
	onCaseLoaded: (caseData: any) => void;
	delay?: number;
}

/**
 * Hook para gerenciar a abertura automática do modal de caso via parâmetros da URL
 * Suporta os parâmetros: caseId, case_id, id
 */
export default function useCaseModalFromUrl({
	fetchEspecifiedCases,
	onCaseLoaded,
	delay = 800,
}: UseCaseModalFromUrlOptions) {
	const queryParams = useQuery();
	const router = useRouter();
	const hasOpenedCaseFromUrl = useRef(false);
	const openedCaseIdRef = useRef<string | null>(null);
	const fetchEspecifiedCasesRef = useRef(fetchEspecifiedCases);
	const onCaseLoadedRef = useRef(onCaseLoaded);
	const timerRef = useRef<NodeJS.Timeout | null>(null);

	// Atualiza as referências das funções quando elas mudarem
	useEffect(() => {
		fetchEspecifiedCasesRef.current = fetchEspecifiedCases;
		onCaseLoadedRef.current = onCaseLoaded;
	}, [fetchEspecifiedCases, onCaseLoaded]);

	// Extrai o caseId dos parâmetros da URL
	const caseId = queryParams['caseId'] || queryParams['case_id'] || queryParams['id'] || null;

	useEffect(() => {
		// Reset se o caseId mudou
		if (caseId && caseId !== openedCaseIdRef.current) {
			openedCaseIdRef.current = caseId;
			hasOpenedCaseFromUrl.current = false;
			// Limpa timer anterior quando o caseId muda
			if (timerRef.current) {
				clearTimeout(timerRef.current);
				timerRef.current = null;
			}
		}

		if (caseId && !hasOpenedCaseFromUrl.current) {
			hasOpenedCaseFromUrl.current = true;

			// Limpa qualquer timer anterior apenas se não for o mesmo caseId
			if (timerRef.current && openedCaseIdRef.current !== caseId) {
				clearTimeout(timerRef.current);
			}

			// Aguarda um pouco para garantir que a página terminou de carregar
			const currentCaseId = caseId; // Captura o valor atual
			timerRef.current = setTimeout(() => {
				// Verifica se ainda é o mesmo caseId antes de executar
				if (openedCaseIdRef.current !== currentCaseId) {
					return;
				}
				
				// Fecha outros modais que possam estar abertos
				if (typeof window !== 'undefined') {
					window.dispatchEvent(new Event(CASE_CONFLICT_MODAL_CLOSE_EVENT));
					window.dispatchEvent(new Event(CASE_RESUME_MODAL_FORCE_CLOSE_EVENT));
				}

				// Busca os dados do caso e abre o modal após carregar
				fetchEspecifiedCasesRef.current(currentCaseId)
					.then((response) => {
						if (response?.data) {
							onCaseLoadedRef.current(response.data);
						}
					})
					.catch((error) => {
						console.error('Erro ao buscar caso:', error);
					});

				// Remove o parâmetro da URL após abrir o modal
				const url = new URL(window.location.href);
				url.searchParams.delete('caseId');
				url.searchParams.delete('case_id');
				url.searchParams.delete('id');
				router.replace(url.pathname + url.search, { scroll: false });

				timerRef.current = null;
			}, delay);
		}

		// Não limpa o timer no cleanup para evitar cancelar quando o componente re-renderiza
		// O timer só será limpo quando o caseId mudar ou quando executar
		return () => {
			// Não faz nada aqui - deixa o timer executar mesmo se o componente re-renderizar
			// O timer será limpo automaticamente quando executar ou quando o caseId mudar
		};
	}, [caseId, delay, router]);
}

