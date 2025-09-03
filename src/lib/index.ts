/**
 * ライブラリのメインエクスポート
 * 全てのユーティリティとヘルパー関数を一元管理
 */

// エラーハンドリング
export {
  ErrorLogger,
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  logger,
  handleAsyncError,
  safeExecute,
  requireEnvVar,
  sanitizeInput,
  createSecureResponse
} from './utils/errorHandling';

// セキュリティユーティリティ
export {
  InputValidator,
  CryptoUtils,
  RateLimiter,
  createSecurityContext,
  generateCSPHeader,
  logSecurityEvent,
  validateFileUpload
} from './utils/security';

// 型定義
export type {
  ApiError,
  ApiResponse,
  AuthToken,
  AdminUser,
  ContentMetadata,
  Tool,
  MCPProvider,
  Agent,
  PageProps,
  EnvironmentVariables,
  LogLevel,
  SecurityContext,
  ValidationError as ValidationErrorType,
  DatabaseResult,
  FileOperationResult,
  CacheEntry,
  SearchResult
} from '../types';

/**
 * 共通の定数
 */
export const CONSTANTS = {
  // セキュリティ
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_REQUEST_SIZE: 1024 * 1024, // 1MB
  DEFAULT_RATE_LIMIT: 100, // requests per minute
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes in ms
  
  // バリデーション
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MAX_USERNAME_LENGTH: 50,
  MAX_EMAIL_LENGTH: 254,
  MAX_DESCRIPTION_LENGTH: 1000,
  
  // キャッシュ
  CACHE_TTL: 60 * 60 * 1000, // 1 hour in ms
  
  // ページネーション
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100
} as const;

/**
 * 環境別の設定
 */
export const ENV_CONFIG = {
  development: {
    logLevel: 'debug' as const,
    enableDetailedErrors: true,
    rateLimitMultiplier: 10
  },
  production: {
    logLevel: 'error' as const,
    enableDetailedErrors: false,
    rateLimitMultiplier: 1
  },
  test: {
    logLevel: 'warn' as const,
    enableDetailedErrors: true,
    rateLimitMultiplier: 100
  }
} as const;