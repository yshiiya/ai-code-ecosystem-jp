// 海外AI情報サイトのリソースデータ

export interface AIResourceSite {
  id: string;
  name: string;
  url: string;
  description: string;
  mainContent: string;
  features: string;
  updateFrequency: string;
  keyPoints: string;
  category: 'comparison' | 'directory' | 'learning' | 'news' | 'documentation' | 'enterprise' | 'specialized';
  importance: 'high' | 'medium' | 'low';
  checkFrequency: 'daily' | 'weekly' | 'monthly';
  rssUrl?: string;
  apiEndpoint?: string;
  lastChecked?: Date;
}

export const aiResourceSites: AIResourceSite[] = [
  {
    id: 'qodo',
    name: 'Qodo',
    url: 'https://www.qodo.ai/blog/best-ai-coding-assistant-tools/',
    description: 'AIコーディングアシスタントツールの包括的比較サイト',
    mainContent: '20のAIコーディングツールの詳細レビュー、プロ・コン比較、価格情報、専門家サマリー、FAQ',
    features: '製品別ナビゲーション、詳細なツール比較表、実際の使用体験談、価格モデル分析',
    updateFrequency: '2025年8月更新、定期的に最新ツール情報を追加',
    keyPoints: '実践的なツール評価、価格比較、専門家の視点、選定基準の明確化',
    category: 'comparison',
    importance: 'high',
    checkFrequency: 'monthly'
  },
  {
    id: 'n8n-blog',
    name: 'n8n Blog',
    url: 'https://blog.n8n.io/best-ai-for-coding/',
    description: 'ワークフロー自動化プラットフォームによるAIコーディングツール比較ブログ',
    mainContent: '8つの主要AIコーディングツールのテスト結果、詳細レビュー、実用的な比較分析',
    features: 'カテゴリ別ナビゲーション、実践的テスト方法論、包括的な機能比較表',
    updateFrequency: '2025年3月公開、月次更新頻度',
    keyPoints: '実際のテスト結果、ローコードとの組み合わせ提案、開発者向け実用情報',
    category: 'comparison',
    importance: 'medium',
    checkFrequency: 'monthly'
  },
  {
    id: 'spacelift',
    name: 'Spacelift',
    url: 'https://spacelift.io/blog/ai-coding-assistant-tools',
    description: 'インフラ自動化プラットフォームによるAIコーディングツール情報サイト',
    mainContent: '20のAI搭載コーディングアシスタントツール、DevOps観点からの分析、価格・機能比較',
    features: '製品・ソリューション別構成、企業向け情報充実、技術文書完備',
    updateFrequency: '2025年8月12日更新、継続的更新',
    keyPoints: 'DevOps統合観点、エンタープライズ向け情報、インフラとの連携視点',
    category: 'enterprise',
    importance: 'medium',
    checkFrequency: 'monthly'
  },
  {
    id: 'ai-tool-hub',
    name: 'AI Tool Hub',
    url: 'https://aitoolhub.co/',
    description: 'AIツールの包括的なディレクトリ・マーケットプレイス',
    mainContent: '厳選されたAIツールコレクション、新着ツール、トレンドツール、カテゴリ別分類、TwitterとRedditのトレンド情報',
    features: 'カテゴリ・価格でのフィルタリング機能、お気に入り機能、ツール提出機能、評価システム、外部トレンド統合',
    updateFrequency: 'ほぼ毎日新しいツールが追加（18時間前～9日前の新着ツール表示）',
    keyPoints: '包括的なAIツールディレクトリ、リアルタイムトレンド情報、コミュニティ投稿機能、多様なカテゴリ分類',
    category: 'directory',
    importance: 'high',
    checkFrequency: 'daily',
    rssUrl: 'https://aitoolhub.co/feed'
  },
  {
    id: 'ai-coding-tools-blog',
    name: 'AI Coding Tools Blog',
    url: 'https://aicodingtools.blog/en',
    description: 'AIコーディングツールの包括的なドキュメントハブ',
    mainContent: 'Gemini CLI、Kiro IDE、Context Engineeringなどの詳細ガイド、自然言語プログラミング手法',
    features: 'ドキュメント形式、ステップバイステップガイド、技術的な詳細説明、実装例',
    updateFrequency: '2025年の最新情報、継続的にドキュメント更新',
    keyPoints: '技術詳細の深掘り、実装ガイド、次世代コーディング手法の解説',
    category: 'documentation',
    importance: 'medium',
    checkFrequency: 'weekly'
  },
  {
    id: 'awesome-claude-ai',
    name: 'Awesome Claude AI',
    url: 'https://awesomeclaude.ai/',
    description: 'Claude AI専用のリソース・ツール総合ディレクトリサイト',
    mainContent: '90以上のClaude関連ツール・SDK・サーバー・統合機能の厳選リスト、公式Anthropicリソース、教育コンテンツ、MCPサーバー、IDE拡張機能、アプリケーション',
    features: 'カテゴリ別階層構造、GitHubスター数表示、コミュニティリンク集、MCP Installer、Code Cheatsheet、Artifacts機能',
    updateFrequency: '2025年対応、継続的なツール追加・更新、コミュニティ主導',
    keyPoints: 'Claude専用エコシステムの包括的マップ、実用的なツール分類、開発者コミュニティとの連携、公式リソースとの統合',
    category: 'specialized',
    importance: 'high',
    checkFrequency: 'weekly'
  },
  {
    id: 'claude-code-anthropic',
    name: 'Claude Code (Anthropic)',
    url: 'https://www.anthropic.com/claude-code',
    description: 'ターミナル統合型AIコーディングアシスタント',
    mainContent: 'ターミナル内AI操作、コードベース全体理解、ファイル編集・コマンド実行、VS Code/JetBrains統合',
    features: '製品紹介動画、ユースケース別説明、開発者証言、技術文書へのリンク',
    updateFrequency: 'Claude Opus 4.1搭載、継続的な機能強化',
    keyPoints: 'エージェンティックな動作、深いコードベース理解、ターミナル中心のワークフロー',
    category: 'specialized',
    importance: 'high',
    checkFrequency: 'weekly'
  },
  {
    id: 'tabnine',
    name: 'Tabnine',
    url: 'https://www.tabnine.com/',
    description: 'プライベート・パーソナライズされたAIコーディングアシスタント',
    mainContent: '6つの専門AIエージェント（コードレビュー、Jira統合、オンボーディング、テスト、修正、ドキュメント）、エアギャップデプロイメント、完全なプライバシー保護',
    features: '製品価値の3本柱（Private/Personalized/Protected）、各AIエージェントの詳細説明、セキュリティ・プライバシー重視、Gartner評価表示',
    updateFrequency: '2024年中に複数の新機能追加、継続的なAIエージェント強化',
    keyPoints: 'エンタープライズセキュリティ重視、エアギャップ対応、IP保護・補償、業界アナリスト高評価',
    category: 'enterprise',
    importance: 'medium',
    checkFrequency: 'monthly'
  },
  {
    id: 'prompt-engineering-guide',
    name: 'Prompt Engineering Guide',
    url: 'https://www.promptingguide.ai/',
    description: 'プロンプトエンジニアリングの包括的な学習・リファレンスサイト',
    mainContent: 'プロンプト技術の基礎から応用、AI エージェント構築、最新研究論文、実践的ガイド、モデル別対応情報、プロンプトハブ',
    features: '体系的なカリキュラム構成、技術別詳細解説、実践例豊富、GitHub連携、Discord コミュニティ、多言語対応',
    updateFrequency: '2025年7月最終更新、継続的なコンテンツ追加、最新AI研究反映',
    keyPoints: 'プロンプトエンジニアリングの包括的学習、実践的技術習得、最新研究動向把握、コミュニティ連携',
    category: 'learning',
    importance: 'high',
    checkFrequency: 'weekly'
  },
  {
    id: 'learn-prompting',
    name: 'Learn Prompting',
    url: 'https://learnprompting.org/',
    description: 'AIとプロンプトエンジニアリングの包括的学習プラットフォーム',
    mainContent: 'ChatGPT・Claude等の基礎コース、高度なプロンプト技術、AIセキュリティ・レッドチーミング、HackAPrompt競技会、認定試験、ライブコース',
    features: '難易度別コース体系、業界専門家による指導、受賞研究ベース、300万人利用、企業向けソリューション、Discord コミュニティ',
    updateFrequency: '2025年対応、継続的な新コース追加、AI進化に合わせた迅速更新',
    keyPoints: '体系的AI教育、実践的スキル習得、セキュリティ重視、大規模コミュニティ、企業実績',
    category: 'learning',
    importance: 'high',
    checkFrequency: 'weekly'
  },
  {
    id: 'future-tools',
    name: 'Future Tools',
    url: 'https://www.futuretools.io/news',
    description: 'AI関連ニュース・情報の厳選キュレーションサイト',
    mainContent: '日々のAIニュース厳選、新着AIツール紹介、AI用語集、FAQ、ツール投稿機能、AI Income Database',
    features: 'Matt Wolfe による手動キュレーション、簡潔なニュース要約、元記事への直接リンク、教育リソース充実',
    updateFrequency: 'ほぼ毎日更新（平日）、週末・出張時は更新頻度低下、リアルタイム性重視',
    keyPoints: '厳選されたAI情報、ノイズフィルタリング、信頼できる情報源、教育コンテンツ併設',
    category: 'news',
    importance: 'high',
    checkFrequency: 'daily',
    rssUrl: 'https://www.futuretools.io/rss'
  }
];

