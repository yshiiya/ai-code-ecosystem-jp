# 初心者：HTMLページ作成

## 概要

プログラミング未経験者が、AIツール（ChatGPT）とVS Codeを使用して、自己紹介サイトを作成する実践例です。

## 対象者
- プログラミング未経験者
- HTML/CSSの基礎を学びたい方
- AIツールを活用した開発に興味がある方

## 使用ツール
- **ChatGPT**: コード生成とアドバイス
- **VS Code**: コードエディタ
- **Live Server**: ローカル開発サーバー
- **Bootstrap 5**: CSSフレームワーク

## 成果物
レスポンシブ対応の自己紹介サイト（HTML/CSS/JavaScript）

### 主な機能
1. ヘッダーナビゲーション
2. プロフィールセクション
3. スキル・経験表示
4. ポートフォリオギャラリー
5. お問い合わせフォーム

## 実装手順

### 1. 基本構造の作成

ChatGPTに以下のプロンプトを送信：

```
自己紹介サイトのHTML構造を作成してください。
以下のセクションを含めて：
- ヘッダー（ナビゲーション付き）
- プロフィールセクション
- スキルセクション
- ポートフォリオセクション
- お問い合わせセクション

Bootstrap 5を使用して、モバイルフレンドリーにしてください。
```

### 2. スタイリングの追加

生成されたHTMLに対して、以下をChatGPTに依頼：

```
上記のHTMLに対して、以下の要件でCSSスタイルを作成してください：
- モダンで清潔なデザイン
- レスポンシブ対応
- カラーパレット：ブルーとグレーを基調
- アニメーション効果の追加
```

### 3. JavaScript機能の実装

インタラクティブ要素のJavaScriptを追加：

```
以下の機能を実装するJavaScriptを書いてください：
- スムーススクロール機能
- モバイルメニューのトグル
- お問い合わせフォームのバリデーション
- スクロール時のナビゲーションハイライト
```

### 4. 最終調整

完成したコードに対して微調整：

```
コードを見直して、以下の改善を行ってください：
- SEOに配慮したメタタグの追加
- アクセシビリティの向上
- パフォーマンス最適化
- コメント追加
```

## コード例

### HTML構造（抜粋）

```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>田中太郎 - Web Developer</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="style.css" rel="stylesheet">
</head>
<body>
    <!-- ナビゲーション -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white fixed-top shadow-sm">
        <div class="container">
            <a class="navbar-brand fw-bold text-primary" href="#home">田中太郎</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item"><a class="nav-link" href="#about">About</a></li>
                    <li class="nav-item"><a class="nav-link" href="#skills">Skills</a></li>
                    <li class="nav-item"><a class="nav-link" href="#portfolio">Portfolio</a></li>
                    <li class="nav-item"><a class="nav-link" href="#contact">Contact</a></li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- ヒーローセクション -->
    <section id="home" class="hero-section d-flex align-items-center">
        <div class="container">
            <div class="row">
                <div class="col-lg-6">
                    <h1 class="display-4 fw-bold mb-3">Hello, I'm 田中太郎</h1>
                    <p class="lead mb-4">Web Developer passionate about creating amazing user experiences</p>
                    <a href="#contact" class="btn btn-primary btn-lg">Get In Touch</a>
                </div>
            </div>
        </div>
    </section>
</body>
</html>
```

### CSS（抜粋）

```css
/* カスタムスタイル */
:root {
    --primary-color: #007bff;
    --secondary-color: #6c757d;
    --accent-color: #17a2b8;
    --light-bg: #f8f9fa;
}

.hero-section {
    min-height: 100vh;
    background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
    color: white;
}

.navbar {
    transition: all 0.3s ease;
}

.navbar.scrolled {
    background-color: rgba(255, 255, 255, 0.95) !important;
    backdrop-filter: blur(10px);
}

/* アニメーション */
.fade-in {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s ease;
}

.fade-in.visible {
    opacity: 1;
    transform: translateY(0);
}
```

### JavaScript（抜粋）

```javascript
// スムーススクロール
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// スクロール時のナビゲーション効果
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// フェードインアニメーション
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});
```

## 学習ポイント

### AIツールの効果的な使用方法
1. **具体的な要求**: 曖昧な指示ではなく、具体的な機能や見た目を指定
2. **段階的な開発**: 一度にすべてを要求せず、段階的に機能を追加
3. **継続的な改善**: 生成されたコードを確認し、改善点を指摘

### HTML/CSS/JavaScriptの基礎
1. **セマンティックHTML**: 意味のあるタグの使用
2. **レスポンシブデザイン**: モバイルファーストの考え方
3. **モダンCSS**: Flexbox、Grid、カスタムプロパティの活用
4. **バニラJavaScript**: ライブラリに依存しない基本的な操作

## 所要時間
- 初回作成: 2-3時間
- カスタマイズ: 1-2時間
- 最終調整: 30分-1時間

## 次のステップ
1. **機能拡張**: ブログ機能やCMSの統合
2. **フレームワーク学習**: React、Vue.jsへの移行
3. **バックエンド連携**: Node.js、PHPとの連携
4. **デプロイメント**: Netlify、Vercelでの公開

## 参考リンク
- [Bootstrap 5 Documentation](https://getbootstrap.com/docs/5.1/getting-started/introduction/)
- [HTML5 Semantic Elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [JavaScript DOM Manipulation](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)