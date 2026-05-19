import { githubFetch } from '../github-client';
import type { GitHubTool } from '../types';

interface Args {
  repo: string;
  limit?: number;
}

interface Commit {
  sha: string;
  message: string;
  author: string;
  date: string;
  url: string;
}

export const getRecentCommitsTool: GitHubTool<Args> = {
  definition: {
    name: 'get_recent_commits',
    description:
      "Get recent commit history for one of Emil's repositories. Use this when asked about recent activity or what he has been working on.",
    inputSchema: {
      type: 'object',
      properties: {
        repo: {
          type: 'string',
          description: 'Repository name (e.g. "my-project").',
        },
        limit: {
          type: 'number',
          description: 'Number of commits to return (1–20). Default: 10.',
        },
      },
      required: ['repo'],
    },
  },

  async execute(args) {
    const username = process.env.GITHUB_USERNAME;
    const limit = Math.min(args.limit ?? 10, 20);

    const data = (await githubFetch(
      `/repos/${username}/${args.repo}/commits?per_page=${limit}`,
    )) as any[];

    return data.map<Commit>((c) => ({
      sha: c.sha.slice(0, 7),
      message: c.commit.message.split('\n')[0], // First line only
      author: c.commit.author?.name ?? 'unknown',
      date: c.commit.author?.date ?? '',
      url: c.html_url,
    }));
  },
};
