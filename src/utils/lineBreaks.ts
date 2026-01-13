export const normalizeLineBreaksToCrlf = (value: string): string =>
	value.replace(/\r\n|\r|\n/g, '\r\n');
