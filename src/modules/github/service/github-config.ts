export interface GitHubConfig {
  username: string;
  token: string | undefined;
}

export function getGitHubConfig(): GitHubConfig {
  const username = process.env.GITHUB_USERNAME;
  if (!username) throw new Error('Missing GITHUB_USERNAME env var');

  return {
    username,
    token: process.env.GITHUB_TOKEN,
  };
}
