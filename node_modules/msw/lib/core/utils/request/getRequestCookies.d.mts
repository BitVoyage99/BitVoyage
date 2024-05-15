/** @todo Rename this to "getDocumentCookies" */
/**
 * Returns relevant document cookies based on the request `credentials` option.
 */
declare function getRequestCookies(request: Request): Record<string, string>;
declare function getAllRequestCookies(request: Request): Record<string, string>;

export { getAllRequestCookies, getRequestCookies };
