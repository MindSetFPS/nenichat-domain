import { IMessage } from '../../Messages/domain/IMessage';
import type { SuggestionAction } from '../domain/ISuggestionAction';
export declare function generateManySuggestions(messages: IMessage[], modelName?: string): Promise<{
    suggestions: SuggestionAction[];
    promptTokens: number;
    completionTokens: number;
}>;
