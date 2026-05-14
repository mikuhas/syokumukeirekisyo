import React from 'react';
import type { Profile as ProfileType } from '../../schema/resumeSchema';
import { Link as LinkIcon } from 'lucide-react';

interface ProfileProps {
  data: ProfileType;
}

export const Profile: React.FC<ProfileProps> = ({ data }) => {
  const today = new Date().toLocaleDateString('ja-JP');

  return (
    <section className="profile-section">
      <div className="resume-title-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.8rem', margin: 0, color: '#162333', letterSpacing: '0.1em' }}>職務経歴書</h1>
        <div style={{ textAlign: 'right', fontSize: '0.9rem' }}>
          <div style={{ fontWeight: 'bold' }}>{data.name}</div>
          <div>更新日: {today}</div>
        </div>
      </div>

      <div className="profile-header">
        {data.links && data.links.length > 0 && (
          <div className="links-info">
            {data.links.map((link, idx) => (
              <div key={idx} className="contact-item">
                <LinkIcon size={14} />
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="profile-grid">
        <div className="summary-box">
          <h2>■ 職務要約</h2>
          <p>{data.summary}</p>
        </div>
      </div>

      {data.certifications && data.certifications.length > 0 && (
        <div className="certifications">
          <h2>■ 資格</h2>
          <div className="cert-tags">
            {data.certifications.map((cert, idx) => (
              <span key={idx} className="cert-tag">{cert}</span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
