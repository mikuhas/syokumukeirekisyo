import React from 'react';
import { PREDEFINED_TECH_STACK } from '../../constants/techStack';

const OPTIONAL_CATEGORIES = ['インフラ・クラウド', 'データベース・ミドルウェア', 'その他フレームワーク'];

interface ProjectTechStackProps {
  techStack?: Record<string, Array<{ name: string; version?: string }>>;
}

export const ProjectTechStack: React.FC<ProjectTechStackProps> = ({ techStack }) => {
  if (!techStack) return <span className="text-muted">-</span>;

  return (
    <div className="tech-stack-list">
      {Object.keys(PREDEFINED_TECH_STACK).map((category) => {
        const items = techStack[category];
        const isEmpty = !items || items.length === 0;
        if (OPTIONAL_CATEGORIES.includes(category) && isEmpty) return null;
        return (
          <div key={category}>
            <div className="project-sub-label">{category}</div>
            <div className="tech-stack-value">
              {!isEmpty ? items.map((tech) => tech.name).join(' / ') : '-'}
            </div>
          </div>
        );
      })}
    </div>
  );
};
