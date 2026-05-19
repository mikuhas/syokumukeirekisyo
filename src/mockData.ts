import type { Resume } from './schema/resumeSchema';

export const mockResume: Resume = {
  profile: {
    name: '架空 太郎',
    links: [
      { label: 'GitHub', url: 'https://github.com/example-user-000' },
      { label: 'LinkedIn', url: 'https://linkedin.com/in/example-user-000' }
    ],
    summary: '10年以上の経験を持つシニアソフトウェアエンジニア。主にReactとNode.jsを使用したWebアプリケーション開発に従事。',
    selfPromotion: '技術選定からアーキテクチャ設計、チームマネジメントまで幅広く対応可能です。特にパフォーマンス最適化と、保守性の高いコードベースの構築に強みを持っています。新しい技術のキャッチアップも早く、チームの生産性向上に貢献できます。',
    certifications: ['AWS Certified Solutions Architect', '応用情報技術者']
  },

  workExperiences: [
    {
      company: '株式会社ネクサリア',
      employmentStatus: '正社員',
      startDate: '2020-04',
      endDate: null,
      isCurrentlyWorking: true,
      projects: [
        {
          name: 'プロジェクト・オリオン：マルチテナントECプラットフォーム構築',
          startDate: '2022-01',
          endDate: '2024-03',
          isCurrentlyWorking: false,
          scale: 'チーム15名、開発期間2年',
          assignedTasks: 'テックリード',
          details: 'マイクロサービスアーキテクチャの導入により、デプロイ頻度を3倍に向上させた。',
          workContent: [
            'マイクロサービス移行計画の策定・推進',
            '決済基盤（Stripe連携）のAPI設計・実装',
            'Kubernetes上のCI/CDパイプライン構築',
            'コードレビューおよびチームへの技術指導',
          ],
          responsibilities: [
            'アーキテクチャ設計・技術選定',
            'バックエンド開発（Go / Node.js）',
            'インフラ構築・運用（AWS / Kubernetes）',
          ],
          star: {
            situation: 'モノリシックな旧システムのメンテナンスコストが高騰し、新機能のリリースに時間がかかっていた。',
            task: 'スケーラビリティと開発生産性の向上のため、システムをマイクロサービスへ移行すること。',
            action: 'Kubernetesを採用し、サービス間の通信にgRPCを導入。CI/CDパイプラインを整備した。',
            result: '開発チームが独立してデプロイ可能になり、リリースサイクルが週1回から1日複数回へ改善された。'
          },
          techStack: {
            '言語・フレームワーク': [
              { name: 'Go', version: '1.20' },
              { name: 'TypeScript', version: '5.0' },
              { name: 'Node.js' },
            ],
            'インフラ・クラウド': [
              { name: 'Kubernetes', version: '1.25' },
              { name: 'AWS' }
            ],
            'データベース': [
              { name: 'PostgreSQL', version: '15' },
              { name: 'Redis' },
            ]
          }
        },
        {
          name: 'プロジェクト・プリズム：データ可視化基盤の再構築',
          startDate: '2021-04',
          endDate: '2021-12',
          isCurrentlyWorking: false,
          scale: 'チーム5名、開発期間9ヶ月',
          assignedTasks: 'フロントエンドリード',
          details: '老朽化したBIツールをReactベースのSPAに置き換え、データ可視化の速度を大幅に改善した。',
          workContent: [
            'React + Rechartsを用いたグラフコンポーネントの設計・実装',
            'REST APIとのデータ連携層の構築',
            'デザインシステムの策定とコンポーネントライブラリ化',
          ],
          responsibilities: [
            'フロントエンド設計・実装',
            'UI/UXの改善提案',
            'テスト自動化（Vitest / Playwright）',
          ],
          star: {
            situation: '既存のBIツールは表示速度が遅く、エンジニア以外の社員が活用できていなかった。',
            task: '非エンジニアでも直感的に使えるダッシュボードを構築する。',
            action: 'Reactでカスタムグラフコンポーネントを実装し、フィルタリングやドリルダウンをインタラクティブに提供した。',
            result: '週次レポート作成工数を1人あたり2時間/週削減。利用率が3倍に増加した。'
          },
          techStack: {
            '言語・フレームワーク': [
              { name: 'React', version: '18' },
              { name: 'TypeScript', version: '4.9' },
              { name: 'Recharts' },
            ],
            'インフラ': [
              { name: 'AWS' },
              { name: 'Docker' }
            ]
          }
        },
        {
          name: 'プロジェクト・ヴォルト：認証基盤の全面刷新',
          startDate: '2020-06',
          endDate: '2021-03',
          isCurrentlyWorking: false,
          scale: 'チーム4名、開発期間10ヶ月',
          assignedTasks: 'バックエンドエンジニア',
          details: '独自実装の認証システムをOAuth2 / OIDCに準拠した構成に移行し、セキュリティリスクを低減した。',
          workContent: [
            'Keycloakの導入・カスタムテーマ実装',
            'サービス間のJWT検証ミドルウェアの実装',
            '既存ユーザーデータの移行スクリプト作成',
          ],
          responsibilities: [
            'バックエンドAPI実装（Go）',
            '認証フロー設計',
            'セキュリティレビュー対応',
          ],
          star: {
            situation: '独自認証実装にセキュリティ上の脆弱性が発見され、早急な対応が求められていた。',
            task: '標準準拠の認証基盤へ移行し、既存ユーザーへの影響を最小化すること。',
            action: 'Keycloakを採用しOIDCフローを構築。ユーザー移行はバッチ処理で段階的に実施した。',
            result: 'ゼロダウンタイムで移行完了。セキュリティ監査で指摘事項ゼロを達成した。'
          },
          techStack: {
            '言語・フレームワーク': [
              { name: 'Go', version: '1.19' },
              { name: 'Keycloak' },
            ],
            'インフラ': [
              { name: 'Docker' },
              { name: 'PostgreSQL', version: '14' }
            ]
          }
        }
      ]
    },
    {
      company: '合同会社ゼファテック',
      employmentStatus: '正社員',
      startDate: '2016-04',
      endDate: '2020-03',
      isCurrentlyWorking: false,
      projects: [
        {
          name: 'プロジェクト・ハーミス：倉庫・配送統合管理システム構築',
          startDate: '2018-07',
          endDate: '2020-02',
          isCurrentlyWorking: false,
          scale: 'チーム8名、開発期間1年半',
          assignedTasks: 'バックエンドエンジニア',
          details: '倉庫在庫管理と配送追跡を統合した社内システムをゼロから構築した。',
          workContent: [
            'Java/Spring Bootによるバックエンド実装',
            '配送業者APIとの連携モジュール開発',
            'バッチ処理による在庫同期の実装',
          ],
          responsibilities: [
            'バックエンド設計・実装',
            'DB設計（MySQL）',
            '結合テスト・パフォーマンスチューニング',
          ],
          star: {
            situation: 'Excelで管理していた在庫データが分散しており、リアルタイムの状況把握が困難だった。',
            task: '在庫・配送を一元管理できるシステムを構築する。',
            action: 'Spring Bootでバックエンドを構築し、複数の配送業者APIを統合。Webhookで状態変化をリアルタイム反映した。',
            result: '在庫差異が月平均5%から0.3%に改善。担当者の問い合わせ対応工数を週10時間削減した。'
          },
          techStack: {
            '言語・フレームワーク': [
              { name: 'Java', version: '11' },
              { name: 'Spring Boot', version: '2.5' },
              { name: 'MyBatis' },
            ],
            'データベース': [
              { name: 'MySQL', version: '8.0' }
            ],
            'インフラ': [
              { name: 'AWS' },
              { name: 'Docker' }
            ]
          }
        },
        {
          name: 'プロジェクト・ノヴァゲート：イントラネット全面リニューアル',
          startDate: '2017-04',
          endDate: '2018-03',
          isCurrentlyWorking: false,
          scale: 'チーム3名、開発期間12ヶ月',
          assignedTasks: 'フルスタックエンジニア',
          details: '旧来のイントラネットサイトをモダンなSPAにリニューアルし、従業員の情報アクセス効率を改善した。',
          workContent: [
            'Vue.js + Laravel構成のSPA構築',
            '社内ディレクトリ（LDAP）との認証連携',
            '掲示板・申請フロー機能の実装',
          ],
          responsibilities: [
            'フロントエンド・バックエンド実装',
            '要件定義・UI設計',
            'リリース後の運用保守',
          ],
          star: {
            situation: '旧ポータルは情報が散在しており、社員が必要な情報を見つけるのに時間がかかっていた。',
            task: '情報を集約し、誰でも使いやすいポータルを構築する。',
            action: 'Vue.jsとLaravelで検索機能付きポータルを構築。LDAP連携でシングルサインオンを実現した。',
            result: '社員満足度調査でITツール満足度が62%から89%に向上した。'
          },
          techStack: {
            '言語・フレームワーク': [
              { name: 'Vue.js', version: '2' },
              { name: 'Laravel', version: '8' },
              { name: 'PHP', version: '7.4' },
            ],
            'インフラ': [
              { name: 'CentOS' },
              { name: 'Nginx' }
            ]
          }
        },
        {
          name: 'プロジェクト・ケプラー：受発注システムへの帳票・EC連携機能追加',
          startDate: '2016-06',
          endDate: '2017-03',
          isCurrentlyWorking: false,
          scale: 'チーム6名、開発期間10ヶ月',
          assignedTasks: 'エンジニア（新卒）',
          details: '既存の受発注システムに帳票出力機能と外部ECサイト連携機能を追加した。',
          workContent: [
            'JasperReportsを用いた帳票PDF出力機能の実装',
            '楽天・Amazon出品APIとの連携開発',
            'ユニットテストの整備',
          ],
          responsibilities: [
            'バックエンド機能実装',
            '既存コードの調査・改修',
            'テスト仕様書の作成',
          ],
          star: {
            situation: '帳票出力が手作業でありミスが多発。EC連携も手動で時間がかかっていた。',
            task: '帳票自動出力とEC連携を自動化し、業務効率を上げる。',
            action: 'JasperReportsで帳票テンプレートを設計し、EC各社のAPIを共通インターフェースで抽象化した。',
            result: '帳票出力ミスをゼロにし、EC在庫同期の所要時間を4時間/日から15分/日に短縮した。'
          },
          techStack: {
            '言語・フレームワーク': [
              { name: 'Java', version: '8' },
              { name: 'Spring MVC' },
              { name: 'JasperReports' },
            ],
            'データベース': [
              { name: 'Oracle', version: '12c' }
            ]
          }
        }
      ]
    },
    {
      company: '株式会社クロスノヴァ',
      employmentStatus: '業務委託',
      startDate: '2014-09',
      endDate: '2016-03',
      isCurrentlyWorking: false,
      projects: [
        {
          name: 'プロジェクト・コインズ：家計簿アプリ向けバックエンドAPI開発',
          startDate: '2015-06',
          endDate: '2016-02',
          isCurrentlyWorking: false,
          scale: 'チーム4名、開発期間9ヶ月',
          assignedTasks: 'バックエンドエンジニア',
          details: 'iOS/Android向け家計簿アプリのバックエンドAPIを設計・実装した。',
          workContent: [
            'REST APIの設計・実装（Ruby on Rails）',
            '銀行口座連携（スクレイピング）機能の開発',
            'プッシュ通知基盤（FCM）の構築',
          ],
          responsibilities: [
            'バックエンドAPI設計・実装',
            'セキュリティ対策（暗号化・認証）',
            '負荷テスト・チューニング',
          ],
          star: {
            situation: 'ユーザーが複数の銀行口座を手動で入力しており、継続率が低かった。',
            task: '口座連携を自動化しユーザー継続率を改善する。',
            action: 'Seleniumで銀行サイトのスクレイピングを実装し、定期バッチで残高・明細を自動取得した。',
            result: 'リリース3ヶ月でDAUが2.5倍に増加。継続率が40%から68%に向上した。'
          },
          techStack: {
            '言語・フレームワーク': [
              { name: 'Ruby', version: '2.7' },
              { name: 'Rails', version: '6' },
            ],
            'インフラ': [
              { name: 'GCP' },
              { name: 'Docker' }
            ],
            'データベース': [
              { name: 'MySQL', version: '5.7' }
            ]
          }
        },
        {
          name: 'プロジェクト・ルーメン：ヘッドレスCMS・記事配信基盤の構築',
          startDate: '2015-01',
          endDate: '2015-05',
          isCurrentlyWorking: false,
          scale: 'チーム3名、開発期間5ヶ月',
          assignedTasks: 'フロントエンド・バックエンドエンジニア',
          details: 'ライター向けのヘッドレスCMSと記事配信APIをゼロから構築した。',
          workContent: [
            'Reactベースの管理画面実装',
            'Node.jsによる記事配信APIの実装',
            '画像最適化・CDN連携の設定',
          ],
          responsibilities: [
            'フルスタック実装',
            'CDN・インフラ設定',
            'ライターへの利用説明',
          ],
          star: {
            situation: 'WordPressの表示速度が遅く、SEOスコアが競合に劣っていた。',
            task: 'ヘッドレスCMS化で高速なコンテンツ配信を実現する。',
            action: 'Next.jsで静的サイト生成し、画像をCloudflare経由で配信。Lighthouseスコアを改善した。',
            result: 'ページ表示速度が平均3.2秒から0.8秒に短縮。SEO流入が半年で30%増加した。'
          },
          techStack: {
            '言語・フレームワーク': [
              { name: 'React', version: '16' },
              { name: 'Node.js' },
              { name: 'Next.js', version: '12' },
            ],
            'インフラ': [
              { name: 'Cloudflare' },
              { name: 'AWS' }
            ]
          }
        },
        {
          name: 'プロジェクト・シナプス：グループウェア自動連携Botの開発',
          startDate: '2014-10',
          endDate: '2014-12',
          isCurrentlyWorking: false,
          scale: 'チーム2名、開発期間3ヶ月',
          assignedTasks: 'エンジニア',
          details: 'SlackとGoogle Workspaceを連携し、社内の情報共有を自動化するBotを開発した。',
          workContent: [
            'Slack Bolt for Pythonを使ったBot開発',
            'Google Calendar / Drive APIとの連携',
            'Slackチャンネルへの自動通知機能の実装',
          ],
          responsibilities: [
            'Bot設計・実装',
            'OAuthフロー構築',
            '社内展開・運用サポート',
          ],
          star: {
            situation: 'カレンダーとSlackが連携されておらず、会議のリマインドや議事録共有が漏れていた。',
            task: 'SlackとGoogle Workspaceを連携し、通知の自動化を実現する。',
            action: 'Slack BotとGoogle APIを組み合わせ、会議前リマインド・議事録自動共有フローを実装した。',
            result: '会議直前のリマインド漏れがゼロになり、議事録の共有率が50%から95%に向上した。'
          },
          techStack: {
            '言語・フレームワーク': [
              { name: 'Python', version: '3.10' },
              { name: 'Slack Bolt' },
            ],
            'インフラ': [
              { name: 'GCP' },
              { name: 'Cloud Functions' }
            ]
          }
        }
      ]
    }
  ]
};
