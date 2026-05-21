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
