"use strict";
var MockServiceWorker = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
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
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/iife/index.ts
  var iife_exports = {};
  __export(iife_exports, {
    GraphQLHandler: () => GraphQLHandler,
    HttpHandler: () => HttpHandler,
    HttpMethods: () => HttpMethods,
    HttpResponse: () => HttpResponse,
    MAX_SERVER_RESPONSE_TIME: () => MAX_SERVER_RESPONSE_TIME,
    MIN_SERVER_RESPONSE_TIME: () => MIN_SERVER_RESPONSE_TIME,
    NODE_SERVER_RESPONSE_TIME: () => NODE_SERVER_RESPONSE_TIME,
    RequestHandler: () => RequestHandler,
    SET_TIMEOUT_MAX_ALLOWED_INT: () => SET_TIMEOUT_MAX_ALLOWED_INT,
    SetupApi: () => SetupApi,
    SetupWorkerApi: () => SetupWorkerApi,
    bypass: () => bypass,
    cleanUrl: () => cleanUrl,
    delay: () => delay,
    getResponse: () => getResponse,
    graphql: () => graphql,
    handleRequest: () => handleRequest,
    http: () => http,
    matchRequestUrl: () => matchRequestUrl,
    passthrough: () => passthrough,
    setupWorker: () => setupWorker
  });

  // node_modules/.pnpm/outvariant@1.4.2/node_modules/outvariant/lib/index.mjs
  var POSITIONALS_EXP = /(%?)(%([sdijo]))/g;
  function serializePositional(positional, flag) {
    switch (flag) {
      case "s":
        return positional;
      case "d":
      case "i":
        return Number(positional);
      case "j":
        return JSON.stringify(positional);
      case "o": {
        if (typeof positional === "string") {
          return positional;
        }
        const json = JSON.stringify(positional);
        if (json === "{}" || json === "[]" || /^\[object .+?\]$/.test(json)) {
          return positional;
        }
        return json;
      }
    }
  }
  function format(message3, ...positionals) {
    if (positionals.length === 0) {
      return message3;
    }
    let positionalIndex = 0;
    let formattedMessage = message3.replace(
      POSITIONALS_EXP,
      (match2, isEscaped, _, flag) => {
        const positional = positionals[positionalIndex];
        const value = serializePositional(positional, flag);
        if (!isEscaped) {
          positionalIndex++;
          return value;
        }
        return match2;
      }
    );
    if (positionalIndex < positionals.length) {
      formattedMessage += ` ${positionals.slice(positionalIndex).join(" ")}`;
    }
    formattedMessage = formattedMessage.replace(/%{2,2}/g, "%");
    return formattedMessage;
  }
  var STACK_FRAMES_TO_IGNORE = 2;
  function cleanErrorStack(error3) {
    if (!error3.stack) {
      return;
    }
    const nextStack = error3.stack.split("\n");
    nextStack.splice(1, STACK_FRAMES_TO_IGNORE);
    error3.stack = nextStack.join("\n");
  }
  var InvariantError = class extends Error {
    constructor(message3, ...positionals) {
      super(message3);
      this.message = message3;
      this.name = "Invariant Violation";
      this.message = format(message3, ...positionals);
      cleanErrorStack(this);
    }
  };
  var invariant = (predicate, message3, ...positionals) => {
    if (!predicate) {
      throw new InvariantError(message3, ...positionals);
    }
  };
  invariant.as = (ErrorConstructor, predicate, message3, ...positionals) => {
    if (!predicate) {
      const formatMessage2 = positionals.length === 0 ? message3 : format(message3, positionals);
      let error3;
      try {
        error3 = Reflect.construct(ErrorConstructor, [formatMessage2]);
      } catch (err) {
        error3 = ErrorConstructor(formatMessage2);
      }
      throw error3;
    }
  };

  // src/core/utils/internal/devUtils.ts
  var LIBRARY_PREFIX = "[MSW]";
  function formatMessage(message3, ...positionals) {
    const interpolatedMessage = format(message3, ...positionals);
    return `${LIBRARY_PREFIX} ${interpolatedMessage}`;
  }
  function warn(message3, ...positionals) {
    console.warn(formatMessage(message3, ...positionals));
  }
  function error(message3, ...positionals) {
    console.error(formatMessage(message3, ...positionals));
  }
  var devUtils = {
    formatMessage,
    warn,
    error
  };

  // src/core/utils/internal/checkGlobals.ts
  function checkGlobals() {
    invariant(
      typeof URL !== "undefined",
      devUtils.formatMessage(
        `Global "URL" class is not defined. This likely means that you're running MSW in an environment that doesn't support all Node.js standard API (e.g. React Native). If that's the case, please use an appropriate polyfill for the "URL" class, like "react-native-url-polyfill".`
      )
    );
  }

  // node_modules/.pnpm/strict-event-emitter@0.5.1/node_modules/strict-event-emitter/lib/index.mjs
  var MemoryLeakError = class extends Error {
    constructor(emitter, type, count) {
      super(
        `Possible EventEmitter memory leak detected. ${count} ${type.toString()} listeners added. Use emitter.setMaxListeners() to increase limit`
      );
      this.emitter = emitter;
      this.type = type;
      this.count = count;
      this.name = "MaxListenersExceededWarning";
    }
  };
  var _Emitter = class {
    static listenerCount(emitter, eventName) {
      return emitter.listenerCount(eventName);
    }
    constructor() {
      this.events = /* @__PURE__ */ new Map();
      this.maxListeners = _Emitter.defaultMaxListeners;
      this.hasWarnedAboutPotentialMemoryLeak = false;
    }
    _emitInternalEvent(internalEventName, eventName, listener) {
      this.emit(
        internalEventName,
        ...[eventName, listener]
      );
    }
    _getListeners(eventName) {
      return Array.prototype.concat.apply([], this.events.get(eventName)) || [];
    }
    _removeListener(listeners, listener) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
      return [];
    }
    _wrapOnceListener(eventName, listener) {
      const onceListener = (...data) => {
        this.removeListener(eventName, onceListener);
        return listener.apply(this, data);
      };
      Object.defineProperty(onceListener, "name", { value: listener.name });
      return onceListener;
    }
    setMaxListeners(maxListeners) {
      this.maxListeners = maxListeners;
      return this;
    }
    /**
     * Returns the current max listener value for the `Emitter` which is
     * either set by `emitter.setMaxListeners(n)` or defaults to
     * `Emitter.defaultMaxListeners`.
     */
    getMaxListeners() {
      return this.maxListeners;
    }
    /**
     * Returns an array listing the events for which the emitter has registered listeners.
     * The values in the array will be strings or Symbols.
     */
    eventNames() {
      return Array.from(this.events.keys());
    }
    /**
     * Synchronously calls each of the listeners registered for the event named `eventName`,
     * in the order they were registered, passing the supplied arguments to each.
     * Returns `true` if the event has listeners, `false` otherwise.
     *
     * @example
     * const emitter = new Emitter<{ hello: [string] }>()
     * emitter.emit('hello', 'John')
     */
    emit(eventName, ...data) {
      const listeners = this._getListeners(eventName);
      listeners.forEach((listener) => {
        listener.apply(this, data);
      });
      return listeners.length > 0;
    }
    addListener(eventName, listener) {
      this._emitInternalEvent("newListener", eventName, listener);
      const nextListeners = this._getListeners(eventName).concat(listener);
      this.events.set(eventName, nextListeners);
      if (this.maxListeners > 0 && this.listenerCount(eventName) > this.maxListeners && !this.hasWarnedAboutPotentialMemoryLeak) {
        this.hasWarnedAboutPotentialMemoryLeak = true;
        const memoryLeakWarning = new MemoryLeakError(
          this,
          eventName,
          this.listenerCount(eventName)
        );
        console.warn(memoryLeakWarning);
      }
      return this;
    }
    on(eventName, listener) {
      return this.addListener(eventName, listener);
    }
    once(eventName, listener) {
      return this.addListener(
        eventName,
        this._wrapOnceListener(eventName, listener)
      );
    }
    prependListener(eventName, listener) {
      const listeners = this._getListeners(eventName);
      if (listeners.length > 0) {
        const nextListeners = [listener].concat(listeners);
        this.events.set(eventName, nextListeners);
      } else {
        this.events.set(eventName, listeners.concat(listener));
      }
      return this;
    }
    prependOnceListener(eventName, listener) {
      return this.prependListener(
        eventName,
        this._wrapOnceListener(eventName, listener)
      );
    }
    removeListener(eventName, listener) {
      const listeners = this._getListeners(eventName);
      if (listeners.length > 0) {
        this._removeListener(listeners, listener);
        this.events.set(eventName, listeners);
        this._emitInternalEvent("removeListener", eventName, listener);
      }
      return this;
    }
    /**
     * Alias for `emitter.removeListener()`.
     *
     * @example
     * emitter.off('hello', listener)
     */
    off(eventName, listener) {
      return this.removeListener(eventName, listener);
    }
    removeAllListeners(eventName) {
      if (eventName) {
        this.events.delete(eventName);
      } else {
        this.events.clear();
      }
      return this;
    }
    /**
     * Returns a copy of the array of listeners for the event named `eventName`.
     */
    listeners(eventName) {
      return Array.from(this._getListeners(eventName));
    }
    /**
     * Returns the number of listeners listening to the event named `eventName`.
     */
    listenerCount(eventName) {
      return this._getListeners(eventName).length;
    }
    rawListeners(eventName) {
      return this.listeners(eventName);
    }
  };
  var Emitter = _Emitter;
  Emitter.defaultMaxListeners = 10;

  // src/core/utils/internal/pipeEvents.ts
  function pipeEvents(source, destination) {
    const rawEmit = source.emit;
    if (rawEmit._isPiped) {
      return;
    }
    const sourceEmit = function sourceEmit2(event, ...data) {
      destination.emit(event, ...data);
      return rawEmit.call(this, event, ...data);
    };
    sourceEmit._isPiped = true;
    source.emit = sourceEmit;
  }

  // src/core/utils/internal/toReadonlyArray.ts
  function toReadonlyArray(source) {
    const clone = [...source];
    Object.freeze(clone);
    return clone;
  }

  // src/core/utils/internal/Disposable.ts
  var Disposable = class {
    subscriptions = [];
    async dispose() {
      await Promise.all(this.subscriptions.map((subscription) => subscription()));
    }
  };

  // src/core/SetupApi.ts
  var InMemoryHandlersController = class {
    constructor(initialHandlers) {
      this.initialHandlers = initialHandlers;
      this.handlers = [...initialHandlers];
    }
    handlers;
    prepend(runtimeHandles) {
      this.handlers.unshift(...runtimeHandles);
    }
    reset(nextHandlers) {
      this.handlers = nextHandlers.length > 0 ? [...nextHandlers] : [...this.initialHandlers];
    }
    currentHandlers() {
      return this.handlers;
    }
  };
  var SetupApi = class extends Disposable {
    handlersController;
    emitter;
    publicEmitter;
    events;
    constructor(...initialHandlers) {
      super();
      invariant(
        this.validateHandlers(initialHandlers),
        devUtils.formatMessage(
          `Failed to apply given request handlers: invalid input. Did you forget to spread the request handlers Array?`
        )
      );
      this.handlersController = new InMemoryHandlersController(initialHandlers);
      this.emitter = new Emitter();
      this.publicEmitter = new Emitter();
      pipeEvents(this.emitter, this.publicEmitter);
      this.events = this.createLifeCycleEvents();
      this.subscriptions.push(() => {
        this.emitter.removeAllListeners();
        this.publicEmitter.removeAllListeners();
      });
    }
    validateHandlers(handlers) {
      return handlers.every((handler) => !Array.isArray(handler));
    }
    use(...runtimeHandlers) {
      invariant(
        this.validateHandlers(runtimeHandlers),
        devUtils.formatMessage(
          `Failed to call "use()" with the given request handlers: invalid input. Did you forget to spread the array of request handlers?`
        )
      );
      this.handlersController.prepend(runtimeHandlers);
    }
    restoreHandlers() {
      this.handlersController.currentHandlers().forEach((handler) => {
        handler.isUsed = false;
      });
    }
    resetHandlers(...nextHandlers) {
      this.handlersController.reset(nextHandlers);
    }
    listHandlers() {
      return toReadonlyArray(this.handlersController.currentHandlers());
    }
    createLifeCycleEvents() {
      return {
        on: (...args) => {
          return this.publicEmitter.on(...args);
        },
        removeListener: (...args) => {
          return this.publicEmitter.removeListener(...args);
        },
        removeAllListeners: (...args) => {
          return this.publicEmitter.removeAllListeners(...args);
        }
      };
    }
  };

  // src/core/utils/internal/getCallFrame.ts
  var SOURCE_FRAME = /[\/\\]msw[\/\\]src[\/\\](.+)/;
  var BUILD_FRAME = /(node_modules)?[\/\\]lib[\/\\](core|browser|node|native|iife)[\/\\]|^[^\/\\]*$/;
  function getCallFrame(error3) {
    const stack = error3.stack;
    if (!stack) {
      return;
    }
    const frames = stack.split("\n").slice(1);
    const declarationFrame = frames.find((frame) => {
      return !(SOURCE_FRAME.test(frame) || BUILD_FRAME.test(frame));
    });
    if (!declarationFrame) {
      return;
    }
    const declarationPath = declarationFrame.replace(/\s*at [^()]*\(([^)]+)\)/, "$1").replace(/^@/, "");
    return declarationPath;
  }

  // src/core/utils/internal/isIterable.ts
  function isIterable(fn) {
    if (!fn) {
      return false;
    }
    return typeof fn[Symbol.iterator] == "function";
  }

  // src/core/handlers/RequestHandler.ts
  var RequestHandler = class _RequestHandler {
    static cache = /* @__PURE__ */ new WeakMap();
    info;
    /**
     * Indicates whether this request handler has been used
     * (its resolver has successfully executed).
     */
    isUsed;
    resolver;
    resolverGenerator;
    resolverGeneratorResult;
    options;
    constructor(args) {
      this.resolver = args.resolver;
      this.options = args.options;
      const callFrame = getCallFrame(new Error());
      this.info = {
        ...args.info,
        callFrame
      };
      this.isUsed = false;
    }
    /**
     * Parse the intercepted request to extract additional information from it.
     * Parsed result is then exposed to other methods of this request handler.
     */
    async parse(_args) {
      return {};
    }
    /**
     * Test if this handler matches the given request.
     *
     * This method is not used internally but is exposed
     * as a convenience method for consumers writing custom
     * handlers.
     */
    async test(args) {
      const parsedResult = await this.parse({
        request: args.request,
        resolutionContext: args.resolutionContext
      });
      return this.predicate({
        request: args.request,
        parsedResult,
        resolutionContext: args.resolutionContext
      });
    }
    extendResolverArgs(_args) {
      return {};
    }
    // Clone the request instance before it's passed to the handler phases
    // and the response resolver so we can always read it for logging.
    // We only clone it once per request to avoid unnecessary overhead.
    cloneRequestOrGetFromCache(request) {
      const existingClone = _RequestHandler.cache.get(request);
      if (typeof existingClone !== "undefined") {
        return existingClone;
      }
      const clonedRequest = request.clone();
      _RequestHandler.cache.set(request, clonedRequest);
      return clonedRequest;
    }
    /**
     * Execute this request handler and produce a mocked response
     * using the given resolver function.
     */
    async run(args) {
      if (this.isUsed && this.options?.once) {
        return null;
      }
      const requestClone = this.cloneRequestOrGetFromCache(args.request);
      const parsedResult = await this.parse({
        request: args.request,
        resolutionContext: args.resolutionContext
      });
      const shouldInterceptRequest = this.predicate({
        request: args.request,
        parsedResult,
        resolutionContext: args.resolutionContext
      });
      if (!shouldInterceptRequest) {
        return null;
      }
      if (this.isUsed && this.options?.once) {
        return null;
      }
      this.isUsed = true;
      const executeResolver = this.wrapResolver(this.resolver);
      const resolverExtras = this.extendResolverArgs({
        request: args.request,
        parsedResult
      });
      const mockedResponsePromise = executeResolver({
        ...resolverExtras,
        requestId: args.requestId,
        request: args.request
      }).catch((errorOrResponse) => {
        if (errorOrResponse instanceof Response) {
          return errorOrResponse;
        }
        throw errorOrResponse;
      });
      const mockedResponse = await mockedResponsePromise;
      const executionResult = this.createExecutionResult({
        // Pass the cloned request to the result so that logging
        // and other consumers could read its body once more.
        request: requestClone,
        requestId: args.requestId,
        response: mockedResponse,
        parsedResult
      });
      return executionResult;
    }
    wrapResolver(resolver) {
      return async (info) => {
        const result = this.resolverGenerator || await resolver(info);
        if (isIterable(result)) {
          this.isUsed = false;
          const { value, done } = result[Symbol.iterator]().next();
          const nextResponse = await value;
          if (done) {
            this.isUsed = true;
          }
          if (!nextResponse && done) {
            invariant(
              this.resolverGeneratorResult,
              "Failed to returned a previously stored generator response: the value is not a valid Response."
            );
            return this.resolverGeneratorResult.clone();
          }
          if (!this.resolverGenerator) {
            this.resolverGenerator = result;
          }
          if (nextResponse) {
            this.resolverGeneratorResult = nextResponse?.clone();
          }
          return nextResponse;
        }
        return result;
      };
    }
    createExecutionResult(args) {
      return {
        handler: this,
        request: args.request,
        requestId: args.requestId,
        response: args.response,
        parsedResult: args.parsedResult
      };
    }
  };

  // src/core/utils/internal/isStringEqual.ts
  function isStringEqual(actual, expected) {
    return actual.toLowerCase() === expected.toLowerCase();
  }

  // src/core/utils/logging/getStatusCodeColor.ts
  function getStatusCodeColor(status) {
    if (status < 300) {
      return "#69AB32" /* Success */;
    }
    if (status < 400) {
      return "#F0BB4B" /* Warning */;
    }
    return "#E95F5D" /* Danger */;
  }

  // src/core/utils/logging/getTimestamp.ts
  function getTimestamp() {
    const now = /* @__PURE__ */ new Date();
    return [now.getHours(), now.getMinutes(), now.getSeconds()].map(String).map((chunk) => chunk.slice(0, 2)).map((chunk) => chunk.padStart(2, "0")).join(":");
  }

  // src/core/utils/logging/serializeRequest.ts
  async function serializeRequest(request) {
    const requestClone = request.clone();
    const requestText = await requestClone.text();
    return {
      url: new URL(request.url),
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
      body: requestText
    };
  }

  // node_modules/.pnpm/@bundled-es-modules+statuses@1.0.1/node_modules/@bundled-es-modules/statuses/index-esm.js
  var __create = Object.create;
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames2(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps2 = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps2(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp2(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var require_codes = __commonJS({
    "node_modules/statuses/codes.json"(exports, module) {
      module.exports = {
        "100": "Continue",
        "101": "Switching Protocols",
        "102": "Processing",
        "103": "Early Hints",
        "200": "OK",
        "201": "Created",
        "202": "Accepted",
        "203": "Non-Authoritative Information",
        "204": "No Content",
        "205": "Reset Content",
        "206": "Partial Content",
        "207": "Multi-Status",
        "208": "Already Reported",
        "226": "IM Used",
        "300": "Multiple Choices",
        "301": "Moved Permanently",
        "302": "Found",
        "303": "See Other",
        "304": "Not Modified",
        "305": "Use Proxy",
        "307": "Temporary Redirect",
        "308": "Permanent Redirect",
        "400": "Bad Request",
        "401": "Unauthorized",
        "402": "Payment Required",
        "403": "Forbidden",
        "404": "Not Found",
        "405": "Method Not Allowed",
        "406": "Not Acceptable",
        "407": "Proxy Authentication Required",
        "408": "Request Timeout",
        "409": "Conflict",
        "410": "Gone",
        "411": "Length Required",
        "412": "Precondition Failed",
        "413": "Payload Too Large",
        "414": "URI Too Long",
        "415": "Unsupported Media Type",
        "416": "Range Not Satisfiable",
        "417": "Expectation Failed",
        "418": "I'm a Teapot",
        "421": "Misdirected Request",
        "422": "Unprocessable Entity",
        "423": "Locked",
        "424": "Failed Dependency",
        "425": "Too Early",
        "426": "Upgrade Required",
        "428": "Precondition Required",
        "429": "Too Many Requests",
        "431": "Request Header Fields Too Large",
        "451": "Unavailable For Legal Reasons",
        "500": "Internal Server Error",
        "501": "Not Implemented",
        "502": "Bad Gateway",
        "503": "Service Unavailable",
        "504": "Gateway Timeout",
        "505": "HTTP Version Not Supported",
        "506": "Variant Also Negotiates",
        "507": "Insufficient Storage",
        "508": "Loop Detected",
        "509": "Bandwidth Limit Exceeded",
        "510": "Not Extended",
        "511": "Network Authentication Required"
      };
    }
  });
  var require_statuses = __commonJS({
    "node_modules/statuses/index.js"(exports, module) {
      "use strict";
      var codes = require_codes();
      module.exports = status2;
      status2.message = codes;
      status2.code = createMessageToStatusCodeMap(codes);
      status2.codes = createStatusCodeList(codes);
      status2.redirect = {
        300: true,
        301: true,
        302: true,
        303: true,
        305: true,
        307: true,
        308: true
      };
      status2.empty = {
        204: true,
        205: true,
        304: true
      };
      status2.retry = {
        502: true,
        503: true,
        504: true
      };
      function createMessageToStatusCodeMap(codes2) {
        var map = {};
        Object.keys(codes2).forEach(function forEachCode(code) {
          var message3 = codes2[code];
          var status3 = Number(code);
          map[message3.toLowerCase()] = status3;
        });
        return map;
      }
      function createStatusCodeList(codes2) {
        return Object.keys(codes2).map(function mapCode(code) {
          return Number(code);
        });
      }
      function getStatusCode(message3) {
        var msg = message3.toLowerCase();
        if (!Object.prototype.hasOwnProperty.call(status2.code, msg)) {
          throw new Error('invalid status message: "' + message3 + '"');
        }
        return status2.code[msg];
      }
      function getStatusMessage(code) {
        if (!Object.prototype.hasOwnProperty.call(status2.message, code)) {
          throw new Error("invalid status code: " + code);
        }
        return status2.message[code];
      }
      function status2(code) {
        if (typeof code === "number") {
          return getStatusMessage(code);
        }
        if (typeof code !== "string") {
          throw new TypeError("code must be a number or string");
        }
        var n = parseInt(code, 10);
        if (!isNaN(n)) {
          return getStatusMessage(n);
        }
        return getStatusCode(code);
      }
    }
  });
  var import_statuses = __toESM(require_statuses(), 1);
  var source_default = import_statuses.default;

  // src/core/utils/logging/serializeResponse.ts
  var { message } = source_default;
  async function serializeResponse(response) {
    const responseClone = response.clone();
    const responseText = await responseClone.text();
    const responseStatus = responseClone.status || 200;
    const responseStatusText = responseClone.statusText || message[responseStatus] || "OK";
    return {
      status: responseStatus,
      statusText: responseStatusText,
      headers: Object.fromEntries(responseClone.headers.entries()),
      body: responseText
    };
  }

  // node_modules/.pnpm/path-to-regexp@6.2.1/node_modules/path-to-regexp/dist.es2015/index.js
  function lexer(str) {
    var tokens = [];
    var i = 0;
    while (i < str.length) {
      var char = str[i];
      if (char === "*" || char === "+" || char === "?") {
        tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
        continue;
      }
      if (char === "\\") {
        tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
        continue;
      }
      if (char === "{") {
        tokens.push({ type: "OPEN", index: i, value: str[i++] });
        continue;
      }
      if (char === "}") {
        tokens.push({ type: "CLOSE", index: i, value: str[i++] });
        continue;
      }
      if (char === ":") {
        var name = "";
        var j = i + 1;
        while (j < str.length) {
          var code = str.charCodeAt(j);
          if (
            // `0-9`
            code >= 48 && code <= 57 || // `A-Z`
            code >= 65 && code <= 90 || // `a-z`
            code >= 97 && code <= 122 || // `_`
            code === 95
          ) {
            name += str[j++];
            continue;
          }
          break;
        }
        if (!name)
          throw new TypeError("Missing parameter name at ".concat(i));
        tokens.push({ type: "NAME", index: i, value: name });
        i = j;
        continue;
      }
      if (char === "(") {
        var count = 1;
        var pattern = "";
        var j = i + 1;
        if (str[j] === "?") {
          throw new TypeError('Pattern cannot start with "?" at '.concat(j));
        }
        while (j < str.length) {
          if (str[j] === "\\") {
            pattern += str[j++] + str[j++];
            continue;
          }
          if (str[j] === ")") {
            count--;
            if (count === 0) {
              j++;
              break;
            }
          } else if (str[j] === "(") {
            count++;
            if (str[j + 1] !== "?") {
              throw new TypeError("Capturing groups are not allowed at ".concat(j));
            }
          }
          pattern += str[j++];
        }
        if (count)
          throw new TypeError("Unbalanced pattern at ".concat(i));
        if (!pattern)
          throw new TypeError("Missing pattern at ".concat(i));
        tokens.push({ type: "PATTERN", index: i, value: pattern });
        i = j;
        continue;
      }
      tokens.push({ type: "CHAR", index: i, value: str[i++] });
    }
    tokens.push({ type: "END", index: i, value: "" });
    return tokens;
  }
  function parse(str, options) {
    if (options === void 0) {
      options = {};
    }
    var tokens = lexer(str);
    var _a2 = options.prefixes, prefixes = _a2 === void 0 ? "./" : _a2;
    var defaultPattern = "[^".concat(escapeString(options.delimiter || "/#?"), "]+?");
    var result = [];
    var key = 0;
    var i = 0;
    var path = "";
    var tryConsume = function(type) {
      if (i < tokens.length && tokens[i].type === type)
        return tokens[i++].value;
    };
    var mustConsume = function(type) {
      var value2 = tryConsume(type);
      if (value2 !== void 0)
        return value2;
      var _a3 = tokens[i], nextType = _a3.type, index = _a3.index;
      throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
    };
    var consumeText = function() {
      var result2 = "";
      var value2;
      while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
        result2 += value2;
      }
      return result2;
    };
    while (i < tokens.length) {
      var char = tryConsume("CHAR");
      var name = tryConsume("NAME");
      var pattern = tryConsume("PATTERN");
      if (name || pattern) {
        var prefix = char || "";
        if (prefixes.indexOf(prefix) === -1) {
          path += prefix;
          prefix = "";
        }
        if (path) {
          result.push(path);
          path = "";
        }
        result.push({
          name: name || key++,
          prefix,
          suffix: "",
          pattern: pattern || defaultPattern,
          modifier: tryConsume("MODIFIER") || ""
        });
        continue;
      }
      var value = char || tryConsume("ESCAPED_CHAR");
      if (value) {
        path += value;
        continue;
      }
      if (path) {
        result.push(path);
        path = "";
      }
      var open = tryConsume("OPEN");
      if (open) {
        var prefix = consumeText();
        var name_1 = tryConsume("NAME") || "";
        var pattern_1 = tryConsume("PATTERN") || "";
        var suffix = consumeText();
        mustConsume("CLOSE");
        result.push({
          name: name_1 || (pattern_1 ? key++ : ""),
          pattern: name_1 && !pattern_1 ? defaultPattern : pattern_1,
          prefix,
          suffix,
          modifier: tryConsume("MODIFIER") || ""
        });
        continue;
      }
      mustConsume("END");
    }
    return result;
  }
  function match(str, options) {
    var keys = [];
    var re = pathToRegexp(str, keys, options);
    return regexpToFunction(re, keys, options);
  }
  function regexpToFunction(re, keys, options) {
    if (options === void 0) {
      options = {};
    }
    var _a2 = options.decode, decode = _a2 === void 0 ? function(x) {
      return x;
    } : _a2;
    return function(pathname) {
      var m = re.exec(pathname);
      if (!m)
        return false;
      var path = m[0], index = m.index;
      var params = /* @__PURE__ */ Object.create(null);
      var _loop_1 = function(i2) {
        if (m[i2] === void 0)
          return "continue";
        var key = keys[i2 - 1];
        if (key.modifier === "*" || key.modifier === "+") {
          params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
            return decode(value, key);
          });
        } else {
          params[key.name] = decode(m[i2], key);
        }
      };
      for (var i = 1; i < m.length; i++) {
        _loop_1(i);
      }
      return { path, index, params };
    };
  }
  function escapeString(str) {
    return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
  }
  function flags(options) {
    return options && options.sensitive ? "" : "i";
  }
  function regexpToRegexp(path, keys) {
    if (!keys)
      return path;
    var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
    var index = 0;
    var execResult = groupsRegex.exec(path.source);
    while (execResult) {
      keys.push({
        // Use parenthesized substring match if available, index otherwise
        name: execResult[1] || index++,
        prefix: "",
        suffix: "",
        modifier: "",
        pattern: ""
      });
      execResult = groupsRegex.exec(path.source);
    }
    return path;
  }
  function arrayToRegexp(paths, keys, options) {
    var parts = paths.map(function(path) {
      return pathToRegexp(path, keys, options).source;
    });
    return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
  }
  function stringToRegexp(path, keys, options) {
    return tokensToRegexp(parse(path, options), keys, options);
  }
  function tokensToRegexp(tokens, keys, options) {
    if (options === void 0) {
      options = {};
    }
    var _a2 = options.strict, strict = _a2 === void 0 ? false : _a2, _b2 = options.start, start = _b2 === void 0 ? true : _b2, _c2 = options.end, end = _c2 === void 0 ? true : _c2, _d = options.encode, encode = _d === void 0 ? function(x) {
      return x;
    } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
    var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
    var delimiterRe = "[".concat(escapeString(delimiter), "]");
    var route = start ? "^" : "";
    for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
      var token = tokens_1[_i];
      if (typeof token === "string") {
        route += escapeString(encode(token));
      } else {
        var prefix = escapeString(encode(token.prefix));
        var suffix = escapeString(encode(token.suffix));
        if (token.pattern) {
          if (keys)
            keys.push(token);
          if (prefix || suffix) {
            if (token.modifier === "+" || token.modifier === "*") {
              var mod = token.modifier === "*" ? "?" : "";
              route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
            } else {
              route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
            }
          } else {
            if (token.modifier === "+" || token.modifier === "*") {
              route += "((?:".concat(token.pattern, ")").concat(token.modifier, ")");
            } else {
              route += "(".concat(token.pattern, ")").concat(token.modifier);
            }
          }
        } else {
          route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
        }
      }
    }
    if (end) {
      if (!strict)
        route += "".concat(delimiterRe, "?");
      route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
    } else {
      var endToken = tokens[tokens.length - 1];
      var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
      if (!strict) {
        route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
      }
      if (!isEndDelimited) {
        route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
      }
    }
    return new RegExp(route, flags(options));
  }
  function pathToRegexp(path, keys, options) {
    if (path instanceof RegExp)
      return regexpToRegexp(path, keys);
    if (Array.isArray(path))
      return arrayToRegexp(path, keys, options);
    return stringToRegexp(path, keys, options);
  }

  // node_modules/.pnpm/@mswjs+interceptors@0.26.15/node_modules/@mswjs/interceptors/lib/browser/chunk-UJZOJSMP.mjs
  var encoder = new TextEncoder();
  function encodeBuffer(text) {
    return encoder.encode(text);
  }
  function decodeBuffer(buffer, encoding) {
    const decoder = new TextDecoder(encoding);
    return decoder.decode(buffer);
  }
  function toArrayBuffer(array) {
    return array.buffer.slice(
      array.byteOffset,
      array.byteOffset + array.byteLength
    );
  }
  var RESPONSE_STATUS_CODES_WITHOUT_BODY = /* @__PURE__ */ new Set([
    101,
    103,
    204,
    205,
    304
  ]);
  function isResponseWithoutBody(status) {
    return RESPONSE_STATUS_CODES_WITHOUT_BODY.has(status);
  }

  // node_modules/.pnpm/@mswjs+interceptors@0.26.15/node_modules/@mswjs/interceptors/lib/browser/chunk-HAGW22AN.mjs
  var IS_PATCHED_MODULE = Symbol("isPatchedModule");

  // node_modules/.pnpm/is-node-process@1.2.0/node_modules/is-node-process/lib/index.mjs
  function isNodeProcess() {
    if (typeof navigator !== "undefined" && navigator.product === "ReactNative") {
      return true;
    }
    if (typeof process !== "undefined") {
      const type = process.type;
      if (type === "renderer" || type === "worker") {
        return false;
      }
      return !!(process.versions && process.versions.node);
    }
    return false;
  }

  // node_modules/.pnpm/@open-draft+logger@0.3.0/node_modules/@open-draft/logger/lib/index.mjs
  var __defProp3 = Object.defineProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp3(target, name, { get: all[name], enumerable: true });
  };
  var colors_exports = {};
  __export2(colors_exports, {
    blue: () => blue,
    gray: () => gray,
    green: () => green,
    red: () => red,
    yellow: () => yellow
  });
  function yellow(text) {
    return `\x1B[33m${text}\x1B[0m`;
  }
  function blue(text) {
    return `\x1B[34m${text}\x1B[0m`;
  }
  function gray(text) {
    return `\x1B[90m${text}\x1B[0m`;
  }
  function red(text) {
    return `\x1B[31m${text}\x1B[0m`;
  }
  function green(text) {
    return `\x1B[32m${text}\x1B[0m`;
  }
  var IS_NODE = isNodeProcess();
  var Logger = class {
    constructor(name) {
      this.name = name;
      this.prefix = `[${this.name}]`;
      const LOGGER_NAME = getVariable("DEBUG");
      const LOGGER_LEVEL = getVariable("LOG_LEVEL");
      const isLoggingEnabled = LOGGER_NAME === "1" || LOGGER_NAME === "true" || typeof LOGGER_NAME !== "undefined" && this.name.startsWith(LOGGER_NAME);
      if (isLoggingEnabled) {
        this.debug = isDefinedAndNotEquals(LOGGER_LEVEL, "debug") ? noop : this.debug;
        this.info = isDefinedAndNotEquals(LOGGER_LEVEL, "info") ? noop : this.info;
        this.success = isDefinedAndNotEquals(LOGGER_LEVEL, "success") ? noop : this.success;
        this.warning = isDefinedAndNotEquals(LOGGER_LEVEL, "warning") ? noop : this.warning;
        this.error = isDefinedAndNotEquals(LOGGER_LEVEL, "error") ? noop : this.error;
      } else {
        this.info = noop;
        this.success = noop;
        this.warning = noop;
        this.error = noop;
        this.only = noop;
      }
    }
    prefix;
    extend(domain) {
      return new Logger(`${this.name}:${domain}`);
    }
    /**
     * Print a debug message.
     * @example
     * logger.debug('no duplicates found, creating a document...')
     */
    debug(message3, ...positionals) {
      this.logEntry({
        level: "debug",
        message: gray(message3),
        positionals,
        prefix: this.prefix,
        colors: {
          prefix: "gray"
        }
      });
    }
    /**
     * Print an info message.
     * @example
     * logger.info('start parsing...')
     */
    info(message3, ...positionals) {
      this.logEntry({
        level: "info",
        message: message3,
        positionals,
        prefix: this.prefix,
        colors: {
          prefix: "blue"
        }
      });
      const performance2 = new PerformanceEntry();
      return (message22, ...positionals2) => {
        performance2.measure();
        this.logEntry({
          level: "info",
          message: `${message22} ${gray(`${performance2.deltaTime}ms`)}`,
          positionals: positionals2,
          prefix: this.prefix,
          colors: {
            prefix: "blue"
          }
        });
      };
    }
    /**
     * Print a success message.
     * @example
     * logger.success('successfully created document')
     */
    success(message3, ...positionals) {
      this.logEntry({
        level: "info",
        message: message3,
        positionals,
        prefix: `\u2714 ${this.prefix}`,
        colors: {
          timestamp: "green",
          prefix: "green"
        }
      });
    }
    /**
     * Print a warning.
     * @example
     * logger.warning('found legacy document format')
     */
    warning(message3, ...positionals) {
      this.logEntry({
        level: "warning",
        message: message3,
        positionals,
        prefix: `\u26A0 ${this.prefix}`,
        colors: {
          timestamp: "yellow",
          prefix: "yellow"
        }
      });
    }
    /**
     * Print an error message.
     * @example
     * logger.error('something went wrong')
     */
    error(message3, ...positionals) {
      this.logEntry({
        level: "error",
        message: message3,
        positionals,
        prefix: `\u2716 ${this.prefix}`,
        colors: {
          timestamp: "red",
          prefix: "red"
        }
      });
    }
    /**
     * Execute the given callback only when the logging is enabled.
     * This is skipped in its entirety and has no runtime cost otherwise.
     * This executes regardless of the log level.
     * @example
     * logger.only(() => {
     *   logger.info('additional info')
     * })
     */
    only(callback) {
      callback();
    }
    createEntry(level, message3) {
      return {
        timestamp: /* @__PURE__ */ new Date(),
        level,
        message: message3
      };
    }
    logEntry(args) {
      const {
        level,
        message: message3,
        prefix,
        colors: customColors,
        positionals = []
      } = args;
      const entry = this.createEntry(level, message3);
      const timestampColor = customColors?.timestamp || "gray";
      const prefixColor = customColors?.prefix || "gray";
      const colorize = {
        timestamp: colors_exports[timestampColor],
        prefix: colors_exports[prefixColor]
      };
      const write = this.getWriter(level);
      write(
        [colorize.timestamp(this.formatTimestamp(entry.timestamp))].concat(prefix != null ? colorize.prefix(prefix) : []).concat(serializeInput(message3)).join(" "),
        ...positionals.map(serializeInput)
      );
    }
    formatTimestamp(timestamp) {
      return `${timestamp.toLocaleTimeString(
        "en-GB"
      )}:${timestamp.getMilliseconds()}`;
    }
    getWriter(level) {
      switch (level) {
        case "debug":
        case "success":
        case "info": {
          return log;
        }
        case "warning": {
          return warn2;
        }
        case "error": {
          return error2;
        }
      }
    }
  };
  var PerformanceEntry = class {
    startTime;
    endTime;
    deltaTime;
    constructor() {
      this.startTime = performance.now();
    }
    measure() {
      this.endTime = performance.now();
      const deltaTime = this.endTime - this.startTime;
      this.deltaTime = deltaTime.toFixed(2);
    }
  };
  var noop = () => void 0;
  function log(message3, ...positionals) {
    if (IS_NODE) {
      process.stdout.write(format(message3, ...positionals) + "\n");
      return;
    }
    console.log(message3, ...positionals);
  }
  function warn2(message3, ...positionals) {
    if (IS_NODE) {
      process.stderr.write(format(message3, ...positionals) + "\n");
      return;
    }
    console.warn(message3, ...positionals);
  }
  function error2(message3, ...positionals) {
    if (IS_NODE) {
      process.stderr.write(format(message3, ...positionals) + "\n");
      return;
    }
    console.error(message3, ...positionals);
  }
  function getVariable(variableName) {
    if (IS_NODE) {
      return process.env[variableName];
    }
    return globalThis[variableName]?.toString();
  }
  function isDefinedAndNotEquals(value, expected) {
    return value !== void 0 && value !== expected;
  }
  function serializeInput(message3) {
    if (typeof message3 === "undefined") {
      return "undefined";
    }
    if (message3 === null) {
      return "null";
    }
    if (typeof message3 === "string") {
      return message3;
    }
    if (typeof message3 === "object") {
      return JSON.stringify(message3);
    }
    return message3.toString();
  }

  // node_modules/.pnpm/@mswjs+interceptors@0.26.15/node_modules/@mswjs/interceptors/lib/browser/chunk-QED3Q6Z2.mjs
  var INTERNAL_REQUEST_ID_HEADER_NAME = "x-interceptors-internal-request-id";
  function getGlobalSymbol(symbol) {
    return (
      // @ts-ignore https://github.com/Microsoft/TypeScript/issues/24587
      globalThis[symbol] || void 0
    );
  }
  function setGlobalSymbol(symbol, value) {
    globalThis[symbol] = value;
  }
  function deleteGlobalSymbol(symbol) {
    delete globalThis[symbol];
  }
  var Interceptor = class {
    constructor(symbol) {
      this.symbol = symbol;
      this.readyState = "INACTIVE";
      this.emitter = new Emitter();
      this.subscriptions = [];
      this.logger = new Logger(symbol.description);
      this.emitter.setMaxListeners(0);
      this.logger.info("constructing the interceptor...");
    }
    /**
     * Determine if this interceptor can be applied
     * in the current environment.
     */
    checkEnvironment() {
      return true;
    }
    /**
     * Apply this interceptor to the current process.
     * Returns an already running interceptor instance if it's present.
     */
    apply() {
      const logger = this.logger.extend("apply");
      logger.info("applying the interceptor...");
      if (this.readyState === "APPLIED") {
        logger.info("intercepted already applied!");
        return;
      }
      const shouldApply = this.checkEnvironment();
      if (!shouldApply) {
        logger.info("the interceptor cannot be applied in this environment!");
        return;
      }
      this.readyState = "APPLYING";
      const runningInstance = this.getInstance();
      if (runningInstance) {
        logger.info("found a running instance, reusing...");
        this.on = (event, listener) => {
          logger.info('proxying the "%s" listener', event);
          runningInstance.emitter.addListener(event, listener);
          this.subscriptions.push(() => {
            runningInstance.emitter.removeListener(event, listener);
            logger.info('removed proxied "%s" listener!', event);
          });
          return this;
        };
        this.readyState = "APPLIED";
        return;
      }
      logger.info("no running instance found, setting up a new instance...");
      this.setup();
      this.setInstance();
      this.readyState = "APPLIED";
    }
    /**
     * Setup the module augments and stubs necessary for this interceptor.
     * This method is not run if there's a running interceptor instance
     * to prevent instantiating an interceptor multiple times.
     */
    setup() {
    }
    /**
     * Listen to the interceptor's public events.
     */
    on(event, listener) {
      const logger = this.logger.extend("on");
      if (this.readyState === "DISPOSING" || this.readyState === "DISPOSED") {
        logger.info("cannot listen to events, already disposed!");
        return this;
      }
      logger.info('adding "%s" event listener:', event, listener);
      this.emitter.on(event, listener);
      return this;
    }
    once(event, listener) {
      this.emitter.once(event, listener);
      return this;
    }
    off(event, listener) {
      this.emitter.off(event, listener);
      return this;
    }
    removeAllListeners(event) {
      this.emitter.removeAllListeners(event);
      return this;
    }
    /**
     * Disposes of any side-effects this interceptor has introduced.
     */
    dispose() {
      const logger = this.logger.extend("dispose");
      if (this.readyState === "DISPOSED") {
        logger.info("cannot dispose, already disposed!");
        return;
      }
      logger.info("disposing the interceptor...");
      this.readyState = "DISPOSING";
      if (!this.getInstance()) {
        logger.info("no interceptors running, skipping dispose...");
        return;
      }
      this.clearInstance();
      logger.info("global symbol deleted:", getGlobalSymbol(this.symbol));
      if (this.subscriptions.length > 0) {
        logger.info("disposing of %d subscriptions...", this.subscriptions.length);
        for (const dispose of this.subscriptions) {
          dispose();
        }
        this.subscriptions = [];
        logger.info("disposed of all subscriptions!", this.subscriptions.length);
      }
      this.emitter.removeAllListeners();
      logger.info("destroyed the listener!");
      this.readyState = "DISPOSED";
    }
    getInstance() {
      var _a2;
      const instance = getGlobalSymbol(this.symbol);
      this.logger.info("retrieved global instance:", (_a2 = instance == null ? void 0 : instance.constructor) == null ? void 0 : _a2.name);
      return instance;
    }
    setInstance() {
      setGlobalSymbol(this.symbol, this);
      this.logger.info("set global instance!", this.symbol.description);
    }
    clearInstance() {
      deleteGlobalSymbol(this.symbol);
      this.logger.info("cleared global instance!", this.symbol.description);
    }
  };
  function createRequestId() {
    return Math.random().toString(16).slice(2);
  }

  // node_modules/.pnpm/@mswjs+interceptors@0.26.15/node_modules/@mswjs/interceptors/lib/browser/index.mjs
  var BatchInterceptor = class extends Interceptor {
    constructor(options) {
      BatchInterceptor.symbol = Symbol(options.name);
      super(BatchInterceptor.symbol);
      this.interceptors = options.interceptors;
    }
    setup() {
      const logger = this.logger.extend("setup");
      logger.info("applying all %d interceptors...", this.interceptors.length);
      for (const interceptor of this.interceptors) {
        logger.info('applying "%s" interceptor...', interceptor.constructor.name);
        interceptor.apply();
        logger.info("adding interceptor dispose subscription");
        this.subscriptions.push(() => interceptor.dispose());
      }
    }
    on(event, listener) {
      for (const interceptor of this.interceptors) {
        interceptor.on(event, listener);
      }
      return this;
    }
    once(event, listener) {
      for (const interceptor of this.interceptors) {
        interceptor.once(event, listener);
      }
      return this;
    }
    off(event, listener) {
      for (const interceptor of this.interceptors) {
        interceptor.off(event, listener);
      }
      return this;
    }
    removeAllListeners(event) {
      for (const interceptors of this.interceptors) {
        interceptors.removeAllListeners(event);
      }
      return this;
    }
  };
  function getCleanUrl(url, isAbsolute = true) {
    return [isAbsolute && url.origin, url.pathname].filter(Boolean).join("");
  }

  // src/core/utils/url/cleanUrl.ts
  var REDUNDANT_CHARACTERS_EXP = /[\?|#].*$/g;
  function getSearchParams(path) {
    return new URL(`/${path}`, "http://localhost").searchParams;
  }
  function cleanUrl(path) {
    return path.replace(REDUNDANT_CHARACTERS_EXP, "");
  }

  // src/core/utils/url/isAbsoluteUrl.ts
  function isAbsoluteUrl(url) {
    return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
  }

  // src/core/utils/url/getAbsoluteUrl.ts
  function getAbsoluteUrl(path, baseUrl) {
    if (isAbsoluteUrl(path)) {
      return path;
    }
    if (path.startsWith("*")) {
      return path;
    }
    const origin = baseUrl || typeof document !== "undefined" && document.baseURI;
    return origin ? (
      // Encode and decode the path to preserve escaped characters.
      decodeURI(new URL(encodeURI(path), origin).href)
    ) : path;
  }

  // src/core/utils/matching/normalizePath.ts
  function normalizePath(path, baseUrl) {
    if (path instanceof RegExp) {
      return path;
    }
    const maybeAbsoluteUrl = getAbsoluteUrl(path, baseUrl);
    return cleanUrl(maybeAbsoluteUrl);
  }

  // src/core/utils/matching/matchRequestUrl.ts
  function coercePath(path) {
    return path.replace(
      /([:a-zA-Z_-]*)(\*{1,2})+/g,
      (_, parameterName, wildcard) => {
        const expression = "(.*)";
        if (!parameterName) {
          return expression;
        }
        return parameterName.startsWith(":") ? `${parameterName}${wildcard}` : `${parameterName}${expression}`;
      }
    ).replace(/([^\/])(:)(?=\d+)/, "$1\\$2").replace(/^([^\/]+)(:)(?=\/\/)/, "$1\\$2");
  }
  function matchRequestUrl(url, path, baseUrl) {
    const normalizedPath = normalizePath(path, baseUrl);
    const cleanPath = typeof normalizedPath === "string" ? coercePath(normalizedPath) : normalizedPath;
    const cleanUrl2 = getCleanUrl(url);
    const result = match(cleanPath, { decode: decodeURIComponent })(cleanUrl2);
    const params = result && result.params || {};
    return {
      matches: result !== false,
      params
    };
  }

  // src/core/utils/request/toPublicUrl.ts
  function toPublicUrl(url) {
    if (typeof location === "undefined") {
      return url.toString();
    }
    const urlInstance = url instanceof URL ? url : new URL(url);
    return urlInstance.origin === location.origin ? urlInstance.pathname : urlInstance.origin + urlInstance.pathname;
  }

  // node_modules/.pnpm/@bundled-es-modules+cookie@2.0.0/node_modules/@bundled-es-modules/cookie/index-esm.js
  var __create2 = Object.create;
  var __defProp4 = Object.defineProperty;
  var __getOwnPropDesc3 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames3 = Object.getOwnPropertyNames;
  var __getProtoOf2 = Object.getPrototypeOf;
  var __hasOwnProp3 = Object.prototype.hasOwnProperty;
  var __commonJS2 = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames3(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps3 = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames3(from))
        if (!__hasOwnProp3.call(to, key) && key !== except)
          __defProp4(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc3(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM2 = (mod, isNodeMode, target) => (target = mod != null ? __create2(__getProtoOf2(mod)) : {}, __copyProps3(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp4(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var require_cookie = __commonJS2({
    "node_modules/cookie/index.js"(exports) {
      "use strict";
      exports.parse = parse3;
      exports.serialize = serialize;
      var __toString = Object.prototype.toString;
      var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
      function parse3(str, options) {
        if (typeof str !== "string") {
          throw new TypeError("argument str must be a string");
        }
        var obj = {};
        var opt = options || {};
        var dec = opt.decode || decode;
        var index = 0;
        while (index < str.length) {
          var eqIdx = str.indexOf("=", index);
          if (eqIdx === -1) {
            break;
          }
          var endIdx = str.indexOf(";", index);
          if (endIdx === -1) {
            endIdx = str.length;
          } else if (endIdx < eqIdx) {
            index = str.lastIndexOf(";", eqIdx - 1) + 1;
            continue;
          }
          var key = str.slice(index, eqIdx).trim();
          if (void 0 === obj[key]) {
            var val = str.slice(eqIdx + 1, endIdx).trim();
            if (val.charCodeAt(0) === 34) {
              val = val.slice(1, -1);
            }
            obj[key] = tryDecode(val, dec);
          }
          index = endIdx + 1;
        }
        return obj;
      }
      function serialize(name, val, options) {
        var opt = options || {};
        var enc = opt.encode || encode;
        if (typeof enc !== "function") {
          throw new TypeError("option encode is invalid");
        }
        if (!fieldContentRegExp.test(name)) {
          throw new TypeError("argument name is invalid");
        }
        var value = enc(val);
        if (value && !fieldContentRegExp.test(value)) {
          throw new TypeError("argument val is invalid");
        }
        var str = name + "=" + value;
        if (null != opt.maxAge) {
          var maxAge = opt.maxAge - 0;
          if (isNaN(maxAge) || !isFinite(maxAge)) {
            throw new TypeError("option maxAge is invalid");
          }
          str += "; Max-Age=" + Math.floor(maxAge);
        }
        if (opt.domain) {
          if (!fieldContentRegExp.test(opt.domain)) {
            throw new TypeError("option domain is invalid");
          }
          str += "; Domain=" + opt.domain;
        }
        if (opt.path) {
          if (!fieldContentRegExp.test(opt.path)) {
            throw new TypeError("option path is invalid");
          }
          str += "; Path=" + opt.path;
        }
        if (opt.expires) {
          var expires = opt.expires;
          if (!isDate(expires) || isNaN(expires.valueOf())) {
            throw new TypeError("option expires is invalid");
          }
          str += "; Expires=" + expires.toUTCString();
        }
        if (opt.httpOnly) {
          str += "; HttpOnly";
        }
        if (opt.secure) {
          str += "; Secure";
        }
        if (opt.priority) {
          var priority = typeof opt.priority === "string" ? opt.priority.toLowerCase() : opt.priority;
          switch (priority) {
            case "low":
              str += "; Priority=Low";
              break;
            case "medium":
              str += "; Priority=Medium";
              break;
            case "high":
              str += "; Priority=High";
              break;
            default:
              throw new TypeError("option priority is invalid");
          }
        }
        if (opt.sameSite) {
          var sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
          switch (sameSite) {
            case true:
              str += "; SameSite=Strict";
              break;
            case "lax":
              str += "; SameSite=Lax";
              break;
            case "strict":
              str += "; SameSite=Strict";
              break;
            case "none":
              str += "; SameSite=None";
              break;
            default:
              throw new TypeError("option sameSite is invalid");
          }
        }
        return str;
      }
      function decode(str) {
        return str.indexOf("%") !== -1 ? decodeURIComponent(str) : str;
      }
      function encode(val) {
        return encodeURIComponent(val);
      }
      function isDate(val) {
        return __toString.call(val) === "[object Date]" || val instanceof Date;
      }
      function tryDecode(str, decode2) {
        try {
          return decode2(str);
        } catch (e) {
          return str;
        }
      }
    }
  });
  var import_cookie = __toESM2(require_cookie(), 1);
  var source_default2 = import_cookie.default;

  // node_modules/.pnpm/@mswjs+cookies@1.1.0/node_modules/@mswjs/cookies/lib/index.mjs
  var __create3 = Object.create;
  var __defProp5 = Object.defineProperty;
  var __getOwnPropDesc4 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames4 = Object.getOwnPropertyNames;
  var __getProtoOf3 = Object.getPrototypeOf;
  var __hasOwnProp4 = Object.prototype.hasOwnProperty;
  var __commonJS3 = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames4(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps4 = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames4(from))
        if (!__hasOwnProp4.call(to, key) && key !== except)
          __defProp5(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc4(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM3 = (mod, isNodeMode, target) => (target = mod != null ? __create3(__getProtoOf3(mod)) : {}, __copyProps4(
    isNodeMode || !mod || !mod.__esModule ? __defProp5(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var require_set_cookie = __commonJS3({
    "node_modules/set-cookie-parser/lib/set-cookie.js"(exports, module) {
      "use strict";
      var defaultParseOptions = {
        decodeValues: true,
        map: false,
        silent: false
      };
      function isNonEmptyString(str) {
        return typeof str === "string" && !!str.trim();
      }
      function parseString(setCookieValue, options) {
        var parts = setCookieValue.split(";").filter(isNonEmptyString);
        var nameValuePairStr = parts.shift();
        var parsed = parseNameValuePair(nameValuePairStr);
        var name = parsed.name;
        var value = parsed.value;
        options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
        try {
          value = options.decodeValues ? decodeURIComponent(value) : value;
        } catch (e) {
          console.error(
            "set-cookie-parser encountered an error while decoding a cookie with value '" + value + "'. Set options.decodeValues to false to disable this feature.",
            e
          );
        }
        var cookie = {
          name,
          value
        };
        parts.forEach(function(part) {
          var sides = part.split("=");
          var key = sides.shift().trimLeft().toLowerCase();
          var value2 = sides.join("=");
          if (key === "expires") {
            cookie.expires = new Date(value2);
          } else if (key === "max-age") {
            cookie.maxAge = parseInt(value2, 10);
          } else if (key === "secure") {
            cookie.secure = true;
          } else if (key === "httponly") {
            cookie.httpOnly = true;
          } else if (key === "samesite") {
            cookie.sameSite = value2;
          } else {
            cookie[key] = value2;
          }
        });
        return cookie;
      }
      function parseNameValuePair(nameValuePairStr) {
        var name = "";
        var value = "";
        var nameValueArr = nameValuePairStr.split("=");
        if (nameValueArr.length > 1) {
          name = nameValueArr.shift();
          value = nameValueArr.join("=");
        } else {
          value = nameValuePairStr;
        }
        return { name, value };
      }
      function parse3(input, options) {
        options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
        if (!input) {
          if (!options.map) {
            return [];
          } else {
            return {};
          }
        }
        if (input.headers) {
          if (typeof input.headers.getSetCookie === "function") {
            input = input.headers.getSetCookie();
          } else if (input.headers["set-cookie"]) {
            input = input.headers["set-cookie"];
          } else {
            var sch = input.headers[Object.keys(input.headers).find(function(key) {
              return key.toLowerCase() === "set-cookie";
            })];
            if (!sch && input.headers.cookie && !options.silent) {
              console.warn(
                "Warning: set-cookie-parser appears to have been called on a request object. It is designed to parse Set-Cookie headers from responses, not Cookie headers from requests. Set the option {silent: true} to suppress this warning."
              );
            }
            input = sch;
          }
        }
        if (!Array.isArray(input)) {
          input = [input];
        }
        options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
        if (!options.map) {
          return input.filter(isNonEmptyString).map(function(str) {
            return parseString(str, options);
          });
        } else {
          var cookies = {};
          return input.filter(isNonEmptyString).reduce(function(cookies2, str) {
            var cookie = parseString(str, options);
            cookies2[cookie.name] = cookie;
            return cookies2;
          }, cookies);
        }
      }
      function splitCookiesString(cookiesString) {
        if (Array.isArray(cookiesString)) {
          return cookiesString;
        }
        if (typeof cookiesString !== "string") {
          return [];
        }
        var cookiesStrings = [];
        var pos = 0;
        var start;
        var ch;
        var lastComma;
        var nextStart;
        var cookiesSeparatorFound;
        function skipWhitespace() {
          while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
            pos += 1;
          }
          return pos < cookiesString.length;
        }
        function notSpecialChar() {
          ch = cookiesString.charAt(pos);
          return ch !== "=" && ch !== ";" && ch !== ",";
        }
        while (pos < cookiesString.length) {
          start = pos;
          cookiesSeparatorFound = false;
          while (skipWhitespace()) {
            ch = cookiesString.charAt(pos);
            if (ch === ",") {
              lastComma = pos;
              pos += 1;
              skipWhitespace();
              nextStart = pos;
              while (pos < cookiesString.length && notSpecialChar()) {
                pos += 1;
              }
              if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
                cookiesSeparatorFound = true;
                pos = nextStart;
                cookiesStrings.push(cookiesString.substring(start, lastComma));
                start = pos;
              } else {
                pos = lastComma + 1;
              }
            } else {
              pos += 1;
            }
          }
          if (!cookiesSeparatorFound || pos >= cookiesString.length) {
            cookiesStrings.push(cookiesString.substring(start, cookiesString.length));
          }
        }
        return cookiesStrings;
      }
      module.exports = parse3;
      module.exports.parse = parse3;
      module.exports.parseString = parseString;
      module.exports.splitCookiesString = splitCookiesString;
    }
  });
  var import_set_cookie_parser = __toESM3(require_set_cookie());
  var PERSISTENCY_KEY = "MSW_COOKIE_STORE";
  function supportsLocalStorage() {
    try {
      if (localStorage == null) {
        return false;
      }
      const testKey = PERSISTENCY_KEY + "_test";
      localStorage.setItem(testKey, "test");
      localStorage.getItem(testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (error3) {
      return false;
    }
  }
  function isPropertyAccessible(object, method) {
    try {
      object[method];
      return true;
    } catch {
      return false;
    }
  }
  var CookieStore = class {
    constructor() {
      this.store = /* @__PURE__ */ new Map();
    }
    add(request, response) {
      if (isPropertyAccessible(request, "credentials") && request.credentials === "omit") {
        return;
      }
      const requestUrl = new URL(request.url);
      const responseCookies = response.headers.get("set-cookie");
      if (!responseCookies) {
        return;
      }
      const now = Date.now();
      const parsedResponseCookies = (0, import_set_cookie_parser.parse)(responseCookies).map(
        ({ maxAge, ...cookie }) => ({
          ...cookie,
          expires: maxAge === void 0 ? cookie.expires : new Date(now + maxAge * 1e3),
          maxAge
        })
      );
      const prevCookies = this.store.get(requestUrl.origin) || /* @__PURE__ */ new Map();
      parsedResponseCookies.forEach((cookie) => {
        this.store.set(requestUrl.origin, prevCookies.set(cookie.name, cookie));
      });
    }
    get(request) {
      this.deleteExpiredCookies();
      const requestUrl = new URL(request.url);
      const originCookies = this.store.get(requestUrl.origin) || /* @__PURE__ */ new Map();
      if (!isPropertyAccessible(request, "credentials")) {
        return originCookies;
      }
      switch (request.credentials) {
        case "include": {
          if (typeof document === "undefined") {
            return originCookies;
          }
          const documentCookies = (0, import_set_cookie_parser.parse)(document.cookie);
          documentCookies.forEach((cookie) => {
            originCookies.set(cookie.name, cookie);
          });
          return originCookies;
        }
        case "same-origin": {
          return originCookies;
        }
        default:
          return /* @__PURE__ */ new Map();
      }
    }
    getAll() {
      this.deleteExpiredCookies();
      return this.store;
    }
    deleteAll(request) {
      const requestUrl = new URL(request.url);
      this.store.delete(requestUrl.origin);
    }
    clear() {
      this.store.clear();
    }
    hydrate() {
      if (!supportsLocalStorage()) {
        return;
      }
      const persistedCookies = localStorage.getItem(PERSISTENCY_KEY);
      if (!persistedCookies) {
        return;
      }
      try {
        const parsedCookies = JSON.parse(persistedCookies);
        parsedCookies.forEach(([origin, cookies]) => {
          this.store.set(
            origin,
            new Map(
              cookies.map(([token, { expires, ...cookie }]) => [
                token,
                expires === void 0 ? cookie : { ...cookie, expires: new Date(expires) }
              ])
            )
          );
        });
      } catch (error3) {
        console.warn(`
[virtual-cookie] Failed to parse a stored cookie from the localStorage (key "${PERSISTENCY_KEY}").

Stored value:
${localStorage.getItem(PERSISTENCY_KEY)}

Thrown exception:
${error3}

Invalid value has been removed from localStorage to prevent subsequent failed parsing attempts.`);
        localStorage.removeItem(PERSISTENCY_KEY);
      }
    }
    persist() {
      if (!supportsLocalStorage()) {
        return;
      }
      const serializedCookies = Array.from(this.store.entries()).map(
        ([origin, cookies]) => {
          return [origin, Array.from(cookies.entries())];
        }
      );
      localStorage.setItem(PERSISTENCY_KEY, JSON.stringify(serializedCookies));
    }
    deleteExpiredCookies() {
      const now = Date.now();
      this.store.forEach((originCookies, origin) => {
        originCookies.forEach(({ expires, name }) => {
          if (expires !== void 0 && expires.getTime() <= now) {
            originCookies.delete(name);
          }
        });
        if (originCookies.size === 0) {
          this.store.delete(origin);
        }
      });
    }
  };
  var store = new CookieStore();

  // src/core/utils/request/getRequestCookies.ts
  function getAllDocumentCookies() {
    return source_default2.parse(document.cookie);
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
    const cookiesFromHeaders = requestCookiesString ? source_default2.parse(requestCookiesString) : {};
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
      request.headers.append("cookie", source_default2.serialize(name, value));
    }
    return {
      ...forwardedCookies,
      ...cookiesFromHeaders
    };
  }

  // src/core/handlers/HttpHandler.ts
  var HttpMethods = /* @__PURE__ */ ((HttpMethods2) => {
    HttpMethods2["HEAD"] = "HEAD";
    HttpMethods2["GET"] = "GET";
    HttpMethods2["POST"] = "POST";
    HttpMethods2["PUT"] = "PUT";
    HttpMethods2["PATCH"] = "PATCH";
    HttpMethods2["OPTIONS"] = "OPTIONS";
    HttpMethods2["DELETE"] = "DELETE";
    return HttpMethods2;
  })(HttpMethods || {});
  var HttpHandler = class extends RequestHandler {
    constructor(method, path, resolver, options) {
      super({
        info: {
          header: `${method} ${path}`,
          path,
          method
        },
        resolver,
        options
      });
      this.checkRedundantQueryParameters();
    }
    checkRedundantQueryParameters() {
      const { method, path } = this.info;
      if (path instanceof RegExp) {
        return;
      }
      const url = cleanUrl(path);
      if (url === path) {
        return;
      }
      const searchParams = getSearchParams(path);
      const queryParams = [];
      searchParams.forEach((_, paramName) => {
        queryParams.push(paramName);
      });
      devUtils.warn(
        `Found a redundant usage of query parameters in the request handler URL for "${method} ${path}". Please match against a path instead and access query parameters using "new URL(request.url).searchParams" instead. Learn more: https://mswjs.io/docs/recipes/query-parameters`
      );
    }
    async parse(args) {
      const url = new URL(args.request.url);
      const match2 = matchRequestUrl(
        url,
        this.info.path,
        args.resolutionContext?.baseUrl
      );
      const cookies = getAllRequestCookies(args.request);
      return {
        match: match2,
        cookies
      };
    }
    predicate(args) {
      const hasMatchingMethod = this.matchMethod(args.request.method);
      const hasMatchingUrl = args.parsedResult.match.matches;
      return hasMatchingMethod && hasMatchingUrl;
    }
    matchMethod(actualMethod) {
      return this.info.method instanceof RegExp ? this.info.method.test(actualMethod) : isStringEqual(this.info.method, actualMethod);
    }
    extendResolverArgs(args) {
      return {
        params: args.parsedResult.match?.params || {},
        cookies: args.parsedResult.cookies
      };
    }
    async log(args) {
      const publicUrl = toPublicUrl(args.request.url);
      const loggedRequest = await serializeRequest(args.request);
      const loggedResponse = await serializeResponse(args.response);
      const statusColor = getStatusCodeColor(loggedResponse.status);
      console.groupCollapsed(
        devUtils.formatMessage(
          `${getTimestamp()} ${args.request.method} ${publicUrl} (%c${loggedResponse.status} ${loggedResponse.statusText}%c)`
        ),
        `color:${statusColor}`,
        "color:inherit"
      );
      console.log("Request", loggedRequest);
      console.log("Handler:", this);
      console.log("Response", loggedResponse);
      console.groupEnd();
    }
  };

  // src/core/http.ts
  function createHttpHandler(method) {
    return (path, resolver, options = {}) => {
      return new HttpHandler(method, path, resolver, options);
    };
  }
  var http = {
    all: createHttpHandler(/.+/),
    head: createHttpHandler("HEAD" /* HEAD */),
    get: createHttpHandler("GET" /* GET */),
    post: createHttpHandler("POST" /* POST */),
    put: createHttpHandler("PUT" /* PUT */),
    delete: createHttpHandler("DELETE" /* DELETE */),
    patch: createHttpHandler("PATCH" /* PATCH */),
    options: createHttpHandler("OPTIONS" /* OPTIONS */)
  };

  // node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/devAssert.mjs
  function devAssert(condition, message3) {
    const booleanCondition = Boolean(condition);
    if (!booleanCondition) {
      throw new Error(message3);
    }
  }

  // node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/isObjectLike.mjs
  function isObjectLike(value) {
    return typeof value == "object" && value !== null;
  }

  // node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/invariant.mjs
  function invariant2(condition, message3) {
    const booleanCondition = Boolean(condition);
    if (!booleanCondition) {
      throw new Error(
        message3 != null ? message3 : "Unexpected invariant triggered."
      );
    }
  }

  // node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/location.mjs
  var LineRegExp = /\r\n|[\n\r]/g;
  function getLocation(source, position) {
    let lastLineStart = 0;
    let line = 1;
    for (const match2 of source.body.matchAll(LineRegExp)) {
      typeof match2.index === "number" || invariant2(false);
      if (match2.index >= position) {
        break;
      }
      lastLineStart = match2.index + match2[0].length;
      line += 1;
    }
    return {
      line,
      column: position + 1 - lastLineStart
    };
  }

  // node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/printLocation.mjs
  function printLocation(location2) {
    return printSourceLocation(
      location2.source,
      getLocation(location2.source, location2.start)
    );
  }
  function printSourceLocation(source, sourceLocation) {
    const firstLineColumnOffset = source.locationOffset.column - 1;
    const body = "".padStart(firstLineColumnOffset) + source.body;
    const lineIndex = sourceLocation.line - 1;
    const lineOffset = source.locationOffset.line - 1;
    const lineNum = sourceLocation.line + lineOffset;
    const columnOffset = sourceLocation.line === 1 ? firstLineColumnOffset : 0;
    const columnNum = sourceLocation.column + columnOffset;
    const locationStr = `${source.name}:${lineNum}:${columnNum}
`;
    const lines = body.split(/\r\n|[\n\r]/g);
    const locationLine = lines[lineIndex];
    if (locationLine.length > 120) {
      const subLineIndex = Math.floor(columnNum / 80);
      const subLineColumnNum = columnNum % 80;
      const subLines = [];
      for (let i = 0; i < locationLine.length; i += 80) {
        subLines.push(locationLine.slice(i, i + 80));
      }
      return locationStr + printPrefixedLines([
        [`${lineNum} |`, subLines[0]],
        ...subLines.slice(1, subLineIndex + 1).map((subLine) => ["|", subLine]),
        ["|", "^".padStart(subLineColumnNum)],
        ["|", subLines[subLineIndex + 1]]
      ]);
    }
    return locationStr + printPrefixedLines([
      // Lines specified like this: ["prefix", "string"],
      [`${lineNum - 1} |`, lines[lineIndex - 1]],
      [`${lineNum} |`, locationLine],
      ["|", "^".padStart(columnNum)],
      [`${lineNum + 1} |`, lines[lineIndex + 1]]
    ]);
  }
  function printPrefixedLines(lines) {
    const existingLines = lines.filter(([_, line]) => line !== void 0);
    const padLen = Math.max(...existingLines.map(([prefix]) => prefix.length));
    return existingLines.map(([prefix, line]) => prefix.padStart(padLen) + (line ? " " + line : "")).join("\n");
  }

  // node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/GraphQLError.mjs
  function toNormalizedOptions(args) {
    const firstArg = args[0];
    if (firstArg == null || "kind" in firstArg || "length" in firstArg) {
      return {
        nodes: firstArg,
        source: args[1],
        positions: args[2],
        path: args[3],
        originalError: args[4],
        extensions: args[5]
      };
    }
    return firstArg;
  }
  var GraphQLError = class _GraphQLError extends Error {
    /**
     * An array of `{ line, column }` locations within the source GraphQL document
     * which correspond to this error.
     *
     * Errors during validation often contain multiple locations, for example to
     * point out two things with the same name. Errors during execution include a
     * single location, the field which produced the error.
     *
     * Enumerable, and appears in the result of JSON.stringify().
     */
    /**
     * An array describing the JSON-path into the execution response which
     * corresponds to this error. Only included for errors during execution.
     *
     * Enumerable, and appears in the result of JSON.stringify().
     */
    /**
     * An array of GraphQL AST Nodes corresponding to this error.
     */
    /**
     * The source GraphQL document for the first location of this error.
     *
     * Note that if this Error represents more than one node, the source may not
     * represent nodes after the first node.
     */
    /**
     * An array of character offsets within the source GraphQL document
     * which correspond to this error.
     */
    /**
     * The original error thrown from a field resolver during execution.
     */
    /**
     * Extension fields to add to the formatted error.
     */
    /**
     * @deprecated Please use the `GraphQLErrorOptions` constructor overload instead.
     */
    constructor(message3, ...rawArgs) {
      var _this$nodes, _nodeLocations$, _ref;
      const { nodes, source, positions, path, originalError, extensions } = toNormalizedOptions(rawArgs);
      super(message3);
      this.name = "GraphQLError";
      this.path = path !== null && path !== void 0 ? path : void 0;
      this.originalError = originalError !== null && originalError !== void 0 ? originalError : void 0;
      this.nodes = undefinedIfEmpty(
        Array.isArray(nodes) ? nodes : nodes ? [nodes] : void 0
      );
      const nodeLocations = undefinedIfEmpty(
        (_this$nodes = this.nodes) === null || _this$nodes === void 0 ? void 0 : _this$nodes.map((node) => node.loc).filter((loc) => loc != null)
      );
      this.source = source !== null && source !== void 0 ? source : nodeLocations === null || nodeLocations === void 0 ? void 0 : (_nodeLocations$ = nodeLocations[0]) === null || _nodeLocations$ === void 0 ? void 0 : _nodeLocations$.source;
      this.positions = positions !== null && positions !== void 0 ? positions : nodeLocations === null || nodeLocations === void 0 ? void 0 : nodeLocations.map((loc) => loc.start);
      this.locations = positions && source ? positions.map((pos) => getLocation(source, pos)) : nodeLocations === null || nodeLocations === void 0 ? void 0 : nodeLocations.map((loc) => getLocation(loc.source, loc.start));
      const originalExtensions = isObjectLike(
        originalError === null || originalError === void 0 ? void 0 : originalError.extensions
      ) ? originalError === null || originalError === void 0 ? void 0 : originalError.extensions : void 0;
      this.extensions = (_ref = extensions !== null && extensions !== void 0 ? extensions : originalExtensions) !== null && _ref !== void 0 ? _ref : /* @__PURE__ */ Object.create(null);
      Object.defineProperties(this, {
        message: {
          writable: true,
          enumerable: true
        },
        name: {
          enumerable: false
        },
        nodes: {
          enumerable: false
        },
        source: {
          enumerable: false
        },
        positions: {
          enumerable: false
        },
        originalError: {
          enumerable: false
        }
      });
      if (originalError !== null && originalError !== void 0 && originalError.stack) {
        Object.defineProperty(this, "stack", {
          value: originalError.stack,
          writable: true,
          configurable: true
        });
      } else if (Error.captureStackTrace) {
        Error.captureStackTrace(this, _GraphQLError);
      } else {
        Object.defineProperty(this, "stack", {
          value: Error().stack,
          writable: true,
          configurable: true
        });
      }
    }
    get [Symbol.toStringTag]() {
      return "GraphQLError";
    }
    toString() {
      let output = this.message;
      if (this.nodes) {
        for (const node of this.nodes) {
          if (node.loc) {
            output += "\n\n" + printLocation(node.loc);
          }
        }
      } else if (this.source && this.locations) {
        for (const location2 of this.locations) {
          output += "\n\n" + printSourceLocation(this.source, location2);
        }
      }
      return output;
    }
    toJSON() {
      const formattedError = {
        message: this.message
      };
      if (this.locations != null) {
        formattedError.locations = this.locations;
      }
      if (this.path != null) {
        formattedError.path = this.path;
      }
      if (this.extensions != null && Object.keys(this.extensions).length > 0) {
        formattedError.extensions = this.extensions;
      }
      return formattedError;
    }
  };
  function undefinedIfEmpty(array) {
    return array === void 0 || array.length === 0 ? void 0 : array;
  }

  // node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/error/syntaxError.mjs
  function syntaxError(source, position, description) {
    return new GraphQLError(`Syntax Error: ${description}`, {
      source,
      positions: [position]
    });
  }

  // node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/ast.mjs
  var Location = class {
    /**
     * The character offset at which this Node begins.
     */
    /**
     * The character offset at which this Node ends.
     */
    /**
     * The Token at which this Node begins.
     */
    /**
     * The Token at which this Node ends.
     */
    /**
     * The Source document the AST represents.
     */
    constructor(startToken, endToken, source) {
      this.start = startToken.start;
      this.end = endToken.end;
      this.startToken = startToken;
      this.endToken = endToken;
      this.source = source;
    }
    get [Symbol.toStringTag]() {
      return "Location";
    }
    toJSON() {
      return {
        start: this.start,
        end: this.end
      };
    }
  };
  var Token = class {
    /**
     * The kind of Token.
     */
    /**
     * The character offset at which this Node begins.
     */
    /**
     * The character offset at which this Node ends.
     */
    /**
     * The 1-indexed line number on which this Token appears.
     */
    /**
     * The 1-indexed column number at which this Token begins.
     */
    /**
     * For non-punctuation tokens, represents the interpreted value of the token.
     *
     * Note: is undefined for punctuation tokens, but typed as string for
     * convenience in the parser.
     */
    /**
     * Tokens exist as nodes in a double-linked-list amongst all tokens
     * including ignored tokens. <SOF> is always the first node and <EOF>
     * the last.
     */
    constructor(kind, start, end, line, column, value) {
      this.kind = kind;
      this.start = start;
      this.end = end;
      this.line = line;
      this.column = column;
      this.value = value;
      this.prev = null;
      this.next = null;
    }
    get [Symbol.toStringTag]() {
      return "Token";
    }
    toJSON() {
      return {
        kind: this.kind,
        value: this.value,
        line: this.line,
        column: this.column
      };
    }
  };
  var QueryDocumentKeys = {
    Name: [],
    Document: ["definitions"],
    OperationDefinition: [
      "name",
      "variableDefinitions",
      "directives",
      "selectionSet"
    ],
    VariableDefinition: ["variable", "type", "defaultValue", "directives"],
    Variable: ["name"],
    SelectionSet: ["selections"],
    Field: ["alias", "name", "arguments", "directives", "selectionSet"],
    Argument: ["name", "value"],
    FragmentSpread: ["name", "directives"],
    InlineFragment: ["typeCondition", "directives", "selectionSet"],
    FragmentDefinition: [
      "name",
      // Note: fragment variable definitions are deprecated and will removed in v17.0.0
      "variableDefinitions",
      "typeCondition",
      "directives",
      "selectionSet"
    ],
    IntValue: [],
    FloatValue: [],
    StringValue: [],
    BooleanValue: [],
    NullValue: [],
    EnumValue: [],
    ListValue: ["values"],
    ObjectValue: ["fields"],
    ObjectField: ["name", "value"],
    Directive: ["name", "arguments"],
    NamedType: ["name"],
    ListType: ["type"],
    NonNullType: ["type"],
    SchemaDefinition: ["description", "directives", "operationTypes"],
    OperationTypeDefinition: ["type"],
    ScalarTypeDefinition: ["description", "name", "directives"],
    ObjectTypeDefinition: [
      "description",
      "name",
      "interfaces",
      "directives",
      "fields"
    ],
    FieldDefinition: ["description", "name", "arguments", "type", "directives"],
    InputValueDefinition: [
      "description",
      "name",
      "type",
      "defaultValue",
      "directives"
    ],
    InterfaceTypeDefinition: [
      "description",
      "name",
      "interfaces",
      "directives",
      "fields"
    ],
    UnionTypeDefinition: ["description", "name", "directives", "types"],
    EnumTypeDefinition: ["description", "name", "directives", "values"],
    EnumValueDefinition: ["description", "name", "directives"],
    InputObjectTypeDefinition: ["description", "name", "directives", "fields"],
    DirectiveDefinition: ["description", "name", "arguments", "locations"],
    SchemaExtension: ["directives", "operationTypes"],
    ScalarTypeExtension: ["name", "directives"],
    ObjectTypeExtension: ["name", "interfaces", "directives", "fields"],
    InterfaceTypeExtension: ["name", "interfaces", "directives", "fields"],
    UnionTypeExtension: ["name", "directives", "types"],
    EnumTypeExtension: ["name", "directives", "values"],
    InputObjectTypeExtension: ["name", "directives", "fields"]
  };
  var kindValues = new Set(Object.keys(QueryDocumentKeys));
  var OperationTypeNode;
  (function(OperationTypeNode2) {
    OperationTypeNode2["QUERY"] = "query";
    OperationTypeNode2["MUTATION"] = "mutation";
    OperationTypeNode2["SUBSCRIPTION"] = "subscription";
  })(OperationTypeNode || (OperationTypeNode = {}));

  // node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/directiveLocation.mjs
  var DirectiveLocation;
  (function(DirectiveLocation2) {
    DirectiveLocation2["QUERY"] = "QUERY";
    DirectiveLocation2["MUTATION"] = "MUTATION";
    DirectiveLocation2["SUBSCRIPTION"] = "SUBSCRIPTION";
    DirectiveLocation2["FIELD"] = "FIELD";
    DirectiveLocation2["FRAGMENT_DEFINITION"] = "FRAGMENT_DEFINITION";
    DirectiveLocation2["FRAGMENT_SPREAD"] = "FRAGMENT_SPREAD";
    DirectiveLocation2["INLINE_FRAGMENT"] = "INLINE_FRAGMENT";
    DirectiveLocation2["VARIABLE_DEFINITION"] = "VARIABLE_DEFINITION";
    DirectiveLocation2["SCHEMA"] = "SCHEMA";
    DirectiveLocation2["SCALAR"] = "SCALAR";
    DirectiveLocation2["OBJECT"] = "OBJECT";
    DirectiveLocation2["FIELD_DEFINITION"] = "FIELD_DEFINITION";
    DirectiveLocation2["ARGUMENT_DEFINITION"] = "ARGUMENT_DEFINITION";
    DirectiveLocation2["INTERFACE"] = "INTERFACE";
    DirectiveLocation2["UNION"] = "UNION";
    DirectiveLocation2["ENUM"] = "ENUM";
    DirectiveLocation2["ENUM_VALUE"] = "ENUM_VALUE";
    DirectiveLocation2["INPUT_OBJECT"] = "INPUT_OBJECT";
    DirectiveLocation2["INPUT_FIELD_DEFINITION"] = "INPUT_FIELD_DEFINITION";
  })(DirectiveLocation || (DirectiveLocation = {}));

  // node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/kinds.mjs
  var Kind;
  (function(Kind2) {
    Kind2["NAME"] = "Name";
    Kind2["DOCUMENT"] = "Document";
    Kind2["OPERATION_DEFINITION"] = "OperationDefinition";
    Kind2["VARIABLE_DEFINITION"] = "VariableDefinition";
    Kind2["SELECTION_SET"] = "SelectionSet";
    Kind2["FIELD"] = "Field";
    Kind2["ARGUMENT"] = "Argument";
    Kind2["FRAGMENT_SPREAD"] = "FragmentSpread";
    Kind2["INLINE_FRAGMENT"] = "InlineFragment";
    Kind2["FRAGMENT_DEFINITION"] = "FragmentDefinition";
    Kind2["VARIABLE"] = "Variable";
    Kind2["INT"] = "IntValue";
    Kind2["FLOAT"] = "FloatValue";
    Kind2["STRING"] = "StringValue";
    Kind2["BOOLEAN"] = "BooleanValue";
    Kind2["NULL"] = "NullValue";
    Kind2["ENUM"] = "EnumValue";
    Kind2["LIST"] = "ListValue";
    Kind2["OBJECT"] = "ObjectValue";
    Kind2["OBJECT_FIELD"] = "ObjectField";
    Kind2["DIRECTIVE"] = "Directive";
    Kind2["NAMED_TYPE"] = "NamedType";
    Kind2["LIST_TYPE"] = "ListType";
    Kind2["NON_NULL_TYPE"] = "NonNullType";
    Kind2["SCHEMA_DEFINITION"] = "SchemaDefinition";
    Kind2["OPERATION_TYPE_DEFINITION"] = "OperationTypeDefinition";
    Kind2["SCALAR_TYPE_DEFINITION"] = "ScalarTypeDefinition";
    Kind2["OBJECT_TYPE_DEFINITION"] = "ObjectTypeDefinition";
    Kind2["FIELD_DEFINITION"] = "FieldDefinition";
    Kind2["INPUT_VALUE_DEFINITION"] = "InputValueDefinition";
    Kind2["INTERFACE_TYPE_DEFINITION"] = "InterfaceTypeDefinition";
    Kind2["UNION_TYPE_DEFINITION"] = "UnionTypeDefinition";
    Kind2["ENUM_TYPE_DEFINITION"] = "EnumTypeDefinition";
    Kind2["ENUM_VALUE_DEFINITION"] = "EnumValueDefinition";
    Kind2["INPUT_OBJECT_TYPE_DEFINITION"] = "InputObjectTypeDefinition";
    Kind2["DIRECTIVE_DEFINITION"] = "DirectiveDefinition";
    Kind2["SCHEMA_EXTENSION"] = "SchemaExtension";
    Kind2["SCALAR_TYPE_EXTENSION"] = "ScalarTypeExtension";
    Kind2["OBJECT_TYPE_EXTENSION"] = "ObjectTypeExtension";
    Kind2["INTERFACE_TYPE_EXTENSION"] = "InterfaceTypeExtension";
    Kind2["UNION_TYPE_EXTENSION"] = "UnionTypeExtension";
    Kind2["ENUM_TYPE_EXTENSION"] = "EnumTypeExtension";
    Kind2["INPUT_OBJECT_TYPE_EXTENSION"] = "InputObjectTypeExtension";
  })(Kind || (Kind = {}));

  // node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/characterClasses.mjs
  function isWhiteSpace(code) {
    return code === 9 || code === 32;
  }
  function isDigit(code) {
    return code >= 48 && code <= 57;
  }
  function isLetter(code) {
    return code >= 97 && code <= 122 || // A-Z
    code >= 65 && code <= 90;
  }
  function isNameStart(code) {
    return isLetter(code) || code === 95;
  }
  function isNameContinue(code) {
    return isLetter(code) || isDigit(code) || code === 95;
  }

  // node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/blockString.mjs
  function dedentBlockStringLines(lines) {
    var _firstNonEmptyLine2;
    let commonIndent = Number.MAX_SAFE_INTEGER;
    let firstNonEmptyLine = null;
    let lastNonEmptyLine = -1;
    for (let i = 0; i < lines.length; ++i) {
      var _firstNonEmptyLine;
      const line = lines[i];
      const indent = leadingWhitespace(line);
      if (indent === line.length) {
        continue;
      }
      firstNonEmptyLine = (_firstNonEmptyLine = firstNonEmptyLine) !== null && _firstNonEmptyLine !== void 0 ? _firstNonEmptyLine : i;
      lastNonEmptyLine = i;
      if (i !== 0 && indent < commonIndent) {
        commonIndent = indent;
      }
    }
    return lines.map((line, i) => i === 0 ? line : line.slice(commonIndent)).slice(
      (_firstNonEmptyLine2 = firstNonEmptyLine) !== null && _firstNonEmptyLine2 !== void 0 ? _firstNonEmptyLine2 : 0,
      lastNonEmptyLine + 1
    );
  }
  function leadingWhitespace(str) {
    let i = 0;
    while (i < str.length && isWhiteSpace(str.charCodeAt(i))) {
      ++i;
    }
    return i;
  }

  // node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/tokenKind.mjs
  var TokenKind;
  (function(TokenKind2) {
    TokenKind2["SOF"] = "<SOF>";
    TokenKind2["EOF"] = "<EOF>";
    TokenKind2["BANG"] = "!";
    TokenKind2["DOLLAR"] = "$";
    TokenKind2["AMP"] = "&";
    TokenKind2["PAREN_L"] = "(";
    TokenKind2["PAREN_R"] = ")";
    TokenKind2["SPREAD"] = "...";
    TokenKind2["COLON"] = ":";
    TokenKind2["EQUALS"] = "=";
    TokenKind2["AT"] = "@";
    TokenKind2["BRACKET_L"] = "[";
    TokenKind2["BRACKET_R"] = "]";
    TokenKind2["BRACE_L"] = "{";
    TokenKind2["PIPE"] = "|";
    TokenKind2["BRACE_R"] = "}";
    TokenKind2["NAME"] = "Name";
    TokenKind2["INT"] = "Int";
    TokenKind2["FLOAT"] = "Float";
    TokenKind2["STRING"] = "String";
    TokenKind2["BLOCK_STRING"] = "BlockString";
    TokenKind2["COMMENT"] = "Comment";
  })(TokenKind || (TokenKind = {}));

  // node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/lexer.mjs
  var Lexer = class {
    /**
     * The previously focused non-ignored token.
     */
    /**
     * The currently focused non-ignored token.
     */
    /**
     * The (1-indexed) line containing the current token.
     */
    /**
     * The character offset at which the current line begins.
     */
    constructor(source) {
      const startOfFileToken = new Token(TokenKind.SOF, 0, 0, 0, 0);
      this.source = source;
      this.lastToken = startOfFileToken;
      this.token = startOfFileToken;
      this.line = 1;
      this.lineStart = 0;
    }
    get [Symbol.toStringTag]() {
      return "Lexer";
    }
    /**
     * Advances the token stream to the next non-ignored token.
     */
    advance() {
      this.lastToken = this.token;
      const token = this.token = this.lookahead();
      return token;
    }
    /**
     * Looks ahead and returns the next non-ignored token, but does not change
     * the state of Lexer.
     */
    lookahead() {
      let token = this.token;
      if (token.kind !== TokenKind.EOF) {
        do {
          if (token.next) {
            token = token.next;
          } else {
            const nextToken = readNextToken(this, token.end);
            token.next = nextToken;
            nextToken.prev = token;
            token = nextToken;
          }
        } while (token.kind === TokenKind.COMMENT);
      }
      return token;
    }
  };
  function isPunctuatorTokenKind(kind) {
    return kind === TokenKind.BANG || kind === TokenKind.DOLLAR || kind === TokenKind.AMP || kind === TokenKind.PAREN_L || kind === TokenKind.PAREN_R || kind === TokenKind.SPREAD || kind === TokenKind.COLON || kind === TokenKind.EQUALS || kind === TokenKind.AT || kind === TokenKind.BRACKET_L || kind === TokenKind.BRACKET_R || kind === TokenKind.BRACE_L || kind === TokenKind.PIPE || kind === TokenKind.BRACE_R;
  }
  function isUnicodeScalarValue(code) {
    return code >= 0 && code <= 55295 || code >= 57344 && code <= 1114111;
  }
  function isSupplementaryCodePoint(body, location2) {
    return isLeadingSurrogate(body.charCodeAt(location2)) && isTrailingSurrogate(body.charCodeAt(location2 + 1));
  }
  function isLeadingSurrogate(code) {
    return code >= 55296 && code <= 56319;
  }
  function isTrailingSurrogate(code) {
    return code >= 56320 && code <= 57343;
  }
  function printCodePointAt(lexer2, location2) {
    const code = lexer2.source.body.codePointAt(location2);
    if (code === void 0) {
      return TokenKind.EOF;
    } else if (code >= 32 && code <= 126) {
      const char = String.fromCodePoint(code);
      return char === '"' ? `'"'` : `"${char}"`;
    }
    return "U+" + code.toString(16).toUpperCase().padStart(4, "0");
  }
  function createToken(lexer2, kind, start, end, value) {
    const line = lexer2.line;
    const col = 1 + start - lexer2.lineStart;
    return new Token(kind, start, end, line, col, value);
  }
  function readNextToken(lexer2, start) {
    const body = lexer2.source.body;
    const bodyLength = body.length;
    let position = start;
    while (position < bodyLength) {
      const code = body.charCodeAt(position);
      switch (code) {
        case 65279:
        case 9:
        case 32:
        case 44:
          ++position;
          continue;
        case 10:
          ++position;
          ++lexer2.line;
          lexer2.lineStart = position;
          continue;
        case 13:
          if (body.charCodeAt(position + 1) === 10) {
            position += 2;
          } else {
            ++position;
          }
          ++lexer2.line;
          lexer2.lineStart = position;
          continue;
        case 35:
          return readComment(lexer2, position);
        case 33:
          return createToken(lexer2, TokenKind.BANG, position, position + 1);
        case 36:
          return createToken(lexer2, TokenKind.DOLLAR, position, position + 1);
        case 38:
          return createToken(lexer2, TokenKind.AMP, position, position + 1);
        case 40:
          return createToken(lexer2, TokenKind.PAREN_L, position, position + 1);
        case 41:
          return createToken(lexer2, TokenKind.PAREN_R, position, position + 1);
        case 46:
          if (body.charCodeAt(position + 1) === 46 && body.charCodeAt(position + 2) === 46) {
            return createToken(lexer2, TokenKind.SPREAD, position, position + 3);
          }
          break;
        case 58:
          return createToken(lexer2, TokenKind.COLON, position, position + 1);
        case 61:
          return createToken(lexer2, TokenKind.EQUALS, position, position + 1);
        case 64:
          return createToken(lexer2, TokenKind.AT, position, position + 1);
        case 91:
          return createToken(lexer2, TokenKind.BRACKET_L, position, position + 1);
        case 93:
          return createToken(lexer2, TokenKind.BRACKET_R, position, position + 1);
        case 123:
          return createToken(lexer2, TokenKind.BRACE_L, position, position + 1);
        case 124:
          return createToken(lexer2, TokenKind.PIPE, position, position + 1);
        case 125:
          return createToken(lexer2, TokenKind.BRACE_R, position, position + 1);
        case 34:
          if (body.charCodeAt(position + 1) === 34 && body.charCodeAt(position + 2) === 34) {
            return readBlockString(lexer2, position);
          }
          return readString(lexer2, position);
      }
      if (isDigit(code) || code === 45) {
        return readNumber(lexer2, position, code);
      }
      if (isNameStart(code)) {
        return readName(lexer2, position);
      }
      throw syntaxError(
        lexer2.source,
        position,
        code === 39 ? `Unexpected single quote character ('), did you mean to use a double quote (")?` : isUnicodeScalarValue(code) || isSupplementaryCodePoint(body, position) ? `Unexpected character: ${printCodePointAt(lexer2, position)}.` : `Invalid character: ${printCodePointAt(lexer2, position)}.`
      );
    }
    return createToken(lexer2, TokenKind.EOF, bodyLength, bodyLength);
  }
  function readComment(lexer2, start) {
    const body = lexer2.source.body;
    const bodyLength = body.length;
    let position = start + 1;
    while (position < bodyLength) {
      const code = body.charCodeAt(position);
      if (code === 10 || code === 13) {
        break;
      }
      if (isUnicodeScalarValue(code)) {
        ++position;
      } else if (isSupplementaryCodePoint(body, position)) {
        position += 2;
      } else {
        break;
      }
    }
    return createToken(
      lexer2,
      TokenKind.COMMENT,
      start,
      position,
      body.slice(start + 1, position)
    );
  }
  function readNumber(lexer2, start, firstCode) {
    const body = lexer2.source.body;
    let position = start;
    let code = firstCode;
    let isFloat = false;
    if (code === 45) {
      code = body.charCodeAt(++position);
    }
    if (code === 48) {
      code = body.charCodeAt(++position);
      if (isDigit(code)) {
        throw syntaxError(
          lexer2.source,
          position,
          `Invalid number, unexpected digit after 0: ${printCodePointAt(
            lexer2,
            position
          )}.`
        );
      }
    } else {
      position = readDigits(lexer2, position, code);
      code = body.charCodeAt(position);
    }
    if (code === 46) {
      isFloat = true;
      code = body.charCodeAt(++position);
      position = readDigits(lexer2, position, code);
      code = body.charCodeAt(position);
    }
    if (code === 69 || code === 101) {
      isFloat = true;
      code = body.charCodeAt(++position);
      if (code === 43 || code === 45) {
        code = body.charCodeAt(++position);
      }
      position = readDigits(lexer2, position, code);
      code = body.charCodeAt(position);
    }
    if (code === 46 || isNameStart(code)) {
      throw syntaxError(
        lexer2.source,
        position,
        `Invalid number, expected digit but got: ${printCodePointAt(
          lexer2,
          position
        )}.`
      );
    }
    return createToken(
      lexer2,
      isFloat ? TokenKind.FLOAT : TokenKind.INT,
      start,
      position,
      body.slice(start, position)
    );
  }
  function readDigits(lexer2, start, firstCode) {
    if (!isDigit(firstCode)) {
      throw syntaxError(
        lexer2.source,
        start,
        `Invalid number, expected digit but got: ${printCodePointAt(
          lexer2,
          start
        )}.`
      );
    }
    const body = lexer2.source.body;
    let position = start + 1;
    while (isDigit(body.charCodeAt(position))) {
      ++position;
    }
    return position;
  }
  function readString(lexer2, start) {
    const body = lexer2.source.body;
    const bodyLength = body.length;
    let position = start + 1;
    let chunkStart = position;
    let value = "";
    while (position < bodyLength) {
      const code = body.charCodeAt(position);
      if (code === 34) {
        value += body.slice(chunkStart, position);
        return createToken(lexer2, TokenKind.STRING, start, position + 1, value);
      }
      if (code === 92) {
        value += body.slice(chunkStart, position);
        const escape = body.charCodeAt(position + 1) === 117 ? body.charCodeAt(position + 2) === 123 ? readEscapedUnicodeVariableWidth(lexer2, position) : readEscapedUnicodeFixedWidth(lexer2, position) : readEscapedCharacter(lexer2, position);
        value += escape.value;
        position += escape.size;
        chunkStart = position;
        continue;
      }
      if (code === 10 || code === 13) {
        break;
      }
      if (isUnicodeScalarValue(code)) {
        ++position;
      } else if (isSupplementaryCodePoint(body, position)) {
        position += 2;
      } else {
        throw syntaxError(
          lexer2.source,
          position,
          `Invalid character within String: ${printCodePointAt(
            lexer2,
            position
          )}.`
        );
      }
    }
    throw syntaxError(lexer2.source, position, "Unterminated string.");
  }
  function readEscapedUnicodeVariableWidth(lexer2, position) {
    const body = lexer2.source.body;
    let point = 0;
    let size = 3;
    while (size < 12) {
      const code = body.charCodeAt(position + size++);
      if (code === 125) {
        if (size < 5 || !isUnicodeScalarValue(point)) {
          break;
        }
        return {
          value: String.fromCodePoint(point),
          size
        };
      }
      point = point << 4 | readHexDigit(code);
      if (point < 0) {
        break;
      }
    }
    throw syntaxError(
      lexer2.source,
      position,
      `Invalid Unicode escape sequence: "${body.slice(
        position,
        position + size
      )}".`
    );
  }
  function readEscapedUnicodeFixedWidth(lexer2, position) {
    const body = lexer2.source.body;
    const code = read16BitHexCode(body, position + 2);
    if (isUnicodeScalarValue(code)) {
      return {
        value: String.fromCodePoint(code),
        size: 6
      };
    }
    if (isLeadingSurrogate(code)) {
      if (body.charCodeAt(position + 6) === 92 && body.charCodeAt(position + 7) === 117) {
        const trailingCode = read16BitHexCode(body, position + 8);
        if (isTrailingSurrogate(trailingCode)) {
          return {
            value: String.fromCodePoint(code, trailingCode),
            size: 12
          };
        }
      }
    }
    throw syntaxError(
      lexer2.source,
      position,
      `Invalid Unicode escape sequence: "${body.slice(position, position + 6)}".`
    );
  }
  function read16BitHexCode(body, position) {
    return readHexDigit(body.charCodeAt(position)) << 12 | readHexDigit(body.charCodeAt(position + 1)) << 8 | readHexDigit(body.charCodeAt(position + 2)) << 4 | readHexDigit(body.charCodeAt(position + 3));
  }
  function readHexDigit(code) {
    return code >= 48 && code <= 57 ? code - 48 : code >= 65 && code <= 70 ? code - 55 : code >= 97 && code <= 102 ? code - 87 : -1;
  }
  function readEscapedCharacter(lexer2, position) {
    const body = lexer2.source.body;
    const code = body.charCodeAt(position + 1);
    switch (code) {
      case 34:
        return {
          value: '"',
          size: 2
        };
      case 92:
        return {
          value: "\\",
          size: 2
        };
      case 47:
        return {
          value: "/",
          size: 2
        };
      case 98:
        return {
          value: "\b",
          size: 2
        };
      case 102:
        return {
          value: "\f",
          size: 2
        };
      case 110:
        return {
          value: "\n",
          size: 2
        };
      case 114:
        return {
          value: "\r",
          size: 2
        };
      case 116:
        return {
          value: "	",
          size: 2
        };
    }
    throw syntaxError(
      lexer2.source,
      position,
      `Invalid character escape sequence: "${body.slice(
        position,
        position + 2
      )}".`
    );
  }
  function readBlockString(lexer2, start) {
    const body = lexer2.source.body;
    const bodyLength = body.length;
    let lineStart = lexer2.lineStart;
    let position = start + 3;
    let chunkStart = position;
    let currentLine = "";
    const blockLines = [];
    while (position < bodyLength) {
      const code = body.charCodeAt(position);
      if (code === 34 && body.charCodeAt(position + 1) === 34 && body.charCodeAt(position + 2) === 34) {
        currentLine += body.slice(chunkStart, position);
        blockLines.push(currentLine);
        const token = createToken(
          lexer2,
          TokenKind.BLOCK_STRING,
          start,
          position + 3,
          // Return a string of the lines joined with U+000A.
          dedentBlockStringLines(blockLines).join("\n")
        );
        lexer2.line += blockLines.length - 1;
        lexer2.lineStart = lineStart;
        return token;
      }
      if (code === 92 && body.charCodeAt(position + 1) === 34 && body.charCodeAt(position + 2) === 34 && body.charCodeAt(position + 3) === 34) {
        currentLine += body.slice(chunkStart, position);
        chunkStart = position + 1;
        position += 4;
        continue;
      }
      if (code === 10 || code === 13) {
        currentLine += body.slice(chunkStart, position);
        blockLines.push(currentLine);
        if (code === 13 && body.charCodeAt(position + 1) === 10) {
          position += 2;
        } else {
          ++position;
        }
        currentLine = "";
        chunkStart = position;
        lineStart = position;
        continue;
      }
      if (isUnicodeScalarValue(code)) {
        ++position;
      } else if (isSupplementaryCodePoint(body, position)) {
        position += 2;
      } else {
        throw syntaxError(
          lexer2.source,
          position,
          `Invalid character within String: ${printCodePointAt(
            lexer2,
            position
          )}.`
        );
      }
    }
    throw syntaxError(lexer2.source, position, "Unterminated string.");
  }
  function readName(lexer2, start) {
    const body = lexer2.source.body;
    const bodyLength = body.length;
    let position = start + 1;
    while (position < bodyLength) {
      const code = body.charCodeAt(position);
      if (isNameContinue(code)) {
        ++position;
      } else {
        break;
      }
    }
    return createToken(
      lexer2,
      TokenKind.NAME,
      start,
      position,
      body.slice(start, position)
    );
  }

  // node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/inspect.mjs
  var MAX_ARRAY_LENGTH = 10;
  var MAX_RECURSIVE_DEPTH = 2;
  function inspect(value) {
    return formatValue(value, []);
  }
  function formatValue(value, seenValues) {
    switch (typeof value) {
      case "string":
        return JSON.stringify(value);
      case "function":
        return value.name ? `[function ${value.name}]` : "[function]";
      case "object":
        return formatObjectValue(value, seenValues);
      default:
        return String(value);
    }
  }
  function formatObjectValue(value, previouslySeenValues) {
    if (value === null) {
      return "null";
    }
    if (previouslySeenValues.includes(value)) {
      return "[Circular]";
    }
    const seenValues = [...previouslySeenValues, value];
    if (isJSONable(value)) {
      const jsonValue = value.toJSON();
      if (jsonValue !== value) {
        return typeof jsonValue === "string" ? jsonValue : formatValue(jsonValue, seenValues);
      }
    } else if (Array.isArray(value)) {
      return formatArray(value, seenValues);
    }
    return formatObject(value, seenValues);
  }
  function isJSONable(value) {
    return typeof value.toJSON === "function";
  }
  function formatObject(object, seenValues) {
    const entries = Object.entries(object);
    if (entries.length === 0) {
      return "{}";
    }
    if (seenValues.length > MAX_RECURSIVE_DEPTH) {
      return "[" + getObjectTag(object) + "]";
    }
    const properties = entries.map(
      ([key, value]) => key + ": " + formatValue(value, seenValues)
    );
    return "{ " + properties.join(", ") + " }";
  }
  function formatArray(array, seenValues) {
    if (array.length === 0) {
      return "[]";
    }
    if (seenValues.length > MAX_RECURSIVE_DEPTH) {
      return "[Array]";
    }
    const len = Math.min(MAX_ARRAY_LENGTH, array.length);
    const remaining = array.length - len;
    const items = [];
    for (let i = 0; i < len; ++i) {
      items.push(formatValue(array[i], seenValues));
    }
    if (remaining === 1) {
      items.push("... 1 more item");
    } else if (remaining > 1) {
      items.push(`... ${remaining} more items`);
    }
    return "[" + items.join(", ") + "]";
  }
  function getObjectTag(object) {
    const tag = Object.prototype.toString.call(object).replace(/^\[object /, "").replace(/]$/, "");
    if (tag === "Object" && typeof object.constructor === "function") {
      const name = object.constructor.name;
      if (typeof name === "string" && name !== "") {
        return name;
      }
    }
    return tag;
  }

  // node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/jsutils/instanceOf.mjs
  var instanceOf = (
    /* c8 ignore next 6 */
    // FIXME: https://github.com/graphql/graphql-js/issues/2317
    globalThis.process && globalThis.process.env.NODE_ENV === "production" ? function instanceOf2(value, constructor) {
      return value instanceof constructor;
    } : function instanceOf3(value, constructor) {
      if (value instanceof constructor) {
        return true;
      }
      if (typeof value === "object" && value !== null) {
        var _value$constructor;
        const className = constructor.prototype[Symbol.toStringTag];
        const valueClassName = (
          // We still need to support constructor's name to detect conflicts with older versions of this library.
          Symbol.toStringTag in value ? value[Symbol.toStringTag] : (_value$constructor = value.constructor) === null || _value$constructor === void 0 ? void 0 : _value$constructor.name
        );
        if (className === valueClassName) {
          const stringifiedValue = inspect(value);
          throw new Error(`Cannot use ${className} "${stringifiedValue}" from another module or realm.

Ensure that there is only one instance of "graphql" in the node_modules
directory. If different versions of "graphql" are the dependencies of other
relied on modules, use "resolutions" to ensure only one version is installed.

https://yarnpkg.com/en/docs/selective-version-resolutions

Duplicate "graphql" modules cannot be used at the same time since different
versions may have different capabilities and behavior. The data from one
version used in the function from another could produce confusing and
spurious results.`);
        }
      }
      return false;
    }
  );

  // node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/source.mjs
  var Source = class {
    constructor(body, name = "GraphQL request", locationOffset = {
      line: 1,
      column: 1
    }) {
      typeof body === "string" || devAssert(false, `Body must be a string. Received: ${inspect(body)}.`);
      this.body = body;
      this.name = name;
      this.locationOffset = locationOffset;
      this.locationOffset.line > 0 || devAssert(
        false,
        "line in locationOffset is 1-indexed and must be positive."
      );
      this.locationOffset.column > 0 || devAssert(
        false,
        "column in locationOffset is 1-indexed and must be positive."
      );
    }
    get [Symbol.toStringTag]() {
      return "Source";
    }
  };
  function isSource(source) {
    return instanceOf(source, Source);
  }

  // node_modules/.pnpm/graphql@16.8.1/node_modules/graphql/language/parser.mjs
  function parse2(source, options) {
    const parser = new Parser(source, options);
    return parser.parseDocument();
  }
  var Parser = class {
    constructor(source, options = {}) {
      const sourceObj = isSource(source) ? source : new Source(source);
      this._lexer = new Lexer(sourceObj);
      this._options = options;
      this._tokenCounter = 0;
    }
    /**
     * Converts a name lex token into a name parse node.
     */
    parseName() {
      const token = this.expectToken(TokenKind.NAME);
      return this.node(token, {
        kind: Kind.NAME,
        value: token.value
      });
    }
    // Implements the parsing rules in the Document section.
    /**
     * Document : Definition+
     */
    parseDocument() {
      return this.node(this._lexer.token, {
        kind: Kind.DOCUMENT,
        definitions: this.many(
          TokenKind.SOF,
          this.parseDefinition,
          TokenKind.EOF
        )
      });
    }
    /**
     * Definition :
     *   - ExecutableDefinition
     *   - TypeSystemDefinition
     *   - TypeSystemExtension
     *
     * ExecutableDefinition :
     *   - OperationDefinition
     *   - FragmentDefinition
     *
     * TypeSystemDefinition :
     *   - SchemaDefinition
     *   - TypeDefinition
     *   - DirectiveDefinition
     *
     * TypeDefinition :
     *   - ScalarTypeDefinition
     *   - ObjectTypeDefinition
     *   - InterfaceTypeDefinition
     *   - UnionTypeDefinition
     *   - EnumTypeDefinition
     *   - InputObjectTypeDefinition
     */
    parseDefinition() {
      if (this.peek(TokenKind.BRACE_L)) {
        return this.parseOperationDefinition();
      }
      const hasDescription = this.peekDescription();
      const keywordToken = hasDescription ? this._lexer.lookahead() : this._lexer.token;
      if (keywordToken.kind === TokenKind.NAME) {
        switch (keywordToken.value) {
          case "schema":
            return this.parseSchemaDefinition();
          case "scalar":
            return this.parseScalarTypeDefinition();
          case "type":
            return this.parseObjectTypeDefinition();
          case "interface":
            return this.parseInterfaceTypeDefinition();
          case "union":
            return this.parseUnionTypeDefinition();
          case "enum":
            return this.parseEnumTypeDefinition();
          case "input":
            return this.parseInputObjectTypeDefinition();
          case "directive":
            return this.parseDirectiveDefinition();
        }
        if (hasDescription) {
          throw syntaxError(
            this._lexer.source,
            this._lexer.token.start,
            "Unexpected description, descriptions are supported only on type definitions."
          );
        }
        switch (keywordToken.value) {
          case "query":
          case "mutation":
          case "subscription":
            return this.parseOperationDefinition();
          case "fragment":
            return this.parseFragmentDefinition();
          case "extend":
            return this.parseTypeSystemExtension();
        }
      }
      throw this.unexpected(keywordToken);
    }
    // Implements the parsing rules in the Operations section.
    /**
     * OperationDefinition :
     *  - SelectionSet
     *  - OperationType Name? VariableDefinitions? Directives? SelectionSet
     */
    parseOperationDefinition() {
      const start = this._lexer.token;
      if (this.peek(TokenKind.BRACE_L)) {
        return this.node(start, {
          kind: Kind.OPERATION_DEFINITION,
          operation: OperationTypeNode.QUERY,
          name: void 0,
          variableDefinitions: [],
          directives: [],
          selectionSet: this.parseSelectionSet()
        });
      }
      const operation = this.parseOperationType();
      let name;
      if (this.peek(TokenKind.NAME)) {
        name = this.parseName();
      }
      return this.node(start, {
        kind: Kind.OPERATION_DEFINITION,
        operation,
        name,
        variableDefinitions: this.parseVariableDefinitions(),
        directives: this.parseDirectives(false),
        selectionSet: this.parseSelectionSet()
      });
    }
    /**
     * OperationType : one of query mutation subscription
     */
    parseOperationType() {
      const operationToken = this.expectToken(TokenKind.NAME);
      switch (operationToken.value) {
        case "query":
          return OperationTypeNode.QUERY;
        case "mutation":
          return OperationTypeNode.MUTATION;
        case "subscription":
          return OperationTypeNode.SUBSCRIPTION;
      }
      throw this.unexpected(operationToken);
    }
    /**
     * VariableDefinitions : ( VariableDefinition+ )
     */
    parseVariableDefinitions() {
      return this.optionalMany(
        TokenKind.PAREN_L,
        this.parseVariableDefinition,
        TokenKind.PAREN_R
      );
    }
    /**
     * VariableDefinition : Variable : Type DefaultValue? Directives[Const]?
     */
    parseVariableDefinition() {
      return this.node(this._lexer.token, {
        kind: Kind.VARIABLE_DEFINITION,
        variable: this.parseVariable(),
        type: (this.expectToken(TokenKind.COLON), this.parseTypeReference()),
        defaultValue: this.expectOptionalToken(TokenKind.EQUALS) ? this.parseConstValueLiteral() : void 0,
        directives: this.parseConstDirectives()
      });
    }
    /**
     * Variable : $ Name
     */
    parseVariable() {
      const start = this._lexer.token;
      this.expectToken(TokenKind.DOLLAR);
      return this.node(start, {
        kind: Kind.VARIABLE,
        name: this.parseName()
      });
    }
    /**
     * ```
     * SelectionSet : { Selection+ }
     * ```
     */
    parseSelectionSet() {
      return this.node(this._lexer.token, {
        kind: Kind.SELECTION_SET,
        selections: this.many(
          TokenKind.BRACE_L,
          this.parseSelection,
          TokenKind.BRACE_R
        )
      });
    }
    /**
     * Selection :
     *   - Field
     *   - FragmentSpread
     *   - InlineFragment
     */
    parseSelection() {
      return this.peek(TokenKind.SPREAD) ? this.parseFragment() : this.parseField();
    }
    /**
     * Field : Alias? Name Arguments? Directives? SelectionSet?
     *
     * Alias : Name :
     */
    parseField() {
      const start = this._lexer.token;
      const nameOrAlias = this.parseName();
      let alias;
      let name;
      if (this.expectOptionalToken(TokenKind.COLON)) {
        alias = nameOrAlias;
        name = this.parseName();
      } else {
        name = nameOrAlias;
      }
      return this.node(start, {
        kind: Kind.FIELD,
        alias,
        name,
        arguments: this.parseArguments(false),
        directives: this.parseDirectives(false),
        selectionSet: this.peek(TokenKind.BRACE_L) ? this.parseSelectionSet() : void 0
      });
    }
    /**
     * Arguments[Const] : ( Argument[?Const]+ )
     */
    parseArguments(isConst) {
      const item = isConst ? this.parseConstArgument : this.parseArgument;
      return this.optionalMany(TokenKind.PAREN_L, item, TokenKind.PAREN_R);
    }
    /**
     * Argument[Const] : Name : Value[?Const]
     */
    parseArgument(isConst = false) {
      const start = this._lexer.token;
      const name = this.parseName();
      this.expectToken(TokenKind.COLON);
      return this.node(start, {
        kind: Kind.ARGUMENT,
        name,
        value: this.parseValueLiteral(isConst)
      });
    }
    parseConstArgument() {
      return this.parseArgument(true);
    }
    // Implements the parsing rules in the Fragments section.
    /**
     * Corresponds to both FragmentSpread and InlineFragment in the spec.
     *
     * FragmentSpread : ... FragmentName Directives?
     *
     * InlineFragment : ... TypeCondition? Directives? SelectionSet
     */
    parseFragment() {
      const start = this._lexer.token;
      this.expectToken(TokenKind.SPREAD);
      const hasTypeCondition = this.expectOptionalKeyword("on");
      if (!hasTypeCondition && this.peek(TokenKind.NAME)) {
        return this.node(start, {
          kind: Kind.FRAGMENT_SPREAD,
          name: this.parseFragmentName(),
          directives: this.parseDirectives(false)
        });
      }
      return this.node(start, {
        kind: Kind.INLINE_FRAGMENT,
        typeCondition: hasTypeCondition ? this.parseNamedType() : void 0,
        directives: this.parseDirectives(false),
        selectionSet: this.parseSelectionSet()
      });
    }
    /**
     * FragmentDefinition :
     *   - fragment FragmentName on TypeCondition Directives? SelectionSet
     *
     * TypeCondition : NamedType
     */
    parseFragmentDefinition() {
      const start = this._lexer.token;
      this.expectKeyword("fragment");
      if (this._options.allowLegacyFragmentVariables === true) {
        return this.node(start, {
          kind: Kind.FRAGMENT_DEFINITION,
          name: this.parseFragmentName(),
          variableDefinitions: this.parseVariableDefinitions(),
          typeCondition: (this.expectKeyword("on"), this.parseNamedType()),
          directives: this.parseDirectives(false),
          selectionSet: this.parseSelectionSet()
        });
      }
      return this.node(start, {
        kind: Kind.FRAGMENT_DEFINITION,
        name: this.parseFragmentName(),
        typeCondition: (this.expectKeyword("on"), this.parseNamedType()),
        directives: this.parseDirectives(false),
        selectionSet: this.parseSelectionSet()
      });
    }
    /**
     * FragmentName : Name but not `on`
     */
    parseFragmentName() {
      if (this._lexer.token.value === "on") {
        throw this.unexpected();
      }
      return this.parseName();
    }
    // Implements the parsing rules in the Values section.
    /**
     * Value[Const] :
     *   - [~Const] Variable
     *   - IntValue
     *   - FloatValue
     *   - StringValue
     *   - BooleanValue
     *   - NullValue
     *   - EnumValue
     *   - ListValue[?Const]
     *   - ObjectValue[?Const]
     *
     * BooleanValue : one of `true` `false`
     *
     * NullValue : `null`
     *
     * EnumValue : Name but not `true`, `false` or `null`
     */
    parseValueLiteral(isConst) {
      const token = this._lexer.token;
      switch (token.kind) {
        case TokenKind.BRACKET_L:
          return this.parseList(isConst);
        case TokenKind.BRACE_L:
          return this.parseObject(isConst);
        case TokenKind.INT:
          this.advanceLexer();
          return this.node(token, {
            kind: Kind.INT,
            value: token.value
          });
        case TokenKind.FLOAT:
          this.advanceLexer();
          return this.node(token, {
            kind: Kind.FLOAT,
            value: token.value
          });
        case TokenKind.STRING:
        case TokenKind.BLOCK_STRING:
          return this.parseStringLiteral();
        case TokenKind.NAME:
          this.advanceLexer();
          switch (token.value) {
            case "true":
              return this.node(token, {
                kind: Kind.BOOLEAN,
                value: true
              });
            case "false":
              return this.node(token, {
                kind: Kind.BOOLEAN,
                value: false
              });
            case "null":
              return this.node(token, {
                kind: Kind.NULL
              });
            default:
              return this.node(token, {
                kind: Kind.ENUM,
                value: token.value
              });
          }
        case TokenKind.DOLLAR:
          if (isConst) {
            this.expectToken(TokenKind.DOLLAR);
            if (this._lexer.token.kind === TokenKind.NAME) {
              const varName = this._lexer.token.value;
              throw syntaxError(
                this._lexer.source,
                token.start,
                `Unexpected variable "$${varName}" in constant value.`
              );
            } else {
              throw this.unexpected(token);
            }
          }
          return this.parseVariable();
        default:
          throw this.unexpected();
      }
    }
    parseConstValueLiteral() {
      return this.parseValueLiteral(true);
    }
    parseStringLiteral() {
      const token = this._lexer.token;
      this.advanceLexer();
      return this.node(token, {
        kind: Kind.STRING,
        value: token.value,
        block: token.kind === TokenKind.BLOCK_STRING
      });
    }
    /**
     * ListValue[Const] :
     *   - [ ]
     *   - [ Value[?Const]+ ]
     */
    parseList(isConst) {
      const item = () => this.parseValueLiteral(isConst);
      return this.node(this._lexer.token, {
        kind: Kind.LIST,
        values: this.any(TokenKind.BRACKET_L, item, TokenKind.BRACKET_R)
      });
    }
    /**
     * ```
     * ObjectValue[Const] :
     *   - { }
     *   - { ObjectField[?Const]+ }
     * ```
     */
    parseObject(isConst) {
      const item = () => this.parseObjectField(isConst);
      return this.node(this._lexer.token, {
        kind: Kind.OBJECT,
        fields: this.any(TokenKind.BRACE_L, item, TokenKind.BRACE_R)
      });
    }
    /**
     * ObjectField[Const] : Name : Value[?Const]
     */
    parseObjectField(isConst) {
      const start = this._lexer.token;
      const name = this.parseName();
      this.expectToken(TokenKind.COLON);
      return this.node(start, {
        kind: Kind.OBJECT_FIELD,
        name,
        value: this.parseValueLiteral(isConst)
      });
    }
    // Implements the parsing rules in the Directives section.
    /**
     * Directives[Const] : Directive[?Const]+
     */
    parseDirectives(isConst) {
      const directives = [];
      while (this.peek(TokenKind.AT)) {
        directives.push(this.parseDirective(isConst));
      }
      return directives;
    }
    parseConstDirectives() {
      return this.parseDirectives(true);
    }
    /**
     * ```
     * Directive[Const] : @ Name Arguments[?Const]?
     * ```
     */
    parseDirective(isConst) {
      const start = this._lexer.token;
      this.expectToken(TokenKind.AT);
      return this.node(start, {
        kind: Kind.DIRECTIVE,
        name: this.parseName(),
        arguments: this.parseArguments(isConst)
      });
    }
    // Implements the parsing rules in the Types section.
    /**
     * Type :
     *   - NamedType
     *   - ListType
     *   - NonNullType
     */
    parseTypeReference() {
      const start = this._lexer.token;
      let type;
      if (this.expectOptionalToken(TokenKind.BRACKET_L)) {
        const innerType = this.parseTypeReference();
        this.expectToken(TokenKind.BRACKET_R);
        type = this.node(start, {
          kind: Kind.LIST_TYPE,
          type: innerType
        });
      } else {
        type = this.parseNamedType();
      }
      if (this.expectOptionalToken(TokenKind.BANG)) {
        return this.node(start, {
          kind: Kind.NON_NULL_TYPE,
          type
        });
      }
      return type;
    }
    /**
     * NamedType : Name
     */
    parseNamedType() {
      return this.node(this._lexer.token, {
        kind: Kind.NAMED_TYPE,
        name: this.parseName()
      });
    }
    // Implements the parsing rules in the Type Definition section.
    peekDescription() {
      return this.peek(TokenKind.STRING) || this.peek(TokenKind.BLOCK_STRING);
    }
    /**
     * Description : StringValue
     */
    parseDescription() {
      if (this.peekDescription()) {
        return this.parseStringLiteral();
      }
    }
    /**
     * ```
     * SchemaDefinition : Description? schema Directives[Const]? { OperationTypeDefinition+ }
     * ```
     */
    parseSchemaDefinition() {
      const start = this._lexer.token;
      const description = this.parseDescription();
      this.expectKeyword("schema");
      const directives = this.parseConstDirectives();
      const operationTypes = this.many(
        TokenKind.BRACE_L,
        this.parseOperationTypeDefinition,
        TokenKind.BRACE_R
      );
      return this.node(start, {
        kind: Kind.SCHEMA_DEFINITION,
        description,
        directives,
        operationTypes
      });
    }
    /**
     * OperationTypeDefinition : OperationType : NamedType
     */
    parseOperationTypeDefinition() {
      const start = this._lexer.token;
      const operation = this.parseOperationType();
      this.expectToken(TokenKind.COLON);
      const type = this.parseNamedType();
      return this.node(start, {
        kind: Kind.OPERATION_TYPE_DEFINITION,
        operation,
        type
      });
    }
    /**
     * ScalarTypeDefinition : Description? scalar Name Directives[Const]?
     */
    parseScalarTypeDefinition() {
      const start = this._lexer.token;
      const description = this.parseDescription();
      this.expectKeyword("scalar");
      const name = this.parseName();
      const directives = this.parseConstDirectives();
      return this.node(start, {
        kind: Kind.SCALAR_TYPE_DEFINITION,
        description,
        name,
        directives
      });
    }
    /**
     * ObjectTypeDefinition :
     *   Description?
     *   type Name ImplementsInterfaces? Directives[Const]? FieldsDefinition?
     */
    parseObjectTypeDefinition() {
      const start = this._lexer.token;
      const description = this.parseDescription();
      this.expectKeyword("type");
      const name = this.parseName();
      const interfaces = this.parseImplementsInterfaces();
      const directives = this.parseConstDirectives();
      const fields = this.parseFieldsDefinition();
      return this.node(start, {
        kind: Kind.OBJECT_TYPE_DEFINITION,
        description,
        name,
        interfaces,
        directives,
        fields
      });
    }
    /**
     * ImplementsInterfaces :
     *   - implements `&`? NamedType
     *   - ImplementsInterfaces & NamedType
     */
    parseImplementsInterfaces() {
      return this.expectOptionalKeyword("implements") ? this.delimitedMany(TokenKind.AMP, this.parseNamedType) : [];
    }
    /**
     * ```
     * FieldsDefinition : { FieldDefinition+ }
     * ```
     */
    parseFieldsDefinition() {
      return this.optionalMany(
        TokenKind.BRACE_L,
        this.parseFieldDefinition,
        TokenKind.BRACE_R
      );
    }
    /**
     * FieldDefinition :
     *   - Description? Name ArgumentsDefinition? : Type Directives[Const]?
     */
    parseFieldDefinition() {
      const start = this._lexer.token;
      const description = this.parseDescription();
      const name = this.parseName();
      const args = this.parseArgumentDefs();
      this.expectToken(TokenKind.COLON);
      const type = this.parseTypeReference();
      const directives = this.parseConstDirectives();
      return this.node(start, {
        kind: Kind.FIELD_DEFINITION,
        description,
        name,
        arguments: args,
        type,
        directives
      });
    }
    /**
     * ArgumentsDefinition : ( InputValueDefinition+ )
     */
    parseArgumentDefs() {
      return this.optionalMany(
        TokenKind.PAREN_L,
        this.parseInputValueDef,
        TokenKind.PAREN_R
      );
    }
    /**
     * InputValueDefinition :
     *   - Description? Name : Type DefaultValue? Directives[Const]?
     */
    parseInputValueDef() {
      const start = this._lexer.token;
      const description = this.parseDescription();
      const name = this.parseName();
      this.expectToken(TokenKind.COLON);
      const type = this.parseTypeReference();
      let defaultValue;
      if (this.expectOptionalToken(TokenKind.EQUALS)) {
        defaultValue = this.parseConstValueLiteral();
      }
      const directives = this.parseConstDirectives();
      return this.node(start, {
        kind: Kind.INPUT_VALUE_DEFINITION,
        description,
        name,
        type,
        defaultValue,
        directives
      });
    }
    /**
     * InterfaceTypeDefinition :
     *   - Description? interface Name Directives[Const]? FieldsDefinition?
     */
    parseInterfaceTypeDefinition() {
      const start = this._lexer.token;
      const description = this.parseDescription();
      this.expectKeyword("interface");
      const name = this.parseName();
      const interfaces = this.parseImplementsInterfaces();
      const directives = this.parseConstDirectives();
      const fields = this.parseFieldsDefinition();
      return this.node(start, {
        kind: Kind.INTERFACE_TYPE_DEFINITION,
        description,
        name,
        interfaces,
        directives,
        fields
      });
    }
    /**
     * UnionTypeDefinition :
     *   - Description? union Name Directives[Const]? UnionMemberTypes?
     */
    parseUnionTypeDefinition() {
      const start = this._lexer.token;
      const description = this.parseDescription();
      this.expectKeyword("union");
      const name = this.parseName();
      const directives = this.parseConstDirectives();
      const types = this.parseUnionMemberTypes();
      return this.node(start, {
        kind: Kind.UNION_TYPE_DEFINITION,
        description,
        name,
        directives,
        types
      });
    }
    /**
     * UnionMemberTypes :
     *   - = `|`? NamedType
     *   - UnionMemberTypes | NamedType
     */
    parseUnionMemberTypes() {
      return this.expectOptionalToken(TokenKind.EQUALS) ? this.delimitedMany(TokenKind.PIPE, this.parseNamedType) : [];
    }
    /**
     * EnumTypeDefinition :
     *   - Description? enum Name Directives[Const]? EnumValuesDefinition?
     */
    parseEnumTypeDefinition() {
      const start = this._lexer.token;
      const description = this.parseDescription();
      this.expectKeyword("enum");
      const name = this.parseName();
      const directives = this.parseConstDirectives();
      const values = this.parseEnumValuesDefinition();
      return this.node(start, {
        kind: Kind.ENUM_TYPE_DEFINITION,
        description,
        name,
        directives,
        values
      });
    }
    /**
     * ```
     * EnumValuesDefinition : { EnumValueDefinition+ }
     * ```
     */
    parseEnumValuesDefinition() {
      return this.optionalMany(
        TokenKind.BRACE_L,
        this.parseEnumValueDefinition,
        TokenKind.BRACE_R
      );
    }
    /**
     * EnumValueDefinition : Description? EnumValue Directives[Const]?
     */
    parseEnumValueDefinition() {
      const start = this._lexer.token;
      const description = this.parseDescription();
      const name = this.parseEnumValueName();
      const directives = this.parseConstDirectives();
      return this.node(start, {
        kind: Kind.ENUM_VALUE_DEFINITION,
        description,
        name,
        directives
      });
    }
    /**
     * EnumValue : Name but not `true`, `false` or `null`
     */
    parseEnumValueName() {
      if (this._lexer.token.value === "true" || this._lexer.token.value === "false" || this._lexer.token.value === "null") {
        throw syntaxError(
          this._lexer.source,
          this._lexer.token.start,
          `${getTokenDesc(
            this._lexer.token
          )} is reserved and cannot be used for an enum value.`
        );
      }
      return this.parseName();
    }
    /**
     * InputObjectTypeDefinition :
     *   - Description? input Name Directives[Const]? InputFieldsDefinition?
     */
    parseInputObjectTypeDefinition() {
      const start = this._lexer.token;
      const description = this.parseDescription();
      this.expectKeyword("input");
      const name = this.parseName();
      const directives = this.parseConstDirectives();
      const fields = this.parseInputFieldsDefinition();
      return this.node(start, {
        kind: Kind.INPUT_OBJECT_TYPE_DEFINITION,
        description,
        name,
        directives,
        fields
      });
    }
    /**
     * ```
     * InputFieldsDefinition : { InputValueDefinition+ }
     * ```
     */
    parseInputFieldsDefinition() {
      return this.optionalMany(
        TokenKind.BRACE_L,
        this.parseInputValueDef,
        TokenKind.BRACE_R
      );
    }
    /**
     * TypeSystemExtension :
     *   - SchemaExtension
     *   - TypeExtension
     *
     * TypeExtension :
     *   - ScalarTypeExtension
     *   - ObjectTypeExtension
     *   - InterfaceTypeExtension
     *   - UnionTypeExtension
     *   - EnumTypeExtension
     *   - InputObjectTypeDefinition
     */
    parseTypeSystemExtension() {
      const keywordToken = this._lexer.lookahead();
      if (keywordToken.kind === TokenKind.NAME) {
        switch (keywordToken.value) {
          case "schema":
            return this.parseSchemaExtension();
          case "scalar":
            return this.parseScalarTypeExtension();
          case "type":
            return this.parseObjectTypeExtension();
          case "interface":
            return this.parseInterfaceTypeExtension();
          case "union":
            return this.parseUnionTypeExtension();
          case "enum":
            return this.parseEnumTypeExtension();
          case "input":
            return this.parseInputObjectTypeExtension();
        }
      }
      throw this.unexpected(keywordToken);
    }
    /**
     * ```
     * SchemaExtension :
     *  - extend schema Directives[Const]? { OperationTypeDefinition+ }
     *  - extend schema Directives[Const]
     * ```
     */
    parseSchemaExtension() {
      const start = this._lexer.token;
      this.expectKeyword("extend");
      this.expectKeyword("schema");
      const directives = this.parseConstDirectives();
      const operationTypes = this.optionalMany(
        TokenKind.BRACE_L,
        this.parseOperationTypeDefinition,
        TokenKind.BRACE_R
      );
      if (directives.length === 0 && operationTypes.length === 0) {
        throw this.unexpected();
      }
      return this.node(start, {
        kind: Kind.SCHEMA_EXTENSION,
        directives,
        operationTypes
      });
    }
    /**
     * ScalarTypeExtension :
     *   - extend scalar Name Directives[Const]
     */
    parseScalarTypeExtension() {
      const start = this._lexer.token;
      this.expectKeyword("extend");
      this.expectKeyword("scalar");
      const name = this.parseName();
      const directives = this.parseConstDirectives();
      if (directives.length === 0) {
        throw this.unexpected();
      }
      return this.node(start, {
        kind: Kind.SCALAR_TYPE_EXTENSION,
        name,
        directives
      });
    }
    /**
     * ObjectTypeExtension :
     *  - extend type Name ImplementsInterfaces? Directives[Const]? FieldsDefinition
     *  - extend type Name ImplementsInterfaces? Directives[Const]
     *  - extend type Name ImplementsInterfaces
     */
    parseObjectTypeExtension() {
      const start = this._lexer.token;
      this.expectKeyword("extend");
      this.expectKeyword("type");
      const name = this.parseName();
      const interfaces = this.parseImplementsInterfaces();
      const directives = this.parseConstDirectives();
      const fields = this.parseFieldsDefinition();
      if (interfaces.length === 0 && directives.length === 0 && fields.length === 0) {
        throw this.unexpected();
      }
      return this.node(start, {
        kind: Kind.OBJECT_TYPE_EXTENSION,
        name,
        interfaces,
        directives,
        fields
      });
    }
    /**
     * InterfaceTypeExtension :
     *  - extend interface Name ImplementsInterfaces? Directives[Const]? FieldsDefinition
     *  - extend interface Name ImplementsInterfaces? Directives[Const]
     *  - extend interface Name ImplementsInterfaces
     */
    parseInterfaceTypeExtension() {
      const start = this._lexer.token;
      this.expectKeyword("extend");
      this.expectKeyword("interface");
      const name = this.parseName();
      const interfaces = this.parseImplementsInterfaces();
      const directives = this.parseConstDirectives();
      const fields = this.parseFieldsDefinition();
      if (interfaces.length === 0 && directives.length === 0 && fields.length === 0) {
        throw this.unexpected();
      }
      return this.node(start, {
        kind: Kind.INTERFACE_TYPE_EXTENSION,
        name,
        interfaces,
        directives,
        fields
      });
    }
    /**
     * UnionTypeExtension :
     *   - extend union Name Directives[Const]? UnionMemberTypes
     *   - extend union Name Directives[Const]
     */
    parseUnionTypeExtension() {
      const start = this._lexer.token;
      this.expectKeyword("extend");
      this.expectKeyword("union");
      const name = this.parseName();
      const directives = this.parseConstDirectives();
      const types = this.parseUnionMemberTypes();
      if (directives.length === 0 && types.length === 0) {
        throw this.unexpected();
      }
      return this.node(start, {
        kind: Kind.UNION_TYPE_EXTENSION,
        name,
        directives,
        types
      });
    }
    /**
     * EnumTypeExtension :
     *   - extend enum Name Directives[Const]? EnumValuesDefinition
     *   - extend enum Name Directives[Const]
     */
    parseEnumTypeExtension() {
      const start = this._lexer.token;
      this.expectKeyword("extend");
      this.expectKeyword("enum");
      const name = this.parseName();
      const directives = this.parseConstDirectives();
      const values = this.parseEnumValuesDefinition();
      if (directives.length === 0 && values.length === 0) {
        throw this.unexpected();
      }
      return this.node(start, {
        kind: Kind.ENUM_TYPE_EXTENSION,
        name,
        directives,
        values
      });
    }
    /**
     * InputObjectTypeExtension :
     *   - extend input Name Directives[Const]? InputFieldsDefinition
     *   - extend input Name Directives[Const]
     */
    parseInputObjectTypeExtension() {
      const start = this._lexer.token;
      this.expectKeyword("extend");
      this.expectKeyword("input");
      const name = this.parseName();
      const directives = this.parseConstDirectives();
      const fields = this.parseInputFieldsDefinition();
      if (directives.length === 0 && fields.length === 0) {
        throw this.unexpected();
      }
      return this.node(start, {
        kind: Kind.INPUT_OBJECT_TYPE_EXTENSION,
        name,
        directives,
        fields
      });
    }
    /**
     * ```
     * DirectiveDefinition :
     *   - Description? directive @ Name ArgumentsDefinition? `repeatable`? on DirectiveLocations
     * ```
     */
    parseDirectiveDefinition() {
      const start = this._lexer.token;
      const description = this.parseDescription();
      this.expectKeyword("directive");
      this.expectToken(TokenKind.AT);
      const name = this.parseName();
      const args = this.parseArgumentDefs();
      const repeatable = this.expectOptionalKeyword("repeatable");
      this.expectKeyword("on");
      const locations = this.parseDirectiveLocations();
      return this.node(start, {
        kind: Kind.DIRECTIVE_DEFINITION,
        description,
        name,
        arguments: args,
        repeatable,
        locations
      });
    }
    /**
     * DirectiveLocations :
     *   - `|`? DirectiveLocation
     *   - DirectiveLocations | DirectiveLocation
     */
    parseDirectiveLocations() {
      return this.delimitedMany(TokenKind.PIPE, this.parseDirectiveLocation);
    }
    /*
     * DirectiveLocation :
     *   - ExecutableDirectiveLocation
     *   - TypeSystemDirectiveLocation
     *
     * ExecutableDirectiveLocation : one of
     *   `QUERY`
     *   `MUTATION`
     *   `SUBSCRIPTION`
     *   `FIELD`
     *   `FRAGMENT_DEFINITION`
     *   `FRAGMENT_SPREAD`
     *   `INLINE_FRAGMENT`
     *
     * TypeSystemDirectiveLocation : one of
     *   `SCHEMA`
     *   `SCALAR`
     *   `OBJECT`
     *   `FIELD_DEFINITION`
     *   `ARGUMENT_DEFINITION`
     *   `INTERFACE`
     *   `UNION`
     *   `ENUM`
     *   `ENUM_VALUE`
     *   `INPUT_OBJECT`
     *   `INPUT_FIELD_DEFINITION`
     */
    parseDirectiveLocation() {
      const start = this._lexer.token;
      const name = this.parseName();
      if (Object.prototype.hasOwnProperty.call(DirectiveLocation, name.value)) {
        return name;
      }
      throw this.unexpected(start);
    }
    // Core parsing utility functions
    /**
     * Returns a node that, if configured to do so, sets a "loc" field as a
     * location object, used to identify the place in the source that created a
     * given parsed object.
     */
    node(startToken, node) {
      if (this._options.noLocation !== true) {
        node.loc = new Location(
          startToken,
          this._lexer.lastToken,
          this._lexer.source
        );
      }
      return node;
    }
    /**
     * Determines if the next token is of a given kind
     */
    peek(kind) {
      return this._lexer.token.kind === kind;
    }
    /**
     * If the next token is of the given kind, return that token after advancing the lexer.
     * Otherwise, do not change the parser state and throw an error.
     */
    expectToken(kind) {
      const token = this._lexer.token;
      if (token.kind === kind) {
        this.advanceLexer();
        return token;
      }
      throw syntaxError(
        this._lexer.source,
        token.start,
        `Expected ${getTokenKindDesc(kind)}, found ${getTokenDesc(token)}.`
      );
    }
    /**
     * If the next token is of the given kind, return "true" after advancing the lexer.
     * Otherwise, do not change the parser state and return "false".
     */
    expectOptionalToken(kind) {
      const token = this._lexer.token;
      if (token.kind === kind) {
        this.advanceLexer();
        return true;
      }
      return false;
    }
    /**
     * If the next token is a given keyword, advance the lexer.
     * Otherwise, do not change the parser state and throw an error.
     */
    expectKeyword(value) {
      const token = this._lexer.token;
      if (token.kind === TokenKind.NAME && token.value === value) {
        this.advanceLexer();
      } else {
        throw syntaxError(
          this._lexer.source,
          token.start,
          `Expected "${value}", found ${getTokenDesc(token)}.`
        );
      }
    }
    /**
     * If the next token is a given keyword, return "true" after advancing the lexer.
     * Otherwise, do not change the parser state and return "false".
     */
    expectOptionalKeyword(value) {
      const token = this._lexer.token;
      if (token.kind === TokenKind.NAME && token.value === value) {
        this.advanceLexer();
        return true;
      }
      return false;
    }
    /**
     * Helper function for creating an error when an unexpected lexed token is encountered.
     */
    unexpected(atToken) {
      const token = atToken !== null && atToken !== void 0 ? atToken : this._lexer.token;
      return syntaxError(
        this._lexer.source,
        token.start,
        `Unexpected ${getTokenDesc(token)}.`
      );
    }
    /**
     * Returns a possibly empty list of parse nodes, determined by the parseFn.
     * This list begins with a lex token of openKind and ends with a lex token of closeKind.
     * Advances the parser to the next lex token after the closing token.
     */
    any(openKind, parseFn, closeKind) {
      this.expectToken(openKind);
      const nodes = [];
      while (!this.expectOptionalToken(closeKind)) {
        nodes.push(parseFn.call(this));
      }
      return nodes;
    }
    /**
     * Returns a list of parse nodes, determined by the parseFn.
     * It can be empty only if open token is missing otherwise it will always return non-empty list
     * that begins with a lex token of openKind and ends with a lex token of closeKind.
     * Advances the parser to the next lex token after the closing token.
     */
    optionalMany(openKind, parseFn, closeKind) {
      if (this.expectOptionalToken(openKind)) {
        const nodes = [];
        do {
          nodes.push(parseFn.call(this));
        } while (!this.expectOptionalToken(closeKind));
        return nodes;
      }
      return [];
    }
    /**
     * Returns a non-empty list of parse nodes, determined by the parseFn.
     * This list begins with a lex token of openKind and ends with a lex token of closeKind.
     * Advances the parser to the next lex token after the closing token.
     */
    many(openKind, parseFn, closeKind) {
      this.expectToken(openKind);
      const nodes = [];
      do {
        nodes.push(parseFn.call(this));
      } while (!this.expectOptionalToken(closeKind));
      return nodes;
    }
    /**
     * Returns a non-empty list of parse nodes, determined by the parseFn.
     * This list may begin with a lex token of delimiterKind followed by items separated by lex tokens of tokenKind.
     * Advances the parser to the next lex token after last item in the list.
     */
    delimitedMany(delimiterKind, parseFn) {
      this.expectOptionalToken(delimiterKind);
      const nodes = [];
      do {
        nodes.push(parseFn.call(this));
      } while (this.expectOptionalToken(delimiterKind));
      return nodes;
    }
    advanceLexer() {
      const { maxTokens } = this._options;
      const token = this._lexer.advance();
      if (maxTokens !== void 0 && token.kind !== TokenKind.EOF) {
        ++this._tokenCounter;
        if (this._tokenCounter > maxTokens) {
          throw syntaxError(
            this._lexer.source,
            token.start,
            `Document contains more that ${maxTokens} tokens. Parsing aborted.`
          );
        }
      }
    }
  };
  function getTokenDesc(token) {
    const value = token.value;
    return getTokenKindDesc(token.kind) + (value != null ? ` "${value}"` : "");
  }
  function getTokenKindDesc(kind) {
    return isPunctuatorTokenKind(kind) ? `"${kind}"` : kind;
  }

  // src/core/utils/internal/jsonParse.ts
  function jsonParse(value) {
    try {
      return JSON.parse(value);
    } catch (error3) {
      return void 0;
    }
  }

  // node_modules/.pnpm/headers-polyfill@4.0.3/node_modules/headers-polyfill/lib/index.mjs
  var __create4 = Object.create;
  var __defProp6 = Object.defineProperty;
  var __getOwnPropDesc5 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames5 = Object.getOwnPropertyNames;
  var __getProtoOf4 = Object.getPrototypeOf;
  var __hasOwnProp5 = Object.prototype.hasOwnProperty;
  var __commonJS4 = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames5(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps5 = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames5(from))
        if (!__hasOwnProp5.call(to, key) && key !== except)
          __defProp6(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc5(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM4 = (mod, isNodeMode, target) => (target = mod != null ? __create4(__getProtoOf4(mod)) : {}, __copyProps5(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp6(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var require_set_cookie2 = __commonJS4({
    "node_modules/set-cookie-parser/lib/set-cookie.js"(exports, module) {
      "use strict";
      var defaultParseOptions = {
        decodeValues: true,
        map: false,
        silent: false
      };
      function isNonEmptyString(str) {
        return typeof str === "string" && !!str.trim();
      }
      function parseString(setCookieValue, options) {
        var parts = setCookieValue.split(";").filter(isNonEmptyString);
        var nameValuePairStr = parts.shift();
        var parsed = parseNameValuePair(nameValuePairStr);
        var name = parsed.name;
        var value = parsed.value;
        options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
        try {
          value = options.decodeValues ? decodeURIComponent(value) : value;
        } catch (e) {
          console.error(
            "set-cookie-parser encountered an error while decoding a cookie with value '" + value + "'. Set options.decodeValues to false to disable this feature.",
            e
          );
        }
        var cookie = {
          name,
          value
        };
        parts.forEach(function(part) {
          var sides = part.split("=");
          var key = sides.shift().trimLeft().toLowerCase();
          var value2 = sides.join("=");
          if (key === "expires") {
            cookie.expires = new Date(value2);
          } else if (key === "max-age") {
            cookie.maxAge = parseInt(value2, 10);
          } else if (key === "secure") {
            cookie.secure = true;
          } else if (key === "httponly") {
            cookie.httpOnly = true;
          } else if (key === "samesite") {
            cookie.sameSite = value2;
          } else {
            cookie[key] = value2;
          }
        });
        return cookie;
      }
      function parseNameValuePair(nameValuePairStr) {
        var name = "";
        var value = "";
        var nameValueArr = nameValuePairStr.split("=");
        if (nameValueArr.length > 1) {
          name = nameValueArr.shift();
          value = nameValueArr.join("=");
        } else {
          value = nameValuePairStr;
        }
        return { name, value };
      }
      function parse3(input, options) {
        options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
        if (!input) {
          if (!options.map) {
            return [];
          } else {
            return {};
          }
        }
        if (input.headers) {
          if (typeof input.headers.getSetCookie === "function") {
            input = input.headers.getSetCookie();
          } else if (input.headers["set-cookie"]) {
            input = input.headers["set-cookie"];
          } else {
            var sch = input.headers[Object.keys(input.headers).find(function(key) {
              return key.toLowerCase() === "set-cookie";
            })];
            if (!sch && input.headers.cookie && !options.silent) {
              console.warn(
                "Warning: set-cookie-parser appears to have been called on a request object. It is designed to parse Set-Cookie headers from responses, not Cookie headers from requests. Set the option {silent: true} to suppress this warning."
              );
            }
            input = sch;
          }
        }
        if (!Array.isArray(input)) {
          input = [input];
        }
        options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
        if (!options.map) {
          return input.filter(isNonEmptyString).map(function(str) {
            return parseString(str, options);
          });
        } else {
          var cookies = {};
          return input.filter(isNonEmptyString).reduce(function(cookies2, str) {
            var cookie = parseString(str, options);
            cookies2[cookie.name] = cookie;
            return cookies2;
          }, cookies);
        }
      }
      function splitCookiesString2(cookiesString) {
        if (Array.isArray(cookiesString)) {
          return cookiesString;
        }
        if (typeof cookiesString !== "string") {
          return [];
        }
        var cookiesStrings = [];
        var pos = 0;
        var start;
        var ch;
        var lastComma;
        var nextStart;
        var cookiesSeparatorFound;
        function skipWhitespace() {
          while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
            pos += 1;
          }
          return pos < cookiesString.length;
        }
        function notSpecialChar() {
          ch = cookiesString.charAt(pos);
          return ch !== "=" && ch !== ";" && ch !== ",";
        }
        while (pos < cookiesString.length) {
          start = pos;
          cookiesSeparatorFound = false;
          while (skipWhitespace()) {
            ch = cookiesString.charAt(pos);
            if (ch === ",") {
              lastComma = pos;
              pos += 1;
              skipWhitespace();
              nextStart = pos;
              while (pos < cookiesString.length && notSpecialChar()) {
                pos += 1;
              }
              if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
                cookiesSeparatorFound = true;
                pos = nextStart;
                cookiesStrings.push(cookiesString.substring(start, lastComma));
                start = pos;
              } else {
                pos = lastComma + 1;
              }
            } else {
              pos += 1;
            }
          }
          if (!cookiesSeparatorFound || pos >= cookiesString.length) {
            cookiesStrings.push(cookiesString.substring(start, cookiesString.length));
          }
        }
        return cookiesStrings;
      }
      module.exports = parse3;
      module.exports.parse = parse3;
      module.exports.parseString = parseString;
      module.exports.splitCookiesString = splitCookiesString2;
    }
  });
  var import_set_cookie_parser2 = __toESM4(require_set_cookie2());
  var HEADERS_INVALID_CHARACTERS = /[^a-z0-9\-#$%&'*+.^_`|~]/i;
  function normalizeHeaderName(name) {
    if (HEADERS_INVALID_CHARACTERS.test(name) || name.trim() === "") {
      throw new TypeError("Invalid character in header field name");
    }
    return name.trim().toLowerCase();
  }
  var charCodesToRemove = [
    String.fromCharCode(10),
    String.fromCharCode(13),
    String.fromCharCode(9),
    String.fromCharCode(32)
  ];
  var HEADER_VALUE_REMOVE_REGEXP = new RegExp(
    `(^[${charCodesToRemove.join("")}]|$[${charCodesToRemove.join("")}])`,
    "g"
  );
  function normalizeHeaderValue(value) {
    const nextValue = value.replace(HEADER_VALUE_REMOVE_REGEXP, "");
    return nextValue;
  }
  function isValidHeaderName(value) {
    if (typeof value !== "string") {
      return false;
    }
    if (value.length === 0) {
      return false;
    }
    for (let i = 0; i < value.length; i++) {
      const character = value.charCodeAt(i);
      if (character > 127 || !isToken(character)) {
        return false;
      }
    }
    return true;
  }
  function isToken(value) {
    return ![
      127,
      32,
      "(",
      ")",
      "<",
      ">",
      "@",
      ",",
      ";",
      ":",
      "\\",
      '"',
      "/",
      "[",
      "]",
      "?",
      "=",
      "{",
      "}"
    ].includes(value);
  }
  function isValidHeaderValue(value) {
    if (typeof value !== "string") {
      return false;
    }
    if (value.trim() !== value) {
      return false;
    }
    for (let i = 0; i < value.length; i++) {
      const character = value.charCodeAt(i);
      if (
        // NUL.
        character === 0 || // HTTP newline bytes.
        character === 10 || character === 13
      ) {
        return false;
      }
    }
    return true;
  }
  var NORMALIZED_HEADERS = Symbol("normalizedHeaders");
  var RAW_HEADER_NAMES = Symbol("rawHeaderNames");
  var HEADER_VALUE_DELIMITER = ", ";
  var _a;
  var _b;
  var _c;
  var Headers2 = class _Headers {
    constructor(init) {
      this[_a] = {};
      this[_b] = /* @__PURE__ */ new Map();
      this[_c] = "Headers";
      if (["Headers", "HeadersPolyfill"].includes(init?.constructor.name) || init instanceof _Headers || typeof globalThis.Headers !== "undefined" && init instanceof globalThis.Headers) {
        const initialHeaders = init;
        initialHeaders.forEach((value, name) => {
          this.append(name, value);
        }, this);
      } else if (Array.isArray(init)) {
        init.forEach(([name, value]) => {
          this.append(
            name,
            Array.isArray(value) ? value.join(HEADER_VALUE_DELIMITER) : value
          );
        });
      } else if (init) {
        Object.getOwnPropertyNames(init).forEach((name) => {
          const value = init[name];
          this.append(
            name,
            Array.isArray(value) ? value.join(HEADER_VALUE_DELIMITER) : value
          );
        });
      }
    }
    [(_a = NORMALIZED_HEADERS, _b = RAW_HEADER_NAMES, _c = Symbol.toStringTag, Symbol.iterator)]() {
      return this.entries();
    }
    *keys() {
      for (const [name] of this.entries()) {
        yield name;
      }
    }
    *values() {
      for (const [, value] of this.entries()) {
        yield value;
      }
    }
    *entries() {
      let sortedKeys = Object.keys(this[NORMALIZED_HEADERS]).sort(
        (a, b) => a.localeCompare(b)
      );
      for (const name of sortedKeys) {
        if (name === "set-cookie") {
          for (const value of this.getSetCookie()) {
            yield [name, value];
          }
        } else {
          yield [name, this.get(name)];
        }
      }
    }
    /**
     * Returns a boolean stating whether a `Headers` object contains a certain header.
     */
    has(name) {
      if (!isValidHeaderName(name)) {
        throw new TypeError(`Invalid header name "${name}"`);
      }
      return this[NORMALIZED_HEADERS].hasOwnProperty(normalizeHeaderName(name));
    }
    /**
     * Returns a `ByteString` sequence of all the values of a header with a given name.
     */
    get(name) {
      if (!isValidHeaderName(name)) {
        throw TypeError(`Invalid header name "${name}"`);
      }
      return this[NORMALIZED_HEADERS][normalizeHeaderName(name)] ?? null;
    }
    /**
     * Sets a new value for an existing header inside a `Headers` object, or adds the header if it does not already exist.
     */
    set(name, value) {
      if (!isValidHeaderName(name) || !isValidHeaderValue(value)) {
        return;
      }
      const normalizedName = normalizeHeaderName(name);
      const normalizedValue = normalizeHeaderValue(value);
      this[NORMALIZED_HEADERS][normalizedName] = normalizeHeaderValue(normalizedValue);
      this[RAW_HEADER_NAMES].set(normalizedName, name);
    }
    /**
     * Appends a new value onto an existing header inside a `Headers` object, or adds the header if it does not already exist.
     */
    append(name, value) {
      if (!isValidHeaderName(name) || !isValidHeaderValue(value)) {
        return;
      }
      const normalizedName = normalizeHeaderName(name);
      const normalizedValue = normalizeHeaderValue(value);
      let resolvedValue = this.has(normalizedName) ? `${this.get(normalizedName)}, ${normalizedValue}` : normalizedValue;
      this.set(name, resolvedValue);
    }
    /**
     * Deletes a header from the `Headers` object.
     */
    delete(name) {
      if (!isValidHeaderName(name)) {
        return;
      }
      if (!this.has(name)) {
        return;
      }
      const normalizedName = normalizeHeaderName(name);
      delete this[NORMALIZED_HEADERS][normalizedName];
      this[RAW_HEADER_NAMES].delete(normalizedName);
    }
    /**
     * Traverses the `Headers` object,
     * calling the given callback for each header.
     */
    forEach(callback, thisArg) {
      for (const [name, value] of this.entries()) {
        callback.call(thisArg, value, name, this);
      }
    }
    /**
     * Returns an array containing the values
     * of all Set-Cookie headers associated
     * with a response
     */
    getSetCookie() {
      const setCookieHeader = this.get("set-cookie");
      if (setCookieHeader === null) {
        return [];
      }
      if (setCookieHeader === "") {
        return [""];
      }
      return (0, import_set_cookie_parser2.splitCookiesString)(setCookieHeader);
    }
  };
  function stringToHeaders(str) {
    const lines = str.trim().split(/[\r\n]+/);
    return lines.reduce((headers, line) => {
      if (line.trim() === "") {
        return headers;
      }
      const parts = line.split(": ");
      const name = parts.shift();
      const value = parts.join(": ");
      headers.append(name, value);
      return headers;
    }, new Headers2());
  }

  // src/core/utils/internal/parseMultipartData.ts
  function parseContentHeaders(headersString) {
    const headers = stringToHeaders(headersString);
    const contentType = headers.get("content-type") || "text/plain";
    const disposition = headers.get("content-disposition");
    if (!disposition) {
      throw new Error('"Content-Disposition" header is required.');
    }
    const directives = disposition.split(";").reduce((acc, chunk) => {
      const [name2, ...rest] = chunk.trim().split("=");
      acc[name2] = rest.join("=");
      return acc;
    }, {});
    const name = directives.name?.slice(1, -1);
    const filename = directives.filename?.slice(1, -1);
    return {
      name,
      filename,
      contentType
    };
  }
  function parseMultipartData(data, headers) {
    const contentType = headers?.get("content-type");
    if (!contentType) {
      return void 0;
    }
    const [, ...directives] = contentType.split(/; */);
    const boundary = directives.filter((d) => d.startsWith("boundary=")).map((s) => s.replace(/^boundary=/, ""))[0];
    if (!boundary) {
      return void 0;
    }
    const boundaryRegExp = new RegExp(`--+${boundary}`);
    const fields = data.split(boundaryRegExp).filter((chunk) => chunk.startsWith("\r\n") && chunk.endsWith("\r\n")).map((chunk) => chunk.trimStart().replace(/\r\n$/, ""));
    if (!fields.length) {
      return void 0;
    }
    const parsedBody = {};
    try {
      for (const field of fields) {
        const [contentHeaders, ...rest] = field.split("\r\n\r\n");
        const contentBody = rest.join("\r\n\r\n");
        const { contentType: contentType2, filename, name } = parseContentHeaders(contentHeaders);
        const value = filename === void 0 ? contentBody : new File([contentBody], filename, { type: contentType2 });
        const parsedValue = parsedBody[name];
        if (parsedValue === void 0) {
          parsedBody[name] = value;
        } else if (Array.isArray(parsedValue)) {
          parsedBody[name] = [...parsedValue, value];
        } else {
          parsedBody[name] = [parsedValue, value];
        }
      }
      return parsedBody;
    } catch (error3) {
      return void 0;
    }
  }

  // src/core/utils/internal/parseGraphQLRequest.ts
  function parseDocumentNode(node) {
    const operationDef = node.definitions.find((definition) => {
      return definition.kind === "OperationDefinition";
    });
    return {
      operationType: operationDef?.operation,
      operationName: operationDef?.name?.value
    };
  }
  function parseQuery(query) {
    try {
      const ast = parse2(query);
      return parseDocumentNode(ast);
    } catch (error3) {
      return error3;
    }
  }
  function extractMultipartVariables(variables, map, files) {
    const operations = { variables };
    for (const [key, pathArray] of Object.entries(map)) {
      if (!(key in files)) {
        throw new Error(`Given files do not have a key '${key}' .`);
      }
      for (const dotPath of pathArray) {
        const [lastPath, ...reversedPaths] = dotPath.split(".").reverse();
        const paths = reversedPaths.reverse();
        let target = operations;
        for (const path of paths) {
          if (!(path in target)) {
            throw new Error(`Property '${paths}' is not in operations.`);
          }
          target = target[path];
        }
        target[lastPath] = files[key];
      }
    }
    return operations.variables;
  }
  async function getGraphQLInput(request) {
    switch (request.method) {
      case "GET": {
        const url = new URL(request.url);
        const query = url.searchParams.get("query");
        const variables = url.searchParams.get("variables") || "";
        return {
          query,
          variables: jsonParse(variables)
        };
      }
      case "POST": {
        const requestClone = request.clone();
        if (request.headers.get("content-type")?.includes("multipart/form-data")) {
          const responseJson = parseMultipartData(
            await requestClone.text(),
            request.headers
          );
          if (!responseJson) {
            return null;
          }
          const { operations, map, ...files } = responseJson;
          const parsedOperations = jsonParse(
            operations
          ) || {};
          if (!parsedOperations.query) {
            return null;
          }
          const parsedMap = jsonParse(map || "") || {};
          const variables = parsedOperations.variables ? extractMultipartVariables(
            parsedOperations.variables,
            parsedMap,
            files
          ) : {};
          return {
            query: parsedOperations.query,
            variables
          };
        }
        const requestJson = await requestClone.json().catch(() => null);
        if (requestJson?.query) {
          const { query, variables } = requestJson;
          return {
            query,
            variables
          };
        }
      }
      default:
        return null;
    }
  }
  async function parseGraphQLRequest(request) {
    const input = await getGraphQLInput(request);
    if (!input || !input.query) {
      return;
    }
    const { query, variables } = input;
    const parsedResult = parseQuery(query);
    if (parsedResult instanceof Error) {
      const requestPublicUrl = toPublicUrl(request.url);
      throw new Error(
        devUtils.formatMessage(
          'Failed to intercept a GraphQL request to "%s %s": cannot parse query. See the error message from the parser below.\n\n%s',
          request.method,
          requestPublicUrl,
          parsedResult.message
        )
      );
    }
    return {
      query: input.query,
      operationType: parsedResult.operationType,
      operationName: parsedResult.operationName,
      variables
    };
  }

  // src/core/handlers/GraphQLHandler.ts
  function isDocumentNode(value) {
    if (value == null) {
      return false;
    }
    return typeof value === "object" && "kind" in value && "definitions" in value;
  }
  var GraphQLHandler = class _GraphQLHandler extends RequestHandler {
    endpoint;
    static parsedRequestCache = /* @__PURE__ */ new WeakMap();
    constructor(operationType, operationName, endpoint, resolver, options) {
      let resolvedOperationName = operationName;
      if (isDocumentNode(operationName)) {
        const parsedNode = parseDocumentNode(operationName);
        if (parsedNode.operationType !== operationType) {
          throw new Error(
            `Failed to create a GraphQL handler: provided a DocumentNode with a mismatched operation type (expected "${operationType}", but got "${parsedNode.operationType}").`
          );
        }
        if (!parsedNode.operationName) {
          throw new Error(
            `Failed to create a GraphQL handler: provided a DocumentNode with no operation name.`
          );
        }
        resolvedOperationName = parsedNode.operationName;
      }
      const header = operationType === "all" ? `${operationType} (origin: ${endpoint.toString()})` : `${operationType} ${resolvedOperationName} (origin: ${endpoint.toString()})`;
      super({
        info: {
          header,
          operationType,
          operationName: resolvedOperationName
        },
        resolver,
        options
      });
      this.endpoint = endpoint;
    }
    /**
     * Parses the request body, once per request, cached across all
     * GraphQL handlers. This is done to avoid multiple parsing of the
     * request body, which each requires a clone of the request.
     */
    async parseGraphQLRequestOrGetFromCache(request) {
      if (!_GraphQLHandler.parsedRequestCache.has(request)) {
        _GraphQLHandler.parsedRequestCache.set(
          request,
          await parseGraphQLRequest(request).catch((error3) => {
            console.error(error3);
            return void 0;
          })
        );
      }
      return _GraphQLHandler.parsedRequestCache.get(request);
    }
    async parse(args) {
      const match2 = matchRequestUrl(new URL(args.request.url), this.endpoint);
      const cookies = getAllRequestCookies(args.request);
      if (!match2.matches) {
        return { match: match2, cookies };
      }
      const parsedResult = await this.parseGraphQLRequestOrGetFromCache(
        args.request
      );
      if (typeof parsedResult === "undefined") {
        return { match: match2, cookies };
      }
      return {
        match: match2,
        cookies,
        query: parsedResult.query,
        operationType: parsedResult.operationType,
        operationName: parsedResult.operationName,
        variables: parsedResult.variables
      };
    }
    predicate(args) {
      if (args.parsedResult.operationType === void 0) {
        return false;
      }
      if (!args.parsedResult.operationName && this.info.operationType !== "all") {
        const publicUrl = toPublicUrl(args.request.url);
        devUtils.warn(`Failed to intercept a GraphQL request at "${args.request.method} ${publicUrl}": anonymous GraphQL operations are not supported.

Consider naming this operation or using "graphql.operation()" request handler to intercept GraphQL requests regardless of their operation name/type. Read more: https://mswjs.io/docs/api/graphql/#graphqloperationresolver`);
        return false;
      }
      const hasMatchingOperationType = this.info.operationType === "all" || args.parsedResult.operationType === this.info.operationType;
      const hasMatchingOperationName = this.info.operationName instanceof RegExp ? this.info.operationName.test(args.parsedResult.operationName || "") : args.parsedResult.operationName === this.info.operationName;
      return args.parsedResult.match.matches && hasMatchingOperationType && hasMatchingOperationName;
    }
    extendResolverArgs(args) {
      return {
        query: args.parsedResult.query || "",
        operationName: args.parsedResult.operationName || "",
        variables: args.parsedResult.variables || {},
        cookies: args.parsedResult.cookies
      };
    }
    async log(args) {
      const loggedRequest = await serializeRequest(args.request);
      const loggedResponse = await serializeResponse(args.response);
      const statusColor = getStatusCodeColor(loggedResponse.status);
      const requestInfo = args.parsedResult.operationName ? `${args.parsedResult.operationType} ${args.parsedResult.operationName}` : `anonymous ${args.parsedResult.operationType}`;
      console.groupCollapsed(
        devUtils.formatMessage(
          `${getTimestamp()} ${requestInfo} (%c${loggedResponse.status} ${loggedResponse.statusText}%c)`
        ),
        `color:${statusColor}`,
        "color:inherit"
      );
      console.log("Request:", loggedRequest);
      console.log("Handler:", this);
      console.log("Response:", loggedResponse);
      console.groupEnd();
    }
  };

  // src/core/graphql.ts
  function createScopedGraphQLHandler(operationType, url) {
    return (operationName, resolver, options = {}) => {
      return new GraphQLHandler(
        operationType,
        operationName,
        url,
        resolver,
        options
      );
    };
  }
  function createGraphQLOperationHandler(url) {
    return (resolver) => {
      return new GraphQLHandler("all", new RegExp(".*"), url, resolver);
    };
  }
  var standardGraphQLHandlers = {
    /**
     * Intercepts a GraphQL query by a given name.
     *
     * @example
     * graphql.query('GetUser', () => {
     *   return HttpResponse.json({ data: { user: { name: 'John' } } })
     * })
     *
     * @see {@link https://mswjs.io/docs/api/graphql#graphqlqueryqueryname-resolver `graphql.query()` API reference}
     */
    query: createScopedGraphQLHandler("query", "*"),
    /**
     * Intercepts a GraphQL mutation by its name.
     *
     * @example
     * graphql.mutation('SavePost', () => {
     *   return HttpResponse.json({ data: { post: { id: 'abc-123 } } })
     * })
     *
     * @see {@link https://mswjs.io/docs/api/graphql#graphqlmutationmutationname-resolver `graphql.query()` API reference}
     *
     */
    mutation: createScopedGraphQLHandler("mutation", "*"),
    /**
     * Intercepts any GraphQL operation, regardless of its type or name.
     *
     * @example
     * graphql.operation(() => {
     *   return HttpResponse.json({ data: { name: 'John' } })
     * })
     *
     * @see {@link https://mswjs.io/docs/api/graphql#graphloperationresolver `graphql.operation()` API reference}
     */
    operation: createGraphQLOperationHandler("*")
  };
  function createGraphQLLink(url) {
    return {
      operation: createGraphQLOperationHandler(url),
      query: createScopedGraphQLHandler("query", url),
      mutation: createScopedGraphQLHandler("mutation", url)
    };
  }
  var graphql = {
    ...standardGraphQLHandlers,
    /**
     * Intercepts GraphQL operations scoped by the given URL.
     *
     * @example
     * const github = graphql.link('https://api.github.com/graphql')
     * github.query('GetRepo', resolver)
     *
     * @see {@link https://mswjs.io/docs/api/graphql#graphqllinkurl `graphql.link()` API reference}
     */
    link: createGraphQLLink
  };

  // node_modules/.pnpm/@open-draft+until@2.1.0/node_modules/@open-draft/until/lib/index.mjs
  var until = async (promise) => {
    try {
      const data = await promise().catch((error3) => {
        throw error3;
      });
      return { error: null, data };
    } catch (error3) {
      return { error: error3, data: null };
    }
  };

  // src/core/utils/executeHandlers.ts
  var executeHandlers = async ({
    request,
    requestId,
    handlers,
    resolutionContext
  }) => {
    let matchingHandler = null;
    let result = null;
    for (const handler of handlers) {
      result = await handler.run({ request, requestId, resolutionContext });
      if (result !== null) {
        matchingHandler = handler;
      }
      if (result?.response) {
        break;
      }
    }
    if (matchingHandler) {
      return {
        handler: matchingHandler,
        parsedResult: result?.parsedResult,
        response: result?.response
      };
    }
    return null;
  };

  // src/core/utils/request/onUnhandledRequest.ts
  async function onUnhandledRequest(request, strategy = "warn") {
    const url = new URL(request.url);
    const publicUrl = toPublicUrl(url) + url.search;
    const unhandledRequestMessage = `intercepted a request without a matching request handler:

  \u2022 ${request.method} ${publicUrl}

If you still wish to intercept this unhandled request, please create a request handler for it.
Read more: https://mswjs.io/docs/getting-started/mocks`;
    function applyStrategy(strategy2) {
      switch (strategy2) {
        case "error": {
          devUtils.error("Error: %s", unhandledRequestMessage);
          throw new Error(
            devUtils.formatMessage(
              'Cannot bypass a request when using the "error" strategy for the "onUnhandledRequest" option.'
            )
          );
        }
        case "warn": {
          devUtils.warn("Warning: %s", unhandledRequestMessage);
          break;
        }
        case "bypass":
          break;
        default:
          throw new Error(
            devUtils.formatMessage(
              'Failed to react to an unhandled request: unknown strategy "%s". Please provide one of the supported strategies ("bypass", "warn", "error") or a custom callback function as the value of the "onUnhandledRequest" option.',
              strategy2
            )
          );
      }
    }
    if (typeof strategy === "function") {
      strategy(request, {
        warning: applyStrategy.bind(null, "warn"),
        error: applyStrategy.bind(null, "error")
      });
      return;
    }
    if (url.protocol === "file:") {
      return;
    }
    applyStrategy(strategy);
  }

  // src/core/utils/request/readResponseCookies.ts
  function readResponseCookies(request, response) {
    store.add({ ...request, url: request.url.toString() }, response);
    store.persist();
  }

  // src/core/utils/handleRequest.ts
  async function handleRequest(request, requestId, handlers, options, emitter, handleRequestOptions) {
    emitter.emit("request:start", { request, requestId });
    if (request.headers.get("x-msw-intention") === "bypass") {
      emitter.emit("request:end", { request, requestId });
      handleRequestOptions?.onPassthroughResponse?.(request);
      return;
    }
    const lookupResult = await until(() => {
      return executeHandlers({
        request,
        requestId,
        handlers,
        resolutionContext: handleRequestOptions?.resolutionContext
      });
    });
    if (lookupResult.error) {
      emitter.emit("unhandledException", {
        error: lookupResult.error,
        request,
        requestId
      });
      throw lookupResult.error;
    }
    if (!lookupResult.data) {
      await onUnhandledRequest(request, options.onUnhandledRequest);
      emitter.emit("request:unhandled", { request, requestId });
      emitter.emit("request:end", { request, requestId });
      handleRequestOptions?.onPassthroughResponse?.(request);
      return;
    }
    const { response } = lookupResult.data;
    if (!response) {
      emitter.emit("request:end", { request, requestId });
      handleRequestOptions?.onPassthroughResponse?.(request);
      return;
    }
    if (response.status === 302 && response.headers.get("x-msw-intention") === "passthrough") {
      emitter.emit("request:end", { request, requestId });
      handleRequestOptions?.onPassthroughResponse?.(request);
      return;
    }
    readResponseCookies(request, response);
    emitter.emit("request:match", { request, requestId });
    const requiredLookupResult = lookupResult.data;
    const transformedResponse = handleRequestOptions?.transformResponse?.(response) || response;
    handleRequestOptions?.onMockedResponse?.(
      transformedResponse,
      requiredLookupResult
    );
    emitter.emit("request:end", { request, requestId });
    return transformedResponse;
  }

  // src/core/getResponse.ts
  var getResponse = async (handlers, request) => {
    const result = await executeHandlers({
      request,
      requestId: createRequestId(),
      handlers
    });
    return result?.response;
  };

  // src/core/utils/HttpResponse/decorators.ts
  var { message: message2 } = source_default;
  function normalizeResponseInit(init = {}) {
    const status = init?.status || 200;
    const statusText = init?.statusText || message2[status] || "";
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
      const responseCookies = Headers2.prototype.getSetCookie.call(
        init.headers
      );
      for (const cookieString of responseCookies) {
        document.cookie = cookieString;
      }
    }
    return response;
  }

  // src/core/HttpResponse.ts
  var HttpResponse = class _HttpResponse extends Response {
    constructor(body, init) {
      const responseInit = normalizeResponseInit(init);
      super(body, responseInit);
      decorateResponse(this, responseInit);
    }
    /**
     * Create a `Response` with a `Content-Type: "text/plain"` body.
     * @example
     * HttpResponse.text('hello world')
     * HttpResponse.text('Error', { status: 500 })
     */
    static text(body, init) {
      const responseInit = normalizeResponseInit(init);
      if (!responseInit.headers.has("Content-Type")) {
        responseInit.headers.set("Content-Type", "text/plain");
      }
      if (!responseInit.headers.has("Content-Length")) {
        responseInit.headers.set(
          "Content-Length",
          body ? new Blob([body]).size.toString() : "0"
        );
      }
      return new _HttpResponse(body, responseInit);
    }
    /**
     * Create a `Response` with a `Content-Type: "application/json"` body.
     * @example
     * HttpResponse.json({ firstName: 'John' })
     * HttpResponse.json({ error: 'Not Authorized' }, { status: 401 })
     */
    static json(body, init) {
      const responseInit = normalizeResponseInit(init);
      if (!responseInit.headers.has("Content-Type")) {
        responseInit.headers.set("Content-Type", "application/json");
      }
      const responseText = JSON.stringify(body);
      if (!responseInit.headers.has("Content-Length")) {
        responseInit.headers.set(
          "Content-Length",
          responseText ? new Blob([responseText]).size.toString() : "0"
        );
      }
      return new _HttpResponse(
        responseText,
        responseInit
      );
    }
    /**
     * Create a `Response` with a `Content-Type: "application/xml"` body.
     * @example
     * HttpResponse.xml(`<user name="John" />`)
     * HttpResponse.xml(`<article id="abc-123" />`, { status: 201 })
     */
    static xml(body, init) {
      const responseInit = normalizeResponseInit(init);
      if (!responseInit.headers.has("Content-Type")) {
        responseInit.headers.set("Content-Type", "text/xml");
      }
      return new _HttpResponse(body, responseInit);
    }
    /**
     * Create a `Response` with an `ArrayBuffer` body.
     * @example
     * const buffer = new ArrayBuffer(3)
     * const view = new Uint8Array(buffer)
     * view.set([1, 2, 3])
     *
     * HttpResponse.arrayBuffer(buffer)
     */
    static arrayBuffer(body, init) {
      const responseInit = normalizeResponseInit(init);
      if (body) {
        responseInit.headers.set("Content-Length", body.byteLength.toString());
      }
      return new _HttpResponse(body, responseInit);
    }
    /**
     * Create a `Response` with a `FormData` body.
     * @example
     * const data = new FormData()
     * data.set('name', 'Alice')
     *
     * HttpResponse.formData(data)
     */
    static formData(body, init) {
      return new _HttpResponse(body, normalizeResponseInit(init));
    }
  };

  // src/core/delay.ts
  var SET_TIMEOUT_MAX_ALLOWED_INT = 2147483647;
  var MIN_SERVER_RESPONSE_TIME = 100;
  var MAX_SERVER_RESPONSE_TIME = 400;
  var NODE_SERVER_RESPONSE_TIME = 5;
  function getRealisticResponseTime() {
    if (isNodeProcess()) {
      return NODE_SERVER_RESPONSE_TIME;
    }
    return Math.floor(
      Math.random() * (MAX_SERVER_RESPONSE_TIME - MIN_SERVER_RESPONSE_TIME) + MIN_SERVER_RESPONSE_TIME
    );
  }
  async function delay(durationOrMode) {
    let delayTime;
    if (typeof durationOrMode === "string") {
      switch (durationOrMode) {
        case "infinite": {
          delayTime = SET_TIMEOUT_MAX_ALLOWED_INT;
          break;
        }
        case "real": {
          delayTime = getRealisticResponseTime();
          break;
        }
        default: {
          throw new Error(
            `Failed to delay a response: unknown delay mode "${durationOrMode}". Please make sure you provide one of the supported modes ("real", "infinite") or a number.`
          );
        }
      }
    } else if (typeof durationOrMode === "undefined") {
      delayTime = getRealisticResponseTime();
    } else {
      if (durationOrMode > SET_TIMEOUT_MAX_ALLOWED_INT) {
        throw new Error(
          `Failed to delay a response: provided delay duration (${durationOrMode}) exceeds the maximum allowed duration for "setTimeout" (${SET_TIMEOUT_MAX_ALLOWED_INT}). This will cause the response to be returned immediately. Please use a number within the allowed range to delay the response by exact duration, or consider the "infinite" delay mode to delay the response indefinitely.`
        );
      }
      delayTime = durationOrMode;
    }
    return new Promise((resolve) => setTimeout(resolve, delayTime));
  }

  // src/core/bypass.ts
  function bypass(input, init) {
    const request = new Request(
      // If given a Request instance, clone it not to exhaust
      // the original request's body.
      input instanceof Request ? input.clone() : input,
      init
    );
    invariant(
      !request.bodyUsed,
      'Failed to create a bypassed request to "%s %s": given request instance already has its body read. Make sure to clone the intercepted request if you wish to read its body before bypassing it.',
      request.method,
      request.url
    );
    const requestClone = request.clone();
    requestClone.headers.set("x-msw-intention", "bypass");
    return requestClone;
  }

  // src/core/passthrough.ts
  function passthrough() {
    return new Response(null, {
      status: 302,
      statusText: "Passthrough",
      headers: {
        "x-msw-intention": "passthrough"
      }
    });
  }

  // src/core/index.ts
  checkGlobals();

  // src/browser/utils/getAbsoluteWorkerUrl.ts
  function getAbsoluteWorkerUrl(workerUrl) {
    return new URL(workerUrl, location.href).href;
  }

  // src/browser/setupWorker/start/utils/getWorkerByRegistration.ts
  function getWorkerByRegistration(registration, absoluteWorkerUrl, findWorker) {
    const allStates = [
      registration.active,
      registration.installing,
      registration.waiting
    ];
    const relevantStates = allStates.filter((state) => {
      return state != null;
    });
    const worker = relevantStates.find((worker2) => {
      return findWorker(worker2.scriptURL, absoluteWorkerUrl);
    });
    return worker || null;
  }

  // src/browser/setupWorker/start/utils/getWorkerInstance.ts
  var getWorkerInstance = async (url, options = {}, findWorker) => {
    const absoluteWorkerUrl = getAbsoluteWorkerUrl(url);
    const mockRegistrations = await navigator.serviceWorker.getRegistrations().then(
      (registrations) => registrations.filter(
        (registration) => getWorkerByRegistration(registration, absoluteWorkerUrl, findWorker)
      )
    );
    if (!navigator.serviceWorker.controller && mockRegistrations.length > 0) {
      location.reload();
    }
    const [existingRegistration] = mockRegistrations;
    if (existingRegistration) {
      return existingRegistration.update().then(() => {
        return [
          getWorkerByRegistration(
            existingRegistration,
            absoluteWorkerUrl,
            findWorker
          ),
          existingRegistration
        ];
      });
    }
    const registrationResult = await until(
      async () => {
        const registration = await navigator.serviceWorker.register(url, options);
        return [
          // Compare existing worker registration by its worker URL,
          // to prevent irrelevant workers to resolve here (such as Codesandbox worker).
          getWorkerByRegistration(registration, absoluteWorkerUrl, findWorker),
          registration
        ];
      }
    );
    if (registrationResult.error) {
      const isWorkerMissing = registrationResult.error.message.includes("(404)");
      if (isWorkerMissing) {
        const scopeUrl = new URL(options?.scope || "/", location.href);
        throw new Error(
          devUtils.formatMessage(`Failed to register a Service Worker for scope ('${scopeUrl.href}') with script ('${absoluteWorkerUrl}'): Service Worker script does not exist at the given path.

Did you forget to run "npx msw init <PUBLIC_DIR>"?

Learn more about creating the Service Worker script: https://mswjs.io/docs/cli/init`)
        );
      }
      throw new Error(
        devUtils.formatMessage(
          "Failed to register the Service Worker:\n\n%s",
          registrationResult.error.message
        )
      );
    }
    return registrationResult.data;
  };

  // src/browser/setupWorker/start/utils/printStartMessage.ts
  function printStartMessage(args = {}) {
    if (args.quiet) {
      return;
    }
    const message3 = args.message || "Mocking enabled.";
    console.groupCollapsed(
      `%c${devUtils.formatMessage(message3)}`,
      "color:orangered;font-weight:bold;"
    );
    console.log(
      "%cDocumentation: %chttps://mswjs.io/docs",
      "font-weight:bold",
      "font-weight:normal"
    );
    console.log("Found an issue? https://github.com/mswjs/msw/issues");
    if (args.workerUrl) {
      console.log("Worker script URL:", args.workerUrl);
    }
    if (args.workerScope) {
      console.log("Worker scope:", args.workerScope);
    }
    console.groupEnd();
  }

  // src/browser/setupWorker/start/utils/enableMocking.ts
  async function enableMocking(context, options) {
    context.workerChannel.send("MOCK_ACTIVATE");
    await context.events.once("MOCKING_ENABLED");
    if (context.isMockingEnabled) {
      devUtils.warn(
        `Found a redundant "worker.start()" call. Note that starting the worker while mocking is already enabled will have no effect. Consider removing this "worker.start()" call.`
      );
      return;
    }
    context.isMockingEnabled = true;
    printStartMessage({
      quiet: options.quiet,
      workerScope: context.registration?.scope,
      workerUrl: context.worker?.scriptURL
    });
  }

  // src/browser/setupWorker/start/utils/createMessageChannel.ts
  var WorkerChannel = class {
    constructor(port) {
      this.port = port;
    }
    postMessage(event, ...rest) {
      const [data, transfer] = rest;
      this.port.postMessage({ type: event, data }, { transfer });
    }
  };

  // src/browser/utils/pruneGetRequestBody.ts
  function pruneGetRequestBody(request) {
    if (["HEAD", "GET"].includes(request.method)) {
      return void 0;
    }
    return request.body;
  }

  // src/browser/utils/parseWorkerRequest.ts
  function parseWorkerRequest(incomingRequest) {
    return new Request(incomingRequest.url, {
      ...incomingRequest,
      body: pruneGetRequestBody(incomingRequest)
    });
  }

  // src/core/utils/toResponseInit.ts
  function toResponseInit(response) {
    return {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    };
  }

  // src/browser/setupWorker/start/createRequestListener.ts
  var createRequestListener = (context, options) => {
    return async (event, message3) => {
      const messageChannel = new WorkerChannel(event.ports[0]);
      const requestId = message3.payload.id;
      const request = parseWorkerRequest(message3.payload);
      const requestCloneForLogs = request.clone();
      const requestClone = request.clone();
      RequestHandler.cache.set(request, requestClone);
      context.requests.set(requestId, requestClone);
      try {
        await handleRequest(
          request,
          requestId,
          context.getRequestHandlers(),
          options,
          context.emitter,
          {
            onPassthroughResponse() {
              messageChannel.postMessage("PASSTHROUGH");
            },
            async onMockedResponse(response, { handler, parsedResult }) {
              const responseClone = response.clone();
              const responseCloneForLogs = response.clone();
              const responseInit = toResponseInit(response);
              if (context.supports.readableStreamTransfer) {
                const responseStreamOrNull = response.body;
                messageChannel.postMessage(
                  "MOCK_RESPONSE",
                  {
                    ...responseInit,
                    body: responseStreamOrNull
                  },
                  responseStreamOrNull ? [responseStreamOrNull] : void 0
                );
              } else {
                const responseBufferOrNull = response.body === null ? null : await responseClone.arrayBuffer();
                messageChannel.postMessage("MOCK_RESPONSE", {
                  ...responseInit,
                  body: responseBufferOrNull
                });
              }
              if (!options.quiet) {
                context.emitter.once("response:mocked", () => {
                  handler.log({
                    request: requestCloneForLogs,
                    response: responseCloneForLogs,
                    parsedResult
                  });
                });
              }
            }
          }
        );
      } catch (error3) {
        if (error3 instanceof Error) {
          devUtils.error(
            `Uncaught exception in the request handler for "%s %s":

%s

This exception has been gracefully handled as a 500 response, however, it's strongly recommended to resolve this error, as it indicates a mistake in your code. If you wish to mock an error response, please see this guide: https://mswjs.io/docs/recipes/mocking-error-responses`,
            request.method,
            request.url,
            error3.stack ?? error3
          );
          messageChannel.postMessage("MOCK_RESPONSE", {
            status: 500,
            statusText: "Request Handler Error",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              name: error3.name,
              message: error3.message,
              stack: error3.stack
            })
          });
        }
      }
    };
  };

  // src/browser/utils/checkWorkerIntegrity.ts
  async function checkWorkerIntegrity(context) {
    context.workerChannel.send("INTEGRITY_CHECK_REQUEST");
    const { payload } = await context.events.once("INTEGRITY_CHECK_RESPONSE");
    if (payload.checksum !== "26357c79639bfa20d64c0efca2a87423") {
      devUtils.warn(
        `The currently registered Service Worker has been generated by a different version of MSW (${payload.packageVersion}) and may not be fully compatible with the installed version.

It's recommended you update your worker script by running this command:

  \u2022 npx msw init <PUBLIC_DIR>

You can also automate this process and make the worker script update automatically upon the library installations. Read more: https://mswjs.io/docs/cli/init.`
      );
    }
  }

  // src/browser/setupWorker/start/createResponseListener.ts
  function createResponseListener(context) {
    return (_, message3) => {
      const { payload: responseJson } = message3;
      const { requestId } = responseJson;
      const request = context.requests.get(requestId);
      context.requests.delete(requestId);
      if (responseJson.type?.includes("opaque")) {
        return;
      }
      const response = responseJson.status === 0 ? Response.error() : new Response(
        /**
         * Responses may be streams here, but when we create a response object
         * with null-body status codes, like 204, 205, 304 Response will
         * throw when passed a non-null body, so ensure it's null here
         * for those codes
         */
        isResponseWithoutBody(responseJson.status) ? null : responseJson.body,
        responseJson
      );
      if (!response.url) {
        Object.defineProperty(response, "url", {
          value: request.url,
          enumerable: true,
          writable: false
        });
      }
      context.emitter.emit(
        responseJson.isMockedResponse ? "response:mocked" : "response:bypass",
        {
          response,
          request,
          requestId: responseJson.requestId
        }
      );
    };
  }

  // src/browser/setupWorker/start/utils/validateWorkerScope.ts
  function validateWorkerScope(registration, options) {
    if (!options?.quiet && !location.href.startsWith(registration.scope)) {
      devUtils.warn(
        `Cannot intercept requests on this page because it's outside of the worker's scope ("${registration.scope}"). If you wish to mock API requests on this page, you must resolve this scope issue.

- (Recommended) Register the worker at the root level ("/") of your application.
- Set the "Service-Worker-Allowed" response header to allow out-of-scope workers.`
      );
    }
  }

  // src/browser/setupWorker/start/createStartHandler.ts
  var createStartHandler = (context) => {
    return function start(options, customOptions) {
      const startWorkerInstance = async () => {
        context.events.removeAllListeners();
        context.workerChannel.on(
          "REQUEST",
          createRequestListener(context, options)
        );
        context.workerChannel.on("RESPONSE", createResponseListener(context));
        const instance = await getWorkerInstance(
          options.serviceWorker.url,
          options.serviceWorker.options,
          options.findWorker
        );
        const [worker, registration] = instance;
        if (!worker) {
          const missingWorkerMessage = customOptions?.findWorker ? devUtils.formatMessage(
            `Failed to locate the Service Worker registration using a custom "findWorker" predicate.

Please ensure that the custom predicate properly locates the Service Worker registration at "%s".
More details: https://mswjs.io/docs/api/setup-worker/start#findworker
`,
            options.serviceWorker.url
          ) : devUtils.formatMessage(
            `Failed to locate the Service Worker registration.

This most likely means that the worker script URL "%s" cannot resolve against the actual public hostname (%s). This may happen if your application runs behind a proxy, or has a dynamic hostname.

Please consider using a custom "serviceWorker.url" option to point to the actual worker script location, or a custom "findWorker" option to resolve the Service Worker registration manually. More details: https://mswjs.io/docs/api/setup-worker/start`,
            options.serviceWorker.url,
            location.host
          );
          throw new Error(missingWorkerMessage);
        }
        context.worker = worker;
        context.registration = registration;
        context.events.addListener(window, "beforeunload", () => {
          if (worker.state !== "redundant") {
            context.workerChannel.send("CLIENT_CLOSED");
          }
          window.clearInterval(context.keepAliveInterval);
        });
        await checkWorkerIntegrity(context).catch((error3) => {
          devUtils.error(
            "Error while checking the worker script integrity. Please report this on GitHub (https://github.com/mswjs/msw/issues), including the original error below."
          );
          console.error(error3);
        });
        context.keepAliveInterval = window.setInterval(
          () => context.workerChannel.send("KEEPALIVE_REQUEST"),
          5e3
        );
        validateWorkerScope(registration, context.startOptions);
        return registration;
      };
      const workerRegistration = startWorkerInstance().then(
        async (registration) => {
          const pendingInstance = registration.installing || registration.waiting;
          if (pendingInstance) {
            await new Promise((resolve) => {
              pendingInstance.addEventListener("statechange", () => {
                if (pendingInstance.state === "activated") {
                  return resolve();
                }
              });
            });
          }
          await enableMocking(context, options).catch((error3) => {
            throw new Error(`Failed to enable mocking: ${error3?.message}`);
          });
          return registration;
        }
      );
      return workerRegistration;
    };
  };

  // src/browser/setupWorker/stop/utils/printStopMessage.ts
  function printStopMessage(args = {}) {
    if (args.quiet) {
      return;
    }
    console.log(
      `%c${devUtils.formatMessage("Mocking disabled.")}`,
      "color:orangered;font-weight:bold;"
    );
  }

  // src/browser/setupWorker/stop/createStop.ts
  var createStop = (context) => {
    return function stop() {
      if (!context.isMockingEnabled) {
        devUtils.warn(
          'Found a redundant "worker.stop()" call. Note that stopping the worker while mocking already stopped has no effect. Consider removing this "worker.stop()" call.'
        );
        return;
      }
      context.workerChannel.send("MOCK_DEACTIVATE");
      context.isMockingEnabled = false;
      window.clearInterval(context.keepAliveInterval);
      printStopMessage({ quiet: context.startOptions?.quiet });
    };
  };

  // src/core/utils/internal/isObject.ts
  function isObject(value) {
    return value != null && typeof value === "object" && !Array.isArray(value);
  }

  // src/core/utils/internal/mergeRight.ts
  function mergeRight(left, right) {
    return Object.entries(right).reduce(
      (result, [key, rightValue]) => {
        const leftValue = result[key];
        if (Array.isArray(leftValue) && Array.isArray(rightValue)) {
          result[key] = leftValue.concat(rightValue);
          return result;
        }
        if (isObject(leftValue) && isObject(rightValue)) {
          result[key] = mergeRight(leftValue, rightValue);
          return result;
        }
        result[key] = rightValue;
        return result;
      },
      Object.assign({}, left)
    );
  }

  // src/browser/setupWorker/start/utils/prepareStartHandler.ts
  var DEFAULT_START_OPTIONS = {
    serviceWorker: {
      url: "/mockServiceWorker.js",
      options: null
    },
    quiet: false,
    waitUntilReady: true,
    onUnhandledRequest: "warn",
    findWorker(scriptURL, mockServiceWorkerUrl) {
      return scriptURL === mockServiceWorkerUrl;
    }
  };

  // node_modules/.pnpm/@open-draft+deferred-promise@2.2.0/node_modules/@open-draft/deferred-promise/build/index.mjs
  function createDeferredExecutor() {
    const executor = (resolve, reject) => {
      executor.state = "pending";
      executor.resolve = (data) => {
        if (executor.state !== "pending") {
          return;
        }
        executor.result = data;
        const onFulfilled = (value) => {
          executor.state = "fulfilled";
          return value;
        };
        return resolve(
          data instanceof Promise ? data : Promise.resolve(data).then(onFulfilled)
        );
      };
      executor.reject = (reason) => {
        if (executor.state !== "pending") {
          return;
        }
        queueMicrotask(() => {
          executor.state = "rejected";
        });
        return reject(executor.rejectionReason = reason);
      };
    };
    return executor;
  }
  var DeferredPromise = class extends Promise {
    #executor;
    resolve;
    reject;
    constructor(executor = null) {
      const deferredExecutor = createDeferredExecutor();
      super((originalResolve, originalReject) => {
        deferredExecutor(originalResolve, originalReject);
        executor?.(deferredExecutor.resolve, deferredExecutor.reject);
      });
      this.#executor = deferredExecutor;
      this.resolve = this.#executor.resolve;
      this.reject = this.#executor.reject;
    }
    get state() {
      return this.#executor.state;
    }
    get rejectionReason() {
      return this.#executor.rejectionReason;
    }
    then(onFulfilled, onRejected) {
      return this.#decorate(super.then(onFulfilled, onRejected));
    }
    catch(onRejected) {
      return this.#decorate(super.catch(onRejected));
    }
    finally(onfinally) {
      return this.#decorate(super.finally(onfinally));
    }
    #decorate(promise) {
      return Object.defineProperties(promise, {
        resolve: { configurable: true, value: this.resolve },
        reject: { configurable: true, value: this.reject }
      });
    }
  };

  // node_modules/.pnpm/@mswjs+interceptors@0.26.15/node_modules/@mswjs/interceptors/lib/browser/chunk-OUWBQF3Z.mjs
  var RequestController = class {
    constructor(request) {
      this.request = request;
      this.responsePromise = new DeferredPromise();
    }
    respondWith(response) {
      invariant(
        this.responsePromise.state === "pending",
        'Failed to respond to "%s %s" request: the "request" event has already been responded to.',
        this.request.method,
        this.request.url
      );
      this.responsePromise.resolve(response);
    }
  };
  function toInteractiveRequest(request) {
    const requestController = new RequestController(request);
    Reflect.set(
      request,
      "respondWith",
      requestController.respondWith.bind(requestController)
    );
    return {
      interactiveRequest: request,
      requestController
    };
  }
  async function emitAsync(emitter, eventName, ...data) {
    const listners = emitter.listeners(eventName);
    if (listners.length === 0) {
      return;
    }
    for (const listener of listners) {
      await listener.apply(emitter, data);
    }
  }

  // node_modules/.pnpm/@mswjs+interceptors@0.26.15/node_modules/@mswjs/interceptors/lib/browser/chunk-3FNUI33J.mjs
  function isPropertyAccessible2(obj, key) {
    try {
      obj[key];
      return true;
    } catch (e) {
      return false;
    }
  }
  function canParseUrl(url) {
    try {
      new URL(url);
      return true;
    } catch (_error) {
      return false;
    }
  }
  var _FetchInterceptor = class extends Interceptor {
    constructor() {
      super(_FetchInterceptor.symbol);
    }
    checkEnvironment() {
      return typeof globalThis !== "undefined" && typeof globalThis.fetch !== "undefined";
    }
    async setup() {
      const pureFetch = globalThis.fetch;
      invariant(
        !pureFetch[IS_PATCHED_MODULE],
        'Failed to patch the "fetch" module: already patched.'
      );
      globalThis.fetch = async (input, init) => {
        var _a2;
        const requestId = createRequestId();
        const resolvedInput = typeof input === "string" && typeof location !== "undefined" && !canParseUrl(input) ? new URL(input, location.origin) : input;
        const request = new Request(resolvedInput, init);
        this.logger.info("[%s] %s", request.method, request.url);
        const { interactiveRequest, requestController } = toInteractiveRequest(request);
        this.logger.info(
          'emitting the "request" event for %d listener(s)...',
          this.emitter.listenerCount("request")
        );
        this.emitter.once("request", ({ requestId: pendingRequestId }) => {
          if (pendingRequestId !== requestId) {
            return;
          }
          if (requestController.responsePromise.state === "pending") {
            requestController.responsePromise.resolve(void 0);
          }
        });
        this.logger.info("awaiting for the mocked response...");
        const signal = interactiveRequest.signal;
        const requestAborted = new DeferredPromise();
        if (signal) {
          signal.addEventListener(
            "abort",
            () => {
              requestAborted.reject(signal.reason);
            },
            { once: true }
          );
        }
        const resolverResult = await until(async () => {
          const listenersFinished = emitAsync(this.emitter, "request", {
            request: interactiveRequest,
            requestId
          });
          await Promise.race([
            requestAborted,
            // Put the listeners invocation Promise in the same race condition
            // with the request abort Promise because otherwise awaiting the listeners
            // would always yield some response (or undefined).
            listenersFinished,
            requestController.responsePromise
          ]);
          this.logger.info("all request listeners have been resolved!");
          const mockedResponse2 = await requestController.responsePromise;
          this.logger.info("event.respondWith called with:", mockedResponse2);
          return mockedResponse2;
        });
        if (requestAborted.state === "rejected") {
          return Promise.reject(requestAborted.rejectionReason);
        }
        if (resolverResult.error) {
          return Promise.reject(createNetworkError(resolverResult.error));
        }
        const mockedResponse = resolverResult.data;
        if (mockedResponse && !((_a2 = request.signal) == null ? void 0 : _a2.aborted)) {
          this.logger.info("received mocked response:", mockedResponse);
          if (isPropertyAccessible2(mockedResponse, "type") && mockedResponse.type === "error") {
            this.logger.info(
              "received a network error response, rejecting the request promise..."
            );
            return Promise.reject(createNetworkError(mockedResponse));
          }
          const responseClone = mockedResponse.clone();
          this.emitter.emit("response", {
            response: responseClone,
            isMockedResponse: true,
            request: interactiveRequest,
            requestId
          });
          Object.defineProperty(mockedResponse, "url", {
            writable: false,
            enumerable: true,
            configurable: false,
            value: request.url
          });
          return mockedResponse;
        }
        this.logger.info("no mocked response received!");
        return pureFetch(request).then((response) => {
          const responseClone = response.clone();
          this.logger.info("original fetch performed", responseClone);
          this.emitter.emit("response", {
            response: responseClone,
            isMockedResponse: false,
            request: interactiveRequest,
            requestId
          });
          return response;
        });
      };
      Object.defineProperty(globalThis.fetch, IS_PATCHED_MODULE, {
        enumerable: true,
        configurable: true,
        value: true
      });
      this.subscriptions.push(() => {
        Object.defineProperty(globalThis.fetch, IS_PATCHED_MODULE, {
          value: void 0
        });
        globalThis.fetch = pureFetch;
        this.logger.info(
          'restored native "globalThis.fetch"!',
          globalThis.fetch.name
        );
      });
    }
  };
  var FetchInterceptor = _FetchInterceptor;
  FetchInterceptor.symbol = Symbol("fetch");
  function createNetworkError(cause) {
    return Object.assign(new TypeError("Failed to fetch"), {
      cause
    });
  }

  // node_modules/.pnpm/@mswjs+interceptors@0.26.15/node_modules/@mswjs/interceptors/lib/browser/chunk-VYFS2IF2.mjs
  function concatArrayBuffer(left, right) {
    const result = new Uint8Array(left.byteLength + right.byteLength);
    result.set(left, 0);
    result.set(right, left.byteLength);
    return result;
  }
  var EventPolyfill = class {
    constructor(type, options) {
      this.AT_TARGET = 0;
      this.BUBBLING_PHASE = 0;
      this.CAPTURING_PHASE = 0;
      this.NONE = 0;
      this.type = "";
      this.srcElement = null;
      this.currentTarget = null;
      this.eventPhase = 0;
      this.isTrusted = true;
      this.composed = false;
      this.cancelable = true;
      this.defaultPrevented = false;
      this.bubbles = true;
      this.lengthComputable = true;
      this.loaded = 0;
      this.total = 0;
      this.cancelBubble = false;
      this.returnValue = true;
      this.type = type;
      this.target = (options == null ? void 0 : options.target) || null;
      this.currentTarget = (options == null ? void 0 : options.currentTarget) || null;
      this.timeStamp = Date.now();
    }
    composedPath() {
      return [];
    }
    initEvent(type, bubbles, cancelable) {
      this.type = type;
      this.bubbles = !!bubbles;
      this.cancelable = !!cancelable;
    }
    preventDefault() {
      this.defaultPrevented = true;
    }
    stopPropagation() {
    }
    stopImmediatePropagation() {
    }
  };
  var ProgressEventPolyfill = class extends EventPolyfill {
    constructor(type, init) {
      super(type);
      this.lengthComputable = (init == null ? void 0 : init.lengthComputable) || false;
      this.composed = (init == null ? void 0 : init.composed) || false;
      this.loaded = (init == null ? void 0 : init.loaded) || 0;
      this.total = (init == null ? void 0 : init.total) || 0;
    }
  };
  var SUPPORTS_PROGRESS_EVENT = typeof ProgressEvent !== "undefined";
  function createEvent(target, type, init) {
    const progressEvents = [
      "error",
      "progress",
      "loadstart",
      "loadend",
      "load",
      "timeout",
      "abort"
    ];
    const ProgressEventClass = SUPPORTS_PROGRESS_EVENT ? ProgressEvent : ProgressEventPolyfill;
    const event = progressEvents.includes(type) ? new ProgressEventClass(type, {
      lengthComputable: true,
      loaded: (init == null ? void 0 : init.loaded) || 0,
      total: (init == null ? void 0 : init.total) || 0
    }) : new EventPolyfill(type, {
      target,
      currentTarget: target
    });
    return event;
  }
  function findPropertySource(target, propertyName) {
    if (!(propertyName in target)) {
      return null;
    }
    const hasProperty = Object.prototype.hasOwnProperty.call(target, propertyName);
    if (hasProperty) {
      return target;
    }
    const prototype = Reflect.getPrototypeOf(target);
    return prototype ? findPropertySource(prototype, propertyName) : null;
  }
  function createProxy(target, options) {
    const proxy = new Proxy(target, optionsToProxyHandler(options));
    return proxy;
  }
  function optionsToProxyHandler(options) {
    const { constructorCall, methodCall, getProperty, setProperty } = options;
    const handler = {};
    if (typeof constructorCall !== "undefined") {
      handler.construct = function(target, args, newTarget) {
        const next = Reflect.construct.bind(null, target, args, newTarget);
        return constructorCall.call(newTarget, args, next);
      };
    }
    handler.set = function(target, propertyName, nextValue) {
      const next = () => {
        const propertySource = findPropertySource(target, propertyName) || target;
        const ownDescriptors = Reflect.getOwnPropertyDescriptor(
          propertySource,
          propertyName
        );
        if (typeof (ownDescriptors == null ? void 0 : ownDescriptors.set) !== "undefined") {
          ownDescriptors.set.apply(target, [nextValue]);
          return true;
        }
        return Reflect.defineProperty(propertySource, propertyName, {
          writable: true,
          enumerable: true,
          configurable: true,
          value: nextValue
        });
      };
      if (typeof setProperty !== "undefined") {
        return setProperty.call(target, [propertyName, nextValue], next);
      }
      return next();
    };
    handler.get = function(target, propertyName, receiver) {
      const next = () => target[propertyName];
      const value = typeof getProperty !== "undefined" ? getProperty.call(target, [propertyName, receiver], next) : next();
      if (typeof value === "function") {
        return (...args) => {
          const next2 = value.bind(target, ...args);
          if (typeof methodCall !== "undefined") {
            return methodCall.call(target, [propertyName, args], next2);
          }
          return next2();
        };
      }
      return value;
    };
    return handler;
  }
  function isDomParserSupportedType(type) {
    const supportedTypes = [
      "application/xhtml+xml",
      "application/xml",
      "image/svg+xml",
      "text/html",
      "text/xml"
    ];
    return supportedTypes.some((supportedType) => {
      return type.startsWith(supportedType);
    });
  }
  function parseJson(data) {
    try {
      const json = JSON.parse(data);
      return json;
    } catch (_) {
      return null;
    }
  }
  function createResponse(request, body) {
    const responseBodyOrNull = isResponseWithoutBody(request.status) ? null : body;
    return new Response(responseBodyOrNull, {
      status: request.status,
      statusText: request.statusText,
      headers: createHeadersFromXMLHttpReqestHeaders(
        request.getAllResponseHeaders()
      )
    });
  }
  function createHeadersFromXMLHttpReqestHeaders(headersString) {
    const headers = new Headers();
    const lines = headersString.split(/[\r\n]+/);
    for (const line of lines) {
      if (line.trim() === "") {
        continue;
      }
      const [name, ...parts] = line.split(": ");
      const value = parts.join(": ");
      headers.append(name, value);
    }
    return headers;
  }
  var IS_MOCKED_RESPONSE = Symbol("isMockedResponse");
  var IS_NODE2 = isNodeProcess();
  var XMLHttpRequestController = class {
    constructor(initialRequest, logger) {
      this.initialRequest = initialRequest;
      this.logger = logger;
      this.method = "GET";
      this.url = null;
      this.events = /* @__PURE__ */ new Map();
      this.requestId = createRequestId();
      this.requestHeaders = new Headers();
      this.responseBuffer = new Uint8Array();
      this.request = createProxy(initialRequest, {
        setProperty: ([propertyName, nextValue], invoke) => {
          switch (propertyName) {
            case "ontimeout": {
              const eventName = propertyName.slice(
                2
              );
              this.request.addEventListener(eventName, nextValue);
              return invoke();
            }
            default: {
              return invoke();
            }
          }
        },
        methodCall: ([methodName, args], invoke) => {
          var _a2;
          switch (methodName) {
            case "open": {
              const [method, url] = args;
              if (typeof url === "undefined") {
                this.method = "GET";
                this.url = toAbsoluteUrl(method);
              } else {
                this.method = method;
                this.url = toAbsoluteUrl(url);
              }
              this.logger = this.logger.extend(`${this.method} ${this.url.href}`);
              this.logger.info("open", this.method, this.url.href);
              return invoke();
            }
            case "addEventListener": {
              const [eventName, listener] = args;
              this.registerEvent(eventName, listener);
              this.logger.info("addEventListener", eventName, listener);
              return invoke();
            }
            case "setRequestHeader": {
              const [name, value] = args;
              this.requestHeaders.set(name, value);
              this.logger.info("setRequestHeader", name, value);
              return invoke();
            }
            case "send": {
              const [body] = args;
              if (body != null) {
                this.requestBody = typeof body === "string" ? encodeBuffer(body) : body;
              }
              this.request.addEventListener("load", () => {
                if (typeof this.onResponse !== "undefined") {
                  const fetchResponse = createResponse(
                    this.request,
                    /**
                     * The `response` property is the right way to read
                     * the ambiguous response body, as the request's "responseType" may differ.
                     * @see https://xhr.spec.whatwg.org/#the-response-attribute
                     */
                    this.request.response
                  );
                  this.onResponse.call(this, {
                    response: fetchResponse,
                    isMockedResponse: IS_MOCKED_RESPONSE in this.request,
                    request: fetchRequest,
                    requestId: this.requestId
                  });
                }
              });
              const fetchRequest = this.toFetchApiRequest();
              const onceRequestSettled = ((_a2 = this.onRequest) == null ? void 0 : _a2.call(this, {
                request: fetchRequest,
                requestId: this.requestId
              })) || Promise.resolve();
              onceRequestSettled.finally(() => {
                if (this.request.readyState < this.request.LOADING) {
                  this.logger.info(
                    "request callback settled but request has not been handled (readystate %d), performing as-is...",
                    this.request.readyState
                  );
                  if (IS_NODE2) {
                    this.request.setRequestHeader(
                      INTERNAL_REQUEST_ID_HEADER_NAME,
                      this.requestId
                    );
                  }
                  return invoke();
                }
              });
              break;
            }
            default: {
              return invoke();
            }
          }
        }
      });
    }
    registerEvent(eventName, listener) {
      const prevEvents = this.events.get(eventName) || [];
      const nextEvents = prevEvents.concat(listener);
      this.events.set(eventName, nextEvents);
      this.logger.info('registered event "%s"', eventName, listener);
    }
    /**
     * Responds to the current request with the given
     * Fetch API `Response` instance.
     */
    respondWith(response) {
      this.logger.info(
        "responding with a mocked response: %d %s",
        response.status,
        response.statusText
      );
      define(this.request, IS_MOCKED_RESPONSE, true);
      define(this.request, "status", response.status);
      define(this.request, "statusText", response.statusText);
      define(this.request, "responseURL", this.url.href);
      this.request.getResponseHeader = new Proxy(this.request.getResponseHeader, {
        apply: (_, __, args) => {
          this.logger.info("getResponseHeader", args[0]);
          if (this.request.readyState < this.request.HEADERS_RECEIVED) {
            this.logger.info("headers not received yet, returning null");
            return null;
          }
          const headerValue = response.headers.get(args[0]);
          this.logger.info(
            'resolved response header "%s" to',
            args[0],
            headerValue
          );
          return headerValue;
        }
      });
      this.request.getAllResponseHeaders = new Proxy(
        this.request.getAllResponseHeaders,
        {
          apply: () => {
            this.logger.info("getAllResponseHeaders");
            if (this.request.readyState < this.request.HEADERS_RECEIVED) {
              this.logger.info("headers not received yet, returning empty string");
              return "";
            }
            const headersList = Array.from(response.headers.entries());
            const allHeaders = headersList.map(([headerName, headerValue]) => {
              return `${headerName}: ${headerValue}`;
            }).join("\r\n");
            this.logger.info("resolved all response headers to", allHeaders);
            return allHeaders;
          }
        }
      );
      Object.defineProperties(this.request, {
        response: {
          enumerable: true,
          configurable: false,
          get: () => this.response
        },
        responseText: {
          enumerable: true,
          configurable: false,
          get: () => this.responseText
        },
        responseXML: {
          enumerable: true,
          configurable: false,
          get: () => this.responseXML
        }
      });
      const totalResponseBodyLength = response.headers.has("Content-Length") ? Number(response.headers.get("Content-Length")) : (
        /**
         * @todo Infer the response body length from the response body.
         */
        void 0
      );
      this.logger.info("calculated response body length", totalResponseBodyLength);
      this.trigger("loadstart", {
        loaded: 0,
        total: totalResponseBodyLength
      });
      this.setReadyState(this.request.HEADERS_RECEIVED);
      this.setReadyState(this.request.LOADING);
      const finalizeResponse = () => {
        this.logger.info("finalizing the mocked response...");
        this.setReadyState(this.request.DONE);
        this.trigger("load", {
          loaded: this.responseBuffer.byteLength,
          total: totalResponseBodyLength
        });
        this.trigger("loadend", {
          loaded: this.responseBuffer.byteLength,
          total: totalResponseBodyLength
        });
      };
      if (response.body) {
        this.logger.info("mocked response has body, streaming...");
        const reader = response.body.getReader();
        const readNextResponseBodyChunk = async () => {
          const { value, done } = await reader.read();
          if (done) {
            this.logger.info("response body stream done!");
            finalizeResponse();
            return;
          }
          if (value) {
            this.logger.info("read response body chunk:", value);
            this.responseBuffer = concatArrayBuffer(this.responseBuffer, value);
            this.trigger("progress", {
              loaded: this.responseBuffer.byteLength,
              total: totalResponseBodyLength
            });
          }
          readNextResponseBodyChunk();
        };
        readNextResponseBodyChunk();
      } else {
        finalizeResponse();
      }
    }
    responseBufferToText() {
      return decodeBuffer(this.responseBuffer);
    }
    get response() {
      this.logger.info(
        "getResponse (responseType: %s)",
        this.request.responseType
      );
      if (this.request.readyState !== this.request.DONE) {
        return null;
      }
      switch (this.request.responseType) {
        case "json": {
          const responseJson = parseJson(this.responseBufferToText());
          this.logger.info("resolved response JSON", responseJson);
          return responseJson;
        }
        case "arraybuffer": {
          const arrayBuffer = toArrayBuffer(this.responseBuffer);
          this.logger.info("resolved response ArrayBuffer", arrayBuffer);
          return arrayBuffer;
        }
        case "blob": {
          const mimeType = this.request.getResponseHeader("Content-Type") || "text/plain";
          const responseBlob = new Blob([this.responseBufferToText()], {
            type: mimeType
          });
          this.logger.info(
            "resolved response Blob (mime type: %s)",
            responseBlob,
            mimeType
          );
          return responseBlob;
        }
        default: {
          const responseText = this.responseBufferToText();
          this.logger.info(
            'resolving "%s" response type as text',
            this.request.responseType,
            responseText
          );
          return responseText;
        }
      }
    }
    get responseText() {
      invariant(
        this.request.responseType === "" || this.request.responseType === "text",
        "InvalidStateError: The object is in invalid state."
      );
      if (this.request.readyState !== this.request.LOADING && this.request.readyState !== this.request.DONE) {
        return "";
      }
      const responseText = this.responseBufferToText();
      this.logger.info('getResponseText: "%s"', responseText);
      return responseText;
    }
    get responseXML() {
      invariant(
        this.request.responseType === "" || this.request.responseType === "document",
        "InvalidStateError: The object is in invalid state."
      );
      if (this.request.readyState !== this.request.DONE) {
        return null;
      }
      const contentType = this.request.getResponseHeader("Content-Type") || "";
      if (typeof DOMParser === "undefined") {
        console.warn(
          "Cannot retrieve XMLHttpRequest response body as XML: DOMParser is not defined. You are likely using an environment that is not browser or does not polyfill browser globals correctly."
        );
        return null;
      }
      if (isDomParserSupportedType(contentType)) {
        return new DOMParser().parseFromString(
          this.responseBufferToText(),
          contentType
        );
      }
      return null;
    }
    errorWith(error3) {
      this.logger.info("responding with an error");
      this.setReadyState(this.request.DONE);
      this.trigger("error");
      this.trigger("loadend");
    }
    /**
     * Transitions this request's `readyState` to the given one.
     */
    setReadyState(nextReadyState) {
      this.logger.info(
        "setReadyState: %d -> %d",
        this.request.readyState,
        nextReadyState
      );
      if (this.request.readyState === nextReadyState) {
        this.logger.info("ready state identical, skipping transition...");
        return;
      }
      define(this.request, "readyState", nextReadyState);
      this.logger.info("set readyState to: %d", nextReadyState);
      if (nextReadyState !== this.request.UNSENT) {
        this.logger.info('triggerring "readystatechange" event...');
        this.trigger("readystatechange");
      }
    }
    /**
     * Triggers given event on the `XMLHttpRequest` instance.
     */
    trigger(eventName, options) {
      const callback = this.request[`on${eventName}`];
      const event = createEvent(this.request, eventName, options);
      this.logger.info('trigger "%s"', eventName, options || "");
      if (typeof callback === "function") {
        this.logger.info('found a direct "%s" callback, calling...', eventName);
        callback.call(this.request, event);
      }
      for (const [registeredEventName, listeners] of this.events) {
        if (registeredEventName === eventName) {
          this.logger.info(
            'found %d listener(s) for "%s" event, calling...',
            listeners.length,
            eventName
          );
          listeners.forEach((listener) => listener.call(this.request, event));
        }
      }
    }
    /**
     * Converts this `XMLHttpRequest` instance into a Fetch API `Request` instance.
     */
    toFetchApiRequest() {
      this.logger.info("converting request to a Fetch API Request...");
      const fetchRequest = new Request(this.url.href, {
        method: this.method,
        headers: this.requestHeaders,
        /**
         * @see https://xhr.spec.whatwg.org/#cross-origin-credentials
         */
        credentials: this.request.withCredentials ? "include" : "same-origin",
        body: ["GET", "HEAD"].includes(this.method) ? null : this.requestBody
      });
      const proxyHeaders = createProxy(fetchRequest.headers, {
        methodCall: ([methodName, args], invoke) => {
          switch (methodName) {
            case "append":
            case "set": {
              const [headerName, headerValue] = args;
              this.request.setRequestHeader(headerName, headerValue);
              break;
            }
            case "delete": {
              const [headerName] = args;
              console.warn(
                `XMLHttpRequest: Cannot remove a "${headerName}" header from the Fetch API representation of the "${fetchRequest.method} ${fetchRequest.url}" request. XMLHttpRequest headers cannot be removed.`
              );
              break;
            }
          }
          return invoke();
        }
      });
      define(fetchRequest, "headers", proxyHeaders);
      this.logger.info("converted request to a Fetch API Request!", fetchRequest);
      return fetchRequest;
    }
  };
  function toAbsoluteUrl(url) {
    if (typeof location === "undefined") {
      return new URL(url);
    }
    return new URL(url.toString(), location.href);
  }
  function define(target, property, value) {
    Reflect.defineProperty(target, property, {
      // Ensure writable properties to allow redefining readonly properties.
      writable: true,
      enumerable: true,
      value
    });
  }
  function createXMLHttpRequestProxy({
    emitter,
    logger
  }) {
    const XMLHttpRequestProxy = new Proxy(globalThis.XMLHttpRequest, {
      construct(target, args, newTarget) {
        logger.info("constructed new XMLHttpRequest");
        const originalRequest = Reflect.construct(
          target,
          args,
          newTarget
        );
        const prototypeDescriptors = Object.getOwnPropertyDescriptors(
          target.prototype
        );
        for (const propertyName in prototypeDescriptors) {
          Reflect.defineProperty(
            originalRequest,
            propertyName,
            prototypeDescriptors[propertyName]
          );
        }
        const xhrRequestController = new XMLHttpRequestController(
          originalRequest,
          logger
        );
        xhrRequestController.onRequest = async function({ request, requestId }) {
          const { interactiveRequest, requestController } = toInteractiveRequest(request);
          this.logger.info("awaiting mocked response...");
          emitter.once("request", ({ requestId: pendingRequestId }) => {
            if (pendingRequestId !== requestId) {
              return;
            }
            if (requestController.responsePromise.state === "pending") {
              requestController.respondWith(void 0);
            }
          });
          const resolverResult = await until(async () => {
            this.logger.info(
              'emitting the "request" event for %s listener(s)...',
              emitter.listenerCount("request")
            );
            await emitAsync(emitter, "request", {
              request: interactiveRequest,
              requestId
            });
            this.logger.info('all "request" listeners settled!');
            const mockedResponse2 = await requestController.responsePromise;
            this.logger.info("event.respondWith called with:", mockedResponse2);
            return mockedResponse2;
          });
          if (resolverResult.error) {
            this.logger.info(
              "request listener threw an exception, aborting request...",
              resolverResult.error
            );
            xhrRequestController.errorWith(resolverResult.error);
            return;
          }
          const mockedResponse = resolverResult.data;
          if (typeof mockedResponse !== "undefined") {
            this.logger.info(
              "received mocked response: %d %s",
              mockedResponse.status,
              mockedResponse.statusText
            );
            if (mockedResponse.type === "error") {
              this.logger.info(
                "received a network error response, rejecting the request promise..."
              );
              xhrRequestController.errorWith(new TypeError("Network error"));
              return;
            }
            return xhrRequestController.respondWith(mockedResponse);
          }
          this.logger.info(
            "no mocked response received, performing request as-is..."
          );
        };
        xhrRequestController.onResponse = async function({
          response,
          isMockedResponse,
          request,
          requestId
        }) {
          this.logger.info(
            'emitting the "response" event for %s listener(s)...',
            emitter.listenerCount("response")
          );
          emitter.emit("response", {
            response,
            isMockedResponse,
            request,
            requestId
          });
        };
        return xhrRequestController.request;
      }
    });
    return XMLHttpRequestProxy;
  }
  var _XMLHttpRequestInterceptor = class extends Interceptor {
    constructor() {
      super(_XMLHttpRequestInterceptor.interceptorSymbol);
    }
    checkEnvironment() {
      return typeof globalThis.XMLHttpRequest !== "undefined";
    }
    setup() {
      const logger = this.logger.extend("setup");
      logger.info('patching "XMLHttpRequest" module...');
      const PureXMLHttpRequest = globalThis.XMLHttpRequest;
      invariant(
        !PureXMLHttpRequest[IS_PATCHED_MODULE],
        'Failed to patch the "XMLHttpRequest" module: already patched.'
      );
      globalThis.XMLHttpRequest = createXMLHttpRequestProxy({
        emitter: this.emitter,
        logger: this.logger
      });
      logger.info(
        'native "XMLHttpRequest" module patched!',
        globalThis.XMLHttpRequest.name
      );
      Object.defineProperty(globalThis.XMLHttpRequest, IS_PATCHED_MODULE, {
        enumerable: true,
        configurable: true,
        value: true
      });
      this.subscriptions.push(() => {
        Object.defineProperty(globalThis.XMLHttpRequest, IS_PATCHED_MODULE, {
          value: void 0
        });
        globalThis.XMLHttpRequest = PureXMLHttpRequest;
        logger.info(
          'native "XMLHttpRequest" module restored!',
          globalThis.XMLHttpRequest.name
        );
      });
    }
  };
  var XMLHttpRequestInterceptor = _XMLHttpRequestInterceptor;
  XMLHttpRequestInterceptor.interceptorSymbol = Symbol("xhr");

  // src/browser/setupWorker/start/createFallbackRequestListener.ts
  function createFallbackRequestListener(context, options) {
    const interceptor = new BatchInterceptor({
      name: "fallback",
      interceptors: [new FetchInterceptor(), new XMLHttpRequestInterceptor()]
    });
    interceptor.on("request", async ({ request, requestId }) => {
      const requestCloneForLogs = request.clone();
      const response = await handleRequest(
        request,
        requestId,
        context.getRequestHandlers(),
        options,
        context.emitter,
        {
          onMockedResponse(_, { handler, parsedResult }) {
            if (!options.quiet) {
              context.emitter.once("response:mocked", ({ response: response2 }) => {
                handler.log({
                  request: requestCloneForLogs,
                  response: response2,
                  parsedResult
                });
              });
            }
          }
        }
      );
      if (response) {
        request.respondWith(response);
      }
    });
    interceptor.on(
      "response",
      ({ response, isMockedResponse, request, requestId }) => {
        context.emitter.emit(
          isMockedResponse ? "response:mocked" : "response:bypass",
          {
            response,
            request,
            requestId
          }
        );
      }
    );
    interceptor.apply();
    return interceptor;
  }

  // src/browser/setupWorker/start/createFallbackStart.ts
  function createFallbackStart(context) {
    return async function start(options) {
      context.fallbackInterceptor = createFallbackRequestListener(
        context,
        options
      );
      printStartMessage({
        message: "Mocking enabled (fallback mode).",
        quiet: options.quiet
      });
      return void 0;
    };
  }

  // src/browser/setupWorker/stop/createFallbackStop.ts
  function createFallbackStop(context) {
    return function stop() {
      context.fallbackInterceptor?.dispose();
      printStopMessage({ quiet: context.startOptions?.quiet });
    };
  }

  // src/browser/utils/supportsReadableStreamTransfer.ts
  function supportsReadableStreamTransfer() {
    try {
      const stream = new ReadableStream({
        start: (controller) => controller.close()
      });
      const message3 = new MessageChannel();
      message3.port1.postMessage(stream, [stream]);
      return true;
    } catch (error3) {
      return false;
    }
  }

  // src/browser/setupWorker/setupWorker.ts
  var SetupWorkerApi = class extends SetupApi {
    context;
    startHandler = null;
    stopHandler = null;
    listeners;
    constructor(...handlers) {
      super(...handlers);
      invariant(
        !isNodeProcess(),
        devUtils.formatMessage(
          "Failed to execute `setupWorker` in a non-browser environment. Consider using `setupServer` for Node.js environment instead."
        )
      );
      this.listeners = [];
      this.context = this.createWorkerContext();
    }
    createWorkerContext() {
      const context = {
        // Mocking is not considered enabled until the worker
        // signals back the successful activation event.
        isMockingEnabled: false,
        startOptions: null,
        worker: null,
        getRequestHandlers: () => {
          return this.handlersController.currentHandlers();
        },
        registration: null,
        requests: /* @__PURE__ */ new Map(),
        emitter: this.emitter,
        workerChannel: {
          on: (eventType, callback) => {
            this.context.events.addListener(navigator.serviceWorker, "message", (event) => {
              if (event.source !== this.context.worker) {
                return;
              }
              const message3 = event.data;
              if (!message3) {
                return;
              }
              if (message3.type === eventType) {
                callback(event, message3);
              }
            });
          },
          send: (type) => {
            this.context.worker?.postMessage(type);
          }
        },
        events: {
          addListener: (target, eventType, callback) => {
            target.addEventListener(eventType, callback);
            this.listeners.push({
              eventType,
              target,
              callback
            });
            return () => {
              target.removeEventListener(eventType, callback);
            };
          },
          removeAllListeners: () => {
            for (const { target, eventType, callback } of this.listeners) {
              target.removeEventListener(eventType, callback);
            }
            this.listeners = [];
          },
          once: (eventType) => {
            const bindings = [];
            return new Promise((resolve, reject) => {
              const handleIncomingMessage = (event) => {
                try {
                  const message3 = event.data;
                  if (message3.type === eventType) {
                    resolve(message3);
                  }
                } catch (error3) {
                  reject(error3);
                }
              };
              bindings.push(
                this.context.events.addListener(
                  navigator.serviceWorker,
                  "message",
                  handleIncomingMessage
                ),
                this.context.events.addListener(
                  navigator.serviceWorker,
                  "messageerror",
                  reject
                )
              );
            }).finally(() => {
              bindings.forEach((unbind) => unbind());
            });
          }
        },
        supports: {
          serviceWorkerApi: !("serviceWorker" in navigator) || location.protocol === "file:",
          readableStreamTransfer: supportsReadableStreamTransfer()
        }
      };
      this.startHandler = context.supports.serviceWorkerApi ? createFallbackStart(context) : createStartHandler(context);
      this.stopHandler = context.supports.serviceWorkerApi ? createFallbackStop(context) : createStop(context);
      return context;
    }
    async start(options = {}) {
      if (options.waitUntilReady === true) {
        devUtils.warn(
          'The "waitUntilReady" option has been deprecated. Please remove it from this "worker.start()" call. Follow the recommended Browser integration (https://mswjs.io/docs/integrations/browser) to eliminate any race conditions between the Service Worker registration and any requests made by your application on initial render.'
        );
      }
      this.context.startOptions = mergeRight(
        DEFAULT_START_OPTIONS,
        options
      );
      return await this.startHandler(this.context.startOptions, options);
    }
    stop() {
      super.dispose();
      this.context.events.removeAllListeners();
      this.context.emitter.removeAllListeners();
      this.stopHandler();
    }
  };
  function setupWorker(...handlers) {
    return new SetupWorkerApi(...handlers);
  }
  return __toCommonJS(iife_exports);
})();
/*! Bundled license information:

@bundled-es-modules/statuses/index-esm.js:
  (*! Bundled license information:
  
  statuses/index.js:
    (*!
     * statuses
     * Copyright(c) 2014 Jonathan Ong
     * Copyright(c) 2016 Douglas Christopher Wilson
     * MIT Licensed
     *)
  *)

@bundled-es-modules/cookie/index-esm.js:
  (*! Bundled license information:
  
  cookie/index.js:
    (*!
     * cookie
     * Copyright(c) 2012-2014 Roman Shtylman
     * Copyright(c) 2015 Douglas Christopher Wilson
     * MIT Licensed
     *)
  *)
*/
//# sourceMappingURL=index.js.map