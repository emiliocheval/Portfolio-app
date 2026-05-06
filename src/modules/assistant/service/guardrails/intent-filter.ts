import type { IntentCheckResult } from '../types';
import type { ScopeConfig } from '../scope-config';

export function checkIntent(
  message: string,
  scope: ScopeConfig,
): IntentCheckResult {
  const trimmed = message.trim();

  // Layer 0: structural validation
  if (trimmed.length === 0) {
    return { allowed: false, reason: 'empty_message' };
  }
  if (trimmed.length > scope.maxMessageLength) {
    return { allowed: false, reason: 'message_too_long' };
  }

  // Layer 1: hard-blocked patterns
  for (const pattern of scope.blockedPatterns) {
    if (pattern.test(trimmed)) {
      return { allowed: false, reason: 'blocked_pattern' };
    }
  }

  // Layer 2: topic allowlist
  const lower = trimmed.toLowerCase();
  const hasAllowedTopic = scope.allowedTopics.some((topic) =>
    lower.includes(topic),
  );
  const isShortMessage = trimmed.split(/\s+/).length <= 4;

  if (!hasAllowedTopic && !isShortMessage) {
    return { allowed: false, reason: 'off_topic' };
  }

  return { allowed: true };
}
