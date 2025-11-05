import type { StylesConfig, GroupBase } from 'react-select';
import { AsyncSelectOption } from '@/hooks/useAsyncSelect';

const baseStyles = {
  control: (base: any, state: any) => ({
    ...base,
    opacity: state.isDisabled ? 0.6 : 1,
    backgroundColor: state.isDisabled ? '#f5f5f5' : base.backgroundColor,
    cursor: state.isDisabled ? 'not-allowed' : 'default',
    // show red border when selectProps.isInvalid is true
    borderColor: state.selectProps?.isInvalid ? '#dc3545' : (state.isDisabled ? '#ddd' : base.borderColor),
    background: state.isDisabled
      ? 'repeating-linear-gradient(45deg, #f5f5f5, #f5f5f5 10px, #efefef 10px, #efefef 20px)'
      : base.background,
    boxShadow: state.selectProps?.isInvalid && state.isFocused ? '0 0 0 0.2rem rgba(220,53,69,.25)' : base.boxShadow,
  }),
  placeholder: (base: any, state: any) => ({
    ...base,
    color: state.isDisabled ? '#999' : '#6c757d',
  }),
  singleValue: (base: any, state: any) => ({
    ...base,
    color: state.isDisabled ? '#666' : base.color,
  }),
  input: (base: any, state: any) => ({
    ...base,
    color: state.isDisabled ? '#666' : base.color,
  }),
};

export const selectStyles: StylesConfig<AsyncSelectOption<any>, false, GroupBase<AsyncSelectOption<any>>> = baseStyles;

export const asyncSelectStyles: StylesConfig<AsyncSelectOption<any>, false, GroupBase<AsyncSelectOption<any>>> = baseStyles;

export const filterOption = (option: { label: string }, inputValue: string) => {
  const optionLabel = option.label.toLowerCase();
  const input = inputValue.toLowerCase();
  return optionLabel.includes(input);
};
