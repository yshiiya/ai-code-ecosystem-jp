/**
 * エラーハンドリングユーティリティ
 * セキュリティ強化と一貫したエラーハンドリング
 */

import type { ApiError, LogLevel } from '@/types';

/**
 * エラーロガークラス
 */
export class ErrorLogger {
  private static instance: ErrorLogger;
  private isDevelopment: boolean;

  private constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  public static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  /**
   * ログ出力
   */
  public log(level: LogLevel, message: string, details?: Record<string, unknown>): void {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      details
    };

    if (this.isDevelopment) {
      console[level](`[${timestamp}] ${level.toUpperCase()}: ${message}`, details || '');
    }

    // 本番では外部ログシステムに送信
    if (level === 'error' && !this.isDevelopment) {
      this.sendToExternalLogger(logEntry);
    }
  }

  /**
   * エラー情報を外部ログシステムに送信
   */
  private sendToExternalLogger(logEntry: Record<string, unknown>): void {
    // 本番実装では Sentry, DataDog などに送信
    // プレースホルダー実装
  }

  /**
   * エラーログ
   */
  public error(message: string, error?: Error, details?: Record<string, unknown>): void {
    const errorDetails = {
      ...details,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: this.isDevelopment ? error.stack : undefined
      } : undefined
    };
    this.log('error', message, errorDetails);
  }

  /**
   * 警告ログ
   */
  public warn(message: string, details?: Record<string, unknown>): void {
    this.log('warn', message, details);
  }

  /**
   * 情報ログ
   */
  public info(message: string, details?: Record<string, unknown>): void {
    this.log('info', message, details);
  }

  /**
   * デバッグログ
   */
  public debug(message: string, details?: Record<string, unknown>): void {
    if (this.isDevelopment) {
      this.log('debug', message, details);
    }
  }
}

/**
 * グローバルエラーハンドラー
 */
export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: Record<string, unknown>;

  constructor(
    message: string,
    code: string = 'INTERNAL_ERROR',
    statusCode: number = 500,
    isOperational: boolean = true,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * APIエラーレスポンスに変換
   */
  public toApiError(): ApiError {
    return {
      message: this.message,
      code: this.code,
      timestamp: new Date().toISOString(),
      details: this.details
    };
  }
}

/**
 * バリデーションエラー
 */
export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'VALIDATION_ERROR', 400, true, details);
    this.name = 'ValidationError';
  }
}

/**
 * 認証エラー
 */
export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required', details?: Record<string, unknown>) {
    super(message, 'AUTH_ERROR', 401, true, details);
    this.name = 'AuthenticationError';
  }
}

/**
 * アクセス権限エラー
 */
export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions', details?: Record<string, unknown>) {
    super(message, 'AUTHZ_ERROR', 403, true, details);
    this.name = 'AuthorizationError';
  }
}

/**
 * リソースが見つからないエラー
 */
export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource', details?: Record<string, unknown>) {
    super(`${resource} not found`, 'NOT_FOUND', 404, true, details);
    this.name = 'NotFoundError';
  }
}

/**
 * ユーティリティ関数
 */
export const logger = ErrorLogger.getInstance();

/**
 * Promiseのエラーをキャッチしてログ出力
 */
export async function handleAsyncError<T>(
  promise: Promise<T>,
  errorMessage: string = 'Async operation failed'
): Promise<[Error | null, T | null]> {
  try {
    const result = await promise;
    return [null, result];
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error(errorMessage, err);
    return [err, null];
  }
}

/**
 * 関数の実行をtry-catchでラップ
 */
export function safeExecute<T>(
  fn: () => T,
  errorMessage: string = 'Function execution failed'
): [Error | null, T | null] {
  try {
    const result = fn();
    return [null, result];
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error(errorMessage, err);
    return [err, null];
  }
}

/**
 * 環境変数の存在チェック
 */
export function requireEnvVar(name: string, fallback?: string): string {
  const value = process.env[name] || fallback;
  if (!value) {
    throw new AppError(
      `Required environment variable ${name} is not set`,
      'ENV_VAR_MISSING',
      503
    );
  }
  return value;
}

/**
 * 入力値のサニタイゼーション
 */
export function sanitizeInput(input: unknown): string {
  if (typeof input !== 'string') {
    return String(input);
  }
  
  // XSS攻撃の基本的なサニタイゼーション
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * セキュアなJSONレスポンスを作成
 */
export function createSecureResponse(data: unknown, status: number = 200): Response {
  const responseData = typeof data === 'object' && data !== null
    ? { ...(data as Record<string, unknown>), timestamp: new Date().toISOString() }
    : { data, timestamp: new Date().toISOString() };

  return new Response(
    JSON.stringify(responseData),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'no-store'
      }
    }
  );
}