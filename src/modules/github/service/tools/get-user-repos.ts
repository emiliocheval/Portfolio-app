import { githubFetch } from '../github-client';
import { getGitHubConfig } from '../github-config';
import type { GitHubTool } from '../types';

interface Args {
  sort?: 'updated' | 'created' | 'pushed' | 'full_name';
  limit?: number;
}

interface Repo {
  name: string;
  full_name: string;
  description: string | null;
  url: string;
  language: string | null;
  stars: number;
  forks: number;
  updatedAt: string;
  topics: string[];
}

export const getUserReposTool: GitHubTool<Args> = {
  definition: {
    name: 'get_user_repos',
    description:
      "List Emil's public GitHub repositories. Use this when asked about his projects, repos, or what he has built.",
    inputSchema: {
      type: 'object',
      properties: {
        sort: {
          type: 'string',
          enum: ['updated', 'created', 'pushed', 'full_name'],
          description: 'Sort order. Default: updated.',
        },
        limit: {
          type: 'number',
          description: 'Max repos to return (1–30). Default: 10.',
        },
      },
      required: [],
    },
  },

  async execute(args) {
    const sort = args.sort ?? 'updated';
    const limit = Math.min(args.limit ?? 10, 30);
    const { username, token } = getGitHubConfig();

const data = (await githubFetch(
      `/users/${username}/repos?sort=${sort}&per_page=${limit}&type=public`, token,
    )) as any[];

    return data.map<Repo>((r) => ({
      name: r.name,
      full_name: r.full_name,
      description: r.description,
      url: r.html_url,
      language: r.language,
      stars: r.stargazers_count,
      forks: r.forks_count,
      updatedAt: r.updated_at,
      topics: r.topics ?? [],
    }));
  },
};
