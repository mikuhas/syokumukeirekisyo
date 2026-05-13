import React from 'react';
import type { Resume } from '../../schema/resumeSchema';
import { Profile } from './Profile';
import { WorkExperience } from './WorkExperience';

interface PreviewProps {
  data: Resume;
}

export const Preview: React.FC<PreviewProps> = ({ data }) => {
  return (
    <div className="resume-preview">
      <div id="basic-info"><Profile data={data.profile} /></div>
      
      <section id="work-experience" className="experiences-container">
        <h2 className="section-title"><span style={{ fontSize: '0.8em', marginRight: '5px' }}>■</span>職務経歴</h2>
        
        {data.workExperiences.map((exp, idx) => (
          <WorkExperience key={idx} data={exp} expIndex={idx} />
        ))}
      </section>

      {data.profile.skillStack && Object.keys(data.profile.skillStack).length > 0 && (
        <section id="skill-stack" className="skill-stack-section">
          <h2><span style={{ fontSize: '0.8em', marginRight: '5px' }}>■</span>スキルスタック</h2>
          <div className="tech-stack-grouped">
            {Object.entries(data.profile.skillStack).map(([category, items]) => (
              <div key={category} className="tech-category-row" style={{ marginBottom: '10px' }}>
                <span style={{ fontWeight: 'bold' }}>{category}:</span>
                <span style={{ marginLeft: '5px' }}>{items.join(' / ')}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section id="self-promotion" className="self-promotion-section">
        <h2><span style={{ fontSize: '0.8em', marginRight: '5px' }}>■</span>自己PR</h2>
        <p style={{ whiteSpace: 'pre-wrap' }}>{data.profile.selfPromotion}</p>
      </section>
    </div>
  );
};
