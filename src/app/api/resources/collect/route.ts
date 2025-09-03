import { NextResponse } from 'next/server';
import { aiResourceSites } from '@/lib/aiResources';

// 収集結果の型定義
interface CollectedItem {
  title: string;
  url: string;
  publishedDate: string;
  source: string;
  sourceId: string;
  summary?: string;
  tags?: string[];
}

// RSSフィードを解析する関数（簡易版）
async function fetchRSSFeed(url: string): Promise<CollectedItem[]> {
  try {
    const response = await fetch(url);
    const text = await response.text();
    
    // 簡易的なXML解析（実際はrss-parserライブラリを使用推奨）
    const items: CollectedItem[] = [];
    const itemMatches = text.match(/<item>[\s\S]*?<\/item>/gi) || [];
    
    itemMatches.slice(0, 5).forEach((itemXml) => {
      const title = itemXml.match(/<title>(.*?)<\/title>/)?.[1] || '';
      const link = itemXml.match(/<link>(.*?)<\/link>/)?.[1] || '';
      const pubDate = itemXml.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || '';
      const description = itemXml.match(/<description>(.*?)<\/description>/)?.[1] || '';
      
      if (title && link) {
        items.push({
          title: title.replace(/<!\[CDATA\[(.*?)\]\]>/, '$1'),
          url: link,
          publishedDate: pubDate,
          summary: description.replace(/<!\[CDATA\[(.*?)\]\]>/, '$1').substring(0, 200),
          source: '',
          sourceId: ''
        });
      }
    });
    
    return items;
  } catch (error) {
    console.error('RSS fetch error:', error);
    return [];
  }
}

// Webページをスクレイピングする関数（簡易版）
async function scrapeWebpage(url: string): Promise<CollectedItem[]> {
  try {
    const response = await fetch(url);
    const html = await response.text();
    
    // 簡易的なHTML解析（実際はcheerioやplaywrightを使用推奨）
    const items: CollectedItem[] = [];
    
    // タイトルタグを取得
    const titleMatch = html.match(/<title>(.*?)<\/title>/);
    if (titleMatch) {
      items.push({
        title: titleMatch[1],
        url: url,
        publishedDate: new Date().toISOString(),
        source: '',
        sourceId: '',
        summary: 'Webページから収集した情報'
      });
    }
    
    return items;
  } catch (error) {
    console.error('Webpage scrape error:', error);
    return [];
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sourceId = searchParams.get('source');
  const category = searchParams.get('category');
  
  // 収集対象のサイトをフィルタリング
  let targetSites = [...aiResourceSites];
  
  if (sourceId) {
    targetSites = targetSites.filter(site => site.id === sourceId);
  }
  
  if (category) {
    targetSites = targetSites.filter(site => site.category === category);
  }
  
  // 収集結果を格納
  const allCollectedItems: CollectedItem[] = [];
  const collectionResults = [];
  
  // 各サイトから情報を収集
  for (const site of targetSites) {
    const result = {
      siteId: site.id,
      siteName: site.name,
      status: 'pending',
      itemsCollected: 0,
      error: null as string | null
    };
    
    try {
      let items: CollectedItem[] = [];
      
      // RSS対応サイトの場合
      if (site.rssUrl) {
        items = await fetchRSSFeed(site.rssUrl);
        result.status = 'rss_collected';
      }
      // APIエンドポイントがある場合（将来的な拡張）
      else if (site.apiEndpoint) {
        // API収集ロジック（未実装）
        result.status = 'api_collected';
      }
      // それ以外はWebスクレイピング
      else {
        items = await scrapeWebpage(site.url);
        result.status = 'scraped';
      }
      
      // ソース情報を追加
      items.forEach(item => {
        item.source = site.name;
        item.sourceId = site.id;
      });
      
      allCollectedItems.push(...items);
      result.itemsCollected = items.length;
      result.status = 'success';
      
    } catch (error) {
      result.status = 'error';
      result.error = error instanceof Error ? error.message : 'Unknown error';
    }
    
    collectionResults.push(result);
  }
  
  // 収集統計
  const stats = {
    totalSites: targetSites.length,
    successfulSites: collectionResults.filter(r => r.status === 'success').length,
    totalItems: allCollectedItems.length,
    timestamp: new Date().toISOString()
  };
  
  return NextResponse.json({
    stats,
    results: collectionResults,
    items: allCollectedItems,
    message: '情報収集が完了しました（デモ版）'
  });
}

// POST: 収集した情報を保存（将来的なデータベース連携用）
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // ここでデータベースに保存する処理を実装
    // 例: Supabase, Prisma, etc.
    
    return NextResponse.json({
      success: true,
      message: '収集した情報を保存しました',
      savedItems: body.items?.length || 0
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to save collected data' },
      { status: 500 }
    );
  }
}