# PDF改ページ制御 設計仕様書

**日付:** 2026-05-20  
**ステータス:** 承認済み

---

## 概要

プロジェクト詳細セル内の小ブロック（作業内容・担当業務・使用技術）が PDF 出力時に途中で切れないよう制御する。プロジェクト自体がページをまたぐことは許容し、ブロック単位で改ページを制御する。

---

## 設計

### アプローチ

各「見出し＋内容」ペアを `<div className="project-sub-block">` でラップし、CSS で `break-inside: avoid` を付与する。

### 変更ファイル

| ファイル | 変更内容 |
|---|---|
| `src/components/Preview/Project.tsx` | 作業内容・担当業務・使用技術の各ブロックを `project-sub-block` div でラップ |
| `src/styles/preview-project.css` | `.project-sub-block` に `break-inside: avoid` / `page-break-inside: avoid` を追加 |

### HTML構造（変更後）

```tsx
<div className="project-sub-block">
  <div className="project-section-heading">■ 作業内容</div>
  <ul className="project-section-list">...</ul>
</div>
<div className="project-sub-block">
  <div className="project-section-heading">■ 担当業務</div>
  <ul className="project-section-list">...</ul>
</div>
<div className="project-sub-block">
  <div className="project-section-heading">■ 使用技術</div>
  <div className="project-tech-container">...</div>
</div>
```

### CSS

```css
.project-sub-block {
  break-inside: avoid;
  page-break-inside: avoid;
}
```

---

## 制約・注意事項

- ブロックが極端に長い場合（リストが非常に多い等）はブラウザの判断でまたぐ場合がある
- プロジェクト全体のページマタギは引き続き許容
