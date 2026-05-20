import React, { useState } from 'react';
import type { UseFormWatch, UseFormSetValue } from 'react-hook-form';
import type { Resume } from '../../schema/resumeSchema';
import { Button } from '../Button';
import { Download, Upload, User, Link as LinkIcon, Briefcase, LayoutList, ChevronUp, ChevronDown, ChevronRight } from 'lucide-react';

export type Section = 'basic' | 'links' | 'experience' | 'order';

const MENU_ITEMS = [
  { id: 'basic', label: '基本情報', icon: User },
  { id: 'links', label: 'リンク・資格', icon: LinkIcon },
  { id: 'experience', label: '職務経歴', icon: Briefcase },
  { id: 'order', label: 'セクション順序', icon: LayoutList },
] as const;

function reorder<T>(arr: T[], from: number, dir: -1 | 1): T[] {
  const to = from + dir;
  if (to < 0 || to >= arr.length) return arr;
  const next = [...arr];
  [next[from], next[to]] = [next[to], next[from]];
  return next;
}

interface FormSidebarProps {
  activeSection: Section;
  setActiveSection: (s: Section) => void;
  watch: UseFormWatch<Resume>;
  setValue: UseFormSetValue<Resume>;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FormSidebar: React.FC<FormSidebarProps> = ({
  activeSection, setActiveSection, watch, setValue, onExport, onImport,
}) => {
  const workExperiences = watch('workExperiences') ?? [];
  const [expandedExp, setExpandedExp] = useState<Set<number>>(new Set());
  const [sortDir, setSortDir] = useState<'asc' | 'desc' | null>(null);

  const toggleCollapse = (expIdx: number) => {
    setExpandedExp(prev => {
      const next = new Set(prev);
      next.has(expIdx) ? next.delete(expIdx) : next.add(expIdx);
      return next;
    });
  };

  const moveExp = (expIdx: number, dir: -1 | 1) => {
    setValue('workExperiences', reorder(workExperiences, expIdx, dir) as any);
    setSortDir(null);
  };

  const moveProj = (expIdx: number, projIdx: number, dir: -1 | 1) => {
    const projs = workExperiences[expIdx]?.projects ?? [];
    setValue(`workExperiences.${expIdx}.projects`, reorder(projs, projIdx, dir) as any);
    setSortDir(null);
  };

  const sortAll = (dir: 'asc' | 'desc') => {
    const cmp = (a: string, b: string) => dir === 'asc' ? a.localeCompare(b) : b.localeCompare(a);
    const sorted = [...workExperiences]
      .sort((a, b) => cmp(a.startDate || '', b.startDate || ''))
      .map(exp => ({
        ...exp,
        projects: [...(exp.projects ?? [])].sort((a, b) => cmp(a.startDate || '', b.startDate || '')),
      }));
    setValue('workExperiences', sorted as any);
    setSortDir(dir);
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const header = document.querySelector('header');
    const headerHeight = header ? header.getBoundingClientRect().height + 16 : 80;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - headerHeight - 16, behavior: 'smooth' });
  };

  return (
    <aside className="form-sidebar">
      <div className="sidebar-actions">
        <Button variant="outline" size="md" onClick={onExport} className="w-full">
          <Download size={16} /> Export
        </Button>
        <label className="import-file-label">
          <input type="file" accept=".yml,.yaml" onChange={onImport} className="hidden" />
          <Button variant="outline" size="md" className="w-full" as="span">
            <Upload size={16} /> Import
          </Button>
        </label>
      </div>
      <div className="sidebar-menu">
        {MENU_ITEMS.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            className={`sidebar-item ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => setActiveSection(item.id as Section)}
            as="button"
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </Button>
        ))}
      </div>
      {activeSection === 'experience' && (
        <div className="sidebar-project-nav">
          <div className="sidebar-project-nav-title">プロジェクト一覧</div>
          <div className="sidebar-sort-controls">
            <div className="sidebar-sort-row">
              <span className="sidebar-sort-label">開始日で並び替え</span>
              <button type="button" className={`sidebar-sort-btn ${sortDir === 'asc' ? 'active' : ''}`} onClick={() => sortAll('asc')}>昇順</button>
              <button type="button" className={`sidebar-sort-btn ${sortDir === 'desc' ? 'active' : ''}`} onClick={() => sortAll('desc')}>降順</button>
            </div>
            <div className="sidebar-sort-row">
              <span className="sidebar-sort-label">担当工程の並び順</span>
              <button
                type="button"
                className={`sidebar-sort-btn ${watch('processScoreOrder') !== 'score' ? 'active' : ''}`}
                onClick={() => setValue('processScoreOrder', 'process')}
              >工程</button>
              <button
                type="button"
                className={`sidebar-sort-btn ${watch('processScoreOrder') === 'score' ? 'active' : ''}`}
                onClick={() => setValue('processScoreOrder', 'score')}
              >関与</button>
            </div>
          </div>
          {workExperiences.map((exp, expIdx) => {
            const isCollapsed = !expandedExp.has(expIdx);
            return (
              <div key={expIdx} className="sidebar-exp-item">
                <div
                  className="sidebar-exp-company"
                  onClick={() => toggleCollapse(expIdx)}
                  role="button"
                  aria-expanded={!isCollapsed}
                >
                  <ChevronRight
                    size={12}
                    className={`sidebar-exp-chevron ${isCollapsed ? '' : 'expanded'}`}
                  />
                  <span className="sidebar-exp-name">{exp.company || `経歴 #${expIdx + 1}`}</span>
                  <div className="sidebar-order-btns" onClick={(e) => e.stopPropagation()}>
                    <button type="button" className="sidebar-order-btn" onClick={() => moveExp(expIdx, -1)} disabled={expIdx === 0} aria-label="上へ"><ChevronUp size={12} /></button>
                    <button type="button" className="sidebar-order-btn" onClick={() => moveExp(expIdx, 1)} disabled={expIdx === workExperiences.length - 1} aria-label="下へ"><ChevronDown size={12} /></button>
                  </div>
                </div>
                <div className={`sidebar-exp-projects ${isCollapsed ? 'collapsed' : ''}`}>
                  <div>
                    {(exp.projects ?? []).map((proj, projIdx) => (
                      <div key={projIdx} className="sidebar-proj-item" onClick={() => scrollTo(`editor-project-${expIdx}-${projIdx}`)}>
                        <span className="sidebar-proj-title">
                          {proj.startDate && <><span className="sidebar-proj-date">{proj.startDate}</span><span className="sidebar-proj-sep">·</span></>}
                          {proj.name || '無題のプロジェクト'}
                        </span>
                        <div className="sidebar-order-btns">
                          <button type="button" className="sidebar-order-btn" onClick={(e) => { e.stopPropagation(); moveProj(expIdx, projIdx, -1); }} disabled={projIdx === 0} aria-label="上へ"><ChevronUp size={12} /></button>
                          <button type="button" className="sidebar-order-btn" onClick={(e) => { e.stopPropagation(); moveProj(expIdx, projIdx, 1); }} disabled={projIdx === (exp.projects?.length ?? 0) - 1} aria-label="下へ"><ChevronDown size={12} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </aside>
  );
};
