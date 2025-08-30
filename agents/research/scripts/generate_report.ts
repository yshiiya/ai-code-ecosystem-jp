#!/usr/bin/env ts-node

/**
 * AI Tool Research Agent - 週次レポート生成スクリプト
 * 1週間の更新情報を集計し、包括的なレポートを生成
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs'
import { join } from 'path'

interface WeeklyReport {
  period: {
    start: string
    end: string
  }
  summary: {
    total_updates: number
    tools_updated: string[]
    critical_updates: number
    new_features: number
    price_changes: number
  }
  highlights: string[]
  tool_details: Record<string, ToolUpdate>
  recommendations: string[]
  next_actions: string[]
}

interface ToolUpdate {
  name: string
  updates_count: number
  latest_version?: string
  major_changes: string[]
  impact_level: 'low' | 'medium' | 'high'
}

class WeeklyReportGenerator {
  private reportsPath = join(__dirname, '../reports')
  private outputPath = join(__dirname, '../../../docs/updates')
  
  constructor() {
    this.ensureDirectories()
  }

  private ensureDirectories() {
    if (!existsSync(this.outputPath)) {
      const fs = require('fs')
      fs.mkdirSync(this.outputPath, { recursive: true })
    }
  }

  /**
   * 週次レポートを生成
   */
  public generateWeeklyReport(): WeeklyReport {
    const endDate = new Date()
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000)
    
    // 過去7日間のレポートファイルを収集
    const dailyReports = this.collectDailyReports(startDate, endDate)
    
    // レポートデータを集計
    const report: WeeklyReport = {
      period: {
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0]
      },
      summary: {
        total_updates: 0,
        tools_updated: [],
        critical_updates: 0,
        new_features: 0,
        price_changes: 0
      },
      highlights: [],
      tool_details: {},
      recommendations: [],
      next_actions: []
    }

    // 各日次レポートからデータを集計
    dailyReports.forEach(reportData => {
      this.aggregateReportData(report, reportData)
    })

    // ハイライトと推奨事項を生成
    this.generateHighlights(report)
    this.generateRecommendations(report)
    this.generateNextActions(report)

    return report
  }

  /**
   * 日次レポートファイルを収集
   */
  private collectDailyReports(startDate: Date, endDate: Date): any[] {
    const reports = []
    
    try {
      const files = readdirSync(this.reportsPath)
      const jsonFiles = files.filter(f => f.endsWith('.json') && f.startsWith('update-report-'))
      
      for (const file of jsonFiles) {
        const datePart = file.replace('update-report-', '').replace('.json', '')
        const fileDate = new Date(datePart)
        
        if (fileDate >= startDate && fileDate <= endDate) {
          const content = readFileSync(join(this.reportsPath, file), 'utf8')
          reports.push(JSON.parse(content))
        }
      }
    } catch (error) {
      console.error('日次レポートの収集エラー:', error)
    }

    return reports
  }

  /**
   * レポートデータを集計
   */
  private aggregateReportData(weeklyReport: WeeklyReport, dailyReport: any) {
    if (!dailyReport.updates) return

    dailyReport.updates.forEach((update: any) => {
      // 総更新数をカウント
      weeklyReport.summary.total_updates++

      // ツール別の更新を記録
      if (!weeklyReport.summary.tools_updated.includes(update.tool)) {
        weeklyReport.summary.tools_updated.push(update.tool)
      }

      // 重要度別のカウント
      if (update.importance === 'critical') {
        weeklyReport.summary.critical_updates++
      }

      // タイプ別のカウント
      if (update.type === 'feature') {
        weeklyReport.summary.new_features++
      } else if (update.type === 'price') {
        weeklyReport.summary.price_changes++
      }

      // ツール詳細の更新
      if (!weeklyReport.tool_details[update.tool]) {
        weeklyReport.tool_details[update.tool] = {
          name: update.tool,
          updates_count: 0,
          major_changes: [],
          impact_level: 'low'
        }
      }

      const toolDetail = weeklyReport.tool_details[update.tool]
      toolDetail.updates_count++
      
      if (update.importance === 'high' || update.importance === 'critical') {
        toolDetail.major_changes.push(update.title)
        toolDetail.impact_level = this.getHigherImpact(toolDetail.impact_level, update.importance)
      }

      if (update.type === 'version' && update.title.includes('v')) {
        const versionMatch = update.title.match(/v[\d.]+/)
        if (versionMatch) {
          toolDetail.latest_version = versionMatch[0]
        }
      }
    })
  }

  private getHigherImpact(current: string, update: string): 'low' | 'medium' | 'high' {
    const levels = { low: 0, medium: 1, high: 2, critical: 2 }
    const currentLevel = levels[current as keyof typeof levels] || 0
    const updateLevel = levels[update as keyof typeof levels] || 0
    
    if (updateLevel > currentLevel) {
      return updateLevel === 2 ? 'high' : updateLevel === 1 ? 'medium' : 'low'
    }
    return current as 'low' | 'medium' | 'high'
  }

  /**
   * ハイライトを生成
   */
  private generateHighlights(report: WeeklyReport) {
    // 重要な更新をハイライト
    if (report.summary.critical_updates > 0) {
      report.highlights.push(`🚨 ${report.summary.critical_updates}件の重要な更新があります`)
    }

    // 最も更新が多かったツール
    const mostUpdated = Object.entries(report.tool_details)
      .sort((a, b) => b[1].updates_count - a[1].updates_count)
      .slice(0, 3)

    if (mostUpdated.length > 0) {
      report.highlights.push(
        `📊 最も更新が多かったツール: ${mostUpdated.map(([name]) => name).join(', ')}`
      )
    }

    // 新機能のハイライト
    if (report.summary.new_features > 0) {
      report.highlights.push(`✨ ${report.summary.new_features}個の新機能がリリースされました`)
    }

    // 価格変更のハイライト
    if (report.summary.price_changes > 0) {
      report.highlights.push(`💰 ${report.summary.price_changes}件の価格変更がありました`)
    }
  }

  /**
   * 推奨事項を生成
   */
  private generateRecommendations(report: WeeklyReport) {
    // 高影響度の更新に対する推奨
    Object.entries(report.tool_details).forEach(([toolName, details]) => {
      if (details.impact_level === 'high') {
        report.recommendations.push(
          `${toolName}の重要な更新を確認し、ドキュメントを更新してください`
        )
      }
    })

    // 価格変更への対応
    if (report.summary.price_changes > 0) {
      report.recommendations.push(
        '価格変更があったツールの比較表を更新してください'
      )
    }

    // 新機能の紹介
    if (report.summary.new_features >= 3) {
      report.recommendations.push(
        '新機能まとめ記事の作成を検討してください'
      )
    }
  }

  /**
   * 次のアクションを生成
   */
  private generateNextActions(report: WeeklyReport) {
    report.next_actions.push('各ツールの詳細ページを最新情報で更新')
    report.next_actions.push('重要な更新についてブログ記事を作成')
    report.next_actions.push('ユーザー向けニュースレターの準備')
    
    if (report.summary.critical_updates > 0) {
      report.next_actions.unshift('Critical更新の影響評価と対応策の検討')
    }
  }

  /**
   * Markdownレポートを出力
   */
  public saveMarkdownReport(report: WeeklyReport) {
    const filename = `weekly-report-${report.period.end}.md`
    const filepath = join(this.outputPath, filename)
    
    let markdown = `# 週次AIツール更新レポート\n\n`
    markdown += `期間: ${report.period.start} 〜 ${report.period.end}\n\n`
    
    // サマリー
    markdown += `## 📊 サマリー\n\n`
    markdown += `- **総更新数**: ${report.summary.total_updates}件\n`
    markdown += `- **更新があったツール**: ${report.summary.tools_updated.length}個\n`
    markdown += `- **Critical更新**: ${report.summary.critical_updates}件\n`
    markdown += `- **新機能**: ${report.summary.new_features}件\n`
    markdown += `- **価格変更**: ${report.summary.price_changes}件\n\n`
    
    // ハイライト
    if (report.highlights.length > 0) {
      markdown += `## 🌟 ハイライト\n\n`
      report.highlights.forEach(highlight => {
        markdown += `- ${highlight}\n`
      })
      markdown += '\n'
    }
    
    // ツール別詳細
    markdown += `## 🔧 ツール別更新詳細\n\n`
    Object.entries(report.tool_details)
      .sort((a, b) => b[1].updates_count - a[1].updates_count)
      .forEach(([toolName, details]) => {
        markdown += `### ${toolName}\n`
        markdown += `- 更新数: ${details.updates_count}件\n`
        if (details.latest_version) {
          markdown += `- 最新バージョン: ${details.latest_version}\n`
        }
        markdown += `- 影響度: ${this.getImpactLabel(details.impact_level)}\n`
        if (details.major_changes.length > 0) {
          markdown += `- 主な変更:\n`
          details.major_changes.forEach(change => {
            markdown += `  - ${change}\n`
          })
        }
        markdown += '\n'
      })
    
    // 推奨事項
    if (report.recommendations.length > 0) {
      markdown += `## 💡 推奨事項\n\n`
      report.recommendations.forEach((rec, index) => {
        markdown += `${index + 1}. ${rec}\n`
      })
      markdown += '\n'
    }
    
    // 次のアクション
    if (report.next_actions.length > 0) {
      markdown += `## ✅ 次のアクション\n\n`
      report.next_actions.forEach(action => {
        markdown += `- [ ] ${action}\n`
      })
      markdown += '\n'
    }
    
    markdown += `---\n`
    markdown += `*このレポートは${new Date().toLocaleString('ja-JP')}に自動生成されました*\n`
    
    writeFileSync(filepath, markdown)
    console.log(`📝 週次レポートを保存しました: ${filepath}`)
  }

  private getImpactLabel(level: string): string {
    const labels: Record<string, string> = {
      low: '低 🟢',
      medium: '中 🟡',
      high: '高 🔴'
    }
    return labels[level] || level
  }
}

// メイン実行
async function main() {
  console.log('📅 週次レポート生成を開始します...\n')
  
  const generator = new WeeklyReportGenerator()
  
  try {
    const report = generator.generateWeeklyReport()
    generator.saveMarkdownReport(report)
    
    console.log('\n✨ 週次レポート生成完了！\n')
    console.log('📊 サマリー:')
    console.log(`  - 総更新数: ${report.summary.total_updates}件`)
    console.log(`  - 更新ツール数: ${report.summary.tools_updated.length}個`)
    console.log(`  - Critical更新: ${report.summary.critical_updates}件`)
    
  } catch (error) {
    console.error('❌ エラーが発生しました:', error)
    process.exit(1)
  }
}

// スクリプト実行
if (require.main === module) {
  main()
}

export { WeeklyReportGenerator }