export type Role = 'user' | 'assistant';

export interface Message {
  role: Role;
  content: string;
}

export interface ChatRequest {
  message: string;
  history: Message[];
}

export type AssistantResult =
  | { ok: true; stream: ReadableStream<Uint8Array> }
  | { ok: false; reason: 'filtered' | 'provider_error' | 'invalid_input'; message: string };

export interface LLMProvider {
  stream(
    systemPrompt: string,
    messages: Message[],
    signal?: AbortSignal,
  ): Promise<ReadableStream<Uint8Array>>;
}
