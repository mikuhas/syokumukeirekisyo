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
        setError(validated.error.issues.map((err: any) => `${err.path.join('.')}: ${err.message}`).join('\n'));
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="yaml-editor">
      <textarea
        value={yamlText}
        onChange={handleChange}
        spellCheck={false}
        rows={30}
        style={{
          width: '100%',
          fontFamily: 'monospace',
          padding: '10px',
          fontSize: '14px',
          backgroundColor: '#2d2d2d',
          color: '#ccc',
          border: '1px solid #444',
          borderRadius: '4px'
        }}
      />
      {error && (
        <pre style={{ color: '#ff6b6b', whiteSpace: 'pre-wrap', fontSize: '12px', marginTop: '10px' }}>
          {error}
        </pre>
      )}
    </div>
  );
};