// カテゴリー情報
export const resourceCategories = {
  comparison: {
    name: '比較・レビュー',
    description: 'AIツールの詳細な比較とレビューを提供するサイト',
    icon: '⚖️'
  },
  directory: {
    name: 'ディレクトリ',
    description: 'AIツールを網羅的に収集・分類したディレクトリサイト',
    icon: '📚'
  },
  learning: {
    name: '学習プラットフォーム',
    description: 'AIとプロンプトエンジニアリングの学習リソース',
    icon: '🎓'
  },
  news: {
    name: 'ニュース・情報',
    description: '最新のAI関連ニュースとトレンド情報',
    icon: '📰'
  },
  documentation: {
    name: 'ドキュメント',
    description: '技術的な詳細とガイドを提供するサイト',
    icon: '📖'
  },
  enterprise: {
    name: 'エンタープライズ',
    description: '企業向けAIソリューションとツール',
    icon: '🏢'
  },
  specialized: {
    name: '特化型',
    description: '特定のAIツールやエコシステムに特化したサイト',
    icon: '🎯'
  }
};

// 追加予定のサイト候補
export const potentialSites = [
  'https://github.com/awesome-ai/awesome-ai-coding',
  'https://www.producthunt.com/topics/ai-code-assistant',
  'https://huggingface.co/spaces',
  'https://theresanaiforthat.com/s/coding/',
  'https://aitools.fyi/categories/code-assistant',
  'https://www.reddit.com/r/AICoding/',
  'https://www.aicodex.com/',
  'https://www.aidev.codes/',
  'https://news.ycombinator.com/',
  'https://dev.to/t/ai'
];

