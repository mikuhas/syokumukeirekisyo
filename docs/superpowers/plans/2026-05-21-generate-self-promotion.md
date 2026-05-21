# 自己PR自動生成機能 実装計画

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 職務経歴データを Google Gemini AI に渡し、自己PR フィールドを自動生成するボタンを BasicInfoSection に追加する。

**Architecture:** `@google/generative-ai` SDK を使ってフロントエンドから直接 Gemini 2.0 Flash を呼び出す。API キーは `.env.local`（Vite が自動ロード、`*.local` で gitignore 済み）で管理する。生成ロジックは `useGenerateSelfPromotion` フックに分離し、BasicInfoSection はそのフックを呼ぶだけにする。

**Tech Stack:** React 19 + TypeScript + Vite + react-hook-form + `@google/generative-ai`

---

## ファイル構成

| 操作 | ファイル | 変更内容 |
|------|----------|----------|
| 新規作成 | `.env.local` | `VITE_GOOGLE_AI_API_KEY=` を追加（gitignore 済み） |
| 新規作成 | `.env.example` | キー名のみ記載 |
| 新規作成 | `src/hooks/useGenerateSelfPromotion.ts` | Gemini 呼び出しとプロンプト構築ロジック |
| 修正 | `src/components/Editor/BasicInfoSection.tsx` | `setValue` / `workExperiences` props 追加、生成ボタン・ローディング・エラー表示 |
| 修正 | `src/components/Editor/FormEditor.tsx` | BasicInfoSection に `setValue` と `workExperiences` を渡す |

---

## Task 1: パッケージインストールと環境変数ファイルの準備

**Files:**
- Modify: `package.json`（npm install 後に自動更新）
- Create: `.env.local`
- Create: `.env.example`

- [ ] **Step 1: `@google/generative-ai` をインストール**

```bash
npm install @google/generative-ai
```

Expected output: `added 1 package` のような成功メッセージ

- [ ] **Step 2: `.env.local` を作成**

`.env.local` をプロジェクトルートに作成し、以下を記載（実際のキーは Google AI Studio から取得）:

```
VITE_GOOGLE_AI_API_KEY=あなたのAPIキーをここに貼り付ける
```

- [ ] **Step 3: `.env.example` を作成**

`.env.example` をプロジェクトルートに作成:

```
VITE_GOOGLE_AI_API_KEY=
```

- [ ] **Step 4: gitignore の確認**

`.gitignore` に `*.local` が含まれていることを確認（`.env.local` はすでに除外されている）。

`.env.example` はコミット対象なので除外不要。

- [ ] **Step 5: コミット**

```bash
git add .env.example package.json package-lock.json
git commit -m "feat: @google/generative-ai パッケージを追加"
```

---

## Task 2: `useGenerateSelfPromotion` フックを作成

**Files:**
- Create: `src/hooks/useGenerateSelfPromotion.ts`

このフックは WorkExperience の配列を受け取り、Gemini API を呼び出して自己PR文字列を返す。

- [ ] **Step 1: `src/hooks/useGenerateSelfPromotion.ts` を作成**

```typescript
import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { WorkExperience } from '../schema/resumeSchema';

interface UseGenerateSelfPromotionReturn {
  isAvailable: boolean;
  generate: () => Promise<string | null>;
  isLoading: boolean;
  error: string | null;
}

function buildPrompt(workExperiences: WorkExperience[]): string {
  const projectLines = workExperiences.flatMap(exp =>
    exp.projects.map(project => {
      const lines: string[] = [];
      if (project.details) lines.push(`詳細: ${project.details}`);
      if (project.workContent?.length) lines.push(`作業内容: ${project.workContent.join('、')}`);
      if (project.responsibilities?.length) lines.push(`担当内容: ${project.responsibilities.join('、')}`);
      if (project.assignedTasks) lines.push(`担当タスク: ${project.assignedTasks}`);
      if (project.star.situation) lines.push(`状況(Situation): ${project.star.situation}`);
      if (project.star.task) lines.push(`課題(Task): ${project.star.task}`);
      if (project.star.action) lines.push(`行動(Action): ${project.star.action}`);
      if (project.star.result) lines.push(`結果(Result): ${project.star.result}`);
      return lines.join('\n');
    })
  ).filter(s => s.length > 0);

  if (projectLines.length === 0) return '';

  const projectSection = projectLines.map((p, i) => `【プロジェクト${i + 1}】\n${p}`).join('\n\n');

  return `あなたは採用担当者向けの職務経歴書の自己PR文を作成するエキスパートです。
