# 技術仕様書 - AI Code Ecosystem Japan

## 🔧 技術スタック

### フロントエンド
```yaml
フレームワーク: Next.js 15
言語: TypeScript 5.x
スタイリング: Tailwind CSS 3.x
UIコンポーネント: shadcn/ui
アイコン: Lucide Icons
```

### コンテンツ管理
```yaml
形式: MDX (Markdown + JSX)
管理: ローカルファイル（/content ディレクトリ）
処理: 
  - gray-matter（フロントマター解析）
  - next-mdx-remote（MDXレンダリング）
  - reading-time（読了時間計算）
```

### 検索・フィルタリング
```yaml
フェーズ1: クライアントサイド検索（Fuse.js）
フェーズ2: Algolia Search（無料プラン）
フェーズ3: MeiliSearch（セルフホスト）
```

### データベース（フェーズ2以降）
```yaml
プラットフォーム: Supabase
データベース: PostgreSQL
認証: Supabase Auth
ストレージ: Supabase Storage
リアルタイム: Supabase Realtime
```

### ホスティング・インフラ
```yaml
ホスティング: Vercel（無料プラン→Pro）
CDN: Vercel Edge Network
画像最適化: Next.js Image Optimization
分析: Vercel Analytics
```

### 開発ツール
```yaml
パッケージマネージャー: pnpm
リンター: Biome
テスト: Vitest + Testing Library
E2Eテスト: Playwright
CI/CD: GitHub Actions
```

## 📁 ディレクトリ構造

```
ai-code-ecosystem-jp/
├── app/                      # Next.js App Router
│   ├── (marketing)/         # マーケティングページ
│   │   ├── page.tsx         # ホームページ
│   │   ├── about/           # About
│   │   └── contact/         # Contact
│   ├── tools/               # ツール関連ページ
│   │   ├── page.tsx         # ツール一覧
│   │   ├── [slug]/          # 個別ツールページ
│   │   └── compare/         # 比較ページ
│   ├── mcp/                 # MCP関連ページ
│   │   ├── page.tsx         # MCP一覧
│   │   └── [slug]/          # 個別MCPページ
│   ├── cli/                 # CLI関連ページ
│   ├── guides/              # ガイド・チュートリアル
│   ├── api/                 # API Routes
│   │   ├── search/          # 検索API
│   │   └── feedback/        # フィードバックAPI
│   └── layout.tsx           # ルートレイアウト
├── components/              # Reactコンポーネント
│   ├── ui/                  # UIコンポーネント（shadcn/ui）
│   ├── layout/              # レイアウトコンポーネント
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Sidebar.tsx
│   ├── features/            # 機能別コンポーネント
│   │   ├── ToolCard.tsx
│   │   ├── ComparisonTable.tsx
│   │   ├── SearchBar.tsx
│   │   └── FilterPanel.tsx
│   └── mdx/                 # MDX用カスタムコンポーネント
├── content/                 # コンテンツファイル（MDX）
│   ├── tools/               # ツール情報
│   ├── mcp/                 # MCP情報
│   ├── cli/                 # CLI情報
│   ├── guides/              # ガイド記事
│   └── meta/                # メタデータ
├── lib/                     # ユーティリティ関数
│   ├── mdx.ts               # MDX処理
│   ├── search.ts            # 検索機能
│   ├── utils.ts             # 汎用ユーティリティ
│   └── constants.ts         # 定数定義
├── hooks/                   # カスタムフック
│   ├── useSearch.ts
│   ├── useFilter.ts
│   └── useBookmark.ts
├── styles/                  # グローバルスタイル
│   └── globals.css
├── public/                  # 静的ファイル
│   ├── images/
│   ├── icons/
│   └── downloads/           # ダウンロード可能ファイル
└── types/                   # TypeScript型定義
    ├── content.ts
    ├── api.ts
    └── index.ts
```

## 🔌 API設計

### RESTful API エンドポイント