// 情報収集設定
export const collectionConfig = {
  // RSS/APIで収集可能なサイト
  rssEnabled: ['future-tools', 'ai-tool-hub'],
  
  // 毎日チェックすべき重要サイト
  dailyCheck: ['ai-tool-hub', 'future-tools'],
  
  // 週次チェックサイト
  weeklyCheck: ['awesome-claude-ai', 'claude-code-anthropic', 'ai-coding-tools-blog', 'prompt-engineering-guide', 'learn-prompting'],
  
  // 月次チェックサイト
  monthlyCheck: ['qodo', 'n8n-blog', 'spacelift', 'tabnine'],
  
  // 翻訳・要約の優先順位
  translationPriority: {
    high: ['新ツールリリース', 'メジャーアップデート', '業界トレンド'],
    medium: ['ツール比較', '技術解説', 'ベストプラクティス'],
    low: ['企業ニュース', '資金調達', 'イベント情報']
  }
};

// ヘルパー関数
export function getResourcesByCategory(category: string) {
  return aiResourceSites.filter(site => site.category === category);
}

export function getHighImportanceSites() {
  return aiResourceSites.filter(site => site.importance === 'high');
}

export function getSitesToCheckToday() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const dayOfMonth = today.getDate();
  
  let sites: AIResourceSite[] = [];
  
  // 毎日チェック
  sites.push(...aiResourceSites.filter(site => site.checkFrequency === 'daily'));
  
  // 週次チェック（月曜日）
  if (dayOfWeek === 1) {
    sites.push(...aiResourceSites.filter(site => site.checkFrequency === 'weekly'));
  }
  
  // 月次チェック（1日）
  if (dayOfMonth === 1) {
    sites.push(...aiResourceSites.filter(site => site.checkFrequency === 'monthly'));
  }
  
  return sites;
}