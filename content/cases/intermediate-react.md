# 中級者：Reactアプリ開発

## 概要

プログラミング基礎知識のある人が、GitHub CopilotとCursorエディタを活用してReact + TypeScriptでTODOアプリを開発する実践例です。

## 対象者
- JavaScript/HTML/CSSの基礎知識がある方
- Reactを学習中・学習済みの方
- AI支援開発ツールを効率的に活用したい方

## 使用ツール
- **GitHub Copilot**: AI powered コード補完
- **Cursor**: AI統合エディタ
- **React 18**: UIライブラリ
- **TypeScript**: 型安全性
- **Vite**: 高速ビルドツール
- **Tailwind CSS**: ユーティリティファーストCSS

## 成果物
高機能TODOアプリケーション（React + TypeScript）

### 主な機能
1. タスクの追加・削除・編集
2. タスクの完了状態管理
3. カテゴリ分類機能
4. 優先度設定
5. フィルタリング・検索
6. ローカルストレージでのデータ永続化
7. ダークモード切り替え

## 実装手順

### 1. プロジェクト初期化

```bash
# Viteを使用してReact TypeScriptプロジェクトを作成
npm create vite@latest todo-app -- --template react-ts
cd todo-app
npm install

# Tailwind CSSの追加
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 追加ライブラリのインストール
npm install lucide-react date-fns uuid
npm install -D @types/uuid
```

### 2. 型定義の作成

GitHub Copilotを活用してコメントベース開発：

```typescript
// src/types/todo.ts
// TODOアプリケーションに必要な型定義を作成

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
}

export interface TodoFilter {
  status: 'all' | 'active' | 'completed';
  category: string;
  priority?: 'low' | 'medium' | 'high';
  searchQuery: string;
}

export interface TodoStats {
  total: number;
  completed: number;
  active: number;
  overdue: number;
}
```

### 3. カスタムフックの実装

CursorのAI機能を使用してロジックを実装：

```typescript
// src/hooks/useTodos.ts
// TODOの状態管理とローカルストレージ連携を行うカスタムフック

import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Todo, TodoFilter, TodoStats } from '../types/todo';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoFilter>({
    status: 'all',
    category: 'all',
    searchQuery: '',
  });

  // ローカルストレージからデータを読み込み
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      const parsedTodos = JSON.parse(savedTodos);
      setTodos(parsedTodos.map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        updatedAt: new Date(todo.updatedAt),
        dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
      })));
    }
  }, []);

  // データ変更時にローカルストレージに保存
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // 新しいTODOを追加
  const addTodo = useCallback((todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTodo: Todo = {
      ...todoData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTodos(prev => [newTodo, ...prev]);
  }, []);

  // TODOを更新
  const updateTodo = useCallback((id: string, updates: Partial<Todo>) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id 
        ? { ...todo, ...updates, updatedAt: new Date() }
        : todo
    ));
  }, []);

  // TODOを削除
  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);

  // TODOの完了状態を切り替え
  const toggleTodo = useCallback((id: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id 
        ? { ...todo, completed: !todo.completed, updatedAt: new Date() }
        : todo
    ));
  }, []);

  // フィルタリングされたTODOリストを取得
  const filteredTodos = todos.filter(todo => {
    // ステータスフィルタ
    if (filter.status === 'active' && todo.completed) return false;
    if (filter.status === 'completed' && !todo.completed) return false;
    
    // カテゴリフィルタ
    if (filter.category !== 'all' && todo.category !== filter.category) return false;
    
    // 優先度フィルタ
    if (filter.priority && todo.priority !== filter.priority) return false;
    
    // 検索クエリフィルタ
    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      return todo.title.toLowerCase().includes(query) ||
             (todo.description?.toLowerCase().includes(query) ?? false);
    }
    
    return true;
  });

  // 統計情報を計算
  const stats: TodoStats = {
    total: todos.length,
    completed: todos.filter(todo => todo.completed).length,
    active: todos.filter(todo => !todo.completed).length,
    overdue: todos.filter(todo => 
      todo.dueDate && 
      !todo.completed && 
      todo.dueDate < new Date()
    ).length,
  };

  return {
    todos: filteredTodos,
    allTodos: todos,
    filter,
    stats,
    setFilter,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
  };
};
```

### 4. メインコンポーネントの実装

GitHub Copilotのコメント駆動開発を活用：

