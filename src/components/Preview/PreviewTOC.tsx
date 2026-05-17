import React from 'react';

const TOC_ITEMS = [
  { id: 'basic-info',      label: '基本情報' },
  { id: 'skill-stack',     label: 'スキルスタック' },
  { id: 'self-promotion',  label: '自己PR' },
  { id: 'work-experience', label: '職務経歴' },
] as const;

interface PreviewTOCProps {
  onNavigate: (id: string) => void;
}

export const PreviewTOC: React.FC<PreviewTOCProps> = ({ onNavigate }) => (
  <aside className="preview-sidebar no-print">
    <nav className="toc-nav">
      <div className="toc-title">目次</div>
      <ul className="toc-list">
        {TOC_ITEMS.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className="toc-link"
              onClick={(e) => { e.preventDefault(); onNavigate(id); }}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  </aside>
);
