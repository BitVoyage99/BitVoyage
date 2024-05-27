"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var getRequestCookies_exports = {};
__export(getRequestCookies_exports, {
  getAllRequestCookies: () => getAllRequestCookies,
  getRequestCookies: () => getRequestCookies
});
module.exports = __toCommonJS(getRequestCookies_exports);
var import_cookie = __toESM(require("@bundled-es-modules/cookie"));
var import_cookies = require("@mswjs/cookies");
function getAllDocumentCookies() {
  return import_cookie.default.parse(document.cookie);
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
  const cookiesFromHeaders = requestCookiesString ? import_cookie.default.parse(requestCookiesString) : {};
  import_cookies.store.hydrate();
  const cookiesFromStore = Array.from(import_cookies.store.get(request)?.entries()).reduce((cookies, [name, { value }]) => {
    return Object.assign(cookies, { [name.trim()]: value });
  }, {});
  const cookiesFromDocument = getRequestCookies(request);
  const forwardedCookies = {
    ...cookiesFromDocument,
    ...cookiesFromStore
  };
  for (const [name, value] of Object.entries(forwardedCookies)) {
    request.headers.append("cookie", import_cookie.default.serialize(name, value));
  }
  return {
    ...forwardedCookies,
    ...cookiesFromHeaders
  };
}
//# sourceMappingURL=getRequestCookies.js.map