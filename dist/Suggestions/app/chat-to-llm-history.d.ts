import { IMessage } from '../../Messages/domain/IMessage';
export declare function chatToLlmHistory(messages: IMessage[]): {
    role: 'user' | 'assistant';
    content: string;
}[];
