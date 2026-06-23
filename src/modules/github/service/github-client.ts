import { GitHubAPIError } from './types';

const GITHUB_API = 'https://api.github.com';

export async function githubFetch(path: string, token?: string): Promise<unknown> {
  const res = await fetch(`${GITHUB_API}${path}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    cache: 'no-store',
  });

  if (res.status === 401) {
    throw new GitHubAPIError({ type: 'auth_failed' });
  }

  if (res.status === 404) {
    throw new GitHubAPIError({ type: 'not_found', resource: path });
  }

  if (res.status === 403 || res.status === 429) {
    const reset = res.headers.get('X-RateLimit-Reset');
    throw new GitHubAPIError({
      type: 'rate_limited',
      resetAt: new Date(reset ? Number(reset) * 1000 : Date.now() + 60_000),
    });
  }

  if (!res.ok) {
    throw new GitHubAPIError({ type: 'network_error', message: `HTTP ${res.status}` });
  }

  return res.json();
}
