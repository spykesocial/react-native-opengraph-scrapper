type HeaderMap = Record<string, string | undefined>;
type CharsetInput = string | HeaderMap | {
    headers?: HeaderMap;
};
declare function find(obj: CharsetInput, data?: string | null, peekSize?: number): string | null;

export { find };
