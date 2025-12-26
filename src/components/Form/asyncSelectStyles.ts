import type { StylesConfig, GroupBase } from 'react-select';
import { AsyncSelectOption } from '@/hooks/useAsyncSelect';

const createBaseStyles = (isDarkMode: boolean = false) => {
  // Cores para tema claro
  const lightColors = {
    disabledBg: '#f5f5f5',
    disabledBgPattern: '#efefef',
    disabledBorder: '#ddd',
    disabledText: '#666',
    disabledPlaceholder: '#999',
    placeholder: '#6c757d',
    invalidBorder: '#dc3545',
    invalidShadow: 'rgba(220,53,69,.25)',
  };

  // Cores para tema escuro
  const darkColors = {
    disabledBg: '#404954',
    disabledBgPattern: '#464f5b',
    disabledBorder: '#464f5b',
    disabledText: '#aab8c5',
    disabledPlaceholder: '#8391a2',
    placeholder: '#aab8c5',
    invalidBorder: '#dc3545',
    invalidShadow: 'rgba(220,53,69,.25)',
  };

  const colors = isDarkMode ? darkColors : lightColors;

  return {
    control: (base: any, state: any) => ({
      ...base,
      opacity: state.isDisabled ? 0.6 : 1,
      backgroundColor: state.isDisabled ? colors.disabledBg : base.backgroundColor,
      cursor: state.isDisabled ? 'not-allowed' : 'default',
      // show red border when selectProps.isInvalid is true
      borderColor: state.selectProps?.isInvalid ? colors.invalidBorder : (state.isDisabled ? colors.disabledBorder : base.borderColor),
      background: state.isDisabled
        ? `repeating-linear-gradient(45deg, ${colors.disabledBg}, ${colors.disabledBg} 10px, ${colors.disabledBgPattern} 10px, ${colors.disabledBgPattern} 20px)`
        : base.background,
      boxShadow: state.selectProps?.isInvalid && state.isFocused ? `0 0 0 0.2rem ${colors.invalidShadow}` : base.boxShadow,
    }),
    placeholder: (base: any, state: any) => ({
      ...base,
      color: state.isDisabled ? colors.disabledPlaceholder : colors.placeholder,
    }),
    singleValue: (base: any, state: any) => ({
      ...base,
      color: state.isDisabled ? colors.disabledText : base.color,
    }),
    input: (base: any, state: any) => ({
      ...base,
      color: state.isDisabled ? colors.disabledText : base.color,
    }),
    menu: (base: any) => ({
      ...base,
      // O menu usa as cores do Bootstrap através do SCSS, então não precisamos sobrescrever aqui
      // mas garantimos que não haja conflitos
      zIndex: 9999,
    }),
  };
};

export const selectStyles: StylesConfig<AsyncSelectOption<any>, false, GroupBase<AsyncSelectOption<any>>> = createBaseStyles(false);

export const asyncSelectStyles: StylesConfig<AsyncSelectOption<any>, false, GroupBase<AsyncSelectOption<any>>> = createBaseStyles(false);

// Função para obter estilos baseados no tema
export const getAsyncSelectStyles = (isDarkMode: boolean = false): StylesConfig<AsyncSelectOption<any>, false, GroupBase<AsyncSelectOption<any>>> => {
  return createBaseStyles(isDarkMode);
};

export const filterOption = (option: { label: string }, inputValue: string) => {
  const optionLabel = option.label.toLowerCase();
  const input = inputValue.toLowerCase();
  return optionLabel.includes(input);
};
