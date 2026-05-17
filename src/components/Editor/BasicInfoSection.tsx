import React from 'react';
import type { UseFormRegister } from 'react-hook-form';
import type { Resume } from '../../schema/resumeSchema';
import { User } from 'lucide-react';

interface BasicInfoSectionProps {
  register: UseFormRegister<Resume>;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ register }) => (
  <section className="form-card">
    <div className="card-header">
      <User size={20} />
      <h3>基本情報</h3>
    </div>
    <div className="form-grid-full">
      <div className="form-group">
        <label>名前</label>
        <input {...register('profile.name')} placeholder="山田 太郎" />
      </div>
      <div className="form-group">
        <label>職務要約</label>
        <textarea
          {...register('profile.summary')}
          rows={10}
          placeholder="これまでの経験の概要や強みを簡潔に入力してください。"
        />
      </div>
      <div className="form-group">
        <label>自己PR</label>
        <textarea
          {...register('profile.selfPromotion')}
          rows={15}
          placeholder="自身のアピールポイントや実績を詳細に入力してください。"
        />
      </div>
    </div>
  </section>
);
