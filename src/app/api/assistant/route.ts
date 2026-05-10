import { createAssistantService } from '@/modules/assistant/service/assistant-service';
import { createDeepSeekProvider } from '@/modules/assistant/service/providers/deepseek';
import type { ChatRequest } from '@/modules/assistant/service/types';

let service: ReturnType<typeof createAssistantService> | null = null;

function getService() {
  if (!service) {
    service = createAssistantService(
      createDeepSeekProvider(process.env.DEEPSEEK_API_KEY!),
    );
  }
  return service;
}

export async function POST(request: Request) {
  let body: ChatRequest;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (typeof body.message !== 'string' || !Array.isArray(body.history)) {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const result = await getService().chat(body, request.signal);

  if (!result.ok) {
    const status = result.reason === 'filtered' ? 403 : 500;
    return Response.json({ error: result.message, reason: result.reason }, { status });
  }

  return new Response(result.stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
