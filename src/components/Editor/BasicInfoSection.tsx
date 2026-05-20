import React from 'react';
import type { UseFormRegister, Control } from 'react-hook-form';
import { useFieldArray } from 'react-hook-form';
import type { Resume } from '../../schema/resumeSchema';
import { User } from 'lucide-react';

interface BasicInfoSectionProps {
  register: UseFormRegister<Resume>;
  control: Control<Resume>;
  skillOptions: string[];
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ register, control, skillOptions }) => {
  const { fields, replace } = useFieldArray({ control, name: 'profile.highlightSkills' });

  const slots = [0, 1, 2];

  const handleSkillChange = (index: number, name: string) => {
    const current = slots.map(i => fields[i] ?? { name: '', years: 0 });
    const updated = current.map((f, i) => i === index ? { ...f, name } : f);
    replace(updated.filter(f => f.name));
  };

  const handleYearsChange = (index: number, years: number) => {
    const current = slots.map(i => fields[i] ?? { name: '', years: 0 });
    const updated = current.map((f, i) => i === index ? { ...f, years } : f);
    replace(updated.filter(f => f.name));
  };

  const handleClear = (index: number) => {
    const current = slots.map(i => fields[i] ?? { name: '', years: 0 });
    const updated = current.filter((_, i) => i !== index);
    replace(updated.filter(f => f.name));
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
        </div>
        <div className="form-group">
          <div className="highlight-skills-header">
            <span className="highlight-skills-bar" />
            <span className="highlight-skills-title">ハイライトスキル（最大3つ）</span>
          </div>
          <div className="highlight-skills-col-labels">
            <span className="highlight-skill-col-label">スキル名</span>
            <span className="highlight-skill-col-label">経験年数</span>
            <span />
          </div>
          {slots.map((i) => {
            const field = fields[i];
            return (
              <div key={i} className="highlight-skill-row">
                <select
                  className="highlight-skill-select"
                  value={field?.name ?? ''}
                  onChange={e => handleSkillChange(i, e.target.value)}
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
                    value={field?.years ?? ''}
                    disabled={!field?.name}
                    onChange={e => handleYearsChange(i, parseFloat(e.target.value) || 0)}
                  />
                  <span className="highlight-skill-years-unit">年</span>
                </div>
                {field?.name ? (
                  <button
                    type="button"
                    className="highlight-skill-clear"
                    onClick={() => handleClear(i)}
                  >✕</button>
                ) : (
                  <span />
                )}
              </div>
            );
          })}
          <div className="highlight-skill-hint">スキルスタックに登録されている技術から選択できます</div>
        </div>
      </div>
    </section>
  );
};
