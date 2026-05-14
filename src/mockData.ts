import type { Resume } from './schema/resumeSchema';

export const mockResume: Resume = {
  profile: {
    name: '山田 太郎',
    links: [
      { label: 'GitHub', url: 'https://github.com/yamada' },
      { label: 'LinkedIn', url: 'https://linkedin.com/in/yamada' }
    ],
    summary: '10年以上の経験を持つシニアソフトウェアエンジニア。主にReactとNode.jsを使用したWebアプリケーション開発に従事。',
    selfPromotion: '技術選定からアーキテクチャ設計、チームマネジメントまで幅広く対応可能です。特にパフォーマンス最適化と、保守性の高いコードベースの構築に強みを持っています。新しい技術のキャッチアップも早く、チームの生産性向上に貢献できます。',
    certifications: ['AWS Certified Solutions Architect', '応用情報技術者']
    },

  workExperiences: [
    {
      company: '株式会社テックイノベーション',
      employmentStatus: '正社員',
      startDate: '2020-04',
      endDate: null,
      isCurrentlyWorking: true,
      projects: [
        {
          name: '次世代Eコマースプラットフォームの開発',
          details: 'マイクロサービスアーキテクチャの導入により、デプロイ頻度を3倍に向上させた。',
          isCurrentlyWorking: false,
          scale: 'チーム15名、開発期間2年',
          assignedTasks: 'アーキテクチャ設計、決済基盤開発、CI/CDパイプライン構築',
          star: {
            situation: 'モノリシックな旧システムのメンテナンスコストが高騰し、新機能のリリースに時間がかかっていた。',
            task: 'スケーラビリティと開発生産性の向上のため、システムをマイクロサービスへ移行すること。',
            action: 'Kubernetesを採用し、サービス間の通信にgRPCを導入。CI/CDパイプラインを整備した。',
            result: '開発チームが独立してデプロイ可能になり、リリースサイクルが週1回から1日複数回へ改善された。'
          },
          techStack: {
            '言語・フレームワーク': [
              { name: 'Go', version: '1.20' },
              { name: 'Node.js' },
              { name: 'jQuery' },
              { name: 'TypeScript', version: '5.0' },
              { name: 'Spring Boot' },
              { name: 'JPA' },
              { name: 'MyBatis' },
              { name: 'Echo' }
            ],
            'インフラ・クラウド': [
              { name: 'Kubernetes', version: '1.25' },
              { name: 'AWS' }
            ],
            'データベース・ミドルウェア': [
              { name: 'PostgreSQL', version: '15' },
              { name: 'Redis' },
              { name: 'gRPC' },
              { name: 'Flyway' },
              { name: 'Firestore' },
              { name: 'REST API' }
            ]
          }
        }
      ]
    }
  ]
};
