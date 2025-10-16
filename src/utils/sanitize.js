const sanitizeHtml = require('sanitize-html');

function sanitizeObjectStrings(data) {
  const sanitized = {};
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
  return sanitized;
}

module.exports = { sanitizeObjectStrings };
