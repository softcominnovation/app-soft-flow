type CaseTimeDraft = {
	timeInput?: string | null;
	tamanhoId?: number | null;
};

type CaseTimeUpdateOptions = CaseTimeDraft & {
	naoPlanejado?: boolean;
	allowZeroTime?: boolean;
};

type CaseEstimationValidationInput = {
	timeInput?: string | null;
	estimadoMinutos?: number | null;
	pontos?: number | null;
	tamanhoId?: number | null;
	naoPlanejado?: boolean | null;
};

const ESTIMATED_POINTS_REQUIRED_MESSAGE =
	'Para casos estimados, é obrigatório informar a quantidade de pontos.';

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

const parseTimeToMinutes = (timeInput: string) => {
	if (!isValidTimeInput(timeInput)) return null;
	const [hours, minutes] = timeInput.split(':').map(Number);
	return hours * 60 + minutes;
};

const resolveEstimatedMinutes = (timeInput?: string | null, fallbackMinutes?: number | null) => {
	if (isMeaningfulTimeSelection(timeInput)) {
		const parsed = parseTimeToMinutes(timeInput as string);
		if (parsed !== null) return parsed;
	}
	return typeof fallbackMinutes === 'number' ? fallbackMinutes : 0;
};

const shouldBlockEstimatedCaseSave = ({
	timeInput,
	estimadoMinutos,
	pontos,
	tamanhoId,
	naoPlanejado,
}: CaseEstimationValidationInput) => {
	const estimatedMinutes = resolveEstimatedMinutes(timeInput, estimadoMinutos);
	if (!estimatedMinutes || estimatedMinutes <= 0) return false;
	if (naoPlanejado) return false;
	if (tamanhoId) return false;
	if (typeof pontos === 'number') {
		return pontos <= 0;
	}
	return true;
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

	if (tamanhoId !== undefined && tamanhoId !== null) {
		const parsedTamanhoId = Number(tamanhoId);
		if (!Number.isNaN(parsedTamanhoId) && parsedTamanhoId > 0) {
			updateData.tamanho = parsedTamanhoId;
		}
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
	shouldBlockEstimatedCaseSave,
	ESTIMATED_POINTS_REQUIRED_MESSAGE,
	type CaseTimeDraft,
};