```tsx
// src/components/TodoApp.tsx
// メインのTODOアプリケーションコンポーネント

import React, { useState } from 'react';
import { Plus, Search, Filter, Moon, Sun } from 'lucide-react';
import { useTodos } from '../hooks/useTodos';
import { TodoList } from './TodoList';
import { TodoForm } from './TodoForm';
import { TodoStats } from './TodoStats';
import { TodoFilters } from './TodoFilters';

export const TodoApp: React.FC = () => {
  const {
    todos,
    filter,
    stats,
    setFilter,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
  } = useTodos();

  const [showForm, setShowForm] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<string | null>(null);

  return (
    <div className={`min-h-screen transition-colors ${
      darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* ヘッダー */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Tasks</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your daily tasks efficiently
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* ダークモード切り替え */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            {/* 新しいタスク追加ボタン */}
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Task
            </button>
          </div>
        </header>

        {/* 統計情報 */}
        <TodoStats stats={stats} />

        {/* フィルタ・検索 */}
        <TodoFilters filter={filter} onFilterChange={setFilter} />

        {/* TODOリスト */}
        <TodoList
          todos={todos}
          onToggle={toggleTodo}
          onUpdate={updateTodo}
          onDelete={deleteTodo}
          selectedTodo={selectedTodo}
          onSelectTodo={setSelectedTodo}
        />

        {/* TODOフォームモーダル */}
        {showForm && (
          <TodoForm
            onSubmit={addTodo}
            onClose={() => setShowForm(false)}
          />
        )}
      </div>
    </div>
  );
};
```

### 5. コンポーネントの詳細実装

各コンポーネントをGitHub Copilotで効率的に実装：

```tsx
// src/components/TodoItem.tsx
// 個別のTODOアイテムコンポーネント

import React, { useState } from 'react';
import { 
  Check, 
  Edit3, 
  Trash2, 
  Calendar, 
  Flag,
  MoreHorizontal 
} from 'lucide-react';
import { Todo } from '../types/todo';
import { format, isOverdue } from '../utils/dateUtils';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
  onDelete: (id: string) => void;
  selected?: boolean;
  onSelect?: (id: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onUpdate,
  onDelete,
  selected = false,
  onSelect,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const priorityColors = {
    low: 'text-green-500',
    medium: 'text-yellow-500',
    high: 'text-red-500',
  };

  const overdue = todo.dueDate && isOverdue(todo.dueDate) && !todo.completed;

  return (
    <div className={`
      p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border-l-4 transition-all
      ${todo.completed ? 'border-green-500 opacity-75' : ''}
      ${overdue ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}
      ${selected ? 'ring-2 ring-blue-500' : ''}
      hover:shadow-md cursor-pointer
    `}>
      <div className="flex items-start gap-3">
        {/* チェックボックス */}
        <button
          onClick={() => onToggle(todo.id)}
          className={`
            flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
            ${todo.completed 
              ? 'bg-green-500 border-green-500 text-white' 
              : 'border-gray-300 hover:border-green-500'
            }
          `}
        >
          {todo.completed && <Check className="w-3 h-3" />}
        </button>

        {/* コンテンツ */}
        <div className="flex-1 min-w-0" onClick={() => onSelect?.(todo.id)}>
          <h3 className={`
            font-medium text-lg mb-1
            ${todo.completed ? 'line-through text-gray-500' : ''}
          `}>
            {todo.title}
          </h3>
          
          {todo.description && (
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
              {todo.description}
            </p>
          )}

          {/* メタデータ */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className={`flex items-center gap-1 ${priorityColors[todo.priority]}`}>
              <Flag className="w-3 h-3" />
              {todo.priority}
            </span>
            
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
              {todo.category}
            </span>
            
            {todo.dueDate && (
              <span className={`flex items-center gap-1 ${overdue ? 'text-red-500' : ''}`}>
                <Calendar className="w-3 h-3" />
                {format(todo.dueDate, 'MMM dd')}
              </span>
            )}
          </div>
        </div>

        {/* アクションメニュー */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Edit3 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => onDelete(todo.id)}
                className="flex items-center gap-2 w-full px-3 py-2 text-left text-red-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
```

## 学習ポイント

### AI支援開発の効果的な活用方法
1. **コメント駆動開発**: コメントで意図を明確に表現
2. **段階的実装**: 小さな機能から始めて徐々に拡張
3. **型定義優先**: TypeScriptの型を先に定義
4. **パターン学習**: 類似コードのパターンを認識させる

### React + TypeScript のベストプラクティス
1. **カスタムフック**: ロジックの分離と再利用
2. **適切な型定義**: バグの早期発見
3. **メモ化**: パフォーマンス最適化
4. **コンポーネント設計**: 単一責任の原則

### 状態管理とデータ永続化
1. **ローカルストレージ**: ブラウザでのデータ保持
2. **useEffect**: 副作用の適切な管理
3. **useCallback**: 不要な再レンダリングの防止

## 所要時間
- プロジェクト初期化: 30分
- 基本機能実装: 3-4時間
- UI/UX改善: 2-3時間
- テスト・デバッグ: 1-2時間

## 拡張アイデア
1. **サーバーサイド連携**: REST API、GraphQL
2. **リアルタイム同期**: WebSocket、Firebase
3. **PWA化**: オフライン対応、プッシュ通知
4. **テスト追加**: Jest、React Testing Library

## 参考リンク
- [React 18 Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/)
- [GitHub Copilot](https://github.com/features/copilot)