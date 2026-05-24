# 目次から基本情報を削除 設計

**日付:** 2026-05-24

## 変更内容

`src/components/Preview/PreviewTOC.tsx` の21〜29行目にある「基本情報」のハードコードされた `<li>` ブロックを削除する。

変更後、目次には `sectionOrder` の内容（職務要約・スキルスタック・自己PR・職務経歴）のみが表示される。

## 変更ファイル

| ファイル | 変更種別 |
|---------|---------|
| `src/components/Preview/PreviewTOC.tsx` | 修正（削除のみ） |
