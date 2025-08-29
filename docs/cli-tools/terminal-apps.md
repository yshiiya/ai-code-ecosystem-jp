# ターミナルエミュレータ 完全ガイド

## 🖥️ 主要ターミナルアプリケーション

### Mac向け

#### iTerm2
- **開発元**: George Nachman
- **料金**: 無料
- **特徴**: Mac最強のターミナル

**主要機能**
- 分割ペイン（横/縦）
- ホットキーウィンドウ
- 検索機能強化
- tmux統合
- プロファイル管理
- トリガー・自動応答
- Shell Integration

**インストール**
```bash
brew install --cask iterm2
```

**おすすめ設定**
```bash
# GPU レンダリング有効化
Preferences → Advanced → Drawing → GPU Rendering

# ホットキー設定
Preferences → Keys → Hotkey → Show/hide with hotkey

# 無限スクロールバック
Preferences → Profiles → Terminal → Unlimited scrollback
```

---

#### Warp
- **開発元**: Warp Terminal Inc.
- **料金**: 無料（Pro版あり）
- **特徴**: AI搭載の次世代ターミナル

**AI機能**
- コマンド提案
- エラー解説
- 自然言語→コマンド変換
- ワークフロー保存

**インストール**
```bash
brew install --cask warp
```

---

#### Alacritty
- **開発元**: Joe Wilm
- **料金**: 無料（オープンソース）
- **特徴**: GPU高速レンダリング

**設定ファイル**
```yaml
# ~/.config/alacritty/alacritty.yml
window:
  opacity: 0.95
  padding:
    x: 10
    y: 10

font:
  size: 14
  normal:
    family: "JetBrains Mono"

colors:
  primary:
    background: '#1e1e2e'
    foreground: '#cdd6f4'
```

---

### Windows向け

#### Windows Terminal
- **開発元**: Microsoft
- **料金**: 無料
- **特徴**: Windows公式モダンターミナル

**主要機能**
- タブ・ペイン分割
- GPU アクセラレーション
- カスタムテーマ
- WSL/PowerShell/CMD統合
- JSON設定

**インストール**
```powershell
winget install Microsoft.WindowsTerminal
```

**設定例**
```json
{
  "defaultProfile": "{guid}",
  "profiles": {
    "defaults": {
      "fontFace": "Cascadia Code",
      "fontSize": 12,
      "useAcrylic": true,
      "acrylicOpacity": 0.9
    }
  },
  "keybindings": [
    {
      "command": "newTab",
      "keys": "ctrl+t"
    }
  ]
}
```

---

#### Hyper
- **開発元**: Vercel
- **料金**: 無料（オープンソース）
- **特徴**: Electron製、プラグイン豊富

**プラグイン例**
```javascript
// ~/.hyper.js
module.exports = {
  plugins: [
    'hyper-dracula',
    'hyper-search',
    'hyper-pane',
    'hypercwd',
    'hyperpower'  // タイピングエフェクト
  ]
};
```

---

### Linux向け

#### Terminator
- **料金**: 無料
- **特徴**: 高度な分割機能

**インストール**
```bash
# Ubuntu/Debian
sudo apt install terminator

# Fedora
sudo dnf install terminator

# Arch
sudo pacman -S terminator
```

---

#### Kitty
- **開発元**: Kovid Goyal
- **料金**: 無料（オープンソース）
- **特徴**: GPU高速、独自プロトコル

**設定**
```conf
# ~/.config/kitty/kitty.conf
font_family      JetBrains Mono
font_size        12.0
background_opacity 0.95

# レイアウト
enabled_layouts tall,grid,horizontal

# ショートカット
map ctrl+shift+enter new_window
map ctrl+shift+t new_tab
```

---

## 🔄 クロスプラットフォーム

### Tabby (旧Terminus)
- **料金**: 無料
- **特徴**: Electron製、美しいUI

**特徴**
- シリアルポート対応
- SSH管理機能
- カスタムCSS
- プラグインシステム

---

## 📊 比較表

| ターミナル | OS | GPU | AI | 分割 | tmux | 価格 |
|-----------|----|----|----|----|------|------|
| iTerm2 | Mac | ○ | × | ◎ | ◎ | 無料 |
| Warp | Mac | ○ | ◎ | ○ | △ | 無料〜 |
| Alacritty | All | ◎ | × | × | ○ | 無料 |
| Windows Terminal | Win | ○ | × | ○ | △ | 無料 |
| Hyper | All | △ | × | ○ | △ | 無料 |
| Kitty | Unix | ◎ | × | ◎ | ○ | 無料 |

## 🎨 カスタマイズ

### カラースキーム
```bash
# 人気のテーマ
- Dracula
- Nord
- Tokyo Night
- Catppuccin
- Gruvbox
- Solarized
```

### フォント設定
```bash
# プログラミング向けフォント
- JetBrains Mono (リガチャ対応)
- Fira Code (リガチャ対応)
- Source Code Pro
- Hack
- Cascadia Code (Windows)

# 日本語対応
- HackGen
- Cica
- Ricty
```

## ⚡ パフォーマンスチューニング

### GPU アクセラレーション
```bash
# 確認方法
- iTerm2: Preferences → Advanced → Drawing
- Windows Terminal: 自動有効
- Alacritty: デフォルトで有効
```

### バッファ設定
```bash
# スクロールバック行数
- 開発: 10,000行
- デバッグ: 無制限
- 通常: 1,000行
```

## 🔌 統合機能

### Claude Code連携
```bash
# iTerm2
Shell Integration → claude-code 自動認識

# Windows Terminal
Profile 追加でClaude Code専用タブ

# Warp
AI機能でClaude Code補完
```

### Git統合
```bash
# ステータス表示
- プロンプトにブランチ名
- 変更ファイル数表示
- Push/Pull状態
```

## 🚀 生産性向上設定

### ホットキー
```bash
# グローバルホットキー
- 呼び出し: Cmd+Space (Mac)
- 最小化: Cmd+M
- フルスクリーン: Cmd+Enter
```

### スニペット
```bash
# iTerm2 Triggers
正規表現 → アクション

# Windows Terminal
SendInput でカスタムコマンド
```

## 📱 モバイル連携

### リモートアクセス
- **Termius**: iOS/Android対応
- **Prompt**: iOS専用
- **JuiceSSH**: Android専用

## 🔐 セキュリティ

### セッション保護
```bash
# パスワードロック
- iTerm2: Secure Keyboard Entry
- Windows Terminal: 管理者権限分離
```

### ログ管理
```bash
# セッションログ
- 自動保存設定
- タイムスタンプ付与
- 暗号化保存
```

## 🎯 用途別推奨

### AI開発
**推奨**: Warp
- AI補完機能
- エラー解説
- ワークフロー保存

### サーバー管理
**推奨**: iTerm2 (Mac) / Windows Terminal
- tmux統合
- 複数セッション管理
- プロファイル切り替え

### 軽量環境
**推奨**: Alacritty
- 最速起動
- 最小メモリ使用
- シンプル設定

---
*最終更新: 2025年8月30日*