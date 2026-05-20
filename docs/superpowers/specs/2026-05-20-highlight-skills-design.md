# ハイライトスキル機能 設計仕様書

**日付:** 2026-05-20  
**ステータス:** 承認済み

---

## 概要

スキルスタックの中から最大3つのスキルを選び、経験年数とともにリッチなデザインで表示する機能を追加する。スキルスタックセクションの冒頭に円形プログレスバーとして表示し、採用担当者が主要スキルを一目で把握できるようにする。

---

## データモデル

### スキーマ変更（`src/schema/resumeSchema.ts`）

`ProfileSchema` に `highlightSkills` フィールドを追加する。

```ts
highlightSkills: z.array(z.object({
  name:  z.string(),
  years: z.number().min(0),
})).max(3).optional()
```

- スキル名と経験年数のペアを最大3つ保持する
- `profile.highlightSkills` として保存（スキルスタック本体 `workExperiences[].projects[].techStack` とは独立）
- 未設定・0件の場合はプレビューにセクション自体を表示しない

---

## フォームUI

### 配置

`BasicInfoSection.tsx` 内、自己PRフィールドの下に「ハイライトスキル」セクションを追加する。

### レイアウト

- ヘッダー行（ラベル：「スキル名」「経験年数」）
- 3行固定のスロット（各行：スキル名ドロップダウン + 経験年数入力 + 削除ボタン）
- ドロップダウンは `watch('workExperiences')` で集約した全技術名リストを選択肢として提供する
- 経験年数は `<input type="number" min="0">` で入力
- 削除ボタン（✕）でそのスロットをクリア

### データフロー

`FormEditor` が `watch('workExperiences')` から技術名を集約し、`skillOptions: string[]` として `BasicInfoSection` に prop で渡す。`useFieldArray` で `profile.highlightSkills` を管理する。

---

## プレビューUI

### 配置

`SkillStackSection.tsx` の冒頭（既存のスキルスタック一覧の上）に追加する。

### 表示仕様

- `profile.highlightSkills` が1件以上存在する場合のみ表示する
- 最大3つの円形プログレスバーを横並びで表示する
- 下部は区切り線を挟んで既存のスキルスタック一覧が続く

### 円形プログレスバー仕様

- SVG実装（`viewBox="0 0 88 88"`、半径36px）
- トラック（背景円弧）：`stroke="#e5e7eb"`、`stroke-width="6"`
- フィル（進捗円弧）：`stroke="#162333"`、`stroke-width="6"`、`stroke-linecap="round"`
- 基準値：表示中の最大経験年数（例：5年・4年・2年なら5年が100%）
- 充填率：`(years / maxYears) * circumference`（circumference = 2π × 36 ≈ 226.2）
- 開始位置：12時方向（`transform="rotate(-90 44 44)"`）
- 中央テキスト：年数（大）＋「年」（小）
- 下部テキスト：スキル名（bold）

---

## 影響ファイル

| ファイル | 変更内容 |
|---|---|
| `src/schema/resumeSchema.ts` | `highlightSkills` フィールドを `ProfileSchema` に追加、型エクスポート |
| `src/components/Editor/BasicInfoSection.tsx` | ハイライトスキルフォームセクションを追加、`skillOptions` prop を受け取る |
| `src/components/Editor/FormEditor.tsx` | 技術名集約ロジックを追加し `BasicInfoSection` に渡す |
| `src/components/Preview/SkillStackSection.tsx` | 円形プログレスバーコンポーネントを追加・先頭表示 |
| `src/styles/preview.css` または新規CSSファイル | ハイライトスキルのレイアウトスタイル |

---

## 制約・注意事項

- スキルスタックが未登録の場合でもフォームは表示する（ドロップダウンが空になる）
- PDF印刷時にSVGが正しくレンダリングされること（`print-color-adjust: exact` は不要、SVGは印刷対応済み）
- `highlightSkills` の年数は整数・小数どちらも許容する（例：1.5年）
