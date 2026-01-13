type CaseTimeDraft = {
	timeInput?: string | null;
	tamanhoId?: number | null;
};

type CaseTimeUpdateOptions = CaseTimeDraft & {
	naoPlanejado?: boolean;
	allowZeroTime?: boolean;
};

const TIME_REGEX = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;

const buildTempoEstimado = (timeInput: string, baseDate: Date = new Date()) => {
	const [hours, minutes] = timeInput.split(':').map(Number);
	const year = baseDate.getFullYear();
	const month = String(baseDate.getMonth() + 1).padStart(2, '0');
	const day = String(baseDate.getDate()).padStart(2, '0');
	return `${year}-${month}-${day} ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
};

const isValidTimeInput = (timeInput?: string | null) => {
	if (!timeInput) return false;
	return TIME_REGEX.test(timeInput);
};

const isMeaningfulTimeSelection = (timeInput?: string | null) => {
	if (!isValidTimeInput(timeInput)) return false;
	return timeInput !== '00:00';
};

const buildCaseTimeUpdatePayload = ({
	timeInput,
	tamanhoId,
	naoPlanejado,
	allowZeroTime = true,
}: CaseTimeUpdateOptions) => {
	const updateData: Record<string, any> = {};

	if (isValidTimeInput(timeInput) && (allowZeroTime || timeInput !== '00:00')) {
		updateData.TempoEstimado = buildTempoEstimado(timeInput as string);
	}

	if (tamanhoId) {
		updateData.tamanho = tamanhoId;
	}

	if (naoPlanejado !== undefined) {
		updateData.NaoPlanejado = naoPlanejado ? 1 : 0;
	}

	return Object.keys(updateData).length > 0 ? updateData : null;
};

export {
	buildCaseTimeUpdatePayload,
	isMeaningfulTimeSelection,
	isValidTimeInput,
	type CaseTimeDraft,
};
