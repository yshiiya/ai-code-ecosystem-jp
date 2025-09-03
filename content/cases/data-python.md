# データ分析：Pythonスクリプト作成

## 概要

Excel操作に慣れた事務職・営業職の方が、ChatGPTとJupyter Notebookを使用して売上データの分析を自動化するPythonスクリプトを作成する実践例です。

## 対象者
- Excel操作に慣れた事務職・営業職
- データ分析業務を効率化したい方
- プログラミング未経験だがPythonに興味がある方
- 手作業での集計・レポート作成に時間を取られている方

## 使用ツール
- **ChatGPT**: コード生成とデータ分析のアドバイス
- **Jupyter Notebook**: インタラクティブな開発環境
- **Pandas**: データ操作・分析ライブラリ
- **Matplotlib/Seaborn**: データ可視化ライブラリ
- **NumPy**: 数値計算ライブラリ

## 成果物
売上データ分析の自動化スクリプト

### 主な機能
1. CSVファイルの自動読み込み
2. 売上トレンド分析（月次・四半期・年次）
3. 商品・地域別売上分析
4. グラフ・チャートの自動生成
5. 分析レポートのPDF出力
6. 異常値・外れ値の検出
7. 予測分析（簡易的な売上予測）

## 実装手順

### 1. 環境セットアップ

Anacondaのインストールとライブラリ準備：

```bash
# Anacondaをインストール後
conda create -n data-analysis python=3.9
conda activate data-analysis

# 必要ライブラリのインストール
pip install pandas matplotlib seaborn numpy jupyter openpyxl
pip install plotly scikit-learn reportlab
```

### 2. データ構造の理解

ChatGPTに以下のプロンプトで売上データ分析の基本を質問：

```
売上データを分析するPythonスクリプトを作成したいです。
以下のようなCSVファイル形式のデータがあります：

列：日付, 商品名, 商品カテゴリ, 地域, 売上金額, 数量, 担当者

このデータから以下の分析を行いたい：
1. 月次売上トレンド
2. 商品カテゴリ別売上
3. 地域別売上
4. 担当者別売上

Pandasを使用したデータ読み込みと基本的な分析コードを教えてください。
```

### 3. データ読み込みと前処理

```python
# sales_analysis.py
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings('ignore')

# 日本語フォント設定
plt.rcParams['font.family'] = 'DejaVu Sans'
sns.set_palette("husl")

class SalesAnalyzer:
    def __init__(self, csv_file_path):
        """
        売上分析クラスの初期化
        """
        self.df = None
        self.csv_file_path = csv_file_path
        self.load_data()
    
    def load_data(self):
        """
        CSVファイルからデータを読み込み、前処理を実行
        """
        try:
            # CSVファイル読み込み
            self.df = pd.read_csv(self.csv_file_path, encoding='utf-8')
            
            # 日付列をdatetime型に変換
            self.df['日付'] = pd.to_datetime(self.df['日付'])
            
            # 月、四半期、年の列を追加
            self.df['年'] = self.df['日付'].dt.year
            self.df['月'] = self.df['日付'].dt.month
            self.df['四半期'] = self.df['日付'].dt.quarter
            self.df['年月'] = self.df['日付'].dt.to_period('M')
            
            # 売上金額の数値変換（カンマを除去）
            if self.df['売上金額'].dtype == 'object':
                self.df['売上金額'] = self.df['売上金額'].str.replace(',', '').astype(float)
            
            print(f"データ読み込み完了: {len(self.df)} 件")
            print(f"期間: {self.df['日付'].min()} ～ {self.df['日付'].max()}")
            
        except Exception as e:
            print(f"データ読み込みエラー: {e}")
    
    def basic_statistics(self):
        """
        基本統計情報を表示
        """
        print("=== 基本統計情報 ===")
        print(f"総売上: {self.df['売上金額'].sum():,.0f} 円")
        print(f"平均売上: {self.df['売上金額'].mean():,.0f} 円")
        print(f"最高売上: {self.df['売上金額'].max():,.0f} 円")
        print(f"最低売上: {self.df['売上金額'].min():,.0f} 円")
        print(f"ユニーク商品数: {self.df['商品名'].nunique()} 個")
        print(f"対象地域数: {self.df['地域'].nunique()} 地域")
        
        return {
            'total_sales': self.df['売上金額'].sum(),
            'average_sales': self.df['売上金額'].mean(),
            'max_sales': self.df['売上金額'].max(),
            'min_sales': self.df['売上金額'].min(),
            'unique_products': self.df['商品名'].nunique(),
            'unique_regions': self.df['地域'].nunique()
        }
```

