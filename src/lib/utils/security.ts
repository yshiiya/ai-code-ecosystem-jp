/**
 * セキュリティユーティリティ
 * 入力検証、サニタイゼーション、認証関連のユーティリティ
 */

import { createHash, randomBytes, timingSafeEqual } from 'crypto';
import type { SecurityContext } from '@/types';
import { logger } from './errorHandling';

/**
 * 入力値検証クラス
 */
export class InputValidator {
  /**
   * 文字列の長さを検証
   */
  static validateLength(
    value: string,
    minLength: number = 0,
    maxLength: number = 1000
  ): boolean {
    return value.length >= minLength && value.length <= maxLength;
  }

  /**
   * メールアドレスの形式を検証
   */
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && this.validateLength(email, 3, 254);
  }

  /**
   * URLの形式を検証
   */
  static validateUrl(url: string): boolean {
    try {
      new URL(url);
      return this.validateLength(url, 3, 2048);
    } catch {
      return false;
    }
  }

  /**
   * 英数字と一部記号のみを許可
   */
  static validateAlphanumeric(value: string, allowSpaces: boolean = false): boolean {
    const pattern = allowSpaces ? /^[a-zA-Z0-9\s._-]+$/ : /^[a-zA-Z0-9._-]+$/;
    return pattern.test(value);
  }

  /**
   * SQLインジェクションの基本的なチェック
   */
  static validateNoSqlInjection(value: string): boolean {
    const suspiciousPatterns = [
      /('|(\-\-)|(;)|(\||\|)|(\*|\*))/, // SQL injection patterns
      /(union|select|insert|delete|update|drop|create|alter|exec|execute)/i,
      /(script|javascript|vbscript|onload|onerror|onclick)/i // XSS patterns
    ];
    
    return !suspiciousPatterns.some(pattern => pattern.test(value));
  }

  /**
   * パスワードの強度を検証
   */
  static validatePasswordStrength(password: string): {
    isValid: boolean;
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) score += 1;
    else feedback.push('パスワードは8文字以上で入力してください');

    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('小文字を含めてください');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('大文字を含めてください');

    if (/[0-9]/.test(password)) score += 1;
    else feedback.push('数字を含めてください');

    if (/[^a-zA-Z0-9]/.test(password)) score += 1;
    else feedback.push('記号を含めてください');

    return {
      isValid: score >= 4,
      score,
      feedback
    };
  }
}

/**
 * 暗号化ユーティリティ
 */
export class CryptoUtils {
  /**
   * ランダムなトークンを生成
   */
  static generateToken(length: number = 32): string {
    return randomBytes(length).toString('hex');
  }

  /**
   * パスワードをハッシュ化
   */
  static hashPassword(password: string, salt?: string): { hash: string; salt: string } {
    const actualSalt = salt || randomBytes(16).toString('hex');
    const hash = createHash('sha256')
      .update(password + actualSalt)
      .digest('hex');
    
    return { hash, salt: actualSalt };
  }

  /**
   * パスワードを検証
   */
  static verifyPassword(password: string, hash: string, salt: string): boolean {
    const { hash: computedHash } = this.hashPassword(password, salt);
    
    // タイミング攻撃を防ぐためのtimingSafeEqualを使用
    try {
      const hashBuffer = Buffer.from(hash, 'hex');
      const computedBuffer = Buffer.from(computedHash, 'hex');
      return hashBuffer.length === computedBuffer.length &&
             timingSafeEqual(hashBuffer, computedBuffer);
    } catch {
      return false;
    }
  }

  /**
   * 簡単な暇号化（機密データは正式な暴号化ライブラリを使用）
   */
  static simpleEncrypt(text: string, key: string): string {
    const hash = createHash('md5').update(key).digest('hex');
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      const keyChar = hash.charCodeAt(i % hash.length);
      result += String.fromCharCode(char ^ keyChar);
    }
    return Buffer.from(result).toString('base64');
  }

  /**
   * 簡単な復号化
   */
  static simpleDecrypt(encryptedText: string, key: string): string {
    try {
      const hash = createHash('md5').update(key).digest('hex');
      const text = Buffer.from(encryptedText, 'base64').toString();
      let result = '';
      for (let i = 0; i < text.length; i++) {
        const char = text.charCodeAt(i);
        const keyChar = hash.charCodeAt(i % hash.length);
        result += String.fromCharCode(char ^ keyChar);
      }
      return result;
    } catch {
      return '';
    }
  }
}

