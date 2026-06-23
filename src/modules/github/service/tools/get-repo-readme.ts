import { githubFetch } from '../github-client';
import { getGitHubConfig } from '../github-config';
import type { GitHubTool } from '../types';

interface Args {
  repo: string;
}

export const getRepoReadmeTool: GitHubTool<Args> = {
  definition: {
    name: 'get_repo_readme',
    description:
      "Fetch and return the README for one of Emil's repositories. Use this when asked for details about a specific project.",
    inputSchema: {
      type: 'object',
      properties: {
        repo: {
          type: 'string',
          description: 'Repository name (e.g. "my-project"). Do not include the owner prefix.',
        },
      },
      required: ['repo'],
    },
  },

  async execute(args) {
    const { username, token } = getGitHubConfig();
    const data = (await githubFetch(`/repos/${username}/${args.repo}/readme`, token)) as {
      content: string;
      encoding: string;
    };

    const decoded = Buffer.from(data.content, 'base64').toString('utf-8');

    // Strip HTML tags and trim leading/trailing whitespace from each line
    const cleaned = decoded
      .replace(/<[^>]+>/g, '')
      .split('\n')
      .map((l) => l.trimEnd())
      .join('\n')
      .trim();

    // Cap at 4000 chars so the LLM isn't overwhelmed
    return cleaned.length > 4000 ? cleaned.slice(0, 4000) + '\n\n[README truncated]' : cleaned;
  },
};
