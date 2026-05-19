import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { getUserReposTool } from './tools/get-user-repos';
import { getRepoReadmeTool } from './tools/get-repo-readme';
import { getRecentCommitsTool } from './tools/get-recent-commits';
import { getRepoLanguagesTool } from './tools/get-repo-languages';
import { searchMyReposTool } from './tools/search-my-repos';
import type { GitHubTool } from './types';
import { GitHubAPIError, formatGitHubError } from './types';

const ALL_TOOLS: GitHubTool[] = [
  getUserReposTool,
  getRepoReadmeTool,
  getRecentCommitsTool,
  getRepoLanguagesTool,
  searchMyReposTool,
];

/** Returns tool definitions in OpenAI function-calling format (used by the assistant route). */
export function listToolsForLLM() {
  return ALL_TOOLS.map((t) => ({
    type: 'function' as const,
    function: {
      name: t.definition.name,
      description: t.definition.description,
      parameters: t.definition.inputSchema,
    },
  }));
}

/** Executes a tool by name. Used by the assistant route's agentic loop. */
export async function dispatch(name: string, args: unknown): Promise<unknown> {
  const tool = ALL_TOOLS.find((t) => t.definition.name === name);
  if (!tool) throw new Error(`Unknown tool: ${name}`);
  return tool.execute(args as never);
}

function toolResult(result: unknown) {
  return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
}

function toolError(err: unknown) {
  const message =
    err instanceof GitHubAPIError ? formatGitHubError(err.error) : 'Tool execution failed.';
  return { content: [{ type: 'text' as const, text: message }], isError: true };
}

/**
 * Registers all GitHub tools on an MCP server instance using Zod schemas.
 * Called once per request in the MCP route (stateless mode).
 */
export function registerTools(server: McpServer): void {
  server.registerTool(
    'get_user_repos',
    {
      description: getUserReposTool.definition.description,
      inputSchema: {
        sort: z.enum(['updated', 'created', 'pushed', 'full_name']).optional(),
        limit: z.number().min(1).max(30).optional(),
      },
    },
    async (args) => {
      try {
        return toolResult(await getUserReposTool.execute(args));
      } catch (err) {
        return toolError(err);
      }
    },
  );

  server.registerTool(
    'get_repo_readme',
    {
      description: getRepoReadmeTool.definition.description,
      inputSchema: {
        repo: z.string().describe('Repository name, e.g. "my-project"'),
      },
    },
    async (args) => {
      try {
        return toolResult(await getRepoReadmeTool.execute(args));
      } catch (err) {
        return toolError(err);
      }
    },
  );

  server.registerTool(
    'get_recent_commits',
    {
      description: getRecentCommitsTool.definition.description,
      inputSchema: {
        repo: z.string().describe('Repository name'),
        limit: z.number().min(1).max(20).optional(),
      },
    },
    async (args) => {
      try {
        return toolResult(await getRecentCommitsTool.execute(args));
      } catch (err) {
        return toolError(err);
      }
    },
  );

  server.registerTool(
    'get_repo_languages',
    {
      description: getRepoLanguagesTool.definition.description,
      inputSchema: {
        repo: z.string().describe('Repository name'),
      },
    },
    async (args) => {
      try {
        return toolResult(await getRepoLanguagesTool.execute(args));
      } catch (err) {
        return toolError(err);
      }
    },
  );

  server.registerTool(
    'search_my_repos',
    {
      description: searchMyReposTool.definition.description,
      inputSchema: {
        query: z.string().describe('Search keyword, e.g. "react" or "typescript"'),
      },
    },
    async (args) => {
      try {
        return toolResult(await searchMyReposTool.execute(args));
      } catch (err) {
        return toolError(err);
      }
    },
  );
}
