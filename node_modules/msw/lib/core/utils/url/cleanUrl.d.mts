declare function getSearchParams(path: string): URLSearchParams;
/**
 * Removes query parameters and hashes from a given URL string.
 */
declare function cleanUrl(path: string): string;

export { cleanUrl, getSearchParams };
