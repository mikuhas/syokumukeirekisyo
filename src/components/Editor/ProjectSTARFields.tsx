import React from 'react';
import type { UseFormRegister } from 'react-hook-form';
import type { Resume } from '../../schema/resumeSchema';

const STAR_FIELDS = [
  { field: 'situation', label: 'Situation', placeholder: '直面した状況について' },
  { field: 'task',      label: 'Task',      placeholder: '達成すべき目標' },
  { field: 'action',    label: 'Action',    placeholder: '実行したアクション' },
  { field: 'result',    label: 'Result',    placeholder: '得られた成果や結果' },
] as const;

interface ProjectSTARFieldsProps {
  nestIndex: number;
  k: number;
  register: UseFormRegister<Resume>;
}

export const ProjectSTARFields: React.FC<ProjectSTARFieldsProps> = ({ nestIndex, k, register }) => (
  <div className="star-form-grid">
    {STAR_FIELDS.map(({ field, label, placeholder }) => (
      <div key={field} className="form-group">
        <label>{label}</label>
        <textarea
          {...register(`workExperiences.${nestIndex}.projects.${k}.star.${field}` as any)}
          rows={4}
          placeholder={placeholder}
        />
      </div>
    ))}
  </div>
);
