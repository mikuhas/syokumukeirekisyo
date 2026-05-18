import React from 'react';
import type { UseFormWatch, UseFormSetValue } from 'react-hook-form';
import type { Resume } from '../../schema/resumeSchema';
import { PREDEFINED_TECH_STACK } from '../../constants/techStack';
import { Trash2 } from 'lucide-react';

type TechItem = { name: string; version?: string };
type SkillStack = Record<string, TechItem[]>;

interface SkillStackEditorProps {
  path: string;
  watch: UseFormWatch<Resume>;
  setValue: UseFormSetValue<Resume>;
}

export const SkillStackEditor: React.FC<SkillStackEditorProps> = ({ path, watch, setValue }) => {
  const skillStack = (watch(path as any) as SkillStack) ?? {};
  const categories = Object.keys(PREDEFINED_TECH_STACK);

  const addItem = (cat: string, item: string) => {
    const current: TechItem[] = skillStack[cat] ?? [];
    if (!current.find((i) => i.name === item)) {
      setValue(`${path}.${cat}` as any, [...current, { name: item, version: '' }]);
    }
  };

  const removeItem = (cat: string, item: string) => {
    const current: TechItem[] = skillStack[cat] ?? [];
    setValue(`${path}.${cat}` as any, current.filter((i) => i.name !== item));
  };

  const updateVersion = (cat: string, item: string, version: string) => {
    const current: TechItem[] = skillStack[cat] ?? [];
    setValue(`${path}.${cat}` as any, current.map((i) => i.name === item ? { name: item, version } : i));
  };

  return (
    <div className="skill-stack-form">
      <div className="categories-grid">
        {categories.map((cat) => (
          <div key={cat} className="category-item-card">
            <div className="category-item-header">
              <span className="category-tag">【{cat}】</span>
            </div>
            <div className="skill-add-row">
              <select className="skill-select" onChange={(e) => addItem(cat, e.target.value)} value="">
                <option value="" disabled>技術を選択して追加</option>
                {PREDEFINED_TECH_STACK[cat as keyof typeof PREDEFINED_TECH_STACK].map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>
            <div className="chips-wrapper chips-wrapper-col">
              {(skillStack[cat] ?? []).map((item) => (
                <div key={item.name} className="skill-chip-row">
                  <div className="form-chip skill-chip">
                    <span className="chip-name">{item.name}</span>
                  </div>
                  <input
                    type="text"
                    className="skill-version-input"
                    placeholder="Version"
                    value={item.version ?? ''}
                    onChange={(e) => updateVersion(cat, item.name, e.target.value)}
                  />
                  <button
                    type="button"
                    className="chip-remove-btn"
                    onClick={() => removeItem(cat, item.name)}
                    aria-label={`${item.name}を削除`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
