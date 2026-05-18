export const LINK_SERVICES = ['GitHub', 'LinkedIn', 'Wantedly'] as const;
export type LinkService = typeof LINK_SERVICES[number];

export const LINK_PLACEHOLDERS: Record<LinkService, string> = {
  'GitHub':   'https://github.com/username',
  'LinkedIn': 'https://linkedin.com/in/username',
  'Wantedly': 'https://www.wantedly.com/id/username',
};
