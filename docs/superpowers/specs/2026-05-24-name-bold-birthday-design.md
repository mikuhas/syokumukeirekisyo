# 名前の太字削除・誕生日フィールド追加 設計

**日付:** 2026-05-24

## 変更1: 名前の太字を外す

`src/styles/preview.css` 148行目の `.resume-date-block .name` から `font-weight: bold` を削除する。

## 変更2: 誕生日フィールドの追加

### スキーマ (`src/schema/resumeSchema.ts`)

`ProfileSchema` に以下を追加:
```ts
birthday: z.string().optional(),
```

日付は `"YYYY-MM-DD"` 形式の文字列として保存する。

### フォーム (`src/components/Editor/BasicInfoSection.tsx`)

名前フィールドの直下に誕生日入力欄を追加:
```tsx
<div className="form-group">
  <label>生年月日</label>
  <input type="date" {...register('profile.birthday')} />
</div>
```

### プレビュー (`src/components/Preview/Profile.tsx`)

誕生日が入力されている場合、名前の隣に `(満 X 歳)` を表示。未入力なら名前のみ。

年齢計算関数（Profile.tsx 内に定義）:
```ts
function calcAge(birthday: string): number {
  const today = new Date();
  const birth = new Date(birthday);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}
```

表示例: `山田太郎(満 20 歳)`

### 変更ファイル一覧

| ファイル | 変更種別 | 内容 |
|---------|---------|------|
| `src/styles/preview.css` | 修正 | `font-weight: bold` を削除 |
| `src/schema/resumeSchema.ts` | 修正 | `birthday` フィールドを追加 |
| `src/components/Editor/BasicInfoSection.tsx` | 修正 | 生年月日入力欄を追加 |
| `src/components/Preview/Profile.tsx` | 修正 | 年齢計算と表示を追加 |

## 対象外

- バリデーション（未来日付の禁止など）: スコープ外
- 年齢の自己PR/職務要約への反映: スコープ外
