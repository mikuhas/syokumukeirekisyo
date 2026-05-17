import React from 'react';
import { useFieldArray } from 'react-hook-form';
import type { Control, UseFormRegister, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import type { Resume } from '../../schema/resumeSchema';
import { Button } from '../Button';
import { Plus } from 'lucide-react';
import { ProjectCard } from './ProjectCard';

interface ProjectFieldsProps {
  nestIndex: number;
  control: Control<Resume>;
  register: UseFormRegister<Resume>;
  watch: UseFormWatch<Resume>;
  setValue: UseFormSetValue<Resume>;
}

export const ProjectFields: React.FC<ProjectFieldsProps> = ({
  nestIndex, control, register, watch, setValue,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `workExperiences.${nestIndex}.projects`,
  });

  return (
    <div className="projects-container-nested">
      <div className="nested-header">
        <h5>プロジェクト実績</h5>
      </div>
      {fields.map((item, k) => (
        <ProjectCard
          key={item.id}
          nestIndex={nestIndex}
          k={k}
          control={control}
          register={register}
          watch={watch}
          setValue={setValue}
          onRemove={() => remove(k)}
        />
      ))}
      <Button
        variant="dashed"
        className="w-full"
        onClick={() => append({ name: '', details: '', isCurrentlyWorking: false, star: { situation: '', task: '', action: '', result: '' } })}
      >
        <Plus size={16} /> プロジェクト実績を追加
      </Button>
    </div>
  );
};
