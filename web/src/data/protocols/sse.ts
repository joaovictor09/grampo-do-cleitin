export type SSEListeners = {
  event: string
  listener: (e: any) => void
}

export type SSERequest = {
  url: string
  onOpen?: () => void
  onError?: (e: Event) => void
  listeners: SSEListeners[]
}

export type SSEResponse<T = unknown> = {
  close: () => void
}

export interface SSEClient {
  connect: <T = unknown>(data: SSERequest) => SSEResponse<T>
}