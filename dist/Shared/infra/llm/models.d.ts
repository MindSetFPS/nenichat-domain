export interface ModelConfig {
    name: string;
    temperature?: number;
    top_p?: number;
    top_k?: number;
    min_p?: number;
    presence_penalty?: number;
    frequency_penalty?: number;
    num_predict?: number;
    num_ctx?: number;
    seed?: number;
    stop?: string[];
    think?: boolean;
    repetition_penalty?: number;
    keep_alive?: string | number;
    [key: string]: unknown;
}
export declare const LLM_MODELS: Record<string, ModelConfig>;
export declare const DEFAULT_MODEL: string;
