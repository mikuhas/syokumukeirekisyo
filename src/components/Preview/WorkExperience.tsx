import React from 'react';
import type { WorkExperience as WorkExperienceType } from '../../schema/resumeSchema';
import { Project } from './Project';

interface WorkExperienceProps {
  data: WorkExperienceType;
  expIndex: number;
}

const formatDate = (dateStr: string | null | undefined) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return `${date.getFullYear()}年${date.getMonth() + 1}月`;
};

export const WorkExperience: React.FC<WorkExperienceProps> = ({ data, expIndex }) => {
  const periodDisplay = data.isCurrentlyWorking
    ? `${formatDate(data.startDate)} - 現在`
    : `${formatDate(data.startDate)} - ${formatDate(data.endDate)}`;

  return (
    <table className="experience-table">
      <tbody>
        <tr>
          <td colSpan={2} className="exp-header-cell">
            <span className="exp-company-name">
              {data.company || <span className="placeholder-text">(会社名を入力)</span>}
            </span>
            <span className="exp-period">
              {periodDisplay || <span className="placeholder-text">(期間を入力)</span>}
            </span>
            {data.employmentStatus && (
              <span className="exp-employment-status">{data.employmentStatus}</span>
            )}
          </td>
        </tr>
        <tr>
          <td colSpan={2} className="exp-projects-cell">
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
