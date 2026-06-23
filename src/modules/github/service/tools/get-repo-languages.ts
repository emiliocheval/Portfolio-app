import { githubFetch } from '../github-client';
import { getGitHubConfig } from '../github-config';
import type { GitHubTool } from '../types';

interface Args {
  repo: string;
}

export const getRepoLanguagesTool: GitHubTool<Args> = {
  definition: {
    name: 'get_repo_languages',
    description:
      "Get the programming language breakdown (by bytes of code) for one of Emil's repositories.",
    inputSchema: {
      type: 'object',
      properties: {
        repo: {
          type: 'string',
          description: 'Repository name (e.g. "my-project").',
        },
      },
      required: ['repo'],
    },
  },

  async execute(args) {
    const { username, token } = getGitHubConfig();
    const data = (await githubFetch(
      `/repos/${username}/${args.repo}/languages`, token,
    )) as Record<string, number>;

    const total = Object.values(data).reduce((sum, n) => sum + n, 0);
    if (total === 0) return {};

    // Return languages with percentage breakdown, sorted by usage
    return Object.entries(data)
      .sort(([, a], [, b]) => b - a)
      .reduce<Record<string, string>>((acc, [lang, bytes]) => {
        acc[lang] = `${((bytes / total) * 100).toFixed(1)}%`;
        return acc;
      }, {});
  },
};
