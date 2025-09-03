/**
 * 共通型定義
 * セキュリティと型安全性向上のための型定義集
 */

// 基本的なエラー型
export interface ApiError {
  message: string;
  code: string;
  timestamp: string;
  details?: Record<string, unknown>;
}

// API レスポンス型
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

// 認証関連型
export interface AuthToken {
  value: string;
  expiresAt: Date;
  issuedAt: Date;
}

export interface AdminUser {
  id: string;
  username: string;
  role: 'admin' | 'moderator';
  lastLogin?: Date;
}

// コンテンツ関連型
export interface ContentMetadata {
  id: string;
  title: string;
  description?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  author?: string;
  published: boolean;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  documentation?: string;
  repository?: string;
  website?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MCPProvider {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  repository: string;
  installation: string;
  configuration?: Record<string, unknown>;
  examples?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// エージェント関連型
export interface Agent {
  id: string;
  name: string;
  description: string;
  category: string;
  prompt?: string;
  capabilities: string[];
  examples?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// ページプロパティ型（Next.js 15対応）
export interface PageProps {
  params?: Promise<Record<string, string | string[]>>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

// 環境変数型
export interface EnvironmentVariables {
  NODE_ENV: 'development' | 'production' | 'test';
  ADMIN_SECRET?: string;
  DATABASE_URL?: string;
  NEXT_PUBLIC_APP_URL?: string;
}

// ログレベル型
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// セキュリティコンテキスト型
export interface SecurityContext {
  userId?: string;
  role?: string;
  permissions: string[];
  sessionId: string;
  ipAddress?: string;
  userAgent?: string;
}

// バリデーションエラー型
export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: unknown;
}

// データベース操作結果型
export interface DatabaseResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  affectedRows?: number;
}

// ファイル操作結果型
export interface FileOperationResult {
  success: boolean;
  filePath?: string;
  error?: string;
  size?: number;
}

// キャッシュエントリ型
export interface CacheEntry<T = unknown> {
  key: string;
  value: T;
  expiresAt: Date;
  createdAt: Date;
}

// 検索結果型
export interface SearchResult<T = unknown> {
  items: T[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}