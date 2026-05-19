import React, { useState } from 'react';
import type { UseFormWatch, UseFormSetValue } from 'react-hook-form';
import type { Resume } from '../../schema/resumeSchema';
import { PREDEFINED_TECH_STACK } from '../../constants/techStack';
import { Trash2, Plus, X } from 'lucide-react';

type TechItem = { name: string; version?: string };
type SkillStack = Record<string, TechItem[]>;

interface SkillStackEditorProps {
  path: string;
  watch: UseFormWatch<Resume>;
  setValue: UseFormSetValue<Resume>;
}

export const SkillStackEditor: React.FC<SkillStackEditorProps> = ({ path, watch, setValue }) => {
  const skillStack = (watch(path as any) as SkillStack) ?? {};
  const [newCatName, setNewCatName] = useState('');
  const [customInputs, setCustomInputs] = useState<Record<string, string>>({});

  const predefinedCats = Object.keys(PREDEFINED_TECH_STACK);
  const existingCats = Object.keys(skillStack);
  const allCategories = [
    ...existingCats,
    ...predefinedCats.filter(c => !existingCats.includes(c)),
  ];

  const addItem = (cat: string, itemName: string) => {
    if (!itemName.trim()) return;
    const current: TechItem[] = skillStack[cat] ?? [];
    if (!current.find((i) => i.name === itemName)) {
      setValue(`${path}.${cat}` as any, [...current, { name: itemName, version: '' }]);
    }
  };

  const removeItem = (cat: string, itemName: string) => {
    const current: TechItem[] = skillStack[cat] ?? [];
    setValue(`${path}.${cat}` as any, current.filter((i) => i.name !== itemName));
  };

  const updateVersion = (cat: string, itemName: string, version: string) => {
    const current: TechItem[] = skillStack[cat] ?? [];
    setValue(`${path}.${cat}` as any, current.map((i) => i.name === itemName ? { name: itemName, version } : i));
  };

  const removeCategory = (cat: string) => {
    const next = { ...skillStack };
    delete next[cat];
    setValue(path as any, Object.keys(next).length ? next : undefined);
  };

  const addCategory = () => {
    const name = newCatName.trim();
    if (!name || allCategories.includes(name)) return;
    setValue(`${path}.${name}` as any, []);
    setNewCatName('');
  };

  const addCustomItem = (cat: string) => {
    const val = (customInputs[cat] ?? '').trim();
    if (!val) return;
    addItem(cat, val);
    setCustomInputs(prev => ({ ...prev, [cat]: '' }));
  };

  return (
    <div className="skill-stack-form">
      <div className="categories-grid">
        {allCategories.map((cat) => {
          const predefined = PREDEFINED_TECH_STACK[cat as keyof typeof PREDEFINED_TECH_STACK];
          return (
            <div key={cat} className="category-item-card">
              <div className="category-item-header">
                <span className="category-tag">【{cat}】</span>
                {!predefined && (
                  <button
                    type="button"
                    className="category-delete-btn"
                    onClick={() => removeCategory(cat)}
                    aria-label={`${cat}を削除`}
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
              {predefined && (
                <div className="skill-add-row">
                  <select className="skill-select" onChange={(e) => addItem(cat, e.target.value)} value="">
                    <option value="" disabled>選択して追加</option>
                    {predefined.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="skill-add-row">
                <input
                  type="text"
                  className="skill-custom-input"
                  placeholder="カスタム追加"
                  value={customInputs[cat] ?? ''}
                  onChange={(e) => setCustomInputs(prev => ({ ...prev, [cat]: e.target.value }))}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomItem(cat); } }}
                />
                <button type="button" className="skill-custom-add-btn" onClick={() => addCustomItem(cat)}>
                  <Plus size={14} />
                </button>
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
          );
        })}
      </div>
      <div className="category-add-row">
        <input
          type="text"
          className="category-name-input"
          placeholder="新しいカテゴリ名（例: テスト・品質管理）"
          value={newCatName}
          onChange={(e) => setNewCatName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCategory(); } }}
        />
        <button type="button" className="category-add-btn" onClick={addCategory}>
          <Plus size={14} /> カテゴリを追加
        </button>
      </div>
    </div>
  );
};
