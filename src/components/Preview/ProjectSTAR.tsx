import React from 'react';
import type { STAR } from '../../schema/resumeSchema';

const STAR_LABELS = [
  { key: 'situation', label: 'Situation / 状況' },
  { key: 'task',      label: 'Task / 課題' },
  { key: 'action',    label: 'Action / 行動' },
  { key: 'result',    label: 'Result / 結果' },
] as const;

interface ProjectSTARProps {
  star: STAR;
}

export const ProjectSTAR: React.FC<ProjectSTARProps> = ({ star }) => (
  <div className="star-section">
    <div className="star-heading">■ 課題と対応 (STAR)</div>
    <div className="star-items">
      {STAR_LABELS.map(({ key, label }) => (
        <div key={key}>
          <div className="project-sub-label">{label}</div>
          <div className="project-sub-value">{star[key] || '-'}</div>
        </div>
      ))}
    </div>
  </div>
);
