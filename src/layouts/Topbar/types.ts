import type { StaticImageData } from 'next/image';

export type Language = {
	name: string;
	flag: StaticImageData;
};

export type AppItem = {
	name: string;
	icon: StaticImageData;
	redirectTo: string;
};

type Message = {
	id: number;
	title: string;
	time?: string;
	subText: string;
	avatar?: StaticImageData;
	icon?: string;
	variant?: string;
	isRead: boolean;
	link?: string | null;
	// Campos adicionais preservados da mensagem original da API
	titulo?: string;
	enviado_por?: string;
	msg_texto?: string;
	id_tipo?: number;
	endo_imagem?: string | null;
	datas?: {
		msg: string | null;
		hora: string | null;
		enviado: string | null;
		inicio: string | null;
		prazo_limite: string | null;
		endo_inicial: string | null;
		endo_final: string | null;
	};
	status_leitura?: {
		lido: boolean;
		auto: boolean;
		data_lido: string | null;
	};
};

export type NotificationItem = {
	day: string;
	messages: Message[];
};

export type ProfileOption = {
	label: string;
	icon: string;
	redirectTo: string;
};

export type SearchOption = {
	label: string;
	icon?: string;
	type: string;
	value?: string;
	userDetails?: {
		firstname: string;
		lastname: string;
		position: string;
		avatar: StaticImageData;
	};
};
