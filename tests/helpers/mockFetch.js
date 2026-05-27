function createHeaders(headers = {}) {
  const normalized = {};
  Object.entries(headers).forEach(([key, value]) => {
    normalized[key.toLowerCase()] = value;
  });

  return {
    get(name) {
      return normalized[name.toLowerCase()] || null;
    },
    forEach(callback) {
      Object.entries(normalized).forEach(([key, value]) => callback(value, key));
    },
  };
}

export function createMockFetchResponse(body, options = {}) {
  const {
    status = 200,
    headers = { 'content-type': 'text/html; charset=utf-8' },
  } = options;
  const textBody = Buffer.isBuffer(body) ? body.toString('utf8') : body;
  const encodedBody = new TextEncoder().encode(textBody);

  return {
    status,
    ok: status >= 200 && status < 300,
    headers: createHeaders(headers),
    body: textBody,
    arrayBuffer: async () => encodedBody.buffer,
    text: async () => textBody,
  };
}
