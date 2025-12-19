import { ICase } from '@/types/cases/ICase';

interface CaseModalStylesProps {
	hasAnotacoes: boolean;
}

export default function CaseModalStyles({ hasAnotacoes }: CaseModalStylesProps) {
	return (
		<style>{`
			${hasAnotacoes ? `
				.nav-tabs .nav-link[data-event-key="detalhes"].active,
				.nav-tabs .nav-link[data-event-key="detalhes"]:hover,
				.nav-tabs .nav-link[data-event-key="detalhes"] {
					color: #dc3545 !important;
				}
				.nav-tabs .nav-link[data-event-key="detalhes"].active {
					border-bottom-color: #dc3545 !important;
				}
			` : ''}
			
			/* Prevenir scroll do body quando modal está aberto */
			body.modal-open {
				overflow: hidden !important;
				position: fixed !important;
				width: 100% !important;
				height: 100% !important;
			}

			.modal-fullscreen {
				position: fixed !important;
				top: 0 !important;
				left: 0 !important;
				right: 0 !important;
				bottom: 0 !important;
				margin: 0 !important;
				max-width: 100% !important;
				width: 100% !important;
				height: 100% !important;
			}

			.modal-fullscreen .modal-dialog {
				margin: 0 !important;
				max-width: 100% !important;
				width: 100% !important;
				height: 100% !important;
				display: flex !important;
				flex-direction: column !important;
			}

			.modal-fullscreen .modal-content {
				height: 100% !important;
				border: 0 !important;
				border-radius: 0 !important;
				display: flex !important;
				flex-direction: column !important;
			}
			
			.modal-fullscreen .modal-body {
				padding: 0;
				flex: 1 1 auto;
				overflow: hidden;
				display: flex;
				flex-direction: column;
				min-height: 0;
				max-height: 100vh;
			}

			/* Garantir que o modal-dialog não cause scroll */
			@media (max-width: 991.98px) {
				.modal-fullscreen {
					position: fixed !important;
					top: 0 !important;
					left: 0 !important;
					right: 0 !important;
					bottom: 0 !important;
					margin: 0 !important;
					width: 100vw !important;
					height: 100vh !important;
					max-width: 100vw !important;
					max-height: 100vh !important;
				}

				.modal-fullscreen .modal-dialog {
					margin: 0 !important;
					max-width: 100% !important;
					width: 100% !important;
					height: 100% !important;
					max-height: 100vh !important;
					display: flex !important;
					flex-direction: column !important;
				}

				.modal-fullscreen .modal-content {
					height: 100vh !important;
					max-height: 100vh !important;
					border: 0 !important;
					border-radius: 0 !important;
					display: flex !important;
					flex-direction: column !important;
					overflow: hidden !important;
				}

				.modal-fullscreen .modal-header {
					flex-shrink: 0;
				}

				.modal-fullscreen .modal-footer {
					flex-shrink: 0;
				}
			}

			/* Melhorias Mobile */
			@media (max-width: 991.98px) {
				/* Header mais compacto no mobile */
				.modal-fullscreen .modal-header {
					padding: 0.75rem 1rem;
					min-height: 56px;
				}

				.modal-fullscreen .modal-title {
					font-size: 1.1rem;
				}

				/* Abas mais touch-friendly */
				.modal-fullscreen .nav-tabs {
					padding: 0.5rem 1rem;
					gap: 0.25rem;
				}

				.modal-fullscreen .nav-tabs .nav-link {
					padding: 0.75rem 1rem;
					font-size: 0.9rem;
					border-radius: 0.375rem 0.375rem 0 0;
					min-height: 44px;
					display: flex;
					align-items: center;
					justify-content: center;
				}

				.modal-fullscreen .nav-tabs .nav-link .iconify-icon {
					font-size: 1.1rem;
				}

				/* Conteúdo com padding adequado */
				.modal-fullscreen .modal-body .custom-scrollbar {
					padding: 1rem !important;
				}

				/* Footer com botões em grid no mobile */
				.modal-fullscreen .modal-footer {
					padding: 1rem;
					flex-wrap: wrap;
					gap: 0.5rem;
					background: #f8f9fa;
					border-top: 1px solid #dee2e6;
				}

				.modal-fullscreen .modal-footer .btn {
					min-height: 44px;
					font-size: 0.9rem;
					padding: 0.625rem 1rem;
					display: flex;
					align-items: center;
					justify-content: center;
					gap: 0.5rem;
				}

				.modal-fullscreen .modal-footer .btn .iconify-icon {
					font-size: 1.1rem;
				}

				/* Cards com melhor espaçamento */
				.modal-fullscreen .card {
					margin-bottom: 1rem;
				}

				.modal-fullscreen .card-header {
					padding: 1rem;
				}

				.modal-fullscreen .card-body {
					padding: 1rem !important;
				}

				/* Form groups com melhor espaçamento */
				.modal-fullscreen .form-group {
					margin-bottom: 1.25rem;
				}

				.modal-fullscreen .form-label {
					font-size: 0.875rem;
					margin-bottom: 0.5rem;
				}

				.modal-fullscreen .form-label .iconify-icon {
					font-size: 1rem;
				}

				/* Inputs mais touch-friendly */
				.modal-fullscreen .form-control,
				.modal-fullscreen .react-select__control {
					min-height: 44px;
					font-size: 1rem;
				}

				/* Badge nas abas menor */
				.modal-fullscreen .nav-tabs .badge {
					font-size: 0.65rem;
					padding: 0.25rem 0.5rem;
				}

				/* Melhor espaçamento entre cards */
				.modal-fullscreen .card {
					margin-bottom: 1.25rem;
					border-radius: 0.5rem;
				}

				/* Headers de cards mais compactos no mobile */
				.modal-fullscreen .card-header h5,
				.modal-fullscreen .card-header h6 {
					font-size: 0.95rem;
					font-weight: 600;
				}

				.modal-fullscreen .card-header .iconify-icon {
					font-size: 1rem;
				}

				.modal-fullscreen .card-header {
					padding: 0.5rem 0 !important;
				}

				/* Headers de cards compactos também no desktop */
				.modal-fullscreen .card-header h5,
				.modal-fullscreen .card-header h6 {
					font-size: 0.95rem;
					font-weight: 600;
					margin-bottom: 0;
				}

				.modal-fullscreen .card-header .iconify-icon {
					font-size: 1rem;
				}

				.modal-fullscreen .accordion-toggle {
					padding: 0.5rem 1rem !important;
				}

				/* Labels mais legíveis */
				.modal-fullscreen .form-label {
					font-size: 0.875rem;
					margin-bottom: 0.5rem;
					font-weight: 600;
				}

				/* Textareas com melhor altura no mobile */
				.modal-fullscreen textarea.form-control {
					font-size: 1rem;
					line-height: 1.5;
					min-height: 80px;
				}

				/* Melhor contraste e espaçamento nos inputs */
				.modal-fullscreen .form-control:focus,
				.modal-fullscreen .react-select__control--is-focused {
					border-color: #0d6efd;
					box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
				}

				/* Accordion toggle mais touch-friendly */
				.modal-fullscreen .accordion-toggle {
					min-height: 48px;
					display: flex;
					align-items: center;
				}

				/* Scrollbar mais visível no mobile */
				.modal-fullscreen .custom-scrollbar::-webkit-scrollbar {
					width: 6px;
				}

				.modal-fullscreen .custom-scrollbar::-webkit-scrollbar-thumb {
					background-color: rgba(0, 0, 0, 0.2);
					border-radius: 3px;
				}

				/* Espaçamento melhor entre seções */
				.modal-fullscreen .d-flex.flex-column[style*="gap"] {
					gap: 1.25rem !important;
				}
			}
		`}</style>
	);
}

