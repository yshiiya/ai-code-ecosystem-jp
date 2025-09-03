# Community Insights Agent

AI Code Ecosystem Japan プロジェクトの Community Insights Agent は、SNSプラットフォーム上でのAIコーディングツールに関する評判・トレンドを分析するエージェントです。

## 機能概要

### 🔍 主要機能

1. **センチメント分析**
   - 投稿の感情的な傾向を分析（ポジティブ/ネガティブ/ニュートラル）
   - 日本語と英語の両方に対応
   - OpenAI APIまたはモックエンジンを使用

2. **トレンド分析**
   - AIツールの言及数とエンゲージメントの変化を追跡
   - 上昇/下降/安定/バイラルなどのトレンドタイプを分類
   - 予測機能付き

3. **多プラットフォーム対応**
   - Twitter/X
   - Reddit
   - Qiita
   - Zenn
   - Hacker News
   - GitHub（議論・Issue）

4. **自動レポート生成**
   - 週次レポート（JSON + Markdown形式）
   - キーインサイトの自動抽出
   - 注目投稿の特定

## ファイル構成

```
agents/community/
├── README.md                    # このファイル
├── types.ts                     # 型定義
├── sources.yaml                 # データソース設定
├── sentiment.ts                 # センチメント分析エンジン
├── analyze_trends.ts            # トレンド分析エンジン
├── test.js                      # 動作テスト
└── scripts/
    └── weekly_report.ts         # 週次レポート生成
```

## 使用方法

### 基本的な使用例

#### センチメント分析

```typescript
import { analyzeSentiment } from './sentiment';

const result = await analyzeSentiment('ChatGPTは本当に素晴らしいツールだと思います！');
console.log(result.sentiment);   // 'positive'
console.log(result.confidence);  // 0.85
console.log(result.scores);      // { positive: 0.8, negative: 0.1, neutral: 0.1 }
```

#### トレンド分析

```typescript
import { analyzeAIToolTrends } from './analyze_trends';

const analysis = await analyzeAIToolTrends();
console.log(analysis.trends);    // TrendAnalysis[]
console.log(analysis.summary);   // 統計サマリー
console.log(analysis.keywords);  // 抽出されたキーワード
```

#### 週次レポート生成

```typescript
import { WeeklyReportGenerator } from './scripts/weekly_report';

const generator = new WeeklyReportGenerator();
const report = await generator.generateReport();

// レポート保存
await generator.saveReport(report, './reports');
await generator.saveMarkdownReport(report, './reports');
```

### コマンドライン実行

```bash
# 動作テスト
node agents/community/test.js

# 週次レポート生成
npx ts-node agents/community/scripts/weekly_report.ts
```

## 設定

### データソース設定 (sources.yaml)

```yaml
# Twitter監視設定
twitter_sources:
  ai_tools:
    name: "AI Development Tools"
    query:
      - "GitHub Copilot"
      - "ChatGPT code"
      - "Claude code"
    hashtags:
      - "#AI"
      - "#Programming"
    active: true
    priority: 9

# 分析設定
analysis_config:
  collection_interval: 30        # データ収集間隔（分）
  analysis_interval: 6           # 分析実行間隔（時間）
  sentiment_analysis:
    enabled: true
    confidence_threshold: 0.7
  trend_analysis:
    enabled: true
    lookback_days: 7
```

### API設定

実際のAPI連携を行う場合は、環境変数で認証情報を設定：

```bash
# .env.local
TWITTER_API_KEY=your_twitter_api_key
OPENAI_API_KEY=your_openai_api_key
REDDIT_CLIENT_ID=your_reddit_client_id
```

## 対象AIツール

現在監視対象としているAIツールカテゴリ：

### コード補完
- GitHub Copilot
- Tabnine
- CodeWhisperer
- IntelliCode

### コード生成
- ChatGPT
- Claude
- CodeT5
- GitHub Copilot X

