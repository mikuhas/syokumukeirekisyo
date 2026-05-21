import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { Resume } from '../../schema/resumeSchema';
import type { SectionId } from '../../App';
import type { Section } from './FormSidebar';
import yaml from 'js-yaml';
import { FormSidebar } from './FormSidebar';
import { BasicInfoSection } from './BasicInfoSection';
import { LinksSection } from './LinksSection';
import { ExperienceSection } from './ExperienceSection';
import { SectionOrderEditor } from './SectionOrderEditor';
import { EditModal } from './EditModal';

interface FormEditorProps {
  data: Resume;
  onChange: (newData: Resume) => void;
  sectionOrder: SectionId[];
  setSectionOrder: (order: SectionId[]) => void;
  activeSection: Section;
  setActiveSection: (s: Section) => void;
}

type EditModalState = { label: string; value: string; inputType: string; name: string } | null;

export const FormEditor: React.FC<FormEditorProps> = ({
  data, onChange, sectionOrder, setSectionOrder, activeSection, setActiveSection,
}) => {
  const { register, control, watch, setValue, reset } = useForm<Resume>({ defaultValues: data });

  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 767);
  const [editModal, setEditModal] = useState<EditModalState>(null);

  React.useEffect(() => {
    const subscription = watch((value) => { if (value) onChange(value as Resume); });
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 767);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const handleExport = () => {
    const blob = new Blob([yaml.dump(watch())], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume.yml';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = yaml.load(event.target?.result as string) as Resume;
        reset(parsed);
        onChange(parsed);
      } catch {
        alert('YAMLの読み込みに失敗しました。');
      }
    };
    reader.readAsText(file);
  };

  const handleAreaMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMobile) return;
    const target = e.target as HTMLElement;
    if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') return;
    const input = target as HTMLInputElement | HTMLTextAreaElement;
    const inputType = input.tagName === 'TEXTAREA' ? 'textarea' : ((input as HTMLInputElement).type ?? 'text');
    if (inputType === 'checkbox') return;
    e.preventDefault();
    const formGroup = input.closest('.form-group');
    const labelEl = formGroup?.querySelector('label:not(.checkbox-label-inline)');
    const label =
      labelEl?.textContent?.trim() ||
      (input as HTMLInputElement).placeholder ||
      input.getAttribute('name')?.split('.').pop() ||
      '';
    setEditModal({ label, value: input.value, inputType, name: input.getAttribute('name') ?? '' });
  };

  return (
    <div className="form-editor-container">
      <FormSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        watch={watch}
        setValue={setValue}
        onExport={handleExport}
        onImport={handleImport}
      />
      <div className="form-content-area" onMouseDown={handleAreaMouseDown}>
        {activeSection === 'basic' && (
          <BasicInfoSection
            register={register}
            control={control}
            setValue={setValue}
            workExperiences={watch('workExperiences')}
            skillOptions={Array.from(new Set(
              (watch('workExperiences') ?? []).flatMap(exp =>
                exp.projects?.flatMap(p =>
                  Object.values(p.techStack ?? {}).flatMap(items =>
                    items.map(item => item.name).filter(Boolean)
                  )
                ) ?? []
              )
            ))}
          />
        )}
        {activeSection === 'links' && <LinksSection control={control} register={register} watch={watch} setValue={setValue} />}
        {activeSection === 'experience' && <ExperienceSection control={control} register={register} watch={watch} setValue={setValue} />}
        {activeSection === 'order' && <SectionOrderEditor sectionOrder={sectionOrder} setSectionOrder={setSectionOrder} />}
      </div>
      {/* EditModalはform-content-areaの外に置き、handleAreaMouseDownの干渉を防ぐ */}
      {isMobile && editModal && (
        <EditModal
          label={editModal.label}
          value={editModal.value}
          inputType={editModal.inputType}
          onSave={(newValue) => {
            const val = editModal.inputType === 'number' ? (parseFloat(newValue) || 0) : newValue;
            const skillMatch = editModal.name.match(/^profile\.highlightSkills\.(\d+)\.(.+)$/);
            if (skillMatch) {
              const idx = parseInt(skillMatch[1]);
              const key = skillMatch[2];
              const current = watch('profile.highlightSkills') ?? [];
              const updated = current.map((skill, i) =>
                i === idx ? { ...skill, [key]: val } : skill
              );
              setValue('profile.highlightSkills', updated as any, { shouldDirty: true });
            } else {
              setValue(editModal.name as any, val, { shouldDirty: true });
            }
            setEditModal(null);
          }}
          onClose={() => setEditModal(null)}
        />
      )}
    </div>
  );
};
