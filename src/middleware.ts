import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // /admin/* パスを保護
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // 簡単な認証チェック（本番では強化が必要）
    const authHeader = request.headers.get('authorization')
    const token = request.cookies.get('admin-token')
    
    // 開発環境では認証をスキップ
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.next()
    }
    
    // 認証トークンチェック
    if (!token || token.value !== process.env.ADMIN_SECRET) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { 'content-type': 'application/json' }
        }
      )
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*'
}