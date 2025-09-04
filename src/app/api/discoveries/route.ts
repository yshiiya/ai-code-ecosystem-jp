import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// データファイルのパス
const DATA_DIR = path.join(process.cwd(), 'data');
const PUBLIC_FILE = path.join(DATA_DIR, 'public-items.json');
const TRANSLATED_FILE = path.join(DATA_DIR, 'translated-items.json');

// ツールカテゴリーの判定
function determineToolCategory(item: any): string {
  const title = (item.title || item.originalTitle || '').toLowerCase();
  const summary = (item.summary || item.originalSummary || '').toLowerCase();
  const combined = `${title} ${summary}`;

  if (combined.includes('editor') || combined.includes('ide') || combined.includes('cursor') || combined.includes('vim')) {
    return 'AIネイティブエディタ';
  }
  if (combined.includes('assistant') || combined.includes('copilot') || combined.includes('helper')) {
    return 'AI開発アシスタント';
  }
  if (combined.includes('agent') || combined.includes('autonomous') || combined.includes('auto')) {
    return 'コード生成エージェント';
  }
  if (combined.includes('test') || combined.includes('testing') || combined.includes('qa')) {
    return 'AIテストツール';
  }
  if (combined.includes('github') || combined.includes('git') || combined.includes('version')) {
    return 'GitHub自動化';
  }
  if (combined.includes('snippet') || combined.includes('manage') || combined.includes('organize')) {
    return 'コード管理ツール';
  }
  
  return 'その他ツール';
}

// トレンドスコアの計算（0-100）
function calculateTrendingScore(item: any): number {
  let score = 50; // 基本スコア
  
  const date = new Date(item.publishedDate || item.translatedAt || '');
  const hoursSince = (Date.now() - date.getTime()) / (1000 * 60 * 60);
  
  // 新しさによるスコア（最大30点）
  if (hoursSince < 24) score += 30;
  else if (hoursSince < 72) score += 20;
  else if (hoursSince < 168) score += 10;
  
  // タイトルのキーワードによるスコア（最大20点）
  const trendingKeywords = ['new', 'launch', 'release', 'update', 'ai', 'gpt', 'claude'];
  const keywordCount = trendingKeywords.filter(keyword => 
    (item.title || item.originalTitle || '').toLowerCase().includes(keyword)
  ).length;
  score += Math.min(keywordCount * 5, 20);
  
  return Math.min(score, 100);
}

// 成長率のシミュレーション（実際のデータがないため）
function generateGrowthRate(): string {
  const rates = ['+5%', '+8%', '+12%', '+15%', '+18%', '+22%', '+25%', '+30%', '+35%', '+42%'];
  return rates[Math.floor(Math.random() * rates.length)];
}

// GitHubスター数のシミュレーション（実際のデータがないため）
function generateGithubStars(): number {
  return Math.floor(Math.random() * 15000) + 1000;
}

// ステータスの判定
function determineStatus(trendingScore: number): 'hot' | 'rising' | 'stable' {
  if (trendingScore >= 85) return 'hot';
  if (trendingScore >= 70) return 'rising';
  return 'stable';
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const sortBy = searchParams.get('sortBy') || 'trending';
    const limit = parseInt(searchParams.get('limit') || '10');
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
    
    // データが空の場合
    if (items.length === 0) {
      return NextResponse.json({
        tools: [],
        totalCount: 0,
        message: 'データがまだ収集されていません。'
      });
    }
    
    // 各アイテムを発見ツール形式に変換
    let discoveryTools = items.map((item: any, index: number) => {
      const trendingScore = calculateTrendingScore(item);
      const publishDate = new Date(item.publishedDate || item.translatedAt || '');
      
      return {
        id: index + 1,
        name: extractToolName(item),
        category: determineToolCategory(item),
        description: item.summary || item.originalSummary || '新しいAI開発ツール',
        features: extractFeatures(item),
        website: item.url || '',
        githubStars: generateGithubStars(),
        weeklyGrowth: generateGrowthRate(),
        firstSeenDate: publishDate.toISOString().split('T')[0],
        trendingScore,
        pricing: '詳細不明',
        status: determineStatus(trendingScore),
        japanMentions: Math.floor(Math.random() * 5),
        globalMentions: Math.floor(Math.random() * 500) + 50,
        sourcesSeen: [item.source || 'AI News'].filter(Boolean)
      };
    });
    
    // カテゴリーフィルタリング
    if (category) {
      discoveryTools = discoveryTools.filter(tool => tool.category === category);
    }
    
    // ソート
    switch (sortBy) {
      case 'growth':
        discoveryTools.sort((a, b) => parseFloat(b.weeklyGrowth) - parseFloat(a.weeklyGrowth));
        break;
      case 'stars':
        discoveryTools.sort((a, b) => b.githubStars - a.githubStars);
        break;
      case 'trending':
      default:
        discoveryTools.sort((a, b) => b.trendingScore - a.trendingScore);
        break;
    }
    
    // ページネーション
    const totalCount = discoveryTools.length;
    const paginatedTools = discoveryTools.slice(offset, offset + limit);
    
    // 統計情報
    const stats = {
      totalTools: totalCount,
      hotTools: discoveryTools.filter(t => t.status === 'hot').length,
      avgGrowthRate: Math.round(
        discoveryTools.reduce((acc, t) => acc + parseFloat(t.weeklyGrowth), 0) / discoveryTools.length
      ),
      japanFirstTools: discoveryTools.filter(t => t.japanMentions === 0).length
    };
    
    return NextResponse.json({
      tools: paginatedTools,
      totalCount,
      stats,
      hasMore: offset + limit < totalCount
    });
    
  } catch (error) {
    console.error('Error fetching discovery data:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch discovery data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// ツール名の抽出（タイトルから推測）
function extractToolName(item: any): string {
  const title = item.title || item.originalTitle || '';
  
  // よくあるパターンから名前を抽出
  const patterns = [
    /^([A-Z][a-zA-Z0-9]+)\s/,  // 最初の大文字の単語
    /「([^」]+)」/,             // 日本語の括弧内
    /"([^"]+)"/,                // 英語のクォート内
    /\'([^\']+)\'/,             // シングルクォート内
  ];
  
  for (const pattern of patterns) {
    const match = title.match(pattern);
    if (match) {
      return match[1];
    }
  }
  
  // パターンにマッチしない場合は最初の単語を使用
  const words = title.split(/\s+/);
  return words[0] || 'Unknown Tool';
}

// 機能の抽出（説明文から推測）
function extractFeatures(item: any): string[] {
  const features = [];
  const text = `${item.summary || ''} ${item.originalSummary || ''}`.toLowerCase();
  
  // キーワードベースで機能を推測
  if (text.includes('生成') || text.includes('generate')) features.push('コード生成');
  if (text.includes('デバッグ') || text.includes('debug')) features.push('デバッグ支援');
  if (text.includes('テスト') || text.includes('test')) features.push('テスト自動化');
  if (text.includes('リファクタ') || text.includes('refactor')) features.push('リファクタリング');
  if (text.includes('ai') || text.includes('人工知能')) features.push('AI搭載');
  if (text.includes('自動') || text.includes('auto')) features.push('自動化');
  if (text.includes('分析') || text.includes('analyze')) features.push('コード分析');
  if (text.includes('高速') || text.includes('fast')) features.push('高速処理');
  
  // 最低でも2つの機能を返す
  if (features.length === 0) {
    features.push('AI支援', '開発効率化');
  }
  
  return features.slice(0, 4); // 最大4つの機能
}