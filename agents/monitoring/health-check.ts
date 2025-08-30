#!/usr/bin/env ts-node

/**
 * エージェントヘルスチェックスクリプト
 * 各エージェントの動作確認とシステムヘルスを検証
 */

import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import * as yaml from 'js-yaml'

interface HealthCheckResult {
  agent: string
  status: 'healthy' | 'warning' | 'critical' | 'unknown'
  checks: {
    name: string
    passed: boolean
    message: string
  }[]
  timestamp: string
  details?: any
}

class AgentHealthChecker {
  private results: HealthCheckResult[] = []
  private logsPath = join(__dirname, '../logs')
  
  constructor() {
    this.ensureLogsDirectory()
  }

  private ensureLogsDirectory() {
    if (!existsSync(this.logsPath)) {
      const fs = require('fs')
      fs.mkdirSync(this.logsPath, { recursive: true })
    }
  }

  /**
   * Research Agentのヘルスチェック
   */
  public checkResearchAgent(): HealthCheckResult {
    console.log('🔍 Research Agentをチェック中...')
    
    const checks = []
    let overallStatus: 'healthy' | 'warning' | 'critical' = 'healthy'
    
    // 1. スクリプトファイルの存在確認
    const scriptPath = join(__dirname, '../research/scripts/check_updates.ts')
    const scriptExists = existsSync(scriptPath)
    checks.push({
      name: 'スクリプトファイル',
      passed: scriptExists,
      message: scriptExists ? '✅ check_updates.ts存在' : '❌ check_updates.ts見つからず'
    })
    if (!scriptExists) overallStatus = 'critical'
    
    // 2. 設定ファイルの検証
    const configPath = join(__dirname, '../config/sources.yaml')
    const configExists = existsSync(configPath)
    let configValid = false
    
    if (configExists) {
      try {
        const config = yaml.load(readFileSync(configPath, 'utf8')) as any
        configValid = config.tools && Object.keys(config.tools).length > 0
        checks.push({
          name: '設定ファイル',
          passed: configValid,
          message: configValid 
            ? `✅ ${Object.keys(config.tools).length}個のツール設定` 
            : '⚠️ ツール設定が不正'
        })
      } catch (error) {
        checks.push({
          name: '設定ファイル',
          passed: false,
          message: '❌ 設定ファイル読み込みエラー'
        })
        overallStatus = 'critical'
      }
    } else {
      checks.push({
        name: '設定ファイル',
        passed: false,
        message: '❌ sources.yaml見つからず'
      })
      overallStatus = 'critical'
    }
    
    // 3. レポートディレクトリの確認
    const reportsPath = join(__dirname, '../research/reports')
    const reportsExists = existsSync(reportsPath)
    checks.push({
      name: 'レポートディレクトリ',
      passed: reportsExists,
      message: reportsExists ? '✅ reportsディレクトリ存在' : '⚠️ reportsディレクトリなし'
    })
    if (!reportsExists && overallStatus === 'healthy') overallStatus = 'warning'
    
    // 4. 最新レポートの確認
    if (reportsExists) {
      const fs = require('fs')
      const files = fs.readdirSync(reportsPath)
      const jsonFiles = files.filter((f: string) => f.endsWith('.json'))
      
      if (jsonFiles.length > 0) {
        const latestFile = jsonFiles.sort().reverse()[0]
        const filePath = join(reportsPath, latestFile)
        const stats = fs.statSync(filePath)
        const age = Date.now() - stats.mtimeMs
        const ageHours = age / (1000 * 60 * 60)
        
        checks.push({
          name: '最新レポート',
          passed: ageHours < 24,
          message: ageHours < 24 
            ? `✅ ${ageHours.toFixed(1)}時間前に更新` 
            : `⚠️ ${ageHours.toFixed(1)}時間前（古い）`
        })
        
        if (ageHours > 24 && overallStatus === 'healthy') overallStatus = 'warning'
      } else {
        checks.push({
          name: '最新レポート',
          passed: false,
          message: '⚠️ レポートファイルなし'
        })
        if (overallStatus === 'healthy') overallStatus = 'warning'
      }
    }
    
    return {
      agent: 'Research Agent',
      status: overallStatus,
      checks,
      timestamp: new Date().toISOString()
    }
  }

