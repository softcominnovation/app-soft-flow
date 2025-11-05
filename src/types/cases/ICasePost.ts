import IProductAssistant from "../assistant/IProductAssistant";
import { IVersionAssistant } from "@/services/versionsServices";

import { AsyncSelectOption } from '@/hooks/useAsyncSelect';

export default interface ICasePost {
	product: AsyncSelectOption<IProductAssistant>;
	project: AsyncSelectOption<any>;
	version: AsyncSelectOption<IVersionAssistant>;
	category: AsyncSelectOption<any>;
	priority: string | undefined;
	Id_Origem?: string;
}