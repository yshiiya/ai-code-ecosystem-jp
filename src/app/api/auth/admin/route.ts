/**
 * 管理者認証 APIエンドポイント
 * セキュリティ強化とレート制限を実装
 */

import { NextRequest } from 'next/server';
import { 
  createSecureResponse,
  RateLimiter,
  InputValidator,
  CryptoUtils,
  logger,
  requireEnvVar,
  AuthenticationError,
  ValidationError
} from '@/lib';

interface AuthRequest {
  password: string;
  timestamp?: number;
}

export async function POST(request: NextRequest) {
  try {
    // IPアドレスを取得
    const clientIP = getClientIP(request);
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // レート制限チェック（IPごとに10回/分）
    const rateLimitResult = RateLimiter.checkRate(`auth:${clientIP}`, 10, 60 * 1000);
    
    if (!rateLimitResult.allowed) {
      logger.warn('Rate limit exceeded for admin auth', {
        clientIP,
        userAgent,
        remaining: rateLimitResult.remaining
      });
      
      return createSecureResponse(
        {
          success: false,
          error: 'Too many requests',
          message: 'リクエストが多すぎます。しばらく待ってから再試行してください。',
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
        },
        429
      );
    }

    // リクエストボディをパース
    let body: AuthRequest;
    try {
      body = await request.json();
    } catch {
      throw new ValidationError('無効なJSONデータです');
    }

    // 基本的な入力検証
    if (!body.password || typeof body.password !== 'string') {
      throw new ValidationError('パスワードが必要です');
    }

    if (!InputValidator.validateLength(body.password, 1, 256)) {
      throw new ValidationError('パスワードの長さが無効です');
    }

    // リプレイ攻撃対策（タイムスタンプチェック）
    if (body.timestamp) {
      const now = Date.now();
      const timeDiff = Math.abs(now - body.timestamp);
      const maxTimeDiff = 5 * 60 * 1000; // 5分
      
      if (timeDiff > maxTimeDiff) {
        throw new AuthenticationError('リクエストの有効期限が切れています');
      }
    }

    // パスワードを検証
    const adminSecret = requireEnvVar('ADMIN_SECRET');
    const providedPassword = body.password.trim();
    
    // 基本的なセキュリティチェック
    if (providedPassword.length < 8) {
      logger.warn('Admin auth attempt with weak password', {
        clientIP,
        userAgent,
        passwordLength: providedPassword.length
      });
      throw new AuthenticationError('無効なパスワードです');
    }

    // パスワードを検証（タイミング攻撃対策付き）
    const isValid = await validatePassword(providedPassword, adminSecret);
    
    if (!isValid) {
      logger.warn('Failed admin authentication attempt', {
        clientIP,
        userAgent,
        timestamp: new Date().toISOString()
      });
      
      // タイミング攻撃対策のため、少し待つ
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      throw new AuthenticationError('認証に失敗しました');
    }

    // 認証成功 - トークンを作成してCookieに設定
    const token = CryptoUtils.generateToken(32);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1時間後
    
    logger.info('Successful admin authentication', {
      clientIP,
      userAgent,
      timestamp: new Date().toISOString()
    });

    const response = createSecureResponse({
      success: true,
      message: '認証に成功しました',
      expiresAt: expiresAt.toISOString()
    });

    // セキュアなCookieを設定
    response.headers.set('Set-Cookie', 
      `admin-token=${token}; Path=/; HttpOnly; Secure=${process.env.NODE_ENV === 'production'}; SameSite=Strict; Max-Age=3600`
    );

    return response;

  } catch (error) {
    if (error instanceof AuthenticationError || error instanceof ValidationError) {
      return createSecureResponse(
        {
          success: false,
          error: error.code,
          message: error.message
        },
        error.statusCode
      );
    }

    // 予期しないエラー
    logger.error('Unexpected error in admin auth', error as Error, {
      timestamp: new Date().toISOString()
    });

    return createSecureResponse(
      {
        success: false,
        error: 'INTERNAL_ERROR',
        message: 'サーバーエラーが発生しました'
      },
      500
    );
  }
}

/**
 * クライアントIPアドレスを取得
 */
function getClientIP(request: NextRequest): string {
  // Vercel, Cloudflare などのプロキシからのIPを取得
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (cfConnectingIP) return cfConnectingIP;
  if (realIP) return realIP;
  if (forwardedFor) return forwardedFor.split(',')[0].trim();
  
  return 'unknown';
}

/**
 * パスワードを検証（タイミング攻撃対策付き）
 */
async function validatePassword(password: string, secret: string): Promise<boolean> {
  // 本番ではデータベースに保存されたハッシュと比較
  // ここでは環境変数との直接比較（改善の余地あり）
  const startTime = Date.now();
  
  try {
    // 基本的な比較（本番ではハッシュ化されたパスワードを使用）
    const isValid = password === secret;
    
    // タイミング攻撃対策：最低限の処理時間を確保
    const minProcessingTime = 500; // 500ms
    const elapsed = Date.now() - startTime;
    if (elapsed < minProcessingTime) {
      await new Promise(resolve => setTimeout(resolve, minProcessingTime - elapsed));
    }
    
    return isValid;
  } catch {
    return false;
  }
}

// 他のHTTPメソッドを明示的に拒否
export async function GET() {
  return createSecureResponse(
    {
      success: false,
      error: 'METHOD_NOT_ALLOWED',
      message: 'GET method is not allowed for this endpoint'
    },
    405
  );
}

export async function PUT() {
  return createSecureResponse(
    {
      success: false,
      error: 'METHOD_NOT_ALLOWED', 
      message: 'PUT method is not allowed for this endpoint'
    },
    405
  );
}

export async function DELETE() {
  return createSecureResponse(
    {
      success: false,
      error: 'METHOD_NOT_ALLOWED',
      message: 'DELETE method is not allowed for this endpoint'
    },
    405
  );
}