/**
 * レートリミッター
 */
export class RateLimiter {
  private static requests = new Map<string, { count: number; resetTime: number }>();

  /**
   * リクエストレートをチェック
   */
  static checkRate(
    identifier: string,
    maxRequests: number = 100,
    windowMs: number = 60 * 1000 // 1分
  ): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const record = this.requests.get(identifier);

    if (!record || now > record.resetTime) {
      // 新しいウィンドウを開始
      const resetTime = now + windowMs;
      this.requests.set(identifier, { count: 1, resetTime });
      return { allowed: true, remaining: maxRequests - 1, resetTime };
    }

    if (record.count >= maxRequests) {
      return { allowed: false, remaining: 0, resetTime: record.resetTime };
    }

    // リクエスト数を増加
    record.count += 1;
    this.requests.set(identifier, record);

    return {
      allowed: true,
      remaining: maxRequests - record.count,
      resetTime: record.resetTime
    };
  }

  /**
   * 期限切れのエントリをクリーンアップ
   */
  static cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.requests.entries()) {
      if (now > record.resetTime) {
        this.requests.delete(key);
      }
    }
  }
}

/**
 * セキュリティコンテキストを作成
 */
export function createSecurityContext(
  request: Request
): SecurityContext {
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  // IPアドレスを抽出
  let ipAddress = 'unknown';
  if (forwardedFor) {
    ipAddress = forwardedFor.split(',')[0].trim();
  } else if (realIp) {
    ipAddress = realIp;
  }

  return {
    permissions: [], // デフォルトは権限なし
    sessionId: CryptoUtils.generateToken(16),
    ipAddress: ipAddress !== 'unknown' ? ipAddress : undefined,
    userAgent
  };
}

/**
 * CSP (Content Security Policy) ヘッダーを生成
 */
export function generateCSPHeader(isDevelopment: boolean = false): string {
  if (isDevelopment) {
    return "default-src 'self' 'unsafe-inline' 'unsafe-eval' localhost:* ws://localhost:*; img-src 'self' data: https:; font-src 'self' https:";
  }

  return [
    "default-src 'self'",
    "script-src 'self' 'strict-dynamic'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' https:",
    "connect-src 'self' https:",
    "media-src 'self'",
    "object-src 'none'",
    "child-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "base-uri 'self'"
  ].join('; ');
}

/**
 * セキュリティイベントのログ
 */
export function logSecurityEvent(
  event: string,
  context: SecurityContext,
  details?: Record<string, unknown>
): void {
  logger.warn(`Security Event: ${event}`, {
    ...details,
    sessionId: context.sessionId,
    ipAddress: context.ipAddress,
    userAgent: context.userAgent,
    timestamp: new Date().toISOString()
  });
}

/**
 * ファイルアップロードのセキュリティチェック
 */
export function validateFileUpload(
  file: File,
  options: {
    maxSize?: number; // bytes
    allowedTypes?: string[];
    allowedExtensions?: string[];
  } = {}
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  const maxSize = options.maxSize || 10 * 1024 * 1024; // 10MB default
  const allowedTypes = options.allowedTypes || ['image/jpeg', 'image/png', 'image/gif', 'text/plain'];
  const allowedExtensions = options.allowedExtensions || ['.jpg', '.jpeg', '.png', '.gif', '.txt'];

  // ファイルサイズチェック
  if (file.size > maxSize) {
    errors.push(`File size exceeds maximum allowed size of ${maxSize} bytes`);
  }

  // MIMEタイプチェック
  if (!allowedTypes.includes(file.type)) {
    errors.push(`File type ${file.type} is not allowed`);
  }

  // 拡張子チェック
  const extension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!allowedExtensions.includes(extension)) {
    errors.push(`File extension ${extension} is not allowed`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}