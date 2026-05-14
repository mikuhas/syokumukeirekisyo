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

  const hasStar = data.star && (data.star.situation || data.star.task || data.star.action || data.star.result);

  return (
    <table id={`project-${expIndex}-${projectIndex}`} className="project-table" style={{ width: '100%', marginBottom: '20px', borderCollapse: 'collapse', border: '1px solid #b8c4d0' }}>
      <tbody>
        <tr>
          <td colSpan={2} style={{ fontWeight: 'bold', fontSize: '1.05rem', padding: '10px 10px', borderBottom: '2px solid #162333', color: '#162333' }}>
            {data.name || <span style={{ color: 'red' }}>(プロジェクト名を入力)</span>}
            <span style={{ fontSize: '0.8rem', fontWeight: 'normal', marginLeft: '12px', color: '#3a5070' }}>
              {periodDisplay}
            </span>
          </td>
        </tr>
        <tr>
          <td style={{ width: '18%', padding: '6px 10px', fontWeight: 'bold', borderRight: '1px solid #b8c4d0', borderBottom: '1px solid #b8c4d0', color: '#162333', fontSize: '0.88rem', whiteSpace: 'nowrap' }}>職種</td>
          <td style={{ width: '82%', padding: '6px 10px', borderBottom: '1px solid #b8c4d0', fontSize: '0.88rem' }}>{data.assignedTasks || <span style={{ color: 'red' }}>(職種を入力)</span>}</td>
        </tr>
        <tr>
          <td style={{ width: '18%', padding: '6px 10px', fontWeight: 'bold', borderRight: '1px solid #b8c4d0', borderBottom: '1px solid #b8c4d0', color: '#162333', fontSize: '0.88rem', whiteSpace: 'nowrap' }}>開発規模</td>
          <td style={{ width: '82%', padding: '6px 10px', borderBottom: '1px solid #b8c4d0', fontSize: '0.88rem' }}>{data.scale || <span style={{ color: 'red' }}>(開発規模を入力)</span>}</td>
        </tr>
        <tr>
          <td style={{ width: '18%', padding: '6px 10px', fontWeight: 'bold', borderRight: '1px solid #b8c4d0', borderBottom: '1px solid #b8c4d0', color: '#162333', fontSize: '0.88rem', whiteSpace: 'nowrap' }}>プロジェクト詳細</td>
          <td style={{ width: '82%', padding: '6px 10px', borderBottom: '1px solid #b8c4d0', fontSize: '0.88rem' }}>
            <div style={{ whiteSpace: 'pre-wrap', marginBottom: '10px' }}>{data.details || <span style={{ color: 'red' }}>(プロジェクト詳細を入力)</span>}</div>

            <div style={{ borderTop: '1px solid #d0d9e4', paddingTop: '8px' }}>
              {data.workContent && data.workContent.length > 0 && (
                <>
                  <div style={{ fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '3px', color: '#162333' }}>■ 作業内容</div>
                  <ul style={{ margin: 0, paddingLeft: '22px', fontSize: '0.85rem', marginBottom: '8px' }}>
                    {data.workContent.map((item, idx) => <li key={idx}>{item}</li>)}
                  </ul>
                </>
              )}

              {data.responsibilities && data.responsibilities.length > 0 && (
                <>
                  <div style={{ fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '3px', color: '#162333' }}>■ 担当業務</div>
                  <ul style={{ margin: 0, paddingLeft: '22px', fontSize: '0.85rem', marginBottom: '8px' }}>
                    {data.responsibilities.map((res, idx) => <li key={idx}>{res}</li>)}
                  </ul>
                </>
              )}

              <div style={{ fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '4px', color: '#162333' }}>■ 使用技術</div>
              <div style={{ marginBottom: '8px' }}>
                {data.techStack ? (
                  <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '0.85rem' }}>
                    <tbody>
                      {Object.keys(PREDEFINED_TECH_STACK).map((category) => {
                        const items = data.techStack?.[category];
                        const isEmpty = !items || items.length === 0;

                        const skipIfEmpty = ['インフラ・クラウド', 'データベース・ミドルウェア', 'その他フレームワーク'];
                        if (skipIfEmpty.includes(category) && isEmpty) return null;

                        return (
                          <tr key={category}>
                            <td style={{ width: '140px', fontWeight: 'bold', color: '#162333', paddingRight: '8px', verticalAlign: 'top', whiteSpace: 'nowrap' }}>{category}</td>
                            <td style={{ color: '#333' }}>{!isEmpty ? items.map(tech => tech.name).join(' / ') : '-'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : <span style={{ color: '#aaa' }}>-</span>}
              </div>

              {hasStar && (
                <div style={{ borderTop: '1px solid #d0d9e4', paddingTop: '8px', marginTop: '8px' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '6px', color: '#162333' }}>■ 課題と対応 (STAR)</div>
                  <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {[
                      { label: 'Situation / 状況', value: data.star.situation },
                      { label: 'Task / 課題', value: data.star.task },
                      { label: 'Action / 行動', value: data.star.action },
                      { label: 'Result / 結果', value: data.star.result },
                    ].map(({ label, value }) => (
                      <div key={label} style={{ borderLeft: '3px solid #b8c4d0', paddingLeft: '8px' }}>
                        <div style={{ fontWeight: 'bold', color: '#162333', marginBottom: '2px' }}>{label}</div>
                        <div style={{ whiteSpace: 'pre-wrap', color: '#333' }}>{value || '-'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
