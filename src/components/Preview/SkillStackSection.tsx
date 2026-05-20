import React from 'react';
import { PREDEFINED_TECH_STACK } from '../../constants/techStack';
import type { HighlightSkill } from '../../schema/resumeSchema';

const OPTIONAL_CATEGORIES = ['インフラ・クラウド', 'データベース・ミドルウェア', 'その他フレームワーク'];

const SkillCard: React.FC<{ skill: HighlightSkill }> = ({ skill }) => (
  <div className="highlight-skill-card-box">
    <div className="highlight-skill-card-name">{skill.name}</div>
    <div className="highlight-skill-card-inner">
      <span className="highlight-skill-card-years">{skill.years}</span>
      <span className="highlight-skill-card-unit">年</span>
    </div>
  </div>
);

interface SkillStackSectionProps {
  aggregatedSkillStack: Record<string, Set<string>>;
  highlightSkills?: HighlightSkill[];
}

export const SkillStackSection: React.FC<SkillStackSectionProps> = ({ aggregatedSkillStack, highlightSkills }) => {
  const activeHighlights = (highlightSkills ?? []).filter(s => s.name);

  return (
    <section id="skill-stack" className="skill-stack-section">
      <h2>スキルスタック</h2>
      {activeHighlights.length > 0 && (
        <>
          <div className="highlight-skills-circles">
            {activeHighlights.map((skill, i) => (
              <SkillCard key={i} skill={skill} />
            ))}
          </div>
        </>
      )}
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
};
