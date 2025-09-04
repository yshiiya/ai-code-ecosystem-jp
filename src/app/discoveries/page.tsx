'use client';

import { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Users, Star, ExternalLink, Calendar, Globe, Award, Zap, Search, Filter, AlertCircle } from 'lucide-react';

// ツールアイテムの型定義
interface DiscoveryTool {
  id: number;
  name: string;
  category: string;
  description: string;
  features: string[];
  website: string;
  githubStars: number;
  weeklyGrowth: string;
  firstSeenDate: string;
  trendingScore: number;
  pricing: string;
  status: 'hot' | 'rising' | 'stable';
  japanMentions: number;
  globalMentions: number;
  sourcesSeen: string[];
}

// APIから発見ツールデータを取得する関数
async function fetchDiscoveryData(category?: string | null, sortBy?: string): Promise<DiscoveryTool[]> {
  try {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (sortBy) params.append('sortBy', sortBy);
    params.append('limit', '30');
    
    const response = await fetch(`/api/discoveries?${params}`);
    if (!response.ok) {
      throw new Error('Failed to fetch discoveries');
    }
    
    const data = await response.json();
    return data.tools || [];
  } catch (error) {
    console.error('Error fetching discoveries:', error);
    // エラー時はサンプルデータを返す
    return getSampleTools();
  }
}

// フォールバック用のサンプルツールデータ
function getSampleTools(): DiscoveryTool[] {
  return [
  {
    id: 1,
    name: 'Zed AI',
    category: 'AIネイティブエディタ',
    description: 'Rustで作られた超高速AIエディタ。Cursorの競合として注目を集める次世代IDE。',
    features: ['超高速レスポンス', 'GPU加速', 'リアルタイムコラボレーション', 'AI補完'],
    website: 'https://zed.dev',
    githubStars: 15200,
    weeklyGrowth: '+12%',
    firstSeenDate: '2025-08-28',
    trendingScore: 95,
    pricing: 'オープンソース',
    status: 'rising',
    japanMentions: 3,
    globalMentions: 287,
    sourcesSeen: ['Hacker News', 'Reddit r/programming', 'AI Tool Hub']
  },
  {
    id: 2,
    name: 'Void',
    category: 'AI開発アシスタント',
    description: 'オープンソースのCursorクローン。完全無料でプライバシー重視のAI IDE。',
    features: ['完全オフライン動作', 'ローカルLLM対応', 'プライバシー保護', 'カスタマイズ可能'],
    website: 'https://voideditor.com',
    githubStars: 8900,
    weeklyGrowth: '+25%',
    firstSeenDate: '2025-08-30',
    trendingScore: 88,
    pricing: '無料',
    status: 'hot',
    japanMentions: 1,
    globalMentions: 156,
    sourcesSeen: ['GitHub Trending', 'Dev.to', 'Product Hunt']
  },
  {
    id: 3,
    name: 'Melty',
    category: 'コード生成エージェント',
    description: 'ターミナルで動作する自律型コーディングエージェント。Aiderの進化版。',
    features: ['大規模リファクタリング', '自動テスト生成', 'バグ修正', 'コードレビュー'],
    website: 'https://melty.sh',
    githubStars: 4200,
    weeklyGrowth: '+35%',
    firstSeenDate: '2025-09-01',
    trendingScore: 92,
    pricing: '$15/月',
    status: 'hot',
    japanMentions: 0,
    globalMentions: 89,
    sourcesSeen: ['Twitter/X', 'Future Tools', 'AI Coding Tools Blog']
  },
  {
    id: 4,
    name: 'Pieces for Developers',
    category: 'コード管理ツール',
    description: 'AI搭載のコードスニペット管理。コンテキスト保持とワークフロー最適化。',
    features: ['AI検索', 'コンテキスト追跡', 'チーム共有', 'IDE統合'],
    website: 'https://pieces.app',
    githubStars: 2800,
    weeklyGrowth: '+8%',
    firstSeenDate: '2025-08-25',
    trendingScore: 75,
    pricing: 'フリーミアム',
    status: 'stable',
    japanMentions: 2,
    globalMentions: 234,
    sourcesSeen: ['Product Hunt', 'Awesome Claude AI', 'n8n Blog']
  },
  {
    id: 5,
    name: 'Sweep',
    category: 'GitHub自動化',
    description: 'Issueから自動でPRを作成するAIエージェント。バグ修正と機能実装を自動化。',
    features: ['Issue→PR自動変換', 'コードレビュー', 'テスト作成', 'ドキュメント生成'],
    website: 'https://sweep.dev',
    githubStars: 6700,
    weeklyGrowth: '+18%',
    firstSeenDate: '2025-08-20',
    trendingScore: 82,
    pricing: '$8/月〜',
    status: 'rising',
    japanMentions: 5,
    globalMentions: 412,
    sourcesSeen: ['GitHub Marketplace', 'Dev.to', 'Hacker News']
  },
  {
    id: 6,
    name: 'Marvin',
    category: 'AIテストツール',
    description: 'AI駆動のE2Eテスト自動生成。自然言語でテストシナリオを記述。',
    features: ['自然言語テスト', 'ビジュアル回帰', '自己修復テスト', 'クロスブラウザ'],
    website: 'https://marvin.ai',
    githubStars: 1900,
    weeklyGrowth: '+42%',
    firstSeenDate: '2025-09-02',
    trendingScore: 79,
    pricing: '$20/月〜',
    status: 'hot',
    japanMentions: 0,
    globalMentions: 67,
    sourcesSeen: ['AI Tool Hub', 'Reddit r/AICoding', 'Twitter/X']
  }
  ];
}

