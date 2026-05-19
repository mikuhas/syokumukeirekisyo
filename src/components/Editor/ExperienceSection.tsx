import React from 'react';
import { useFieldArray } from 'react-hook-form';
import type { Control, UseFormRegister, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import type { Resume } from '../../schema/resumeSchema';
import { Button } from '../Button';
import { Plus, Briefcase } from 'lucide-react';
import { ExperienceCard } from './ExperienceCard';

interface ExperienceSectionProps {
  control: Control<Resume>;
  register: UseFormRegister<Resume>;
  watch: UseFormWatch<Resume>;
  setValue: UseFormSetValue<Resume>;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  control, register, watch, setValue,
}) => {
  const { fields, append, remove } = useFieldArray({ control, name: 'workExperiences' });

  return (
    <div className="form-card">
      <div className="card-header">
        <Briefcase size={20} />
        <h3>職務経歴</h3>
      </div>
      <p className="section-intro-desc">経歴を追加・編集し、その中でプロジェクトの実績を詳しく記載します。</p>
      <div className="experience-list">
        {fields.map((field, index) => (
          <ExperienceCard
            key={field.id}
            index={index}
            control={control}
            register={register}
            watch={watch}
            setValue={setValue}
            onRemove={() => remove(index)}
          />
        ))}
        <Button
          variant="primary"
          size="lg"
          onClick={() => append({ company: '', employmentStatus: '', startDate: '2025-05', isCurrentlyWorking: true, projects: [] })}
        >
          <Plus size={18} /> 職務経歴を追加
        </Button>
      </div>
    </div>
  );
};
