import { IMessage } from '../../Messages/domain/IMessage';
import type { SuggestionAction } from '../domain/ISuggestionAction';
export declare function generateOneOrder(messages: IMessage[], modelName?: string): Promise<{
    suggestion: SuggestionAction | null;
    promptTokens: number;
    completionTokens: number;
}>;
