import React from 'react';
import type { Profile as ProfileType } from '../../schema/resumeSchema';

interface ProfileProps {
  data: ProfileType;
}


function calcAge(birthday: string): number {
  const today = new Date();
  const birth = new Date(birthday);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export const Profile: React.FC<ProfileProps> = ({ data }) => {
  const today = new Date().toLocaleDateString('ja-JP');
  const age = data.birthday ? calcAge(data.birthday) : null;

  return (
    <section className="profile-section">
      <div className="resume-title-header">
        <h1>職務経歴書</h1>
        <div className="resume-date-block">
          <div className="name">{data.name}{age !== null ? `(満 ${age} 歳)` : ''}</div>
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
