import React from 'react';
import type { Profile as ProfileType } from '../../schema/resumeSchema';
import { LINK_SERVICES } from '../../constants/linkServices';
import { ServiceIcon } from '../ServiceIcon';
import { Link as LinkIcon } from 'lucide-react';

const LinkIconForService: React.FC<{ label: string }> = ({ label }) => {
  if ((LINK_SERVICES as readonly string[]).includes(label)) {
    return <ServiceIcon service={label} size={14} />;
  }
  return <LinkIcon size={14} />;
};

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

      <div className="profile-header">
        {data.links && data.links.length > 0 && (
          <div className="links-info">
            {data.links.map((link, idx) => (
              <div key={idx} className="contact-item">
                <LinkIconForService label={link.label} />
                <span className="link-label">{link.label}</span>
                <span className="link-url">{link.url}</span>
              </div>
            ))}
          </div>
        )}
      </div>

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
