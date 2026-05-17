import React from 'react';
import type { UseFormRegister, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import type { Resume } from '../../schema/resumeSchema';
import { Button } from '../Button';
import { Plus, Trash2 } from 'lucide-react';

interface CertEditorProps {
  register: UseFormRegister<Resume>;
  watch: UseFormWatch<Resume>;
  setValue: UseFormSetValue<Resume>;
}

export const CertEditor: React.FC<CertEditorProps> = ({ register, watch, setValue }) => {
  const certs = watch('profile.certifications') ?? [];

  return (
    <div className="cert-form">
      <div className="cert-items-list">
        {certs.map((_, index) => (
          <div key={index} className="item-row-card">
            <input
              {...register(`profile.certifications.${index}` as any)}
              placeholder="例: AWS認定ソリューションアーキテクト、応用情報技術者"
            />
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                const updated = [...certs];
                updated.splice(index, 1);
                setValue('profile.certifications', updated);
              }}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          size="md"
          onClick={() => setValue('profile.certifications', [...certs, ''])}
        >
          <Plus size={16} /> 資格を追加
        </Button>
      </div>
    </div>
  );
};
