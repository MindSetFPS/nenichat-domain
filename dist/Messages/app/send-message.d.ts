import type { IMessage } from "../domain/IMessage";
export default function SendMessage(phone: string, messageTextContent: string, businessId: number): Promise<IMessage>;
