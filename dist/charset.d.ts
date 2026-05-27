type HeaderMap = Record<string, string | undefined>;
type CharsetInput = string | HeaderMap | {
    headers?: HeaderMap;
};
export declare function find(obj: CharsetInput, data?: string | null, peekSize?: number): string | null;
export {};
//# sourceMappingURL=charset.d.ts.map