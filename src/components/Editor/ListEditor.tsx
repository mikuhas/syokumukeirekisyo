import React from 'react';
import { useFieldArray } from 'react-hook-form';
import type { Control, UseFormRegister } from 'react-hook-form';
import type { Resume } from '../../schema/resumeSchema';
import { Button } from '../Button';
import { Plus, Trash2 } from 'lucide-react';

interface ListEditorProps {
  nestIndex: number;
  projectIndex: number;
  control: Control<Resume>;
  register: UseFormRegister<Resume>;
  name: 'workContent' | 'responsibilities';
  placeholder: string;
}

export const ListEditor: React.FC<ListEditorProps> = ({
  nestIndex,
  projectIndex,
  control,
  register,
  name,
  placeholder,
}) => {
  const fieldPath = `workExperiences.${nestIndex}.projects.${projectIndex}.${name}` as any;
  const { fields, append, remove } = useFieldArray({ control, name: fieldPath });

  return (
    <div className="list-form">
      {fields.map((field, index) => (
        <div key={field.id} className="item-row-card">
          <input
            {...register(`workExperiences.${nestIndex}.projects.${projectIndex}.${name}.${index}` as any)}
            placeholder={placeholder}
          />
          <Button variant="danger" size="sm" onClick={() => remove(index)}>
            <Trash2 size={16} />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={() => append('' as any)}>
        <Plus size={16} /> 追加
      </Button>
    </div>
  );
};
