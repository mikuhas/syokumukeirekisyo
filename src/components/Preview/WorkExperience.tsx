import React from 'react';
import type { WorkExperience as WorkExperienceType } from '../../schema/resumeSchema';
import { Project } from './Project';

interface WorkExperienceProps {
  data: WorkExperienceType;
  expIndex: number;
}

export const WorkExperience: React.FC<WorkExperienceProps> = ({ data, expIndex }) => {
  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getFullYear()}年${date.getMonth() + 1}月`;
  };

  const periodDisplay = data.isCurrentlyWorking 
    ? `${formatDate(data.startDate)} - 現在`
    : `${formatDate(data.startDate)} - ${formatDate(data.endDate)}`;

  return (
    <table className="experience-table" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '25px' }}>
      <tbody>
        <tr>
          <td colSpan={2} style={{ padding: '10px', borderBottom: '2px solid #162333' }}>
            <span style={{ fontWeight: 'bold', fontSize: '1rem', color: '#162333', marginRight: '15px' }}>{data.company || <span style={{ color: 'red' }}>(会社名を入力)</span>}</span>
            <span style={{ fontSize: '0.9rem', color: '#3a5070' }}>{periodDisplay || <span style={{ color: 'red' }}>(期間を入力)</span>}</span>
          </td>
        </tr>
        <tr>
          <td colSpan={2} style={{ padding: '10px 0' }}>
            <div className="projects-list">
              {data.projects.map((project, idx) => (
                <Project key={idx} data={project} expIndex={expIndex} projectIndex={idx} />
              ))}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
};


