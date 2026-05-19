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
        {activeSection === 'basic' && <BasicInfoSection register={register} />}
        {activeSection === 'links' && <LinksSection control={control} register={register} watch={watch} setValue={setValue} />}
        {activeSection === 'experience' && <ExperienceSection control={control} register={register} watch={watch} setValue={setValue} />}
        {activeSection === 'order' && <SectionOrderEditor sectionOrder={sectionOrder} setSectionOrder={setSectionOrder} />}
        {isMobile && editModal && (
          <EditModal
            label={editModal.label}
            value={editModal.value}
            inputType={editModal.inputType}
            onSave={(newValue) => {
              setValue(editModal.name as any, newValue, { shouldDirty: true });
              setEditModal(null);
            }}
            onClose={() => setEditModal(null)}
          />
        )}
      </div>
    </div>
  );
};
