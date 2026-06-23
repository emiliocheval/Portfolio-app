import { githubFetch } from '../github-client';
import { getGitHubConfig } from '../github-config';
import type { GitHubTool } from '../types';

interface Args {
  query: string;
}

interface SearchResult {
  name: string;
  description: string | null;
  url: string;
  language: string | null;
  stars: number;
  updatedAt: string;
}

export const searchMyReposTool: GitHubTool<Args> = {
  definition: {
    name: 'search_my_repos',
    description:
      "Search Emil's public repositories by keyword. Use this when asked if he has worked with a specific technology, framework, or topic.",
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search keyword (e.g. "react", "typescript", "api").',
        },
      },
      required: ['query'],
    },
  },

  async execute(args) {
    const { username, token } = getGitHubConfig();
    const q = encodeURIComponent(`${args.query} user:${username}`);

    const data = (await githubFetch(`/search/repositories?q=${q}&sort=updated&per_page=10`, token)) as {
      total_count: number;
      items: any[];
    };

    return {
      total: data.total_count,
      results: data.items.map<SearchResult>((r) => ({
        name: r.name,
        description: r.description,
        url: r.html_url,
        language: r.language,
        stars: r.stargazers_count,
        updatedAt: r.updated_at,
      })),
    };
  },
};
