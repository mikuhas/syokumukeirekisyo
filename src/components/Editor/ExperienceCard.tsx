import React, { useState } from 'react';
import type { Control, UseFormRegister, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import type { Resume } from '../../schema/resumeSchema';
import { ChevronRight, Trash2 } from 'lucide-react';
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
  const [collapsed, setCollapsed] = useState(true);
  const activeStatus = watch(`workExperiences.${index}.employmentStatus`);
  const company = watch(`workExperiences.${index}.company`);
  const companyDisplay = company && company.length > 30 ? company.slice(0, 30) + '…' : company;
  const startDate = watch(`workExperiences.${index}.startDate`);

  return (
    <div className="experience-card-group">
      <div className="card-group-header" onClick={() => setCollapsed(v => !v)} role="button" aria-expanded={!collapsed}>
        <div className="header-title">
          <ChevronRight size={16} className={`experience-card-chevron ${collapsed ? '' : 'expanded'}`} />
          <h4>{companyDisplay || `経歴 #${index + 1}`}</h4>
          {startDate && <span className="experience-card-date">{startDate}</span>}
        </div>
        <button
          type="button"
          className="icon-btn-rich"
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          aria-label="この経歴を削除"
        >
          <Trash2 size={16} />
        </button>
      </div>
      <div className={`experience-card-body ${collapsed ? 'collapsed' : ''}`}>
        <div>
          {!collapsed && (
            <div className="experience-card-body-inner">
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
          )}
        </div>
      </div>
    </div>
  );
};
