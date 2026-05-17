import React, { useState, useEffect } from 'react';
import yaml from 'js-yaml';
import { ResumeSchema } from '../../schema/resumeSchema';
import type { Resume } from '../../schema/resumeSchema';

interface YamlEditorProps {
  data: Resume;
  onChange: (newData: Resume) => void;
}

export const YamlEditor: React.FC<YamlEditorProps> = ({ data, onChange }) => {
  const [yamlText, setYamlText] = useState(yaml.dump(data));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setYamlText(yaml.dump(data));
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setYamlText(text);

    try {
      const parsed = yaml.load(text);
      const validated = ResumeSchema.safeParse(parsed);

      if (validated.success) {
        onChange(validated.data);
        setError(null);
      } else {
        setError(validated.error.issues.map((err) => `${err.path.join('.')}: ${err.message}`).join('\n'));
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="yaml-editor">
      <textarea
        className="yaml-editor-textarea"
        value={yamlText}
        onChange={handleChange}
        spellCheck={false}
        rows={30}
      />
      {error && <pre className="yaml-editor-error">{error}</pre>}
    </div>
  );
};
