import React from 'react';
import type { SectionId } from '../../App';

const SECTION_LABELS: Record<SectionId, string> = {
  'summary':        '職務要約',
  'skill-stack':    'スキルスタック',
  'self-promotion': '自己PR',
  'work-experience':'職務経歴',
};

interface PreviewTOCProps {
  onNavigate: (id: string) => void;
  sectionOrder: SectionId[];
}

export const PreviewTOC: React.FC<PreviewTOCProps> = ({ onNavigate, sectionOrder }) => (
  <aside className="preview-sidebar no-print">
    <nav className="toc-nav">
      <div className="toc-title">目次</div>
      <ul className="toc-list">
        <li>
          <a
            href="#basic-info"
            className="toc-link"
            onClick={(e) => { e.preventDefault(); onNavigate('basic-info'); }}
          >
            基本情報
          </a>
        </li>
        {sectionOrder.map((id) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className="toc-link"
              onClick={(e) => { e.preventDefault(); onNavigate(id); }}
            >
              {SECTION_LABELS[id]}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  </aside>
);
