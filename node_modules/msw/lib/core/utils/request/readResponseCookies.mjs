import { store } from "@mswjs/cookies";
function readResponseCookies(request, response) {
  store.add({ ...request, url: request.url.toString() }, response);
  store.persist();
}
export {
  readResponseCookies
};
//# sourceMappingURL=readResponseCookies.mjs.map