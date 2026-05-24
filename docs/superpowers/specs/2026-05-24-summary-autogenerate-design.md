# 職務要約 自動生成ボタン設計

**日付:** 2026-05-24  
**対象:** 職務要約フィールドへの AI 生成ボタン追加

## 目的

「自己PR」と同様に、職務経歴データをもとに「職務要約」を Gemini API で自動生成するボタンを追加する。

## 変更ファイル

| ファイル | 変更種別 | 変更内容 |
|---------|---------|---------|
| `src/hooks/useGenerateSummary.ts` | 新規 | 職務要約生成フック |
| `src/components/Editor/BasicInfoSection.tsx` | 修正 | 生成ボタンの追加 |

## フック設計: `useGenerateSummary`

### インターフェース

`useGenerateSelfPromotion` と同一のインターフェースを持つ:

```ts
interface UseGenerateSummaryReturn {
  isAvailable: boolean;   // VITE_GOOGLE_AI_API_KEY が設定されているか
  generate: () => Promise<string | null>;
  isLoading: boolean;
  error: string | null;
}

export function useGenerateSummary(workExperiences: WorkExperience[]): UseGenerateSummaryReturn
```

### プロンプト構成

使用するデータ:
- 会社名 (`company`)
- 在籍期間 (`startDate` 〜 `endDate` or 現在も在籍中)
- 雇用形態 (`employmentStatus`)
- プロジェクトの詳細 (`details`)
- 担当内容 (`workContent`)
- 担当タスク (`assignedTasks`)

生成ルール:
- 自然な日本語の文章（箇条書き・見出しなし）
- 2〜4文、150〜250字程度
- キャリアの時系列の流れと経験業務領域を簡潔にまとめる
- 情報が少ない場合は文字数を無理に増やさない
- 自己PR本文のみ出力（前置き不要）

### API 設定

- モデル: `gemini-3.1-flash-lite`（`useGenerateSelfPromotion` と統一）
- API キー: `import.meta.env.VITE_GOOGLE_AI_API_KEY`
- 二重実行ガード: `useRef` で実装（既存パターンと同じ）

## UI設計: BasicInfoSection の変更

### 追加位置

職務要約テキストエリアの直下に、自己PRボタンと同一スタイルで追加:

```tsx
<div className="generate-self-promotion">
  <Button variant="outline" size="sm" onClick={handleGenerateSummary} disabled={isLoadingSummary}>
    <Sparkles size={14} />
    {isLoadingSummary ? '生成中...' : '職務要約を生成'}
  </Button>
  {summaryError && <p className="generate-self-promotion-error">{summaryError}</p>}
</div>
```

### 生成後の動作

```ts
const result = await generateSummary();
if (result) {
  setValue('profile.summary', result, { shouldDirty: true });
}
```

## 対象外

- 生成履歴や Undo 機能: スコープ外
- プロンプトのユーザーカスタマイズ: スコープ外
- `useGenerateSelfPromotion` の変更: 既存コードはそのまま維持
