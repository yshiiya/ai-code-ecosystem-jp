'use client';

import { useState } from 'react';
import { Calendar, Globe, TrendingUp, ExternalLink, Clock, Tag, AlertCircle, Sparkles, RefreshCw } from 'lucide-react';

// サンプルニュースデータ（将来的にAPIから取得）
const sampleNews = [
  {
    id: 1,
    title: 'OpenAI、新しいコーディングアシスタント「GPT-Code」を発表',
    originalTitle: 'OpenAI Announces GPT-Code: Next-Gen Coding Assistant',
    source: 'Future Tools',
    sourceUrl: 'https://www.futuretools.io/',
    publishedAt: '2025-09-03T10:00:00Z',
    summary: 'OpenAIが最新のコーディング特化型AIモデルを発表。従来のCodexを大幅に改善し、より高精度なコード生成と理解能力を実現。',
    tags: ['OpenAI', 'GPT', 'コード生成'],
    importance: 'high',
    isNew: true,
    category: 'tool-release'
  },
  {
    id: 2,
    title: 'GitHub Copilot、マルチモーダル対応を開始',
    originalTitle: 'GitHub Copilot Now Supports Multimodal Input',
    source: 'AI Tool Hub',
    sourceUrl: 'https://aitoolhub.co/',
    publishedAt: '2025-09-02T15:30:00Z',
    summary: '画像やダイアグラムからコードを生成する機能が追加。UIモックアップから直接Reactコンポーネントを生成可能に。',
    tags: ['GitHub Copilot', 'マルチモーダル', 'UI生成'],
    importance: 'high',
    isNew: true,
    category: 'feature-update'
  },
  {
    id: 3,
    title: 'Claude 3.5 Sonnetの性能が大幅向上',
    originalTitle: 'Claude 3.5 Sonnet Performance Boost',
    source: 'Awesome Claude AI',
    sourceUrl: 'https://awesomeclaude.ai/',
    publishedAt: '2025-09-02T08:00:00Z',
    summary: 'AnthropicがClaude 3.5 Sonnetのアップデートを実施。コード理解能力が30%向上し、デバッグ精度も改善。',
    tags: ['Claude', 'Anthropic', '性能向上'],
    importance: 'medium',
    isNew: false,
    category: 'model-update'
  },
  {
    id: 4,
    title: '新しいAIコーディングツール「CodeWhisper」がステルスモードから登場',
    originalTitle: 'CodeWhisper Emerges from Stealth with $20M Funding',
    source: 'n8n Blog',
    sourceUrl: 'https://blog.n8n.io/',
    publishedAt: '2025-09-01T12:00:00Z',
    summary: 'エンタープライズ向けの新しいAIコーディングプラットフォームが2000万ドルの資金調達とともに正式発表。',
    tags: ['スタートアップ', '資金調達', 'エンタープライズ'],
    importance: 'medium',
    isNew: false,
    category: 'company-news'
  },
  {
    id: 5,
    title: 'プロンプトエンジニアリングの新技術「Chain of Verification」が話題',
    originalTitle: 'Chain of Verification: New Prompting Technique Gains Traction',
    source: 'Prompt Engineering Guide',
    sourceUrl: 'https://www.promptingguide.ai/',
    publishedAt: '2025-08-31T16:00:00Z',
    summary: 'コード生成の精度を大幅に向上させる新しいプロンプト技術が研究者から発表され、開発者コミュニティで注目を集める。',
    tags: ['プロンプト', '研究', '技術'],
    importance: 'medium',
    isNew: false,
    category: 'research'
  },
  {
    id: 6,
    title: 'Cursor IDEが日本語対応を開始',
    originalTitle: 'Cursor IDE Adds Japanese Language Support',
    source: 'AI Coding Tools Blog',
    sourceUrl: 'https://aicodingtools.blog/',
    publishedAt: '2025-08-30T09:00:00Z',
    summary: 'AI搭載IDE「Cursor」が待望の日本語インターフェースをリリース。日本人開発者の利用が急増中。',
    tags: ['Cursor', '日本語対応', 'IDE'],
    importance: 'high',
    isNew: false,
    category: 'localization'
  }
];

