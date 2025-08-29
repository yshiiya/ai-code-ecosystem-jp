# Amazon Q Developer - 詳細情報

## 基本情報
- **開発元**: Amazon Web Services (AWS)
- **カテゴリ**: エンタープライズAI開発アシスタント
- **動作環境**: IDE拡張、AWS Console、CLI
- **最終更新**: 2025年8月29日
- **旧名**: Amazon CodeWhisperer

## 概要
Amazon Q DeveloperはAWSが提供するAI開発アシスタント。AWS統合に優れ、セキュリティスキャンやコード変換などエンタープライズ向け機能が充実。旧CodeWhispererから大幅に機能拡張されました。

## 主要機能
- **コード生成**: 関数・クラスの自動生成
- **コード補完**: リアルタイム補完
- **セキュリティスキャン**: 脆弱性の自動検出
- **コード変換**: Java 8→17等の自動変換
- **テスト生成**: 単体テスト自動作成
- **AWS統合**: AWSサービスのベストプラクティス
- **ライセンス検出**: OSSライセンスの自動検出

## 料金プラン
| プラン | 月額料金 | 特徴 |
|--------|----------|------|
| Free Tier | $0 | 月50回のコード生成 |
| Professional | $19/ユーザー | 無制限、高度な機能 |
| Enterprise | お問い合わせ | SSO、管理機能 |

## AWS特化機能
```yaml
AWSサービス統合:
  - Lambda関数の自動生成
  - DynamoDB クエリ最適化
  - S3操作のベストプラクティス
  - CloudFormationテンプレート生成
  - IAMポリシー提案

セキュリティ:
  - OWASP Top 10脆弱性検出
  - CWE検出
  - クリプト解析
  - シークレット検出
  - 依存関係の脆弱性スキャン

コンプライアンス:
  - ライセンス互換性チェック
  - コード帰属の追跡
  - 監査ログ
```

## 対応言語・フレームワーク
```yaml
主要言語:
  - Python
  - Java
  - JavaScript/TypeScript
  - C#
  - Go
  - Rust
  - PHP
  - Ruby
  - Kotlin
  - SQL

AWSフレームワーク:
  - AWS CDK
  - AWS SAM
  - Serverless Framework
  - AWS SDK全般
```

## インストール方法

### VS Code
```bash
# マーケットプレイスから
1. 拡張機能 → "Amazon Q"を検索
2. Install → AWS認証

# AWS Toolkit経由
1. AWS Toolkit for VS Codeをインストール
2. Amazon Q機能を有効化
```

### JetBrains IDE
```bash
1. Settings → Plugins
2. "AWS Toolkit"をインストール
3. Amazon Q機能を有効化
4. AWS認証設定
```

### CLI
```bash
# AWS CLI経由
aws q configure
aws q generate "Lambda function for image processing"
```

## 初期設定
```json
// settings.json
{
  "amazonQ.shareCodeWhispererContentWithAWS": true,
  "amazonQ.includeSuggestionsWithCodeReferences": true,
  "amazonQ.codeScanning": true,
  "amazonQ.autoTriggerEnabled": true
}
```

## 使い方の例
```python
# Lambda関数生成
# Comment: Create Lambda function to process S3 events
def lambda_handler(event, context):
    # Amazon Qが自動生成

# セキュリティスキャン
# Run Amazon Q Security Scan
# → 脆弱性レポート生成

# コード変換
# Amazon Q: Convert this Java 8 code to Java 17
# → 自動変換実行

# AWS SDK使用
import boto3
# Create DynamoDB client
# → ベストプラクティスコード生成
```

## 日本語対応
- ⚠️ 限定的
- UIは英語
- 日本語コメントは理解可能
- 生成コードのコメントは英語

## 長所
- AWS統合が完璧
- セキュリティ機能充実
- エンタープライズ対応
- コード変換機能
- ライセンス管理
- 無料枠あり

## 短所
- AWS以外では機能限定
- 日本語対応が弱い
- 月額料金が高め
- 学習曲線あり

## 競合比較
| 項目 | Amazon Q | GitHub Copilot | Codeium |
|------|----------|----------------|---------|
| 価格 | $19/月 | $10/月 | 無料〜 |
| AWS統合 | ◎ | △ | △ |
| セキュリティ | ◎ | ○ | △ |
| 言語対応 | ○ | ◎ | ◎ |

## エンタープライズ機能
```yaml
管理:
  - AWS Organizations統合
  - IAM/SSO統合
  - 使用状況ダッシュボード
  - コスト分析

セキュリティ:
  - VPCエンドポイント
  - プライベートコード提案
  - データレジデンシー
  - 暗号化

コンプライアンス:
  - SOC
  - ISO
  - HIPAA対応
  - FedRAMP
```

## AWSサービス連携例
```python
# DynamoDB操作
# Q: Create a function to query DynamoDB table 'users' by email
def get_user_by_email(email):
    # 最適化されたコード自動生成
    
# S3操作
# Q: Upload file to S3 with server-side encryption
def secure_upload_to_s3(file_path, bucket_name):
    # セキュアな実装を自動生成

# Lambda + API Gateway
# Q: Create REST API endpoint for user registration
# → 完全なサーバーレス構成を生成
```

## ベストプラクティス
1. **AWS開発**: AWS関連は積極的に活用
2. **セキュリティ**: 定期的なスキャン実行
3. **コード変換**: レガシーコードの近代化
4. **チーム設定**: 組織ポリシーの統一

## 公式リソース
- **公式サイト**: [https://aws.amazon.com/q/developer](https://aws.amazon.com/q/developer)
- **ドキュメント**: [https://docs.aws.amazon.com/amazonq](https://docs.aws.amazon.com/amazonq)
- **ワークショップ**: [https://workshops.aws/amazonq](https://workshops.aws/amazonq)
- **サポート**: AWS Support経由

## 更新履歴
- 2025年8月: エージェント機能追加
- 2025年7月: コード変換機能強化
- 2025年4月: CodeWhispererから改名

## よくある質問
**Q: CodeWhispererとの違いは？**
A: Amazon Qは後継で、より多機能になりました。

**Q: AWS以外でも使える？**
A: 使えますが、AWS関連機能が主要な価値です。

**Q: オンプレミスで使える？**
A: Enterpriseプランで相談可能です。

---
*最終確認日: 2025年8月29日*
*次回更新予定: 2025年9月15日*