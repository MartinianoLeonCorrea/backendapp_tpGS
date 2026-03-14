import sanitizeHtml from 'sanitize-html';

export function sanitizeObjectStrings<T extends Record<string, any>>(data: T): T {
  const sanitized: Record<string, any> = {};
  for (const key in data) {
    if (typeof data[key] === 'string') {
      sanitized[key] = sanitizeHtml(data[key], {
        allowedTags: [],
        allowedAttributes: {},
      }).trim();
    } else {
      sanitized[key] = data[key];
    }
  }
  return sanitized as T;
}

