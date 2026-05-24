import React from 'react';
import type { UseFormRegister, Control, UseFormSetValue } from 'react-hook-form';
import { useFieldArray, Controller } from 'react-hook-form';
import type { Resume, WorkExperience } from '../../schema/resumeSchema';
import DatePicker, { registerLocale } from 'react-datepicker';
import { ja } from 'date-fns/locale/ja';
import { format, parseISO } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';

registerLocale('ja', ja);
import { User, Plus, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { useGenerateSelfPromotion } from '../../hooks/useGenerateSelfPromotion';
import { useGenerateSummary } from '../../hooks/useGenerateSummary';

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
  const {
    isAvailable: isSummaryAvailable,
    generate: generateSummary,
    isLoading: isLoadingSummary,
    error: summaryError,
  } = useGenerateSummary(workExperiences);

  const handleGenerateSummary = async () => {
    const result = await generateSummary();
    if (result) {
      setValue('profile.summary', result, { shouldDirty: true });
    }
  };

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
          <label>生年月日</label>
          <Controller
            control={control}
            name="profile.birthday"
            render={({ field }) => (
              <DatePicker
                name="profile.birthday"
                locale="ja"
                dateFormat="yyyy/MM/dd"
                selected={field.value ? parseISO(field.value) : null}
                onChange={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                placeholderText="例: 1990/01/15"
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
                maxDate={new Date()}
                withPortal
              />
            )}
          />
        </div>
        <div className="form-group">
          <label>職務要約</label>
          <textarea
            {...register('profile.summary')}
            rows={10}
            placeholder="これまでの経験の概要や強みを簡潔に入力してください。"
          />
          {isSummaryAvailable && (
            <div className="generate-self-promotion">
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateSummary}
                disabled={isLoadingSummary}
              >
                <Sparkles size={14} />
                {isLoadingSummary ? '生成中...' : '職務要約を生成'}
              </Button>
              {summaryError && <p className="generate-self-promotion-error">{summaryError}</p>}
            </div>
          )}
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
                      name={`profile.highlightSkills.${i}.years`}
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
