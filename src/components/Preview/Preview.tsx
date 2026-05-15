import React from 'react';
import type { Resume } from '../../schema/resumeSchema';
import { Profile } from './Profile';
import { WorkExperience } from './WorkExperience';

import { PREDEFINED_TECH_STACK } from '../../constants/techStack';

interface PreviewProps {
  data: Resume;
}

const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  const header = document.querySelector('header');
  const headerHeight = header ? header.getBoundingClientRect().height + 16 : 80;
  const top = el.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
  window.scrollTo({ top, behavior: 'smooth' });
};

export const Preview: React.FC<PreviewProps> = ({ data }) => {
  // Aggregate skill stack from all projects
  const aggregatedSkillStack: Record<string, Set<string>> = {};
  
  data.workExperiences.forEach(exp => {
    exp.projects.forEach(project => {
      if (project.techStack) {
        Object.entries(project.techStack).forEach(([category, techs]) => {
          if (!aggregatedSkillStack[category]) {
            aggregatedSkillStack[category] = new Set<string>();
          }
          techs.forEach(tech => {
            aggregatedSkillStack[category].add(tech.name);
          });
        });
      }
    });
  });

  // Use categories directly from PREDEFINED_TECH_STACK to ensure consistency with Edit mode
  const categories = Object.keys(PREDEFINED_TECH_STACK);

  return (
    <div className="preview-layout" style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', justifyContent: 'center', width: '100%' }}>
      {/* Table of Contents - Hidden on Print */}
      <aside className="preview-sidebar no-print" style={{ 
        width: '200px', 
        flexShrink: 0, 
        position: 'sticky', 
        top: '7rem',
        maxHeight: 'calc(100vh - 8rem)',
        overflowY: 'auto'
      }}>
        <nav className="preview-toc" style={{ 
          padding: '20px', 
          background: 'white', 
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '15px', color: '#111827', fontSize: '1rem', borderBottom: '2px solid #f3f4f6', paddingBottom: '8px' }}>目次</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.95rem' }}>
            {[
              { id: 'basic-info', label: '基本情報' },
              { id: 'skill-stack', label: 'スキルスタック' },
              { id: 'self-promotion', label: '自己PR' },
              { id: 'work-experience', label: '職務経歴' },
            ].map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  style={{ color: '#4b5563', textDecoration: 'none', fontWeight: '500' }}
                  onClick={(e) => { e.preventDefault(); scrollToId(id); }}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <div className="resume-preview">
        <div id="basic-info"><Profile data={data.profile} /></div>

        <section id="skill-stack" className="skill-stack-section">
          <h2>スキルスタック</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #b8c4d0', fontSize: '0.88rem' }}>
            <tbody>
              {categories.map((category) => {
                const techs = aggregatedSkillStack[category];
                const isEmpty = !techs || techs.size === 0;

                const skipIfEmpty = ['インフラ・クラウド', 'データベース・ミドルウェア', 'その他フレームワーク'];
                if (skipIfEmpty.includes(category) && isEmpty) return null;

                return (
                  <tr key={category} className="tech-category-row">
                    <td style={{ width: '150px', padding: '6px 10px', fontWeight: 'bold', borderRight: '1px solid #b8c4d0', borderBottom: '1px solid #b8c4d0', color: '#162333', whiteSpace: 'nowrap', verticalAlign: 'top' }}>
                      {category}
                    </td>
                    <td style={{ padding: '6px 10px', borderBottom: '1px solid #b8c4d0', lineHeight: 1.7 }}>
                      {!isEmpty ? Array.from(techs).join(' / ') : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        <section id="self-promotion" className="self-promotion-section">
          <h2>自己PR</h2>
          <p style={{ whiteSpace: 'pre-wrap' }}>{data.profile.selfPromotion}</p>
        </section>

        <section id="work-experience" className="experiences-container">
          <h2>職務経歴</h2>

          {data.workExperiences.map((exp, idx) => (
            <WorkExperience key={idx} data={exp} expIndex={idx} />
          ))}
        </section>

        <div className="resume-end" style={{ textAlign: 'right', fontSize: '0.9rem', marginTop: '10px' }}>以上</div>
      </div>
    </div>
  );
};
