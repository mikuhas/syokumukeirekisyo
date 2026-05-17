import React from 'react';
import type { Resume } from '../../schema/resumeSchema';
import { Profile } from './Profile';
import { WorkExperience } from './WorkExperience';
import { PreviewTOC } from './PreviewTOC';
import { SkillStackSection } from './SkillStackSection';

interface PreviewProps {
  data: Resume;
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

export const Preview: React.FC<PreviewProps> = ({ data }) => {
  const aggregatedSkillStack = buildAggregatedSkillStack(data);

  return (
    <div className="preview-layout">
      <PreviewTOC onNavigate={scrollToId} />
      <div className="resume-preview">
        <div id="basic-info"><Profile data={data.profile} /></div>
        <SkillStackSection aggregatedSkillStack={aggregatedSkillStack} />
        <section id="self-promotion" className="self-promotion-section">
          <h2>自己PR</h2>
          <p>{data.profile.selfPromotion}</p>
        </section>
        <section id="work-experience" className="experiences-container">
          <h2>職務経歴</h2>
          {data.workExperiences.map((exp, idx) => (
            <WorkExperience key={idx} data={exp} expIndex={idx} />
          ))}
        </section>
        <div className="resume-end">以上</div>
      </div>
    </div>
  );
};
