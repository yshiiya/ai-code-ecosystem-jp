'use client';

import { useState } from 'react';
import { aiResourceSites, resourceCategories, type AIResourceSite } from '@/lib/aiResources';
import { ExternalLink, Clock, Tag, Star, Filter, RefreshCw, Globe, TrendingUp } from 'lucide-react';

export default function ResourcesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'importance' | 'name' | 'update'>('importance');

  // フィルタリング
  const filteredSites = selectedCategory
    ? aiResourceSites.filter(site => site.category === selectedCategory)
    : aiResourceSites;

  // ソート
  const sortedSites = [...filteredSites].sort((a, b) => {
    switch (sortBy) {
      case 'importance':
        const importanceOrder = { high: 3, medium: 2, low: 1 };
        return importanceOrder[b.importance] - importanceOrder[a.importance];
      case 'name':
        return a.name.localeCompare(b.name);
      case 'update':
        const frequencyOrder = { daily: 3, weekly: 2, monthly: 1 };
        return frequencyOrder[b.checkFrequency] - frequencyOrder[a.checkFrequency];
      default:
        return 0;
    }
  });

  // カテゴリー別カウント
  const categoryCounts = Object.keys(resourceCategories).reduce((acc, cat) => {
    acc[cat] = aiResourceSites.filter(site => site.category === cat).length;
    return acc;
  }, {} as Record<string, number>);

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getFrequencyBadge = (frequency: string) => {
    switch (frequency) {
      case 'daily': return { text: '毎日更新', color: 'bg-green-100 text-green-700' };
      case 'weekly': return { text: '週次更新', color: 'bg-blue-100 text-blue-700' };
      case 'monthly': return { text: '月次更新', color: 'bg-purple-100 text-purple-700' };
      default: return { text: '不定期', color: 'bg-gray-100 text-gray-700' };
    }
  };

  return (
    <div className="space-y-8">
      {/* ヘッダー */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          海外AI情報サイト<span className="text-blue-600">リンク集</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          世界中のAI開発ツール情報を収集。最新トレンドから専門知識まで、
          信頼できる情報源を厳選してお届けします。
        </p>
      </div>

      {/* 統計情報 */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{aiResourceSites.length}</div>
            <div className="text-sm text-gray-600">登録サイト</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {aiResourceSites.filter(s => s.checkFrequency === 'daily').length}
            </div>
            <div className="text-sm text-gray-600">毎日チェック</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {Object.keys(resourceCategories).length}
            </div>
            <div className="text-sm text-gray-600">カテゴリー</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">
              {aiResourceSites.filter(s => s.importance === 'high').length}
            </div>
            <div className="text-sm text-gray-600">重要サイト</div>
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
                すべて ({aiResourceSites.length})
              </button>
              {Object.entries(resourceCategories).map(([key, cat]) => (
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
                  <span>{cat.name} ({categoryCounts[key]})</span>
                </button>
              ))}
            </div>
          </div>

          {/* ソート */}
          <div className="md:w-48">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">並び替え</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
            >
              <option value="importance">重要度順</option>
              <option value="update">更新頻度順</option>
              <option value="name">名前順</option>
            </select>
          </div>
        </div>
      </div>

      {/* サイトリスト */}
      <div className="grid gap-6">
        {sortedSites.map((site) => (
          <div
            key={site.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
          >
            <div className="p-6">
              {/* ヘッダー */}
              <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      {site.name}
                    </h3>
                    <span className={`px-2 py-1 rounded-lg border text-xs font-medium ${getImportanceColor(site.importance)}`}>
                      {site.importance === 'high' ? '重要' : site.importance === 'medium' ? '中' : '低'}
                    </span>
                    {site.rssUrl && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium">
                        RSS対応
                      </span>
                    )}
                  </div>
                  <a
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1 mb-3"
                  >
                    <Globe className="w-4 h-4" />
                    {site.url.replace('https://', '').replace('www.', '').split('/')[0]}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* バッジ */}
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-lg text-xs font-medium ${getFrequencyBadge(site.checkFrequency).color}`}>
                    <Clock className="w-3 h-3 inline mr-1" />
                    {getFrequencyBadge(site.checkFrequency).text}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">
                    {resourceCategories[site.category as keyof typeof resourceCategories].icon}
                    {resourceCategories[site.category as keyof typeof resourceCategories].name}
                  </span>
                </div>
              </div>

              {/* 説明 */}
              <p className="text-gray-700 mb-4">{site.description}</p>

              {/* 詳細情報 */}
              <div className="space-y-3 mb-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-600">主要コンテンツ：</span>
                  <span className="text-sm text-gray-700">{site.mainContent}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-600">特徴：</span>
                  <span className="text-sm text-gray-700">{site.features}</span>
                </div>
              </div>

              {/* キーポイント */}
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Star className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div>
                    <span className="text-sm font-medium text-blue-900">重要ポイント：</span>
                    <p className="text-sm text-blue-700 mt-1">{site.keyPoints}</p>
                  </div>
                </div>
              </div>

              {/* サイトを訪問ボタン */}
              <div className="mt-4 mb-4">
                <a
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  サイトを訪問
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* 更新情報 */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <RefreshCw className="w-4 h-4" />
                  <span>{site.updateFrequency}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-8 text-center">
        <h3 className="text-2xl font-bold mb-4">
          AI開発の最新情報を見逃さない
        </h3>
        <p className="mb-6 text-blue-100">
          これらのサイトから収集した情報を日本語で要約してお届けします。
          世界のAIトレンドを、いち早くキャッチアップしましょう。
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/news"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            最新ニュースを見る
          </a>
          <a
            href="/discoveries"
            className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
          >
            新発見ツールを探す
          </a>
        </div>
      </div>
    </div>
  );
}