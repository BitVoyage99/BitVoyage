import { I as Interceptor } from '../../Interceptor-af98b768.js';
import '@open-draft/logger';
import 'strict-event-emitter';

type WebSocketData = string | ArrayBufferLike | Blob | ArrayBufferView;
type WebSocketTransportOnIncomingCallback = (event: MessageEvent<WebSocketData>) => void;
type WebSocketTransportOnOutgoingCallback = (data: WebSocketData) => void;
type WebSocketTransportOnCloseCallback = (event: CloseEvent) => void;
declare abstract class WebSocketTransport {
    /**
     * A callback for the incoming server events.
     * This is called when the WebSocket client receives
     * a message from the server.
     */
    abstract onIncoming: WebSocketTransportOnIncomingCallback;
    /**
     * A callback for outgoing client events.
     * This is called when the WebSocket client sends data.
     */
    abstract onOutgoing: WebSocketTransportOnOutgoingCallback;
    /**
     * A callback for the close client event.
     * This is called when the WebSocket client is closed.
     */
    abstract onClose: WebSocketTransportOnCloseCallback;
    /**
     * Send the data from the server to this client.
     */
    abstract send(data: WebSocketData): void;
    /**
     * Close the client connection.
     */
    abstract close(code?: number, reason?: string): void;
}

interface CloseEventInit extends EventInit {
    code?: number;
    reason?: string;
    wasClean?: boolean;
}
declare class CloseEvent$1 extends Event {
    code: number;
    reason: string;
    wasClean: boolean;
    constructor(type: string, init?: CloseEventInit);
}

