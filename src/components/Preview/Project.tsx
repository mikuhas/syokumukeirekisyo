import React from 'react';
import type { Project as ProjectType } from '../../schema/resumeSchema';
import { ProjectTechStack } from './ProjectTechStack';
import { ProjectSTAR } from './ProjectSTAR';

interface ProjectProps {
  data: ProjectType;
  expIndex: number;
  projectIndex: number;
  processScoreOrder?: 'process' | 'score';
}

const PROCESS_LABELS = [
  { key: 'requirements',   label: '要件定義' },
  { key: 'basicDesign',    label: '基本設計' },
  { key: 'detailedDesign', label: '詳細設計' },
  { key: 'frontend',       label: 'フロントエンド' },
  { key: 'backend',        label: 'バックエンド' },
  { key: 'infrastructure', label: 'インフラ' },
] as const;


const ProcessBarGraph: React.FC<{ level: number | undefined }> = ({ level }) => {
  const filled = Math.max(0, Number(level) || 0);
  const W = 100;
  const H = 8;
  return (
    <svg className="process-bar-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" shapeRendering="crispEdges">
      <rect x={0} y={0} width={W} height={H} fill="#e5e7eb" />
      <rect x={0} y={0} width={(filled / 5) * W} height={H} fill="#162333" />
      {[20, 40, 60, 80].map(x => (
        <line key={x} x1={x + 0.5} y1={0} x2={x + 0.5} y2={H} stroke="white" strokeWidth={1} />
      ))}
    </svg>
  );
};

const formatDate = (dateStr: string | null | undefined) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return `${date.getFullYear()}年${date.getMonth() + 1}月`;
};

export const Project: React.FC<ProjectProps> = ({ data, expIndex, projectIndex, processScoreOrder }) => {
  const periodDisplay = data.isCurrentlyWorking
    ? `${formatDate(data.startDate)} - 現在`
    : (data.startDate ? `${formatDate(data.startDate)} - ${formatDate(data.endDate)}` : '');
  const hasStar = data.star && (data.star.situation || data.star.task || data.star.action || data.star.result);

  return (
    <table id={`project-${expIndex}-${projectIndex}`} className="project-table">
      <tbody>
        <tr>
          <td colSpan={2} className="project-header-cell">
            {data.name || <span className="placeholder-text">(プロジェクト名を入力)</span>}
            <span className="project-period">{periodDisplay}</span>
          </td>
        </tr>
        <tr>
            <td className="project-label-cell">担当工程</td>
            <td className="project-value-cell">
              <div className="process-scores-grid-preview">
                {[...PROCESS_LABELS]
                  .sort((a, b) =>
                    processScoreOrder === 'score'
                      ? (data.processScores?.[b.key] ?? 0) - (data.processScores?.[a.key] ?? 0)
                      : 0
                  )
                  .map(({ key, label }) => (
                  <div key={key} className="process-score-item">
                    <span className="process-scores-label">{label}</span>
                    <ProcessBarGraph level={data.processScores?.[key]} />
                  </div>
                ))}
              </div>
            </td>
          </tr>
        <tr>
          <td className="project-label-cell">職種</td>
          <td className="project-value-cell">{data.assignedTasks || <span className="placeholder-text">(職種を入力)</span>}</td>
        </tr>
        <tr>
          <td className="project-label-cell">開発規模</td>
          <td className="project-value-cell">{data.scale || <span className="placeholder-text">(開発規模を入力)</span>}</td>
        </tr>
        <tr>
          <td className="project-detail-label-cell">プロジェクト詳細</td>
          <td className="project-detail-value-cell">
            <div className="project-details-text">{data.details || <span className="placeholder-text">(プロジェクト詳細を入力)</span>}</div>
            <div className="project-sub-sections">
              {data.workContent && data.workContent.length > 0 && (
                <><div className="project-section-heading">■ 作業内容</div>
                <ul className="project-section-list">{data.workContent.map((item, idx) => <li key={idx}>{item}</li>)}</ul></>
              )}
              {data.responsibilities && data.responsibilities.length > 0 && (
                <><div className="project-section-heading">■ 担当業務</div>
                <ul className="project-section-list">{data.responsibilities.map((res, idx) => <li key={idx}>{res}</li>)}</ul></>
              )}
              <div className="project-section-heading">■ 使用技術</div>
              <div className="project-tech-container"><ProjectTechStack techStack={data.techStack} /></div>
              {hasStar && <ProjectSTAR star={data.star} />}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