### 4. 売上トレンド分析

```python
def monthly_trend_analysis(self):
    """
    月次売上トレンド分析とグラフ作成
    """
    # 月次売上集計
    monthly_sales = self.df.groupby('年月')['売上金額'].agg([
        'sum', 'count', 'mean'
    ]).reset_index()
    monthly_sales.columns = ['年月', '売上合計', '取引件数', '平均売上']
    
    # グラフ作成
    fig, axes = plt.subplots(2, 2, figsize=(15, 10))
    fig.suptitle('月次売上トレンド分析', fontsize=16, fontweight='bold')
    
    # 売上合計のトレンド
    axes[0, 0].plot(monthly_sales['年月'].astype(str), 
                    monthly_sales['売上合計'], 
                    marker='o', linewidth=2)
    axes[0, 0].set_title('月次売上合計')
    axes[0, 0].set_ylabel('売上金額（円）')
    axes[0, 0].tick_params(axis='x', rotation=45)
    
    # 取引件数のトレンド
    axes[0, 1].plot(monthly_sales['年月'].astype(str), 
                    monthly_sales['取引件数'], 
                    marker='s', color='orange', linewidth=2)
    axes[0, 1].set_title('月次取引件数')
    axes[0, 1].set_ylabel('件数')
    axes[0, 1].tick_params(axis='x', rotation=45)
    
    # 平均売上のトレンド
    axes[1, 0].plot(monthly_sales['年月'].astype(str), 
                    monthly_sales['平均売上'], 
                    marker='^', color='green', linewidth=2)
    axes[1, 0].set_title('月次平均売上')
    axes[1, 0].set_ylabel('平均売上金額（円）')
    axes[1, 0].tick_params(axis='x', rotation=45)
    
    # 四半期別売上
    quarterly_sales = self.df.groupby(['年', '四半期'])['売上金額'].sum().reset_index()
    quarterly_sales['年四半期'] = quarterly_sales['年'].astype(str) + 'Q' + quarterly_sales['四半期'].astype(str)
    
    axes[1, 1].bar(quarterly_sales['年四半期'], quarterly_sales['売上金額'], color='purple', alpha=0.7)
    axes[1, 1].set_title('四半期別売上')
    axes[1, 1].set_ylabel('売上金額（円）')
    axes[1, 1].tick_params(axis='x', rotation=45)
    
    plt.tight_layout()
    plt.savefig('monthly_trend.png', dpi=300, bbox_inches='tight')
    plt.show()
    
    return monthly_sales

def category_analysis(self):
    """
    商品カテゴリ別売上分析
    """
    # カテゴリ別集計
    category_sales = self.df.groupby('商品カテゴリ')['売上金額'].agg([
        'sum', 'count', 'mean'
    ]).reset_index()
    category_sales.columns = ['商品カテゴリ', '売上合計', '取引件数', '平均売上']
    category_sales = category_sales.sort_values('売上合計', ascending=False)
    
    # パレート図（売上とシェア）
    category_sales['売上シェア'] = category_sales['売上合計'] / category_sales['売上合計'].sum() * 100
    category_sales['累積シェア'] = category_sales['売上シェア'].cumsum()
    
    fig, ax1 = plt.subplots(figsize=(12, 6))
    
    # 棒グラフ（売上）
    bars = ax1.bar(category_sales['商品カテゴリ'], 
                   category_sales['売上合計'], 
                   alpha=0.7, color='skyblue')
    ax1.set_xlabel('商品カテゴリ')
    ax1.set_ylabel('売上金額（円）', color='blue')
    ax1.tick_params(axis='x', rotation=45)
    
    # 累積シェアの折れ線グラフ
    ax2 = ax1.twinx()
    line = ax2.plot(category_sales['商品カテゴリ'], 
                    category_sales['累積シェア'], 
                    color='red', marker='o', linewidth=2)
    ax2.set_ylabel('累積シェア（%）', color='red')
    ax2.set_ylim(0, 105)
    
    # 80%ラインを追加
    ax2.axhline(y=80, color='red', linestyle='--', alpha=0.5)
    
    plt.title('商品カテゴリ別売上分析（パレート図）')
    plt.tight_layout()
    plt.savefig('category_analysis.png', dpi=300, bbox_inches='tight')
    plt.show()
    
    return category_sales
```

### 5. 地域・担当者分析

