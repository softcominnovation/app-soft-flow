import IProductAssistant from "../assistant/IProductAssistant";
import { IVersionAssistant } from "@/services/versionsServices";
import { IStatusAssistant } from "@/services/statusServices";
import { IModuleAssistant } from "@/services/modulesServices";

import { AsyncSelectOption } from '@/hooks/useAsyncSelect';

import IUserAssistant from "../assistant/IUserAssistant";

export default interface ICasePost {
	product: AsyncSelectOption<IProductAssistant>;
	project: AsyncSelectOption<any>;
	version: AsyncSelectOption<IVersionAssistant>;
	category: AsyncSelectOption<any>;
	priority: string | undefined;
	status?: AsyncSelectOption<IStatusAssistant>;
	Id_Origem?: string;
	modulo?: string;
	qa_id?: AsyncSelectOption<IUserAssistant>;
}