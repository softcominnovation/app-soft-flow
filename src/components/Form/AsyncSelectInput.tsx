import { useRef, useCallback } from 'react';
import AsyncSelect, { AsyncProps } from 'react-select/async';
import { GroupBase, components } from 'react-select';
import { AsyncSelectOption } from '@/hooks/useAsyncSelect';

type AsyncSelectInputProps<T extends AsyncSelectOption<any>> = AsyncProps<T, false, GroupBase<T>>;

/**
 * Componente wrapper do AsyncSelect que adiciona funcionalidade de focar o input
 * quando o botão clearable (X) é clicado.
 */
export default function AsyncSelectInput<T extends AsyncSelectOption<any>>({
	onChange,
	inputId,
	components: customComponents,
	...props
}: AsyncSelectInputProps<T>) {
	const selectRef = useRef<any>(null);

	// Função auxiliar para encontrar e clicar no input
	const focusAndClickInput = useCallback(() => {
		setTimeout(() => {
			let inputElement: HTMLElement | null = null;

			// Tenta encontrar o input usando o inputId
			if (inputId) {
				inputElement = document.getElementById(inputId);
			}

			// Se não encontrou pelo inputId, tenta usar a referência do select
			if (!inputElement && selectRef.current) {
				// Tenta acessar o inputRef diretamente
				if (selectRef.current.inputRef) {
					inputElement = selectRef.current.inputRef;
				} else {
					// Tenta encontrar o input dentro do container do select
					const selectContainer = selectRef.current.controlRef;
					if (selectContainer) {
						const input = selectContainer.querySelector('input');
						if (input) {
							inputElement = input;
						}
					}
				}
			}

			// Foca e clica no input se encontrado para abrir o menu e buscar dados
			if (inputElement) {
				// Foca o input
				inputElement.focus();
				// Dispara um click para abrir o menu (isso vai disparar o onMenuOpen)
				inputElement.click();
			}
		}, 50);
	}, [inputId]);

	const handleChange = useCallback(
		(option: T | null, actionMeta: any) => {
			// Chama o onChange original
			if (onChange) {
				onChange(option, actionMeta);
			}

			// Se o valor foi limpo (option é null) e foi através do clearable
			if (option === null && actionMeta?.action === 'clear') {
				focusAndClickInput();
			}
		},
		[onChange, focusAndClickInput],
	);

	// Customiza o ClearIndicator para interceptar o click e focar o input
	const ClearIndicator = useCallback(
		(clearProps: any) => {
			const originalOnMouseDown = clearProps.innerProps?.onMouseDown;
			
			return (
				<components.ClearIndicator
					{...clearProps}
					innerProps={{
						...clearProps.innerProps,
						onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => {
							// Chama o comportamento original primeiro (limpa o valor)
							if (originalOnMouseDown) {
								originalOnMouseDown(e);
							}
							// Depois foca e clica no input para abrir o menu
							focusAndClickInput();
						},
					}}
				/>
			);
		},
		[focusAndClickInput],
	);

	return (
		<AsyncSelect
			ref={selectRef}
			onChange={handleChange}
			inputId={inputId}
			components={{
				...customComponents,
				ClearIndicator,
			}}
			{...props}
		/>
	);
}