### コードレビュー
- DeepCode
- SonarQube with AI
- CodeClimate AI

### チャットアシスタント
- ChatGPT
- Claude
- Bard
- Bing Chat

## レポート例

### 週次レポートサンプル

```markdown
# AI Code Ecosystem Japan - 週次レポート

**レポート期間**: 2024年1月1日 ～ 2024年1月7日
**生成日時**: 2024年1月8日
**信頼度**: 87%

## エグゼクティブサマリー

- **総投稿数**: 1,245件
- **総エンゲージメント**: 45,678
- **分析対象ツール数**: 15個

### 主要なインサイト

- 3個のAIツールが上昇トレンドを示しています
- 今週のキーワード: chatgpt, 開発効率, coding
- 日本語コミュニティでのAIツール利用が活発化しています

## トップトレンドツール

### 1. ChatGPT
- **言及数**: 456件
- **総エンゲージメント**: 12,345
- **センチメント**: ポジティブ
- **公式言及**: あり
```

## データ構造

### 主要な型定義

```typescript
// ソーシャルメディア投稿
interface SocialPost {
  id: string;
  platform: PlatformType;
  author: string;
  content: string;
  createdAt: string;
  engagement: {
    likes: number;
    shares: number;
    comments: number;
  };
  mentionedTools: string[];
  hashtags: string[];
  language: LanguageType;
}

// センチメント分析結果
interface SentimentAnalysis {
  postId: string;
  sentiment: SentimentType;
  confidence: number;
  scores: {
    positive: number;
    negative: number;
    neutral: number;
  };
  engine: string;
  analyzedAt: string;
}

// トレンド分析結果
interface TrendAnalysis {
  period: { start: string; end: string };
  trendType: TrendType;
  trendScore: number;
  mentionGrowth: {
    current: number;
    previous: number;
    growthRate: number;
  };
  engagementGrowth: {
    current: number;
    previous: number;
    growthRate: number;
  };
  factors: TrendFactor[];
  prediction?: {
    nextWeek: TrendType;
    confidence: number;
  };
}
```

## 実装の特徴

### モック実装

現在の実装はモック実装を含んでおり、実際のAPI認証なしでテストが可能です：

- **MockSentimentEngine**: キーワードベースのセンチメント分析
- **MockDataGenerator**: リアルなソーシャルメディア投稿データの生成
- **日本語対応**: 日本語特有の感情表現パターンの分析

### スケーラビリティ

- **プラグイン型アーキテクチャ**: 新しいプラットフォームの追加が容易
- **エンジン交換可能**: センチメント分析エンジンの切り替えが可能
- **非同期処理**: 大量データの効率的な処理
- **レート制限対応**: API制限に配慮した実装

## 今後の拡張予定

1. **実API連携**
   - Twitter API v2 連携
   - Reddit API 連携
   - Qiita/Zenn API 連携

2. **高度な分析機能**
   - 影響力のあるユーザーの特定
   - ネットワーク分析
   - 異常検知

3. **リアルタイム機能**
   - ストリーミングデータ処理
   - リアルタイムアラート
   - ダッシュボード

4. **機械学習強化**
   - カスタムセンチメントモデル
   - トレンド予測の精度向上
   - 多言語対応の拡張

## トラブルシューティング

### よくある問題

**Q: TypeScriptコンパイルエラーが発生する**
A: `npm run build` でプロジェクト全体のビルドを確認し、型定義の不整合を修正してください。

**Q: モックデータの結果が期待と異なる**
A: `sources.yaml` の設定を確認し、分析対象のツールやキーワードを調整してください。

**Q: レポート生成に時間がかかる**
A: `analysis_config.collection_interval` を調整して、データ処理量を制限してください。

## ライセンス

このプロジェクトはAI Code Ecosystem Japanプロジェクトの一部として開発されています。

## 貢献

バグ報告や機能改善の提案は、プロジェクトのメインリポジトリにIssueとして投稿してください。

---

最終更新: 2024年1月8日