import React from 'react';
import { PREDEFINED_TECH_STACK } from '../../constants/techStack';

const OPTIONAL_CATEGORIES = ['インフラ・クラウド', 'データベース・ミドルウェア', 'その他フレームワーク'];

interface SkillStackSectionProps {
  aggregatedSkillStack: Record<string, Set<string>>;
}

export const SkillStackSection: React.FC<SkillStackSectionProps> = ({ aggregatedSkillStack }) => (
  <section id="skill-stack" className="skill-stack-section">
    <h2>スキルスタック</h2>
    <table className="skill-table">
      <tbody>
        {Object.keys(PREDEFINED_TECH_STACK).map((category) => {
          const techs = aggregatedSkillStack[category];
          const isEmpty = !techs || techs.size === 0;
          if (OPTIONAL_CATEGORIES.includes(category) && isEmpty) return null;
          return (
            <tr key={category} className="tech-category-row">
              <td className="skill-table-label">{category}</td>
              <td className="skill-table-value">
                {!isEmpty ? Array.from(techs).join(' / ') : '-'}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </section>
);