以下の職務経歴情報をもとに、400〜600文字の自己PR文を作成してください。
見出しや箇条書きは使わず、自然な日本語の文章で記述してください。
出力は自己PR本文のみとし、余分な説明は含めないでください。

${projectSection}`;
}

export function useGenerateSelfPromotion(workExperiences: WorkExperience[]): UseGenerateSelfPromotionReturn {
  const apiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY as string | undefined;
  const isAvailable = Boolean(apiKey);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async (): Promise<string | null> => {
    if (!apiKey) return null;

    const prompt = buildPrompt(workExperiences);
    if (!prompt) {
      setError('職務経歴データが入力されていません。');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return text;
    } catch (e) {
      setError(e instanceof Error ? e.message : '生成中にエラーが発生しました。');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { isAvailable, generate, isLoading, error };
}
```

- [ ] **Step 2: TypeScript コンパイルエラーがないか確認**

```bash
npx tsc --noEmit
```

Expected: エラーなし（警告のみの場合は許容）

- [ ] **Step 3: コミット**

```bash
git add src/hooks/useGenerateSelfPromotion.ts
git commit -m "feat: useGenerateSelfPromotion フックを追加"
```

---

## Task 3: `BasicInfoSection` に生成ボタンを追加

**Files:**
- Modify: `src/components/Editor/BasicInfoSection.tsx`

`setValue` と `workExperiences` props を追加し、生成ボタン・ローディング・エラーを表示する。

- [ ] **Step 1: `BasicInfoSection.tsx` を以下の内容に更新**

`src/components/Editor/BasicInfoSection.tsx` を以下に置き換える:

```tsx
import React from 'react';
import type { UseFormRegister, Control, UseFormSetValue } from 'react-hook-form';
import { useFieldArray } from 'react-hook-form';
import type { Resume, WorkExperience } from '../../schema/resumeSchema';
import { User, Plus, Sparkles } from 'lucide-react';
import { useGenerateSelfPromotion } from '../../hooks/useGenerateSelfPromotion';

interface BasicInfoSectionProps {
  register: UseFormRegister<Resume>;
  control: Control<Resume>;
  skillOptions: string[];
  setValue: UseFormSetValue<Resume>;
  workExperiences: WorkExperience[];
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  register, control, skillOptions, setValue, workExperiences,
}) => {
  const { fields, append, remove, update } = useFieldArray({ control, name: 'profile.highlightSkills' });
  const { isAvailable, generate, isLoading, error } = useGenerateSelfPromotion(workExperiences);

  const handleGenerate = async () => {
    const result = await generate();
    if (result) {
      setValue('profile.selfPromotion', result, { shouldDirty: true });
    }
  };

  return (
    <section className="form-card">
      <div className="card-header">
        <User size={20} />
        <h3>基本情報</h3>
      </div>
      <div className="form-grid-full">
        <div className="form-group">
          <label>名前</label>
          <input {...register('profile.name')} placeholder="山田 太郎" />
        </div>
        <div className="form-group">
          <label>職務要約</label>
          <textarea
            {...register('profile.summary')}
            rows={10}
            placeholder="これまでの経験の概要や強みを簡潔に入力してください。"
          />
        </div>
        <div className="form-group">
          <label>自己PR</label>
          <textarea
            {...register('profile.selfPromotion')}
            rows={15}
            placeholder="自身のアピールポイントや実績を詳細に入力してください。"
          />
          {isAvailable && (
            <div className="generate-self-promotion">
              <button
                type="button"
                className="generate-self-promotion-btn"
                onClick={handleGenerate}
                disabled={isLoading}
              >
                <Sparkles size={14} />
                {isLoading ? '生成中...' : '自己PRを生成'}
              </button>
              {error && <p className="generate-self-promotion-error">{error}</p>}
            </div>
          )}
        </div>
        <div className="form-group">
          <label>ハイライトスキル（最大3つ）</label>
          {fields.length > 0 && (
            <>
              <div className="highlight-skills-col-labels">
                <span className="highlight-skill-col-label">スキル名</span>
                <span className="highlight-skill-col-label">経験年数</span>
                <span />
              </div>
              {fields.map((field, i) => (
                <div key={field.id} className="highlight-skill-row">
                  <select
                    className="highlight-skill-select"
                    value={field.name}
                    onChange={e => update(i, { ...field, name: e.target.value })}
                  >
                    <option value="">— 選択してください —</option>
                    {skillOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <div className="highlight-skill-years">
                    <input
                      type="number"
                      min={0}
                      step={0.5}
                      className="highlight-skill-years-input"
                      value={field.years}
                      onChange={e => update(i, { ...field, years: parseFloat(e.target.value) || 0 })}
                    />
                    <span className="highlight-skill-years-unit">年</span>
                  </div>
                  <button
                    type="button"
                    className="highlight-skill-clear"
                    onClick={() => remove(i)}
                  >✕</button>
                </div>
              ))}
            </>
          )}
          {fields.length < 3 && (
            <button
              type="button"
              className="highlight-skill-add-btn"
              onClick={() => append({ name: '', years: 0 })}
            >
              <Plus size={14} /> スキルを追加
            </button>
          )}
          <div className="highlight-skill-hint">スキルスタックに登録されている技術から選択できます</div>
        </div>
      </div>
    </section>
  );
};
```

