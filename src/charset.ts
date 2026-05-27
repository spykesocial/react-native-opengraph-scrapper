const CHARTSET_RE = /(?:charset|encoding)\s{0,10}=\s{0,10}['"]? {0,10}([\w-]{1,100})/i;

type HeaderMap = Record<string, string | undefined>;
type CharsetInput = string | HeaderMap | { headers?: HeaderMap };

export function find(obj: CharsetInput, data?: string | null, peekSize?: number) {
  let matches: RegExpExecArray | null = null;
  let end = 0;

  if (data) {
    peekSize = peekSize || 512;
    end = data.length > peekSize ? peekSize : data.length;
  }

  let contentType: unknown = obj;
  if (contentType && typeof contentType === 'object') {
    let headers = obj as HeaderMap;
    if ('headers' in contentType && contentType.headers) {
      headers = contentType.headers as HeaderMap;
    }
    contentType = headers['content-type'] || headers['Content-Type'];
  }

  if (typeof contentType === 'string') {
    matches = CHARTSET_RE.exec(contentType);
  }

  if (!matches && end > 0 && data) {
    matches = CHARTSET_RE.exec(data.slice(0, end));
  }

  if (!matches) return null;
  const charset = matches[1].toLowerCase();
  return charset === 'utf-8' ? 'utf8' : charset;
}
