import React from 'react';
import type { Control, UseFormRegister, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import type { Resume } from '../../schema/resumeSchema';
import { Button } from '../Button';
import { GripVertical } from 'lucide-react';
import { ProjectFields } from './ProjectFields';

const EMPLOYMENT_STATUSES = ['正社員', '契約社員', '派遣社員', 'アルバイト/パート', 'その他'];

interface ExperienceCardProps {
  index: number;
  control: Control<Resume>;
  register: UseFormRegister<Resume>;
  watch: UseFormWatch<Resume>;
  setValue: UseFormSetValue<Resume>;
  onRemove: () => void;
}

export const ExperienceCard: React.FC<ExperienceCardProps> = ({
  index, control, register, watch, setValue, onRemove,
}) => {
  const activeStatus = watch(`workExperiences.${index}.employmentStatus`);

  return (
    <div className="experience-card-group">
      <div className="card-group-header">
        <div className="header-title">
          <GripVertical size={20} />
          <h4>経歴 #{index + 1}</h4>
        </div>
        <Button variant="ghost" size="sm" onClick={onRemove}>この経歴を削除</Button>
      </div>
      <div className="form-grid-2col">
        <div className="form-group full-width">
          <label>会社名</label>
          <input {...register(`workExperiences.${index}.company`)} placeholder="株式会社〇〇" />
        </div>
        <div className="form-group">
          <label>開始年月</label>
          <input type="month" {...register(`workExperiences.${index}.startDate`)} />
        </div>
        <div className="form-group">
          <div className="date-label-row">
            <label>終了年月</label>
            <label className="checkbox-label-inline">
              <input type="checkbox" {...register(`workExperiences.${index}.isCurrentlyWorking`)} />
              現在も在籍中
            </label>
          </div>
          <input
            type="month"
            {...register(`workExperiences.${index}.endDate`)}
            disabled={watch(`workExperiences.${index}.isCurrentlyWorking`)}
          />
        </div>
        <div className="form-group full-width">
          <label>雇用形態</label>
          <div className="employment-status-group">
            {EMPLOYMENT_STATUSES.map((status) => (
              <button
                key={status}
                type="button"
                className={`form-chip ${activeStatus === status ? 'active' : ''}`}
                onClick={() => setValue(`workExperiences.${index}.employmentStatus`, status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>
      <ProjectFields nestIndex={index} control={control} register={register} watch={watch} setValue={setValue} />
    </div>
  );
};
