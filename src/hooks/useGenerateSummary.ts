import { useState, useCallback, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { WorkExperience } from '../schema/resumeSchema';

const API_KEY = import.meta.env.VITE_GOOGLE_AI_API_KEY as string | undefined;

interface UseGenerateSummaryReturn {
  isAvailable: boolean;
  generate: () => Promise<string | null>;
  isLoading: boolean;
  error: string | null;
}

function buildSummaryPrompt(workExperiences: WorkExperience[]): string {
  const experienceLines = workExperiences.map(exp => {
    const period = exp.isCurrentlyWorking
      ? `${exp.startDate} 〜 現在`
      : `${exp.startDate} 〜 ${exp.endDate ?? ''}`;
    const lines: string[] = [
      `会社名: ${exp.company}`,
      `期間: ${period}`,
      `雇用形態: ${exp.employmentStatus}`,
    ];
    exp.projects.forEach(project => {
      const projectLines: string[] = [`プロジェクト: ${project.name}`];
      if (project.details) projectLines.push(`概要: ${project.details}`);
      if (project.workContent?.length) projectLines.push(`担当内容: ${project.workContent.join('、')}`);
      if (project.assignedTasks) projectLines.push(`担当タスク: ${project.assignedTasks}`);
      lines.push(projectLines.join('\n  '));
    });
    return lines.join('\n');
  }).filter(s => s.length > 0);

  if (experienceLines.length === 0) return '';

  const experienceSection = experienceLines
    .map((e, i) => `【経歴${i + 1}】\n${e}`)
    .join('\n\n');

  return `あなたは採用担当者向けの職務経歴書の職務要約文を作成するエキスパートです。
以下の職務経歴情報をもとに、職務要約文を作成してください。

【構成ルール】
- 見出しや箇条書きは使わず、自然な日本語の文章で記述する
- 2〜4文で簡潔にまとめる

【文字数ルール】
- 150〜250字を目安にする
- 参照できる情報が少ない場合は文字数を無理に増やさず、内容に見合った長さにする

【内容ルール】
- キャリアの時系列の流れと経験した業務領域を簡潔に記述する
- 会社名・在籍期間・役割・プロジェクト概要を中心に使用する

【出力ルール】
- 職務要約本文のみ出力する（前置きや説明は不要）

${experienceSection}`;
}

export function useGenerateSummary(workExperiences: WorkExperience[]): UseGenerateSummaryReturn {
  const isAvailable = Boolean(API_KEY);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isLoadingRef = useRef(false);

  const generate = useCallback(async (): Promise<string | null> => {
    if (!API_KEY) return null;
    if (isLoadingRef.current) return null;

    const prompt = buildSummaryPrompt(workExperiences);
    if (!prompt) {
      setError('職務経歴データが入力されていません。');
      return null;
    }

    isLoadingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite' });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch {
      setError('生成中にエラーが発生しました。再度お試しください。');
      return null;
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, [workExperiences]);

  return { isAvailable, generate, isLoading, error };
}
