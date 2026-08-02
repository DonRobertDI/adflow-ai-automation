import { jsonResponse } from './response';

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code = 'request_failed',
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export interface SafeError {
  status: number;
  code: string;
  message: string;
}

const safeMessages: Record<number, string> = {
  400: 'The request could not be processed. Check the submitted information.',
  401: 'This secure link is invalid or has expired.',
  403: 'This request is not allowed.',
  404: 'The requested campaign information was not found.',
  405: 'This request method is not supported.',
  408: 'The upstream service took too long to respond.',
  409: 'This action has already been completed or the campaign state changed.',
  413: 'The submitted information is too large.',
  415: 'Send this request as JSON.',
  422: 'Some submitted fields need attention.',
  429: 'Too many requests were received. Please wait and try again.',
  502: 'The campaign service returned an unexpected response.',
  503: 'The campaign service is temporarily unavailable. Please try again.',
};

export function normalizeError(error: unknown): SafeError {
  if (error instanceof HttpError) {
    return {
      status: error.status,
      code: error.code,
      message: error.message || safeMessages[error.status] || safeMessages[503],
    };
  }

  return {
    status: 503,
    code: 'service_unavailable',
    message: safeMessages[503],
  };
}

export function errorResponse(error: unknown, requestId: string): Response {
  const safe = normalizeError(error);
  return jsonResponse(
    {
      success: false,
      error: safe.code,
      message: safe.message,
      request_id: requestId,
    },
    { status: safe.status, requestId },
  );
}
