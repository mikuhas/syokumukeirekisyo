import React from 'react';
import type { UseFormRegister, Control, UseFormSetValue } from 'react-hook-form';
import { useFieldArray } from 'react-hook-form';
import type { Resume, WorkExperience } from '../../schema/resumeSchema';
import { User, Plus, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
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
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerate}
                disabled={isLoading}
              >
                <Sparkles size={14} />
                {isLoading ? '生成中...' : '自己PRを生成'}
              </Button>
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
