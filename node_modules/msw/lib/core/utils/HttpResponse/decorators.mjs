import statuses from "@bundled-es-modules/statuses";
import { Headers as HeadersPolyfill } from "headers-polyfill";
const { message } = statuses;
function normalizeResponseInit(init = {}) {
  const status = init?.status || 200;
  const statusText = init?.statusText || message[status] || "";
  const headers = new Headers(init?.headers);
  return {
    ...init,
    headers,
    status,
    statusText
  };
}
function decorateResponse(response, init) {
  if (init.type) {
    Object.defineProperty(response, "type", {
      value: init.type,
      enumerable: true,
      writable: false
    });
  }
  if (typeof document !== "undefined") {
    const responseCookies = HeadersPolyfill.prototype.getSetCookie.call(
      init.headers
    );
    for (const cookieString of responseCookies) {
      document.cookie = cookieString;
    }
  }
  return response;
}
export {
  decorateResponse,
  normalizeResponseInit
};
//# sourceMappingURL=decorators.mjs.map