```python
def regional_analysis(self):
    """
    地域別売上分析
    """
    regional_sales = self.df.groupby('地域')['売上金額'].agg([
        'sum', 'count', 'mean'
    ]).reset_index()
    regional_sales.columns = ['地域', '売上合計', '取引件数', '平均売上']
    
    # ヒートマップ用データ準備
    monthly_regional = self.df.groupby(['年月', '地域'])['売上金額'].sum().reset_index()
    heatmap_data = monthly_regional.pivot(index='年月', columns='地域', values='売上金額')
    
    fig, axes = plt.subplots(1, 2, figsize=(16, 6))
    
    # 地域別売上の円グラフ
    axes[0].pie(regional_sales['売上合計'], 
                labels=regional_sales['地域'], 
                autopct='%1.1f%%', 
                startangle=90)
    axes[0].set_title('地域別売上シェア')
    
    # 月次×地域のヒートマップ
    sns.heatmap(heatmap_data.T, annot=True, fmt='.0f', cmap='YlOrRd', ax=axes[1])
    axes[1].set_title('月次×地域別売上ヒートマップ')
    axes[1].set_xlabel('年月')
    axes[1].set_ylabel('地域')
    
    plt.tight_layout()
    plt.savefig('regional_analysis.png', dpi=300, bbox_inches='tight')
    plt.show()
    
    return regional_sales

def sales_person_analysis(self):
    """
    担当者別売上分析
    """
    person_sales = self.df.groupby('担当者')['売上金額'].agg([
        'sum', 'count', 'mean'
    ]).reset_index()
    person_sales.columns = ['担当者', '売上合計', '取引件数', '平均売上']
    person_sales = person_sales.sort_values('売上合計', ascending=True)
    
    # 水平棒グラフ
    plt.figure(figsize=(10, 8))
    bars = plt.barh(person_sales['担当者'], person_sales['売上合計'], alpha=0.7)
    
    # 色分け（上位20%を強調）
    threshold = person_sales['売上合計'].quantile(0.8)
    for i, bar in enumerate(bars):
        if person_sales.iloc[i]['売上合計'] >= threshold:
            bar.set_color('gold')
    
    plt.xlabel('売上金額（円）')
    plt.ylabel('担当者')
    plt.title('担当者別売上実績')
    plt.tight_layout()
    plt.savefig('sales_person_analysis.png', dpi=300, bbox_inches='tight')
    plt.show()
    
    return person_sales
```

### 6. 異常値検出と予測

```python
def detect_anomalies(self):
    """
    売上の異常値検出
    """
    # 日次売上集計
    daily_sales = self.df.groupby('日付')['売上金額'].sum().reset_index()
    
    # IQRメソッドによる異常値検出
    Q1 = daily_sales['売上金額'].quantile(0.25)
    Q3 = daily_sales['売上金額'].quantile(0.75)
    IQR = Q3 - Q1
    
    lower_bound = Q1 - 1.5 * IQR
    upper_bound = Q3 + 1.5 * IQR
    
    anomalies = daily_sales[
        (daily_sales['売上金額'] < lower_bound) | 
        (daily_sales['売上金額'] > upper_bound)
    ]
    
    # 可視化
    plt.figure(figsize=(12, 6))
    plt.plot(daily_sales['日付'], daily_sales['売上金額'], alpha=0.7, label='日次売上')
    plt.scatter(anomalies['日付'], anomalies['売上金額'], 
                color='red', s=50, label=f'異常値 ({len(anomalies)}件)')
    plt.axhline(y=upper_bound, color='red', linestyle='--', alpha=0.5, label='上限閾値')
    plt.axhline(y=lower_bound, color='red', linestyle='--', alpha=0.5, label='下限閾値')
    
    plt.xlabel('日付')
    plt.ylabel('売上金額（円）')
    plt.title('売上異常値検出')
    plt.legend()
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.savefig('anomaly_detection.png', dpi=300, bbox_inches='tight')
    plt.show()
    
    print(f"検出された異常値: {len(anomalies)} 件")
    return anomalies

def simple_forecast(self):
    """
    簡易売上予測（移動平均）
    """
    from sklearn.linear_model import LinearRegression
    
    # 月次売上データ準備
    monthly_sales = self.df.groupby('年月')['売上金額'].sum().reset_index()
    monthly_sales['月番号'] = range(len(monthly_sales))
    
    # 線形回帰による予測
    X = monthly_sales[['月番号']]
    y = monthly_sales['売上金額']
    
    model = LinearRegression()
    model.fit(X, y)
    
    # 次の3ヶ月予測
    future_months = np.array([[len(monthly_sales)], 
                             [len(monthly_sales) + 1], 
                             [len(monthly_sales) + 2]])
    predictions = model.predict(future_months)
    
    # 可視化
    plt.figure(figsize=(12, 6))
    plt.plot(monthly_sales['月番号'], monthly_sales['売上金額'], 
             'o-', label='実績', linewidth=2)
    plt.plot(future_months.flatten(), predictions, 
             'ro-', label='予測', linewidth=2)
    
    plt.xlabel('月（通算）')
    plt.ylabel('売上金額（円）')
    plt.title('売上予測（線形回帰）')
    plt.legend()
    plt.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.savefig('sales_forecast.png', dpi=300, bbox_inches='tight')
    plt.show()
    
    print("今後3ヶ月の売上予測:")
    for i, pred in enumerate(predictions, 1):
        print(f"{i}ヶ月後: {pred:,.0f} 円")
    
    return predictions
```

