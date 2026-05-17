export interface GitHubToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required: string[];
  };
}

export interface GitHubTool<TArgs = unknown> {
  definition: GitHubToolDefinition;
  execute(args: TArgs): Promise<unknown>;
}

export type GitHubErrorType =
  | { type: 'rate_limited'; resetAt: Date }
  | { type: 'not_found'; resource: string }
  | { type: 'auth_failed' }
  | { type: 'network_error'; message: string }
  | { type: 'empty_result' };

export class GitHubAPIError extends Error {
  constructor(public readonly error: GitHubErrorType) {
    super(error.type);
  }
}

export function formatGitHubError(err: GitHubErrorType): string {
  switch (err.type) {
    case 'rate_limited':
      return `GitHub API rate limit reached. Resets at ${err.resetAt.toLocaleTimeString()}.`;
    case 'not_found':
      return `Not found: ${err.resource}`;
    case 'auth_failed':
      return 'GitHub authentication failed. The token may be invalid or expired.';
    case 'empty_result':
      return 'No results found.';
    case 'network_error':
      return `Network error: ${err.message}`;
  }
}

// MCP JSON-RPC types
export interface MCPRequest {
  jsonrpc: '2.0';
  method: string;
  id: number | string | null;
  params?: Record<string, unknown>;
}

export interface MCPToolCallParams {
  name: string;
  arguments?: Record<string, unknown>;
}
