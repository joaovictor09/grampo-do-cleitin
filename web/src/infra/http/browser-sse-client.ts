import { SSEClient, SSEListeners, SSERequest, SSEResponse } from "#/data/protocols/sse";

export class BrowserSSEClient implements SSEClient {
  connect<T>(data: SSERequest): SSEResponse<T> {
    const { url, listeners, onError, onOpen } = data
    
    const es = new EventSource(url)
    
    // Setup
    this.addListeners(es, listeners)
    
    if (onOpen) {
      es.onopen = onOpen
    }
    if (onError) {
      es.onerror = onError
    }

    return {
      close: () => this.closeConnection(es),
    }
  }

  private addListeners(es: EventSource, listeners: SSEListeners[]) {
    listeners.map(({ event, listener }) => {
      es.addEventListener(event, listener)
    })
  }

  private closeConnection(es: EventSource) {
    es.close()

    return
  }
}