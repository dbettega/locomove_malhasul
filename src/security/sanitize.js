import DOMPurify from 'dompurify';

/**
 * Sanitize a string value against XSS.
 * Use ONLY when inserting user content via innerHTML.
 * Prefer textContent for plain text.
 */
export function sanitize(value) {
  if (typeof value !== 'string') return '';
  return DOMPurify.sanitize(value, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}