  /**
   * Data Updater Agentのヘルスチェック
   */
  public checkDataUpdaterAgent(): HealthCheckResult {
    console.log('🔄 Data Updater Agentをチェック中...')
    
    const checks = []
    let overallStatus: 'healthy' | 'warning' | 'critical' = 'healthy'
    
    // 1. スクリプトファイルの存在確認
    const scriptPath = join(__dirname, '../updater/scripts/update_data.ts')
    const scriptExists = existsSync(scriptPath)
    checks.push({
      name: 'スクリプトファイル',
      passed: scriptExists,
      message: scriptExists ? '✅ update_data.ts存在' : '❌ update_data.ts見つからず'
    })
    if (!scriptExists) overallStatus = 'critical'
    
    // 2. データファイルの確認
    const dataPath = join(__dirname, '../../src/lib/data.ts')
    const dataExists = existsSync(dataPath)
    checks.push({
      name: 'データファイル',
      passed: dataExists,
      message: dataExists ? '✅ data.ts存在' : '❌ data.ts見つからず'
    })
    if (!dataExists) overallStatus = 'critical'
    
    // 3. バックアップディレクトリの確認
    const backupPath = join(__dirname, '../updater/backups')
    const backupExists = existsSync(backupPath)
    checks.push({
      name: 'バックアップディレクトリ',
      passed: backupExists,
      message: backupExists ? '✅ backupsディレクトリ存在' : '⚠️ backupsディレクトリなし'
    })
    if (!backupExists && overallStatus === 'healthy') overallStatus = 'warning'
    
    // 4. 更新ログの確認
    const logPath = join(backupPath, 'update-log.json')
    if (existsSync(logPath)) {
      try {
        const log = JSON.parse(readFileSync(logPath, 'utf8'))
        const lastUpdate = log[log.length - 1]
        if (lastUpdate) {
          const age = Date.now() - new Date(lastUpdate.timestamp).getTime()
          const ageDays = age / (1000 * 60 * 60 * 24)
          
          checks.push({
            name: '最終更新',
            passed: ageDays < 7,
            message: ageDays < 7
              ? `✅ ${ageDays.toFixed(1)}日前に更新`
              : `⚠️ ${ageDays.toFixed(1)}日前（要確認）`
          })
          
          if (ageDays > 7 && overallStatus === 'healthy') overallStatus = 'warning'
        }
      } catch (error) {
        checks.push({
          name: '更新ログ',
          passed: false,
          message: '⚠️ 更新ログ読み込みエラー'
        })
      }
    } else {
      checks.push({
        name: '更新ログ',
        passed: false,
        message: '⚠️ 更新ログなし'
      })
    }
    
    return {
      agent: 'Data Updater Agent',
      status: overallStatus,
      checks,
      timestamp: new Date().toISOString()
    }
  }

  /**
   * 全エージェントのヘルスチェック
   */
  public checkAllAgents() {
    console.log('\n🏥 エージェントヘルスチェック開始\n')
    
    // Research Agent
    const researchResult = this.checkResearchAgent()
    this.results.push(researchResult)
    this.printResult(researchResult)
    
    // Data Updater Agent
    const updaterResult = this.checkDataUpdaterAgent()
    this.results.push(updaterResult)
    this.printResult(updaterResult)
    
    // その他のエージェント（未実装）
    const pendingAgents = [
      'Content Creator Agent',
      'Translation Agent',
      'Community Insights Agent'
    ]
    
    pendingAgents.forEach(agentName => {
      const result: HealthCheckResult = {
        agent: agentName,
        status: 'unknown',
        checks: [{
          name: '実装状態',
          passed: false,
          message: '📅 実装予定'
        }],
        timestamp: new Date().toISOString()
      }
      this.results.push(result)
      this.printResult(result)
    })
    
    // サマリー出力
    this.printSummary()
    
    // ログ保存
    this.saveHealthLog()
  }

