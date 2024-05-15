import cookieUtils from "@bundled-es-modules/cookie";
import { store } from "@mswjs/cookies";
function getAllDocumentCookies() {
  return cookieUtils.parse(document.cookie);
}
function getRequestCookies(request) {
  if (typeof document === "undefined" || typeof location === "undefined") {
    return {};
  }
  switch (request.credentials) {
    case "same-origin": {
      const url = new URL(request.url);
      return location.origin === url.origin ? getAllDocumentCookies() : {};
    }
    case "include": {
      return getAllDocumentCookies();
    }
    default: {
      return {};
    }
  }
}
function getAllRequestCookies(request) {
  const requestCookiesString = request.headers.get("cookie");
  const cookiesFromHeaders = requestCookiesString ? cookieUtils.parse(requestCookiesString) : {};
  store.hydrate();
  const cookiesFromStore = Array.from(store.get(request)?.entries()).reduce((cookies, [name, { value }]) => {
    return Object.assign(cookies, { [name.trim()]: value });
  }, {});
  const cookiesFromDocument = getRequestCookies(request);
  const forwardedCookies = {
    ...cookiesFromDocument,
    ...cookiesFromStore
  };
  for (const [name, value] of Object.entries(forwardedCookies)) {
    request.headers.append("cookie", cookieUtils.serialize(name, value));
  }
  return {
    ...forwardedCookies,
    ...cookiesFromHeaders
  };
}
export {
  getAllRequestCookies,
  getRequestCookies
};
//# sourceMappingURL=getRequestCookies.mjs.map