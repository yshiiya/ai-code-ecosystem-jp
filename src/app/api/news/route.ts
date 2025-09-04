import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// データファイルのパス
const DATA_DIR = path.join(process.cwd(), 'data');
const PUBLIC_FILE = path.join(DATA_DIR, 'public-items.json');
const TRANSLATED_FILE = path.join(DATA_DIR, 'translated-items.json');

// ニュースカテゴリーの判定
function determineCategory(item: any): string {
  const title = (item.title || item.originalTitle || '').toLowerCase();
  const summary = (item.summary || item.originalSummary || '').toLowerCase();
  const combined = `${title} ${summary}`;

  if (combined.includes('release') || combined.includes('launch') || combined.includes('announce')) {
    return 'tool-release';
  }
  if (combined.includes('update') || combined.includes('feature') || combined.includes('improve')) {
    return 'feature-update';
  }
  if (combined.includes('model') || combined.includes('gpt') || combined.includes('claude') || combined.includes('llm')) {
    return 'model-update';
  }
  if (combined.includes('funding') || combined.includes('acquire') || combined.includes('merger')) {
    return 'company-news';
  }
  if (combined.includes('research') || combined.includes('paper') || combined.includes('study')) {
    return 'research';
  }
  if (combined.includes('japan') || combined.includes('日本') || combined.includes('ローカル')) {
    return 'localization';
  }
  
  return 'general';
}

// 重要度の判定
function determineImportance(item: any): string {
  const title = (item.title || item.originalTitle || '').toLowerCase();
  
  // 主要企業・ツールのキーワード
  const highImportanceKeywords = ['openai', 'anthropic', 'google', 'microsoft', 'github', 'claude', 'gpt', 'copilot', 'cursor'];
  const hasHighImportance = highImportanceKeywords.some(keyword => title.includes(keyword));
  
  if (hasHighImportance) return 'high';
  
  // 日付が新しいものは重要度を上げる
  const publishDate = new Date(item.publishedDate || item.translatedAt || '');
  const hoursSincePublish = (Date.now() - publishDate.getTime()) / (1000 * 60 * 60);
  
  if (hoursSincePublish < 24) return 'high';
  if (hoursSincePublish < 72) return 'medium';
  
  return 'low';
}

// タグの抽出
function extractTags(item: any): string[] {
  const tags = new Set<string>();
  const text = `${item.title || ''} ${item.originalTitle || ''} ${item.summary || ''}`.toLowerCase();
  
  // 技術系のキーワードを抽出
  const techKeywords = [
    'AI', 'GPT', 'Claude', 'LLM', 'API', 'IDE', 'GitHub', 'OpenAI', 'Anthropic',
    'コード生成', 'プロンプト', 'エージェント', '自動化', 'テスト', 'デバッグ'
  ];
  
  techKeywords.forEach(keyword => {
    if (text.toLowerCase().includes(keyword.toLowerCase())) {
      tags.add(keyword);
    }
  });
  
  // 最大5つのタグに制限
  return Array.from(tags).slice(0, 5);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    // データファイルの読み込み
    let items = [];
    
    // まず public-items.json を試す
    if (fs.existsSync(PUBLIC_FILE)) {
      const publicData = JSON.parse(fs.readFileSync(PUBLIC_FILE, 'utf8'));
      items = publicData.items || [];
    }
    // なければ translated-items.json を試す
    else if (fs.existsSync(TRANSLATED_FILE)) {
      const translatedData = JSON.parse(fs.readFileSync(TRANSLATED_FILE, 'utf8'));
      items = translatedData.items || [];
    }
    
    // データが空の場合はエラー
    if (items.length === 0) {
      return NextResponse.json({
        items: [],
        totalCount: 0,
        message: 'データがまだ収集されていません。GitHub Actionsの実行を待つか、手動で収集スクリプトを実行してください。'
      });
    }
    
    // 各アイテムにメタデータを追加
    items = items.map((item: any) => ({
      ...item,
      category: item.category || determineCategory(item),
      importance: item.importance || determineImportance(item),
      tags: item.tags || extractTags(item),
      isNew: (() => {
        const date = new Date(item.publishedDate || item.translatedAt || '');
        const hoursSince = (Date.now() - date.getTime()) / (1000 * 60 * 60);
        return hoursSince < 48; // 48時間以内なら新着
      })(),
      formattedDate: (() => {
        const date = new Date(item.publishedDate || item.translatedAt || '');
        const now = new Date();
        const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
        
        if (diffHours < 24) {
          return `${diffHours}時間前`;
        } else if (diffHours < 168) {
          return `${Math.floor(diffHours / 24)}日前`;
        } else {
          return date.toLocaleDateString('ja-JP');
        }
      })()
    }));
    
    // カテゴリーフィルタリング
    if (category) {
      items = items.filter((item: any) => item.category === category);
    }
    
    // 日付順にソート（新しい順）
    items.sort((a: any, b: any) => {
      const dateA = new Date(a.publishedDate || a.translatedAt || '');
      const dateB = new Date(b.publishedDate || b.translatedAt || '');
      return dateB.getTime() - dateA.getTime();
    });
    
    // ページネーション
    const totalCount = items.length;
    const paginatedItems = items.slice(offset, offset + limit);
    
    // 統計情報
    const stats = {
      totalItems: totalCount,
      newItems: items.filter((item: any) => item.isNew).length,
      categories: [...new Set(items.map((item: any) => item.category))],
      lastUpdated: new Date().toISOString()
    };
    
    return NextResponse.json({
      items: paginatedItems,
      totalCount,
      stats,
      hasMore: offset + limit < totalCount
    });
    
  } catch (error) {
    console.error('Error fetching news data:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch news data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}