// ステータス定義
const statusConfig = {
  hot: { label: '急上昇', color: 'bg-red-100 text-red-700 border-red-200', icon: '🔥' },
  rising: { label: '注目', color: 'bg-orange-100 text-orange-700 border-orange-200', icon: '📈' },
  stable: { label: '安定', color: 'bg-green-100 text-green-700 border-green-200', icon: '✅' }
};

export default function DiscoveriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'trending' | 'growth' | 'stars'>('trending');
  const [showOnlyNew, setShowOnlyNew] = useState(false);
  const [tools, setTools] = useState<DiscoveryTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);

  // データ取得
  useEffect(() => {
    const loadTools = async () => {
      setLoading(true);
      const data = await fetchDiscoveryData(selectedCategory, sortBy);
      setTools(data);
      // カテゴリーリストを動的に生成
      const uniqueCategories = Array.from(new Set(data.map(tool => tool.category)));
      setCategories(uniqueCategories);
      setLoading(false);
    };
    
    loadTools();
  }, [selectedCategory, sortBy]);

  // フィルタリング
  let filteredTools = [...tools];
  if (selectedCategory) {
    filteredTools = filteredTools.filter(tool => tool.category === selectedCategory);
  }
  if (showOnlyNew) {
    filteredTools = filteredTools.filter(tool => {
      const daysSinceDiscovery = Math.floor(
        (new Date().getTime() - new Date(tool.firstSeenDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysSinceDiscovery <= 7;
    });
  }

  // ソートはAPIで処理されるため、クライアント側でのソートは不要

  return (
    <div className="space-y-8">
      {/* ヘッダー */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          <Sparkles className="inline-block w-10 h-10 text-yellow-500 mr-2" />
          日本未上陸<span className="text-blue-600">AIツール発見</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          海外で話題になっているけど、日本ではまだ知られていない
          最新AIコーディングツールを毎日発掘してお届けします。
        </p>
      </div>

      {/* 発見統計 */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{tools.length}</div>
            <div className="text-sm text-gray-600">今週の発見</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-pink-600">
              {tools.filter(t => t.status === 'hot').length}
            </div>
            <div className="text-sm text-gray-600">急上昇中</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">
              {tools.length > 0 ? Math.round(tools.reduce((acc, t) => acc + parseFloat(t.weeklyGrowth), 0) / tools.length) : 0}%
            </div>
            <div className="text-sm text-gray-600">平均成長率</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {tools.filter(t => t.japanMentions === 0).length}
            </div>
            <div className="text-sm text-gray-600">日本初紹介</div>
          </div>
        </div>
      </div>

      {/* AI発見アラート */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">
              🤖 AI自動発見システム
            </h3>
            <p className="text-sm text-gray-600">
              GitHub Trending、Product Hunt、Hacker News、Reddit等を24時間監視。
              日本での言及が少ない有望ツールを自動検出しています。
            </p>
          </div>
        </div>
      </div>

      {/* フィルター&ソート */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-6">
          {/* カテゴリーフィルター */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">カテゴリー</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-3 py-1.5 rounded-lg text-sm transition ${
                  !selectedCategory
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                すべて
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* ソート&フィルター */}
          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">並び替え</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
              >
                <option value="trending">トレンドスコア順</option>
                <option value="growth">成長率順</option>
                <option value="stars">GitHub Stars順</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOnlyNew}
                  onChange={(e) => setShowOnlyNew(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">今週発見のみ</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* ローディング表示 */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <span className="ml-3 text-gray-600">発見ツールを読み込み中...</span>
        </div>
      )}

      {/* ツールカード */}
      {!loading && (
      <div className="grid gap-6 md:grid-cols-2">
        {filteredTools.length === 0 ? (
          <div className="col-span-2 text-center py-12">
            <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">該当するツールが見つかりませんでした。</p>
            <p className="text-sm text-gray-500 mt-2">フィルターを調整するか、後でもう一度お試しください。</p>
          </div>
        ) : (
        {filteredTools.map((tool) => {
          const status = statusConfig[tool.status as keyof typeof statusConfig];
          const japanAdoptionRate = Math.round((tool.japanMentions / tool.globalMentions) * 100);
          
          return (
            <div
              key={tool.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="p-6">
                {/* ヘッダー */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {tool.name}
                    </h3>
                    <span className="text-sm text-gray-500">{tool.category}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-lg border text-sm font-medium ${status.color}`}>
                    {status.icon} {status.label}
                  </span>
                </div>

                {/* 説明 */}
                <p className="text-gray-700 mb-4">{tool.description}</p>

                {/* 機能タグ */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {tool.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* 統計情報 */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-xs text-gray-600">週間成長率</span>
                    </div>
                    <span className="text-lg font-bold text-green-600">{tool.weeklyGrowth}</span>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-xs text-gray-600">GitHub Stars</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                      {tool.githubStars.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* 日本浸透度 */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">日本での認知度</span>
                    <span className="font-medium">
                      {japanAdoptionRate > 0 ? `${japanAdoptionRate}%` : '未知'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-red-500 to-pink-500 h-2 rounded-full"
                      style={{ width: `${Math.min(japanAdoptionRate, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>日本: {tool.japanMentions}件</span>
                    <span>世界: {tool.globalMentions}件</span>
                  </div>
                </div>

                {/* 発見元 */}
                <div className="mb-4">
                  <span className="text-xs text-gray-600">発見元：</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {tool.sourcesSeen.map((source) => (
                      <span
                        key={source}
                        className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded"
                      >
                        {source}
                      </span>
                    ))}
                  </div>
                </div>

                {/* フッター */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-gray-500">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      発見: {new Date(tool.firstSeenDate).toLocaleDateString('ja-JP')}
                    </span>
                    <span className="font-medium text-gray-700">{tool.pricing}</span>
                  </div>
                  
                  <a
                    href={tool.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Globe className="w-4 h-4" />
                    <span className="text-sm">サイト</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* トレンドスコア */}
                <div className="mt-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="text-xs text-gray-600">トレンドスコア:</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 h-1.5 rounded-full"
                      style={{ width: `${tool.trendingScore}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium">{tool.trendingScore}/100</span>
                </div>
              </div>
            </div>
          );
        })
        )}
      </div>
      )}

      {/* CTA */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl p-8 text-center">
        <Award className="w-12 h-12 mx-auto mb-4 text-purple-200" />
        <h3 className="text-2xl font-bold mb-4">
          次のトレンドを、誰よりも早くキャッチ
        </h3>
        <p className="mb-6 text-purple-100">
          AI開発ツールの世界は日々進化しています。
          日本未上陸のツールをいち早く試して、開発効率を劇的に改善しましょう。
        </p>
        <div className="flex gap-4 justify-center">
          <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition">
            発見アラートを設定
          </button>
          <button className="bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-800 transition">
            ツールをリクエスト
          </button>
        </div>
      </div>
    </div>
  );
}