- [ ] **Step 2: TypeScript コンパイルエラーがないか確認**

```bash
npx tsc --noEmit
```

Expected: エラーなし。`Sparkles` が `lucide-react` に存在しない場合は `Wand2` など別アイコンに変更する。

- [ ] **Step 3: コミット**

```bash
git add src/components/Editor/BasicInfoSection.tsx
git commit -m "feat: BasicInfoSection に自己PR生成ボタンを追加"
```

---

## Task 4: `FormEditor` から新 props を渡す

**Files:**
- Modify: `src/components/Editor/FormEditor.tsx:99-112`

BasicInfoSection の呼び出し箇所に `setValue` と `workExperiences` を渡す。

- [ ] **Step 1: `FormEditor.tsx` の BasicInfoSection 呼び出しを更新**

`FormEditor.tsx` の以下の箇所を:

```tsx
        {activeSection === 'basic' && (
          <BasicInfoSection
            register={register}
            control={control}
            skillOptions={Array.from(new Set(
              (watch('workExperiences') ?? []).flatMap(exp =>
                exp.projects?.flatMap(p =>
                  Object.values(p.techStack ?? {}).flatMap(items =>
                    items.map(item => item.name).filter(Boolean)
                  )
                ) ?? []
              )
            ))}
          />
        )}
```

以下に置き換える:

```tsx
        {activeSection === 'basic' && (
          <BasicInfoSection
            register={register}
            control={control}
            setValue={setValue}
            workExperiences={watch('workExperiences') ?? []}
            skillOptions={Array.from(new Set(
              (watch('workExperiences') ?? []).flatMap(exp =>
                exp.projects?.flatMap(p =>
                  Object.values(p.techStack ?? {}).flatMap(items =>
                    items.map(item => item.name).filter(Boolean)
                  )
                ) ?? []
              )
            ))}
          />
        )}
```

- [ ] **Step 2: TypeScript コンパイルエラーがないか確認**

```bash
npx tsc --noEmit
```

Expected: エラーなし

- [ ] **Step 3: 動作確認**

1. `npm run dev` でアプリを起動
2. `.env.local` に有効な `VITE_GOOGLE_AI_API_KEY` が設定されていることを確認
3. 基本情報セクションの「自己PR」テキストエリア下に「✨ 自己PRを生成」ボタンが表示されることを確認
4. 職務経歴データが入力された状態でボタンをクリック
5. ローディング状態（「生成中...」）になることを確認
6. 生成完了後、テキストエリアに自己PR文が入力されることを確認
7. API キーなし（空）の場合、ボタンが表示されないことを確認

- [ ] **Step 4: コミット**

```bash
git add src/components/Editor/FormEditor.tsx
git commit -m "feat: FormEditor から BasicInfoSection に setValue と workExperiences を渡す"
```

---

## Task 5: スタイルを追加

**Files:**
- Modify: `src/App.css` または関連する CSS ファイル

生成ボタンとエラーメッセージのスタイルを追加する。

- [ ] **Step 1: CSS クラスを追加**

既存の CSS ファイル（`src/App.css`）の末尾に以下を追加する:

```css
.generate-self-promotion {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.generate-self-promotion-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  font-size: 13px;
  border: 1px solid #6366f1;
  border-radius: 6px;
  background: transparent;
  color: #6366f1;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  width: fit-content;
}

.generate-self-promotion-btn:hover:not(:disabled) {
  background: #6366f1;
  color: #fff;
}

.generate-self-promotion-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.generate-self-promotion-error {
  font-size: 12px;
  color: #ef4444;
  margin: 0;
}
```

- [ ] **Step 2: 動作・見た目を確認**

`npm run dev` で起動し、ボタンのスタイルが正しく表示されることを目視確認する。

- [ ] **Step 3: コミット**

```bash
git add src/App.css
git commit -m "style: 自己PR生成ボタンのスタイルを追加"
```
