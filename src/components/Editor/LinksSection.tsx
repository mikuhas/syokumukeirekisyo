import React from 'react';
import { useFieldArray } from 'react-hook-form';
import type { Control, UseFormRegister, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import type { Resume } from '../../schema/resumeSchema';
import { Button } from '../Button';
import { CertEditor } from './CertEditor';
import { ServiceIcon } from '../ServiceIcon';
import { LINK_SERVICES, LINK_PLACEHOLDERS } from '../../constants/linkServices';
import type { LinkService } from '../../constants/linkServices';
import { Plus, Trash2, Link as LinkIcon, Award } from 'lucide-react';

const CUSTOM = '__custom__';

interface LinksSectionProps {
  control: Control<Resume>;
  register: UseFormRegister<Resume>;
  watch: UseFormWatch<Resume>;
  setValue: UseFormSetValue<Resume>;
}

export const LinksSection: React.FC<LinksSectionProps> = ({ control, register, watch, setValue }) => {
  const { fields, append, remove } = useFieldArray({ control, name: 'profile.links' as any });

  const allLinks = watch('profile.links') ?? [];

  // Labels that are already claimed by a predefined service in another row
  const usedPredefined = allLinks.map(l => l?.label).filter(l => (LINK_SERVICES as readonly string[]).includes(l ?? ''));

  // First unused predefined service for the "add" button default
  const nextDefault = LINK_SERVICES.find(s => !usedPredefined.includes(s));

  const handleAdd = () => {
    append({ label: nextDefault ?? '', url: '' });
  };

  return (
    <div className="form-vertical-stack">
      <section className="form-card">
        <div className="card-header">
          <LinkIcon size={20} />
          <h3>リンク</h3>
        </div>
        <div className="links-list">
          {fields.map((field, index) => {
            const currentLabel = (watch(`profile.links.${index}.label` as any) ?? '') as string;
            const isPredefined = (LINK_SERVICES as readonly string[]).includes(currentLabel);
            const selectValue = isPredefined ? currentLabel : CUSTOM;
            const urlPlaceholder = isPredefined
              ? (LINK_PLACEHOLDERS[currentLabel as LinkService] ?? 'https://...')
              : 'https://...';

            return (
              <div key={field.id} className="item-row-card link-row">
                <div className="link-service-icon-preview">
                  <ServiceIcon service={currentLabel} size={18} />
                </div>
                <select
                  value={selectValue}
                  onChange={(e) => {
                    if (e.target.value === CUSTOM) {
                      setValue(`profile.links.${index}.label` as any, '');
                    } else {
                      setValue(`profile.links.${index}.label` as any, e.target.value);
                    }
                  }}
                  className="link-service-select"
                >
                  {LINK_SERVICES.map(service => (
                    <option
                      key={service}
                      value={service}
                      disabled={service !== currentLabel && usedPredefined.includes(service)}
                    >
                      {service}
                    </option>
                  ))}
                  <option value={CUSTOM}>カスタム</option>
                </select>
                {!isPredefined && (
                  <input
                    {...register(`profile.links.${index}.label` as any)}
                    placeholder="表示名"
                    className="link-label-custom-input"
                  />
                )}
                <input
                  {...register(`profile.links.${index}.url` as any)}
                  placeholder={urlPlaceholder}
                  className="link-url-input"
                />
                <Button variant="danger" size="sm" onClick={() => remove(index)}>
                  <Trash2 size={16} />
                </Button>
              </div>
            );
          })}
          <Button variant="outline" size="md" onClick={handleAdd}>
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
