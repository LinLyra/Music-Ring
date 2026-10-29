import type { ApiError } from '@/types/api';

/**
 * 客户端错误类型。见 mobile-client.md §9。
 * kind 用于区分错误来源，message 为可直接展示给用户的中文文案。
 */
export type AppErrorKind = 'network' | 'timeout' | 'backend' | 'unknown';

export class AppError extends Error {
  kind: AppErrorKind;
  /** 后端返回的错误码（backend 类错误时存在），如 AUDIO_NOT_FOUND。 */
  code?: string;
  /** 原始错误 / 后端 error 对象，便于开发模式排查。 */
  original?: unknown;

  constructor(kind: AppErrorKind, message: string, code?: string, original?: unknown) {
    super(message);
    this.name = 'AppError';
    this.kind = kind;
    this.code = code;
    this.original = original;
  }
}

/** 后端错误码 → 中文文案，见 mobile-client.md §9 / api.md §10。 */
const BACKEND_MESSAGES: Record<string, string> = {
  AUDIO_NOT_FOUND: 'No audio is configured for this instrument, key, or technique',
  PLAYBACK_DEVICE_UNAVAILABLE: 'The playback device is unavailable. Check the audio output.',
  PLAYBACK_FAILED: 'Playback could not be started. Check the backend log.',
  INVALID_PARAMETER: 'The request is invalid. Check the instrument, key, or note.',
  SERVICE_UNAVAILABLE: 'The service is temporarily unavailable. Try again shortly.',
  INTERNAL_ERROR: 'The backend hit an internal error. Check the backend log.',
  UNAUTHORIZED: 'The device token is missing or invalid',
};

/** 网络不可达。 */
export function networkError(original?: unknown): AppError {
  logError('network', original);
  return new AppError('network', 'Cannot reach the backend. Check the address and network.', undefined, original);
}

/** 请求超时。 */
export function timeoutError(original?: unknown): AppError {
  logError('timeout', original);
  return new AppError('timeout', 'The request timed out. Check that the backend is running.', undefined, original);
}

/** 后端返回的业务错误。 */
export function backendError(error: ApiError): AppError {
  const message = BACKEND_MESSAGES[error.code] ?? error.message ?? 'The backend returned an error';
  logError('backend', error);
  return new AppError('backend', message, error.code, error);
}

/** 未知错误。 */
export function unknownError(original?: unknown): AppError {
  logError('unknown', original);
  return new AppError('unknown', 'Something went wrong. Try again.', undefined, original);
}

/** 开发模式下输出完整错误，便于排查（mobile-client.md §9）。 */
function logError(kind: AppErrorKind, original: unknown) {
  if (__DEV__) {
    console.warn(`[AppError:${kind}]`, original);
  }
}
