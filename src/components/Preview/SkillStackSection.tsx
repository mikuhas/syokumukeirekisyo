import React from 'react';
import { PREDEFINED_TECH_STACK } from '../../constants/techStack';
import type { HighlightSkill } from '../../schema/resumeSchema';

const OPTIONAL_CATEGORIES = ['インフラ・クラウド', 'データベース・ミドルウェア', 'その他フレームワーク'];

const SkillBadge: React.FC<{ skill: HighlightSkill; maxYears: number }> = ({ skill, maxYears }) => {
  const pct = maxYears > 0 ? (skill.years / maxYears) * 100 : 0;
  return (
    <div className="highlight-skill-badge-row">
      <span className="highlight-skill-badge-name">{skill.name}</span>
      <div className="highlight-skill-badge-bar-wrap">
        <div className="highlight-skill-badge-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="highlight-skill-badge-years">{skill.years}年</span>
    </div>
  );
};

interface SkillStackSectionProps {
  aggregatedSkillStack: Record<string, Set<string>>;
  highlightSkills?: HighlightSkill[];
}

export const SkillStackSection: React.FC<SkillStackSectionProps> = ({ aggregatedSkillStack, highlightSkills }) => {
  const activeHighlights = (highlightSkills ?? []).filter(s => s.name);
  const maxYears = activeHighlights.length > 0 ? Math.max(...activeHighlights.map(s => s.years)) : 0;

  return (
    <section id="skill-stack" className="skill-stack-section">
      <h2>スキルスタック</h2>
      {activeHighlights.length > 0 && (
        <>
          <div className="highlight-skills-circles">
            {activeHighlights.map((skill, i) => (
              <SkillBadge key={i} skill={skill} maxYears={maxYears} />
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