type WebSocketEventListener<T extends WebSocketEventMap[keyof WebSocketEventMap] = Event> = (this: WebSocket, event: T) => void;
declare const kOnSend: unique symbol;
declare const kClose: unique symbol;
declare class WebSocketOverride extends EventTarget implements WebSocket {
    static readonly CONNECTING = 0;
    static readonly OPEN = 1;
    static readonly CLOSING = 2;
    static readonly CLOSED = 3;
    readonly CONNECTING = 0;
    readonly OPEN = 1;
    readonly CLOSING = 2;
    readonly CLOSED = 3;
    url: string;
    protocol: string;
    extensions: string;
    binaryType: BinaryType;
    readyState: number;
    bufferedAmount: number;
    private _onopen;
    private _onmessage;
    private _onerror;
    private _onclose;
    private [kOnSend]?;
    constructor(url: string | URL, protocols?: string | Array<string>);
    set onopen(listener: WebSocketEventListener | null);
    get onopen(): WebSocketEventListener | null;
    set onmessage(listener: WebSocketEventListener<MessageEvent<WebSocketData>> | null);
    get onmessage(): WebSocketEventListener<MessageEvent<WebSocketData>> | null;
    set onerror(listener: WebSocketEventListener | null);
    get onerror(): WebSocketEventListener | null;
    set onclose(listener: WebSocketEventListener<CloseEvent$1> | null);
    get onclose(): WebSocketEventListener<CloseEvent$1> | null;
    /**
     * @see https://websockets.spec.whatwg.org/#ref-for-dom-websocket-send%E2%91%A0
     */
    send(data: WebSocketData): void;
    close(code?: number, reason?: string): void;
    private [kClose];
    addEventListener<K extends keyof WebSocketEventMap>(type: K, listener: (this: WebSocket, event: WebSocketEventMap[K]) => void, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof WebSocketEventMap>(type: K, callback: EventListenerOrEventListenerObject | null, options?: boolean | EventListenerOptions): void;
}

/**
 * WebSocket client class.
 * This represents an incoming WebSocket client connection.
 * @note Keep this class implementation-agnostic because it's
 * meant to be used over any WebSocket implementation
 * (not all of them follow the one from WHATWG).
 */

declare const kEmitter$1: unique symbol;
interface WebSocketClientEventMap {
    message: MessageEvent<WebSocketData>;
    close: CloseEvent$1;
}
interface WebSocketClientConnectionProtocol {
    id: string;
    url: URL;
    send(data: WebSocketData): void;
    close(code?: number, reason?: string): void;
}
/**
 * The WebSocket client instance represents an incoming
 * client connection. The user can control the connection,
 * send and receive events.
 */
declare class WebSocketClientConnection implements WebSocketClientConnectionProtocol {
    readonly socket: WebSocket;
    private readonly transport;
    readonly id: string;
    readonly url: URL;
    private [kEmitter$1];
    constructor(socket: WebSocket, transport: WebSocketTransport);
    /**
     * Listen for the outgoing events from the connected WebSocket client.
     */
    addEventListener<EventType extends keyof WebSocketClientEventMap>(type: EventType, listener: WebSocketEventListener<WebSocketClientEventMap[EventType]>, options?: AddEventListenerOptions | boolean): void;
    /**
     * Removes the listener for the given event.
     */
    removeEventListener<EventType extends keyof WebSocketClientEventMap>(event: EventType, listener: WebSocketEventListener<WebSocketClientEventMap[EventType]>, options?: EventListenerOptions | boolean): void;
    /**
     * Send data to the connected client.
     */
    send(data: WebSocketData): void;
    /**
     * Close the WebSocket connection.
     * @param {number} code A status code (see https://www.rfc-editor.org/rfc/rfc6455#section-7.4.1).
     * @param {string} reason A custom connection close reason.
     */
    close(code?: number, reason?: string): void;
}

/**
 * Abstraction over the given mock `WebSocket` instance that allows
 * for controlling that instance (e.g. sending and receiving messages).
 */
declare class WebSocketClassTransport extends WebSocketTransport {
    protected readonly socket: WebSocketOverride;
    onOutgoing: WebSocketTransportOnOutgoingCallback;
    onIncoming: WebSocketTransportOnIncomingCallback;
    onClose: WebSocketTransportOnCloseCallback;
    constructor(socket: WebSocketOverride);
    send(data: WebSocketData): void;
    close(code: number, reason?: string): void;
}

declare const kEmitter: unique symbol;
/**
 * The WebSocket server instance represents the actual production
 * WebSocket server connection. It's idle by default but you can
 * establish it by calling `server.connect()`.
 */
declare class WebSocketServerConnection {
    private readonly socket;
    private readonly transport;
    private readonly createConnection;
    /**
     * A WebSocket instance connected to the original server.
     */
    private realWebSocket?;
    private mockCloseController;
    private [kEmitter];
    constructor(socket: WebSocketOverride, transport: WebSocketClassTransport, createConnection: () => WebSocket);
    /**
     * Server ready state.
     * Proxies the ready state of the original WebSocket instance,
     * if set. If the original connection hasn't been established,
     * defaults to `-1`.
     */
    get readyState(): number;
    /**
     * Open connection to the original WebSocket server.
     */
    connect(): void;
    /**
     * Listen for the incoming events from the original WebSocket server.
     */
    addEventListener<K extends keyof WebSocketEventMap>(event: K, listener: (this: WebSocket, event: WebSocketEventMap[K]) => void, options?: AddEventListenerOptions | boolean): void;
    /**
     * Remove the listener for the given event.
     */
    removeEventListener<K extends keyof WebSocketEventMap>(event: K, listener: (this: WebSocket, event: WebSocketEventMap[K]) => void, options?: EventListenerOptions | boolean): void;
    /**
     * Send data to the original WebSocket server.
     * @example
     * server.send('hello')
     * server.send(new Blob(['hello']))
     * server.send(new TextEncoder().encode('hello'))
     */
    send(data: WebSocketData): void;
    /**
     * Close the actual server connection.
     */
    close(): void;
    private handleMockClose;
    private handleRealClose;
}

type WebSocketEventMap$1 = {
    connection: [args: WebSocketConnectionData];
};
type WebSocketConnectionData = {
    /**
     * The incoming WebSocket client connection.
     */
    client: WebSocketClientConnection;
    /**
     * The original WebSocket server connection.
     */
    server: WebSocketServerConnection;
};
/**
 * Intercept the outgoing WebSocket connections created using
 * the global `WebSocket` class.
 */
declare class WebSocketInterceptor extends Interceptor<WebSocketEventMap$1> {
    static symbol: symbol;
    constructor();
    protected checkEnvironment(): boolean;
    protected setup(): void;
}

export { WebSocketClientConnection, WebSocketClientConnectionProtocol, WebSocketConnectionData, WebSocketData, WebSocketEventMap$1 as WebSocketEventMap, WebSocketInterceptor, WebSocketServerConnection, WebSocketTransport };
