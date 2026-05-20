import React from 'react';
import type { Profile as ProfileType } from '../../schema/resumeSchema';

interface ProfileProps {
  data: ProfileType;
}


export const Profile: React.FC<ProfileProps> = ({ data }) => {
  const today = new Date().toLocaleDateString('ja-JP');

  return (
    <section className="profile-section">
      <div className="resume-title-header">
        <h1>職務経歴書</h1>
        <div className="resume-date-block">
          <div className="name">{data.name}</div>
          <div>更新日: {today}</div>
        </div>
      </div>

      <div className="profile-header" />


      {data.certifications && data.certifications.length > 0 && (
        <div className="certifications">
          <h2>資格</h2>
          <ul className="cert-list">
            {data.certifications.map((cert, idx) => (
              <li key={idx}>{cert}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};
