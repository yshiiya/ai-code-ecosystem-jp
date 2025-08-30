import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json(
        { error: 'パスワードが必要です' },
        { status: 400 }
      )
    }

    // 管理者パスワードをチェック
    const adminSecret = process.env.ADMIN_SECRET || 'admin123'
    
    if (password !== adminSecret) {
      return NextResponse.json(
        { error: 'パスワードが間違っています' },
        { status: 401 }
      )
    }

    // 認証成功 - セッショントークンを設定
    const response = NextResponse.json({ success: true })
    
    // HTTPオンリークッキーでセキュアにトークンを設定
    response.cookies.set('admin-token', adminSecret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 24時間
    })

    return response
  } catch (error) {
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}