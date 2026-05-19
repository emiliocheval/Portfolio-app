import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
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

/** Executes a tool by name. Throws if the tool is not found. */
export async function dispatch(name: string, args: unknown): Promise<unknown> {
  const tool = ALL_TOOLS.find((t) => t.definition.name === name);
  if (!tool) throw new Error(`Unknown tool: ${name}`);
  return tool.execute(args as never);
}

/**
 * Registers all GitHub tools on an MCP server instance.
 * Called once per request in the MCP route (stateless mode).
 */
export function registerTools(server: McpServer): void {
  for (const tool of ALL_TOOLS) {
    const { name, description, inputSchema } = tool.definition;

    server.tool(name, description, inputSchema.properties, async (args) => {
      try {
        const result = await tool.execute(args as never);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
        };
      } catch (err) {
        const message =
          err instanceof GitHubAPIError ? formatGitHubError(err.error) : 'Tool execution failed.';
        return {
          content: [{ type: 'text' as const, text: message }],
          isError: true,
        };
      }
    });
  }
}
