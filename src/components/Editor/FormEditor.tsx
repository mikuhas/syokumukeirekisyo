import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { Resume } from '../../schema/resumeSchema';
import yaml from 'js-yaml';
import { FormSidebar } from './FormSidebar';
import { BasicInfoSection } from './BasicInfoSection';
import { LinksSection } from './LinksSection';
import { ExperienceSection } from './ExperienceSection';

interface FormEditorProps {
  data: Resume;
  onChange: (newData: Resume) => void;
}

type Section = 'basic' | 'links' | 'experience';

export const FormEditor: React.FC<FormEditorProps> = ({ data, onChange }) => {
  const [activeSection, setActiveSection] = useState<Section>('basic');
  const { register, control, watch, setValue, reset } = useForm<Resume>({ defaultValues: data });

  React.useEffect(() => {
    const subscription = watch((value) => { if (value) onChange(value as Resume); });
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

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

  return (
    <div className="form-editor-container">
      <FormSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        watch={watch}
        onExport={handleExport}
        onImport={handleImport}
      />
      <div className="form-content-area">
        {activeSection === 'basic' && <BasicInfoSection register={register} />}
        {activeSection === 'links' && <LinksSection control={control} register={register} watch={watch} setValue={setValue} />}
        {activeSection === 'experience' && <ExperienceSection control={control} register={register} watch={watch} setValue={setValue} />}
      </div>
    </div>
  );
};
