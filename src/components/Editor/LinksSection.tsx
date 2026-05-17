import React from 'react';
import { useFieldArray } from 'react-hook-form';
import type { Control, UseFormRegister, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import type { Resume } from '../../schema/resumeSchema';
import { Button } from '../Button';
import { CertEditor } from './CertEditor';
import { Plus, Trash2, Link as LinkIcon, Award } from 'lucide-react';

interface LinksSectionProps {
  control: Control<Resume>;
  register: UseFormRegister<Resume>;
  watch: UseFormWatch<Resume>;
  setValue: UseFormSetValue<Resume>;
}

export const LinksSection: React.FC<LinksSectionProps> = ({ control, register, watch, setValue }) => {
  const { fields, append, remove } = useFieldArray({ control, name: 'profile.links' as any });

  return (
    <div className="form-vertical-stack">
      <section className="form-card">
        <div className="card-header">
          <LinkIcon size={20} />
          <h3>リンク</h3>
        </div>
        <div className="links-list">
          {fields.map((field, index) => (
            <div key={field.id} className="item-row-card">
              <div className="row-inputs">
                <input
                  {...register(`profile.links.${index}.label` as any)}
                  placeholder="表示名 (例: GitHub)"
                  className="link-label-input"
                />
                <input
                  {...register(`profile.links.${index}.url` as any)}
                  placeholder="https://..."
                />
              </div>
              <Button variant="danger" size="sm" onClick={() => remove(index)}>
                <Trash2 size={16} />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="md" onClick={() => append({ label: '', url: '' })}>
            <Plus size={16} /> リンクを追加
          </Button>
        </div>
      </section>
      <section className="form-card">
        <div className="card-header">
          <Award size={20} />
          <h3>資格</h3>
        </div>
        <CertEditor register={register} watch={watch} setValue={setValue} />
      </section>
    </div>
  );
};
