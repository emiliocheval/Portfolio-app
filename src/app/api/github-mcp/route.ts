import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { registerTools } from '@/modules/github/service/tool-registry';

function createServer() {
  const server = new McpServer({
    name: 'emil-github-mcp',
    version: '1.0.0',
  });
  registerTools(server);
  return server;
}

async function handleRequest(req: Request): Promise<Response> {
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined, // stateless — required for serverless (Vercel)
  });

  const server = createServer();
  await server.connect(transport);

  return transport.handleRequest(req);
}

export const GET = handleRequest;
export const POST = handleRequest;
export const DELETE = handleRequest;
