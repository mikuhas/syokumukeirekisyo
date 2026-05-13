import React from 'react';
import type { Project as ProjectType } from '../../schema/resumeSchema';
import { PREDEFINED_TECH_STACK } from '../../constants/techStack';
interface ProjectProps {
  data: ProjectType;
  expIndex: number;
  projectIndex: number;
}

export const Project: React.FC<ProjectProps> = ({ data, expIndex, projectIndex }) => {
  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getFullYear()}年${date.getMonth() + 1}月`;
  };

  const periodDisplay = data.isCurrentlyWorking 
    ? `${formatDate(data.startDate)} - 現在`
    : (data.startDate ? `${formatDate(data.startDate)} - ${formatDate(data.endDate)}` : '');

  return (
    <table id={`project-${expIndex}-${projectIndex}`} className="project-table" style={{ width: '100%', marginBottom: '20px', borderCollapse: 'collapse', border: '1px solid #ccc' }}>
      <tbody>
        <tr>
          <td colSpan={2} style={{ fontWeight: 'bold', fontSize: '1.1rem', padding: '8px', borderBottom: '1px solid #ccc', backgroundColor: '#f9f9f9' }}>
            {data.name || <span style={{ color: 'red' }}>(プロジェクト名を入力)</span>}
            <span style={{ fontSize: '0.9rem', fontWeight: 'normal', marginLeft: '10px', color: '#666' }}>
              {periodDisplay}
            </span>
          </td>
        </tr>
        <tr>
          <td style={{ width: '20%', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #ccc', borderBottom: '1px solid #ccc' }}>職種</td>
          <td style={{ width: '80%', padding: '8px', borderBottom: '1px solid #ccc' }}>{data.assignedTasks || <span style={{ color: 'red' }}>(職種を入力)</span>}</td>
        </tr>
        <tr>
          <td style={{ width: '20%', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #ccc', borderBottom: '1px solid #ccc' }}>開発規模</td>
          <td style={{ width: '80%', padding: '8px', borderBottom: '1px solid #ccc' }}>{data.scale || <span style={{ color: 'red' }}>(開発規模を入力)</span>}</td>
        </tr>
        <tr>
          <td style={{ width: '20%', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #ccc', borderBottom: '1px solid #ccc' }}>プロジェクト詳細</td>
          <td style={{ width: '80%', padding: '8px', borderBottom: '1px solid #ccc' }}>
            <div style={{ whiteSpace: 'pre-wrap', marginBottom: '12px' }}>{data.details || <span style={{ color: 'red' }}>(プロジェクト詳細を入力)</span>}</div>
            
            <div style={{ borderTop: '1px solid #ddd', paddingTop: '10px' }}>
              {data.workContent && data.workContent.length > 0 && (
                <>
                  <div style={{ fontWeight: 'bold', fontSize: '0.95rem', marginBottom: '4px', color: '#2d3748' }}>■ 作業内容</div>
                  <ul style={{ margin: 0, paddingLeft: '25px', fontSize: '0.9rem', marginBottom: '10px' }}>
                    {data.workContent.map((item, idx) => <li key={idx}>{item}</li>)}
                  </ul>
                </>
              )}

              {data.responsibilities && data.responsibilities.length > 0 && (
                <>
                  <div style={{ fontWeight: 'bold', fontSize: '0.95rem', marginBottom: '4px', color: '#2d3748' }}>■ 担当業務</div>
                  <ul style={{ margin: 0, paddingLeft: '25px', fontSize: '0.9rem', marginBottom: '10px' }}>
                    {data.responsibilities.map((res, idx) => <li key={idx}>{res}</li>)}
                  </ul>
                </>
              )}
              
              <div style={{ fontWeight: 'bold', fontSize: '0.95rem', marginBottom: '4px', color: '#2d3748' }}>■ 使用技術</div>
              <div style={{ fontSize: '0.9rem', paddingLeft: '10px' }}>
                {data.techStack && Object.keys(data.techStack).length > 0 ? (
                  <div>
                    {Object.keys(PREDEFINED_TECH_STACK).map((category) => {
                      const items = data.techStack?.[category];
                      if (!items || items.length === 0) return null;
                      return (
                        <div key={category} style={{ marginBottom: '4px' }}>
                          <span style={{ fontWeight: 'bold' }}>{category}:</span>
                          <span style={{ marginLeft: '5px' }}>
                            {items.map(tech => `${tech.name}${tech.version ? ` (v${tech.version})` : ''}`).join(', ')}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : <span style={{ color: '#aaa' }}>-</span>}
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td colSpan={2} style={{ padding: '0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td style={{ width: '20%', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #ccc', borderBottom: '1px solid #ccc', color: '#2d3748' }}>Situation</td>
                  <td style={{ width: '80%', padding: '8px', borderBottom: '1px solid #ccc', whiteSpace: 'pre-wrap' }}>{data.star.situation || '-'}</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px', fontWeight: 'bold', borderRight: '1px solid #ccc', borderBottom: '1px solid #ccc', color: '#2d3748' }}>Task</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #ccc', whiteSpace: 'pre-wrap' }}>{data.star.task || '-'}</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px', fontWeight: 'bold', borderRight: '1px solid #ccc', borderBottom: '1px solid #ccc', color: '#2d3748' }}>Action</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #ccc', whiteSpace: 'pre-wrap' }}>{data.star.action || '-'}</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px', fontWeight: 'bold', borderRight: '1px solid #ccc', color: '#2d3748' }}>Result</td>
                  <td style={{ padding: '8px', whiteSpace: 'pre-wrap' }}>{data.star.result || '-'}</td>
                </tr>

              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