```typescript
// 検索API
GET /api/search
  ?q={query}
  &category={tools|mcp|cli}
  &tags={tag1,tag2}
  &limit={number}
  &offset={number}

// フィードバックAPI
POST /api/feedback
  Body: {
    type: 'suggestion' | 'bug' | 'content',
    message: string,
    email?: string
  }

// 統計API（フェーズ2）
GET /api/stats/tools/{toolId}
  Response: {
    views: number,
    likes: number,
    bookmarks: number
  }

// ユーザーAPI（フェーズ3）
POST /api/auth/register
POST /api/auth/login
GET /api/user/profile
PUT /api/user/bookmarks
```

## 💾 データモデル

### コンテンツスキーマ

```typescript
// ツール情報
interface Tool {
  id: string;
  slug: string;
  name: string;
  nameJa: string;
  category: 'ai-coding' | 'editor' | 'extension';
  description: string;
  descriptionJa: string;
  pricing: {
    free: boolean;
    plans: PricingPlan[];
  };
  features: string[];
  pros: string[];
  cons: string[];
  compatibility: {
    os: ('windows' | 'mac' | 'linux')[];
    ide?: string[];
  };
  links: {
    official: string;
    github?: string;
    docs?: string;
  };
  relatedTools: string[];
  updatedAt: string;
  metadata: {
    stars?: number;
    downloads?: number;
    version?: string;
  };
}

// MCP情報
interface MCP {
  id: string;
  slug: string;
  name: string;
  category: 'official' | 'community' | 'custom';
  description: string;
  installation: string;
  configuration: object;
  compatibleWith: string[];
  author: string;
  repository: string;
  updatedAt: string;
}

// ガイド記事
interface Guide {
  id: string;
  slug: string;
  title: string;
  titleJa: string;
  description: string;
  content: string; // MDX
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // minutes
  tags: string[];
  author: string;
  publishedAt: string;
  updatedAt: string;
}
```

## 🎨 デザインシステム

### カラーパレット
```css
:root {
  /* Primary Colors */
  --primary: #6366f1;      /* Indigo */
  --primary-dark: #4f46e5;
  
  /* Neutral Colors */
  --gray-50: #f9fafb;
  --gray-900: #111827;
  
  /* Semantic Colors */
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
  --info: #3b82f6;
  
  /* Dark Mode */
  --dark-bg: #0f172a;
  --dark-surface: #1e293b;
}
```

### レスポンシブブレークポイント
```scss
$breakpoints: (
  'sm': 640px,   // Mobile
  'md': 768px,   // Tablet
  'lg': 1024px,  // Desktop
  'xl': 1280px,  // Large Desktop
  '2xl': 1536px  // Extra Large
);
```

## 🔒 セキュリティ

### 実装予定のセキュリティ対策
- Content Security Policy (CSP)
- HTTPS強制
- XSS対策（入力値のサニタイズ）
- Rate Limiting（API）
- CORS設定
- 環境変数での機密情報管理

## ⚡ パフォーマンス最適化

### 実装戦略
- Static Site Generation (SSG) for コンテンツページ
- Incremental Static Regeneration (ISR) for 動的コンテンツ
- Image Optimization (next/image)
- Code Splitting
- Lazy Loading
- CDN活用
- Service Worker（PWA対応）

## 📈 SEO対策

### 技術的SEO
- 構造化データ（JSON-LD）
- XMLサイトマップ自動生成
- robots.txt最適化
- OGP対応
- Twitter Card対応
- 多言語対応（hreflang）

## 🧪 テスト戦略

### テストカバレッジ目標
- ユニットテスト: 80%以上
- 統合テスト: 主要フロー100%
- E2Eテスト: クリティカルパス100%

### テスト対象
```yaml
ユニットテスト:
  - ユーティリティ関数
  - カスタムフック
  - データ変換処理

統合テスト:
  - APIエンドポイント
  - MDXレンダリング
  - 検索機能

E2Eテスト:
  - ユーザー登録フロー
  - コンテンツ閲覧
  - 検索・フィルタリング
```

## 📊 モニタリング

### 導入予定ツール
- Google Analytics 4
- Vercel Analytics
- Sentry（エラートラッキング）
- Hotjar（ヒートマップ）※フェーズ2

---
最終更新: 2025年8月29日