import React from 'react';
import type { Resume } from '../../schema/resumeSchema';
import type { SectionId } from '../../App';
import { Profile } from './Profile';
import { WorkExperience } from './WorkExperience';
import { PreviewTOC } from './PreviewTOC';
import { SkillStackSection } from './SkillStackSection';

interface PreviewProps {
  data: Resume;
  sectionOrder: SectionId[];
}

const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  const header = document.querySelector('header');
  const headerHeight = header ? header.getBoundingClientRect().height + 16 : 80;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - headerHeight - 16, behavior: 'smooth' });
};

function buildAggregatedSkillStack(data: Resume): Record<string, Set<string>> {
  const result: Record<string, Set<string>> = {};
  data.workExperiences.forEach((exp) => {
    exp.projects.forEach((project) => {
      if (!project.techStack) return;
      Object.entries(project.techStack).forEach(([category, techs]) => {
        if (!result[category]) result[category] = new Set();
        techs.forEach((tech) => result[category].add(tech.name));
      });
    });
  });
  return result;
}

export const Preview: React.FC<PreviewProps> = ({ data, sectionOrder }) => {
  const aggregatedSkillStack = buildAggregatedSkillStack(data);

  const renderSection = (id: SectionId) => {
    switch (id) {
      case 'summary':
        return (
          <section key="summary" id="summary" className="resume-preview-section">
            <h2>職務要約</h2>
            <p style={{ whiteSpace: 'pre-wrap' }}>{data.profile.summary}</p>
          </section>
        );
      case 'skill-stack':
        return <SkillStackSection key="skill-stack" aggregatedSkillStack={aggregatedSkillStack} />;
      case 'self-promotion':
        return (
          <section key="self-promotion" id="self-promotion" className="self-promotion-section">
            <h2>自己PR</h2>
            <p>{data.profile.selfPromotion}</p>
          </section>
        );
      case 'work-experience':
        return (
          <section key="work-experience" id="work-experience" className="experiences-container">
            <h2>職務経歴</h2>
            {data.workExperiences.map((exp, idx) => (
              <WorkExperience key={idx} data={exp} expIndex={idx} />
            ))}
          </section>
        );
    }
  };

  return (
    <div className="preview-layout">
      <PreviewTOC onNavigate={scrollToId} sectionOrder={sectionOrder} />
      <div className="resume-preview">
        <div id="basic-info"><Profile data={data.profile} /></div>
        {sectionOrder.map(renderSection)}
        <div className="resume-end">以上</div>
      </div>
    </div>
  );
};
