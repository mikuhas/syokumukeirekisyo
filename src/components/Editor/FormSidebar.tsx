import React from 'react';
import type { UseFormWatch } from 'react-hook-form';
import type { Resume } from '../../schema/resumeSchema';
import { Button } from '../Button';
import { Download, Upload, User, Link as LinkIcon, Briefcase } from 'lucide-react';

type Section = 'basic' | 'links' | 'experience';

const MENU_ITEMS = [
  { id: 'basic', label: '基本情報', icon: User },
  { id: 'links', label: 'リンク・資格', icon: LinkIcon },
  { id: 'experience', label: '職務経歴', icon: Briefcase },
] as const;

interface FormSidebarProps {
  activeSection: Section;
  setActiveSection: (s: Section) => void;
  watch: UseFormWatch<Resume>;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FormSidebar: React.FC<FormSidebarProps> = ({
  activeSection, setActiveSection, watch, onExport, onImport,
}) => {
  const workExperiences = watch('workExperiences') ?? [];

  return (
    <aside className="form-sidebar">
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
        {activeSection === 'experience' && (
          <div className="sidebar-project-nav">
            <div className="sidebar-project-nav-title">プロジェクト一覧</div>
            {workExperiences.map((exp, expIdx) => (
              <div key={expIdx} className="sidebar-exp-item">
                <div className="sidebar-exp-company">{exp.company || `経歴 #${expIdx + 1}`}</div>
                {(exp.projects ?? []).map((proj, projIdx) => (
                  <div
                    key={projIdx}
                    className="sidebar-proj-item"
                    onClick={() => {
                      const el = document.getElementById(`editor-project-${expIdx}-${projIdx}`);
                      if (!el) return;
                      const header = document.querySelector('header');
                      const headerHeight = header ? header.getBoundingClientRect().height + 16 : 80;
                      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - headerHeight - 16, behavior: 'smooth' });
                    }}
                  >
                    • {proj.name || '無題のプロジェクト'}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="sidebar-actions">
        <Button variant="outline" size="sm" onClick={onExport} className="w-full">
          <Download size={14} /> エクスポート
        </Button>
        <label className="import-file-label">
          <input type="file" accept=".yml,.yaml" onChange={onImport} className="hidden" />
          <Button variant="outline" size="sm" className="w-full" as="span">
            <Upload size={14} /> インポート
          </Button>
        </label>
      </div>
    </aside>
  );
};
