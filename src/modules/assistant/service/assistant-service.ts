import { checkIntent } from "./guardrails/intent-filter";
import { PORTFOLIO_SCOPE } from "./scope-config";
import type { AssistantResult, ChatRequest, LLMProvider } from "./types";

export function createAssistantService(provider: LLMProvider) {
  return {
    async chat(
      request: ChatRequest,
      signal?: AbortSignal,
    ): Promise<AssistantResult> {
      const intentResult = checkIntent(request.message, PORTFOLIO_SCOPE);
      if (!intentResult.allowed) {
        return {
          ok: false,
          reason: "filtered",
          message: PORTFOLIO_SCOPE.rejectionMessage,
        };
      }

      const history = request.history.slice(-PORTFOLIO_SCOPE.maxHistoryTurns);
      const messages = [
        ...history,
        { role: "user" as const, content: request.message },
      ];

      try {
        const stream = await provider.stream(
          PORTFOLIO_SCOPE.systemPrompt,
          messages,
          signal,
        );
        return { ok: true, stream };
      } catch {
        return {
          ok: false,
          reason: "provider_error",
          message: "Something went wrong. Please try again.",
        };
      }
    },
  };
}
