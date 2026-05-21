# 自己PR自動生成機能 設計仕様書

**日付:** 2026-05-21  
**ステータス:** 承認済み

---

## 概要

職務経歴データを Google Gemini AI に渡し、自己PR（`profile.selfPromotion`）を自動生成する機能を追加する。

---

## 要件

### 機能要件

- 「自己PRを生成」ボタンを押すと、入力済みの職務経歴データをもとに AI が自己PR文を生成する
- 生成結果は自己PRテキストエリアに自動入力される（既存内容は上書き）
- API キーが設定されていない場合、ボタンを非表示にする
- 生成中はボタンをローディング状態にし、二重送信を防ぐ
- エラー発生時はボタン下にエラーメッセージを表示する

### 非機能要件

- API キーは `.env` ファイル（`VITE_GOOGLE_AI_API_KEY`）で管理し、バックエンドは追加しない
- `.env` は `.gitignore` 対象とし、`.env.example` にキー名のみ記載する

---

## アーキテクチャ

### ファイル構成

```
.env                                       ← VITE_GOOGLE_AI_API_KEY を追加（git管理外）
.env.example                               ← キー名のみ記載（git管理対象）
src/
  hooks/
    useGenerateSelfPromotion.ts            ← 新規: AI生成ロジック
  components/Editor/
    BasicInfoSection.tsx                   ← 修正: ボタン・ローディング・エラー表示を追加
```

### パッケージ

```
@google/generative-ai   ← Google 公式 Gemini SDK
```

---

## 実装詳細

### `useGenerateSelfPromotion.ts`

```ts
interface UseGenerateSelfPromotionReturn {
  isAvailable: boolean             // APIキーが設定されているか
  generate: () => Promise<string | null>
  isLoading: boolean
  error: string | null
}
```

**責務:**
1. `import.meta.env.VITE_GOOGLE_AI_API_KEY` を読み取り、未設定なら `isAvailable: false` を返す
2. `resume.workExperiences` から以下フィールドのみ抽出してプロンプトを構築
   - `project.details`（プロジェクト詳細）
   - `project.workContent`（作業内容）
   - `project.responsibilities`（担当内容）
   - `project.assignedTasks`（担当タスク）
   - `project.star`（STAR: situation / task / action / result）
   - ※ 会社名・プロジェクト名は除外
3. Gemini 2.0 Flash（`gemini-2.0-flash`）に送信
4. レスポンステキストを返す

**プロンプト方針:**
- 採用担当者向けに 400〜600 文字で自己PRを書くよう指示
- 複数プロジェクトの情報を統合し、強みと実績を自然な文体で表現させる
- 出力は本文のみ（見出し・箇条書き不要）

### `BasicInfoSection.tsx` の変更

- `useGenerateSelfPromotion` を呼び出し、`apiKeyAvailable` が `true` の場合のみボタンをレンダリング
- `setValue('profile.selfPromotion', generated)` で react-hook-form のフィールドを更新
- ボタンの状態管理:

| 状態       | 表示                        |
|------------|----------------------------|
| 通常       | ✨ 自己PRを生成              |
| 生成中     | 生成中...（disabled）       |
| エラー     | ボタン下にエラーメッセージ   |

---

## データフロー

```
BasicInfoSection
  └── useGenerateSelfPromotion(resumeData)
        └── プロンプト構築（会社名・PJ名除外）
              └── @google/generative-ai SDK
                    └── Gemini 2.0 Flash API
                          └── 生成テキスト
                                └── setValue('profile.selfPromotion', text)
```

---

## 環境変数

| キー                      | 説明                      |
|---------------------------|---------------------------|
| `VITE_GOOGLE_AI_API_KEY`  | Google AI Studio の API キー |

---

## セキュリティ考慮事項

- API キーはクライアントサイドのビルド成果物に含まれる（個人利用ツールのため許容）
- `.env` は `.gitignore` で除外済みであることを確認する
- `.env.example` にはキー名のみ記載し、値は含めない

---

## 除外スコープ

- プロンプトのカスタマイズ UI（文字数指定・トーン選択など）
- 生成履歴の保存
- ストリーミングレスポンス