### 7. レポート生成

```python
def generate_report(self):
    """
    分析結果をまとめたレポートを生成
    """
    from reportlab.lib.pagesizes import letter, A4
    from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph
    from reportlab.lib.styles import getSampleStyleSheet
    from reportlab.lib import colors
    
    # レポートファイル作成
    doc = SimpleDocTemplate("sales_analysis_report.pdf", pagesize=A4)
    styles = getSampleStyleSheet()
    story = []
    
    # タイトル
    title = Paragraph("売上データ分析レポート", styles['Title'])
    story.append(title)
    
    # 基本統計
    basic_stats = self.basic_statistics()
    stats_data = [
        ['項目', '値'],
        ['総売上', f"{basic_stats['total_sales']:,.0f} 円"],
        ['平均売上', f"{basic_stats['average_sales']:,.0f} 円"],
        ['商品数', f"{basic_stats['unique_products']} 個"],
        ['地域数', f"{basic_stats['unique_regions']} 地域"]
    ]
    
    stats_table = Table(stats_data)
    stats_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 14),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    
    story.append(stats_table)
    
    # PDFファイル生成
    doc.build(story)
    print("レポートが生成されました: sales_analysis_report.pdf")

# メイン実行
if __name__ == "__main__":
    # 分析実行
    analyzer = SalesAnalyzer("sales_data.csv")
    
    # 各種分析実行
    analyzer.basic_statistics()
    analyzer.monthly_trend_analysis()
    analyzer.category_analysis()
    analyzer.regional_analysis()
    analyzer.sales_person_analysis()
    analyzer.detect_anomalies()
    analyzer.simple_forecast()
    analyzer.generate_report()
    
    print("分析完了！生成されたファイル:")
    print("- monthly_trend.png")
    print("- category_analysis.png")
    print("- regional_analysis.png")
    print("- sales_person_analysis.png")
    print("- anomaly_detection.png")
    print("- sales_forecast.png")
    print("- sales_analysis_report.pdf")
```

## 学習ポイント

### ChatGPTの効果的な使用方法
1. **具体的なデータ形式の提示**: 実際のCSV構造を示す
2. **段階的な質問**: 基本→応用の順で質問
3. **エラー解決**: エラーメッセージを含めて質問
4. **可視化の要求**: グラフの種類やデザインを具体的に指定

### Pythonデータ分析の基礎
1. **Pandas**: データフレーム操作の基本
2. **Matplotlib/Seaborn**: 効果的な可視化手法
3. **統計分析**: 基本統計量、異常値検出
4. **レポート生成**: 結果の文書化

### Excel vs Python
- **Excel**: 手作業、視覚的操作、小規模データ
- **Python**: 自動化、再現性、大規模データ対応

## 所要時間
- 環境構築: 1時間
- 基本分析実装: 2-3時間
- 高度な分析追加: 1-2時間
- レポート機能: 1時間

## 発展的な学習
1. **データベース連携**: SQL、PostgreSQL
2. **Webダッシュボード**: Streamlit、Dash
3. **機械学習**: scikit-learn、時系列予測
4. **自動化**: スケジュール実行、メール通知

## 参考リンク
- [Pandas Documentation](https://pandas.pydata.org/docs/)
- [Matplotlib Gallery](https://matplotlib.org/stable/gallery/)
- [Jupyter Notebook](https://jupyter.org/)
- [Anaconda](https://www.anaconda.com/)