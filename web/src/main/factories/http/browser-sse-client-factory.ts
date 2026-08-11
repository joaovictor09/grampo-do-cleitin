import { BrowserSSEClient } from "#/infra/http/browser-sse-client";

export const makeSSEClientFactory = () => new BrowserSSEClient