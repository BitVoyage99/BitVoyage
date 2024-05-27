import { H as HttpResponseInit } from '../../HttpResponse-B07UKAkU.js';
import '../../typeUtils.js';

interface HttpResponseDecoratedInit extends HttpResponseInit {
    status: number;
    statusText: string;
    headers: Headers;
}
declare function normalizeResponseInit(init?: HttpResponseInit): HttpResponseDecoratedInit;
declare function decorateResponse(response: Response, init: HttpResponseDecoratedInit): Response;

export { type HttpResponseDecoratedInit, decorateResponse, normalizeResponseInit };
