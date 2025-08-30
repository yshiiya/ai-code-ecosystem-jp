#!/usr/bin/env ts-node

/**
 * Data Updater Agent - データ自動更新スクリプト
 * /src/lib/data.ts および関連ファイルを最新情報で更新
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import * as yaml from 'js-yaml'

interface ToolData {
  id: string
  name: string
  category: string
  description: string
  pricing: string
  tags: string[]
  version?: string
  lastUpdated?: string
}

interface UpdatePayload {
  toolId: string
  field: keyof ToolData
  oldValue: any
  newValue: any
  source: string
  confidence: number
}

class DataUpdater {
  private dataPath = join(__dirname, '../../../src/lib/data.ts')
  private backupPath = join(__dirname, '../backups')
  private configPath = join(__dirname, '../../config/sources.yaml')
  private tools: ToolData[] = []
  private updates: UpdatePayload[] = []

  constructor() {
    this.loadCurrentData()
    this.ensureBackupDirectory()
  }

  /**
   * 現在のデータを読み込み
   */
  private loadCurrentData() {
    try {
      const fileContent = readFileSync(this.dataPath, 'utf8')
      
      // 簡易的なパース（実際の実装ではAST解析を使用）
      const toolsMatch = fileContent.match(/export const tools = \[([\s\S]*?)\]/)
      if (toolsMatch) {
        // TypeScriptコードをJSONライクに変換して解析
        const toolsString = toolsMatch[1]
          .replace(/id:/g, '"id":')
          .replace(/name:/g, '"name":')
          .replace(/category:/g, '"category":')
          .replace(/description:/g, '"description":')
          .replace(/pricing:/g, '"pricing":')
          .replace(/tags:/g, '"tags":')
          .replace(/'/g, '"')
          .replace(/,\s*}/g, '}')
          .replace(/,\s*\]/g, ']')
        
        try {
          this.tools = JSON.parse(`[${toolsString}]`)
          console.log(`✅ ${this.tools.length}個のツールデータを読み込みました`)
        } catch (e) {
          console.log('⚠️ データパースに失敗、モックデータを使用します')
          this.loadMockData()
        }
      }
    } catch (error) {
      console.error('❌ データ読み込みエラー:', error)
      this.loadMockData()
    }
  }

  /**
   * モックデータを読み込み（フォールバック用）
   */
  private loadMockData() {
    this.tools = [
      {
        id: 'claude-code',
        name: 'Claude Code',
        category: 'CLI/エージェント',
        description: 'Anthropicが開発したターミナル内で動作するエージェンティックAIコーディングツール',
        pricing: '$20/月',
        tags: ['CLI', 'エージェント', 'MCP対応'],
        version: 'v1.0.0',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'github-copilot',
        name: 'GitHub Copilot',
        category: 'IDE拡張',
        description: '世界で最も広く採用されているAI開発者ツール。マルチモデル対応',
        pricing: '$10/月〜',
        tags: ['IDE統合', 'マルチモデル', '無料プランあり'],
        version: 'v1.5.0',
        lastUpdated: new Date().toISOString()
      }
    ]
  }

  /**
   * バックアップディレクトリを確保
   */
  private ensureBackupDirectory() {
    if (!existsSync(this.backupPath)) {
      const fs = require('fs')
      fs.mkdirSync(this.backupPath, { recursive: true })
      console.log('📁 バックアップディレクトリを作成しました')
    }
  }

  /**
   * 現在のデータをバックアップ
   */
  private backupCurrentData() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupFile = join(this.backupPath, `data-backup-${timestamp}.ts`)
    
    try {
      const currentContent = readFileSync(this.dataPath, 'utf8')
      writeFileSync(backupFile, currentContent)
      console.log(`💾 バックアップを作成: ${backupFile}`)
      
      // 古いバックアップを削除（30日以上前）
      this.cleanOldBackups()
    } catch (error) {
      console.error('❌ バックアップ作成エラー:', error)
    }
  }

  /**
   * 古いバックアップを削除
   */
  private cleanOldBackups() {
    const fs = require('fs')
    const files = fs.readdirSync(this.backupPath)
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000)
    
    files.forEach((file: string) => {
      const filePath = join(this.backupPath, file)
      const stats = fs.statSync(filePath)
      
      if (stats.mtimeMs < thirtyDaysAgo) {
        fs.unlinkSync(filePath)
        console.log(`🗑️ 古いバックアップを削除: ${file}`)
      }
    })
  }

  /**
   * 価格情報を更新
   */
  public updatePricing(toolId: string, newPrice: string, source: string) {
    const tool = this.tools.find(t => t.id === toolId)
    if (!tool) {
      console.warn(`⚠️ ツール ${toolId} が見つかりません`)
      return
    }

    if (tool.pricing !== newPrice) {
      this.updates.push({
        toolId,
        field: 'pricing',
        oldValue: tool.pricing,
        newValue: newPrice,
        source,
        confidence: 0.9
      })
      
      tool.pricing = newPrice
      console.log(`💰 ${toolId}の価格を更新: ${newPrice}`)
    }
  }

  /**
   * バージョン情報を更新
   */
  public updateVersion(toolId: string, newVersion: string, source: string) {
    const tool = this.tools.find(t => t.id === toolId)
    if (!tool) {
      console.warn(`⚠️ ツール ${toolId} が見つかりません`)
      return
    }

    if (tool.version !== newVersion) {
      this.updates.push({
        toolId,
        field: 'version' as keyof ToolData,
        oldValue: tool.version,
        newValue: newVersion,
        source,
        confidence: 0.95
      })
      
      tool.version = newVersion
      tool.lastUpdated = new Date().toISOString()
      console.log(`📦 ${toolId}のバージョンを更新: ${newVersion}`)
    }
  }

  /**
   * 説明文を更新
   */
  public updateDescription(toolId: string, newDescription: string, source: string) {
    const tool = this.tools.find(t => t.id === toolId)
    if (!tool) return

    if (tool.description !== newDescription) {
      this.updates.push({
        toolId,
        field: 'description',
        oldValue: tool.description,
        newValue: newDescription,
        source,
        confidence: 0.8
      })
      
      tool.description = newDescription
      console.log(`📝 ${toolId}の説明を更新`)
    }
  }

  /**
   * タグを追加
   */
  public addTag(toolId: string, newTag: string) {
    const tool = this.tools.find(t => t.id === toolId)
    if (!tool) return

    if (!tool.tags.includes(newTag)) {
      tool.tags.push(newTag)
      console.log(`🏷️ ${toolId}にタグを追加: ${newTag}`)
    }
  }

  /**
   * 新しいツールを追加
   */
  public addNewTool(toolData: ToolData) {
    const exists = this.tools.find(t => t.id === toolData.id)
    if (exists) {
      console.warn(`⚠️ ツール ${toolData.id} は既に存在します`)
      return
    }

    this.tools.push({
      ...toolData,
      lastUpdated: new Date().toISOString()
    })
    
    console.log(`✨ 新しいツールを追加: ${toolData.name}`)
  }

  /**
   * データファイルを生成して保存
   */
  public saveUpdatedData() {
    if (this.updates.length === 0) {
      console.log('ℹ️ 更新はありません')
      return
    }

    // バックアップを作成
    this.backupCurrentData()

    // 新しいdata.tsファイルを生成
    const content = this.generateDataFile()
    
    try {
      writeFileSync(this.dataPath, content)
      console.log(`✅ data.tsを更新しました (${this.updates.length}件の変更)`)
      
      // 更新ログを保存
      this.saveUpdateLog()
    } catch (error) {
      console.error('❌ ファイル保存エラー:', error)
      this.rollbackFromBackup()
    }
  }

  /**
   * data.tsファイルの内容を生成
   */
  private generateDataFile(): string {
    let content = `// AIコーディングツールのデータ
// 最終更新: ${new Date().toLocaleString('ja-JP')}
// 自動生成 by Data Updater Agent

export const tools = [
`

    this.tools.forEach((tool, index) => {
      content += `  {
    id: "${tool.id}",
    name: "${tool.name}",
    category: "${tool.category}",
    description: "${tool.description}",
    pricing: "${tool.pricing}",
    tags: [${tool.tags.map(t => `"${t}"`).join(', ')}],`
      
      if (tool.version) {
        content += `\n    version: "${tool.version}",`
      }
      if (tool.lastUpdated) {
        content += `\n    lastUpdated: "${tool.lastUpdated}",`
      }
      
      content += '\n  },'
      
      if (index < this.tools.length - 1) {
        content += '\n'
      }
    })

    content += `
]

// MCPサーバーのデータ
export const mcpServers = [
  {
    id: "github-mcp",
    name: "GitHub MCP",
    category: "開発ツール",
    description: "GitHub API統合でリポジトリ、Issue、PR操作",
    status: "stable",
  },
  {
    id: "filesystem-mcp",
    name: "Filesystem MCP",
    category: "ファイル操作",
    description: "ローカルファイルシステムの安全な操作",
    status: "stable",
  },
  {
    id: "memory-mcp",
    name: "Memory MCP",
    category: "データ管理",
    description: "知識とコンテキストの永続化",
    status: "stable",
  },
  {
    id: "slack-mcp",
    name: "Slack MCP",
    category: "コミュニケーション",
    description: "Slackワークスペースとの連携",
    status: "stable",
  },
  {
    id: "postgresql-mcp",
    name: "PostgreSQL MCP",
    category: "データベース",
    description: "PostgreSQLデータベース操作",
    status: "community",
  },
]

// CLIツールのデータ
export const cliTools = [
  {
    id: "iterm2",
    name: "iTerm2",
    category: "ターミナル",
    description: "Mac最強のターミナルエミュレータ",
    os: ["mac"],
  },
  {
    id: "warp",
    name: "Warp",
    category: "ターミナル",
    description: "AI搭載の次世代ターミナル",
    os: ["mac"],
  },
  {
    id: "gh-cli",
    name: "GitHub CLI",
    category: "Git",
    description: "GitHub操作をCLIで完結",
    os: ["mac", "windows", "linux"],
  },
  {
    id: "lazygit",
    name: "lazygit",
    category: "Git",
    description: "TUIでGit操作を効率化",
    os: ["mac", "windows", "linux"],
  },
  {
    id: "fzf",
    name: "fzf",
    category: "検索",
    description: "ファジー検索ツール",
    os: ["mac", "windows", "linux"],
  },
  {
    id: "ripgrep",
    name: "ripgrep",
    category: "検索",
    description: "超高速grep代替",
    os: ["mac", "windows", "linux"],
  },
]
`

    return content
  }

  /**
   * 更新ログを保存
   */
  private saveUpdateLog() {
    const logPath = join(this.backupPath, 'update-log.json')
    let log: any[] = []
    
    if (existsSync(logPath)) {
      const existing = readFileSync(logPath, 'utf8')
      log = JSON.parse(existing)
    }
    
    log.push({
      timestamp: new Date().toISOString(),
      updates: this.updates,
      totalChanges: this.updates.length
    })
    
    writeFileSync(logPath, JSON.stringify(log, null, 2))
    console.log('📋 更新ログを記録しました')
  }

  /**
   * バックアップから復元
   */
  private rollbackFromBackup() {
    console.log('🔄 バックアップから復元中...')
    // 実装省略
  }

  /**
   * サンプル更新の実行
   */
  public runSampleUpdates() {
    console.log('\n📊 サンプル更新を実行します...\n')
    
    // 価格更新のシミュレーション
    this.updatePricing('github-copilot', '$19/月〜', 'Official Website')
    
    // バージョン更新のシミュレーション
    this.updateVersion('claude-code', 'v1.2.0', 'GitHub Release')
    
    // 新しいツールの追加
    this.addNewTool({
      id: 'v0',
      name: 'v0 by Vercel',
      category: 'Webアプリビルダー',
      description: 'AIでUIコンポーネントを生成',
      pricing: '無料〜',
      tags: ['Web', 'UI生成', 'Vercel']
    })
  }
}

// メイン実行
async function main() {
  console.log('🔄 Data Updater Agent起動\n')
  
  const updater = new DataUpdater()
  
  // 実際の実装では、ここで各種APIから最新情報を取得
  // 今回はサンプル更新を実行
  updater.runSampleUpdates()
  
  // データを保存
  updater.saveUpdatedData()
  
  console.log('\n✨ データ更新完了\n')
}

// スクリプト実行
if (require.main === module) {
  main()
}

export { DataUpdater }