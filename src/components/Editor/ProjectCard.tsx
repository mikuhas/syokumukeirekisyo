import React from 'react';
import type { Control, UseFormRegister, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import type { Resume } from '../../schema/resumeSchema';
import { ListEditor } from './ListEditor';
import { SkillStackEditor } from './SkillStackEditor';
import { ProjectSTARFields } from './ProjectSTARFields';

interface ProjectCardProps {
  nestIndex: number;
  k: number;
  control: Control<Resume>;
  register: UseFormRegister<Resume>;
  watch: UseFormWatch<Resume>;
  setValue: UseFormSetValue<Resume>;
  onRemove: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  nestIndex, k, control, register, watch, setValue, onRemove,
}) => (
  <div id={`editor-project-${nestIndex}-${k}`} className="nested-project-card">
    <div className="project-card-header">
      <strong>プロジェクト実績 #{k + 1}</strong>
      <button type="button" className="delete-btn-text-sm" onClick={onRemove}>削除</button>
    </div>
    <div className="form-group">
      <label>プロジェクト名</label>
      <input {...register(`workExperiences.${nestIndex}.projects.${k}.name`)} placeholder="ECサイト開発プロジェクト" />
    </div>
    <div className="form-grid-2col">
      <div className="form-group">
        <label>開始年月</label>
        <input type="month" {...register(`workExperiences.${nestIndex}.projects.${k}.startDate`)} />
      </div>
      <div className="form-group">
        <div className="date-label-row">
          <label>終了年月</label>
          <label className="checkbox-label-inline">
            <input type="checkbox" {...register(`workExperiences.${nestIndex}.projects.${k}.isCurrentlyWorking`)} />
            現在も担当中
          </label>
        </div>
        <input type="month" {...register(`workExperiences.${nestIndex}.projects.${k}.endDate`)} disabled={watch(`workExperiences.${nestIndex}.projects.${k}.isCurrentlyWorking`)} />
      </div>
    </div>
    <div className="form-grid-2col">
      <div className="form-group">
        <label>開発規模</label>
        <input {...register(`workExperiences.${nestIndex}.projects.${k}.scale`)} placeholder="10名体制、期間1年" />
      </div>
      <div className="form-group">
        <label>役職/職種</label>
        <input {...register(`workExperiences.${nestIndex}.projects.${k}.assignedTasks`)} placeholder="システムエンジニア" />
      </div>
    </div>
    <div className="form-group">
      <label>プロジェクト詳細</label>
      <textarea {...register(`workExperiences.${nestIndex}.projects.${k}.details`)} rows={3} placeholder="プロジェクトの概要を入力してください。" />
    </div>
    <div className="form-group">
      <label>作業内容</label>
      <ListEditor nestIndex={nestIndex} projectIndex={k} control={control} register={register} name="workContent" placeholder="作業内容" />
    </div>
    <div className="form-group">
      <label>担当業務</label>
      <ListEditor nestIndex={nestIndex} projectIndex={k} control={control} register={register} name="responsibilities" placeholder="担当業務" />
    </div>
    <ProjectSTARFields nestIndex={nestIndex} k={k} register={register} />
    <div className="project-tech-stack-form">
      <label className="sub-label">使用技術</label>
      <SkillStackEditor path={`workExperiences.${nestIndex}.projects.${k}.techStack`} watch={watch} setValue={setValue} />
    </div>
  </div>
);