// カテゴリー定義
const newsCategories = {
  'tool-release': { name: '新ツールリリース', color: 'bg-purple-100 text-purple-700', icon: '🚀' },
  'feature-update': { name: '機能アップデート', color: 'bg-blue-100 text-blue-700', icon: '✨' },
  'model-update': { name: 'モデル更新', color: 'bg-green-100 text-green-700', icon: '🤖' },
  'company-news': { name: '企業ニュース', color: 'bg-orange-100 text-orange-700', icon: '🏢' },
  'research': { name: '研究・論文', color: 'bg-pink-100 text-pink-700', icon: '📚' },
  'localization': { name: '日本展開', color: 'bg-red-100 text-red-700', icon: '🇯🇵' }
};

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showOnlyNew, setShowOnlyNew] = useState(false);

  // フィルタリング
  let filteredNews = [...sampleNews];
  if (selectedCategory) {
    filteredNews = filteredNews.filter(news => news.category === selectedCategory);
  }
  if (showOnlyNew) {
    filteredNews = filteredNews.filter(news => news.isNew);
  }

  // 時刻フォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return `${diffHours}時間前`;
    } else if (diffHours < 168) {
      return `${Math.floor(diffHours / 24)}日前`;
    } else {
      return date.toLocaleDateString('ja-JP');
    }
  };

  return (
    <div className="space-y-8">
      {/* ヘッダー */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          AI開発<span className="text-blue-600">最新ニュース</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          世界中のAI開発ツール情報を毎日収集。
          最新リリース、アップデート、研究動向を日本語でお届けします。
        </p>
      </div>

      {/* 自動収集通知 */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <RefreshCw className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">
              🤖 AI自動収集システム稼働中
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              世界の主要AI情報サイトから、6時間ごとに最新情報を自動収集・翻訳しています。
            </p>
            <div className="flex gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                最終更新: 30分前
              </span>
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3" />
                監視サイト: 11
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                本日の新着: 6件
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* フィルター */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-6">
          {/* カテゴリーフィルター */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-5 h-5 text-gray-600" />
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
              {Object.entries(newsCategories).map(([key, cat]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition flex items-center gap-1 ${
                    selectedCategory === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 新着フィルター */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showOnlyNew}
                onChange={(e) => setShowOnlyNew(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-700">新着のみ表示</span>
              <Sparkles className="w-4 h-4 text-yellow-500" />
            </label>
          </div>
        </div>
      </div>

      {/* ニュースリスト */}
      <div className="space-y-4">
        {filteredNews.map((news) => {
          const category = newsCategories[news.category as keyof typeof newsCategories];
          return (
            <div
              key={news.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="p-6">
                {/* ヘッダー */}
                <div className="flex flex-col md:flex-row md:items-start justify-between mb-3">
                  <div className="flex-1">
                    {/* タイトル */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {news.isNew && (
                        <span className="inline-block bg-red-500 text-white text-xs px-2 py-1 rounded mr-2">
                          NEW
                        </span>
                      )}
                      {news.title}
                    </h3>
                    
                    {/* 原題 */}
                    <p className="text-sm text-gray-500 mb-3 italic">
                      "{news.originalTitle}"
                    </p>
                  </div>

                  {/* メタ情報 */}
                  <div className="flex flex-col gap-2 text-sm">
                    <span className={`px-3 py-1 rounded-lg text-center ${category.color}`}>
                      {category.icon} {category.name}
                    </span>
                    <span className="text-gray-500 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(news.publishedAt)}
                    </span>
                  </div>
                </div>

                {/* 要約 */}
                <p className="text-gray-700 mb-4">{news.summary}</p>

                {/* タグとソース */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    {news.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  <a
                    href={news.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Globe className="w-4 h-4" />
                    {news.source}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* もっと見る */}
      <div className="text-center py-8">
        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
          もっと過去のニュースを見る
        </button>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-8">
        <div className="max-w-3xl mx-auto text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-blue-200" />
          <h3 className="text-2xl font-bold mb-4">
            AIトレンドを見逃さない
          </h3>
          <p className="mb-6 text-blue-100">
            毎週月曜日に、その週の重要なAI開発ツールニュースをまとめた
            ニュースレターをお届けします。
          </p>
          <div className="flex gap-4 justify-center">
            <input
              type="email"
              placeholder="メールアドレスを入力"
              className="px-4 py-2 rounded-lg text-gray-900 w-64"
            />
            <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition">
              購読する
            </button>
          </div>
          <p className="text-xs text-blue-200 mt-3">
            ※現在準備中。2025年10月開始予定
          </p>
        </div>
      </div>
    </div>
  );
}