  /**
   * 結果を表示
   */
  private printResult(result: HealthCheckResult) {
    const statusEmoji = {
      healthy: '✅',
      warning: '⚠️',
      critical: '❌',
      unknown: '❓'
    }
    
    console.log(`\n${statusEmoji[result.status]} ${result.agent}: ${result.status.toUpperCase()}`)
    result.checks.forEach(check => {
      console.log(`  ${check.message}`)
    })
  }

  /**
   * サマリーを表示
   */
  private printSummary() {
    console.log('\n' + '='.repeat(50))
    console.log('📊 ヘルスチェックサマリー')
    console.log('='.repeat(50))
    
    const healthy = this.results.filter(r => r.status === 'healthy').length
    const warning = this.results.filter(r => r.status === 'warning').length
    const critical = this.results.filter(r => r.status === 'critical').length
    const unknown = this.results.filter(r => r.status === 'unknown').length
    
    console.log(`✅ Healthy: ${healthy}`)
    console.log(`⚠️  Warning: ${warning}`)
    console.log(`❌ Critical: ${critical}`)
    console.log(`❓ Unknown: ${unknown}`)
    
    // 総合判定
    let overallStatus = 'HEALTHY'
    if (critical > 0) overallStatus = 'CRITICAL'
    else if (warning > 0) overallStatus = 'WARNING'
    
    console.log(`\n総合ステータス: ${overallStatus}`)
    
    // Exit codeを設定
    if (overallStatus === 'CRITICAL') {
      process.exit(1)
    }
  }

  /**
   * ヘルスログを保存
   */
  private saveHealthLog() {
    const logFile = join(this.logsPath, `health-check-${new Date().toISOString().split('T')[0]}.json`)
    
    const logEntry = {
      timestamp: new Date().toISOString(),
      results: this.results,
      summary: {
        healthy: this.results.filter(r => r.status === 'healthy').length,
        warning: this.results.filter(r => r.status === 'warning').length,
        critical: this.results.filter(r => r.status === 'critical').length,
        unknown: this.results.filter(r => r.status === 'unknown').length
      }
    }
    
    // 既存のログに追加
    let logs = []
    if (existsSync(logFile)) {
      try {
        logs = JSON.parse(readFileSync(logFile, 'utf8'))
      } catch (error) {
        logs = []
      }
    }
    
    logs.push(logEntry)
    
    // 最新100件のみ保持
    if (logs.length > 100) {
      logs = logs.slice(-100)
    }
    
    writeFileSync(logFile, JSON.stringify(logs, null, 2))
    console.log(`\n📁 ヘルスログ保存: ${logFile}`)
  }

  /**
   * 特定のエージェントをチェック
   */
  public checkSpecificAgent(agentName: string) {
    switch (agentName.toLowerCase()) {
      case 'research':
        const researchResult = this.checkResearchAgent()
        this.printResult(researchResult)
        break
      case 'updater':
        const updaterResult = this.checkDataUpdaterAgent()
        this.printResult(updaterResult)
        break
      default:
        console.error(`❌ 不明なエージェント: ${agentName}`)
        process.exit(1)
    }
  }
}

// メイン実行
function main() {
  const checker = new AgentHealthChecker()
  
  // コマンドライン引数をチェック
  const args = process.argv.slice(2)
  
  if (args.length > 0) {
    // 特定のエージェントをチェック
    checker.checkSpecificAgent(args[0])
  } else {
    // 全エージェントをチェック
    checker.checkAllAgents()
  }
}

if (require.main === module) {
  main()
}

export { AgentHealthChecker }