export type SkillFormulaVersion = 'current' | 'rebalance-2022-06' | 'rebalance-2026-02';

/** Display dates are kRO deployments; persisted IDs retain their original names. */
export const SKILL_REBALANCE_REFERENCES: {
  label: string; value: SkillFormulaVersion; references: { label: string; url: string }[];
}[] = [
  { label: 'Rebalance - 02/06/2022 - (kRO)', value: 'rebalance-2022-06', references: [
    { label: 'Comunicado de implementação no kRO (coreano)', url: 'https://ro.gnjoy.com/news/notice/View.asp?BBSMode=10001&seq=7600&curpage=1' },
    { label: 'Anúncio e alterações em inglês — Divine Pride', url: 'https://www.divine-pride.net/forum/index.php?/topic/3723-kro-jobs-improvement-project/page/13/#comment-11126' },
    { label: 'Fórmulas por classe — Sigma', url: 'https://sigmathefallen.blogspot.com/2025/02/' },
  ] },
  { label: 'Rebalance - 21/12/2022 - (kRO)', value: 'rebalance-2026-02', references: [
    { label: 'Comunicado de implementação no kRO (coreano)', url: 'https://ro.gnjoy.com/news/notice/View.asp?BBSMode=10001&seq=7670&curpage=1' },
    { label: 'Anúncio e alterações em inglês — Divine Pride', url: 'https://www.divine-pride.net/forum/index.php?/topic/3723-kro-jobs-improvement-project/page/14/#comment-12421' },
    { label: 'Fórmulas por classe — Sigma', url: 'https://sigmathefallen.blogspot.com/2026/02/' },
  ] },
];

export const SKILL_FORMULA_VERSION_OPTIONS: { label: string; value: SkillFormulaVersion }[] = [
  { label: 'Atual (LATAM)', value: 'current' },
  ...SKILL_REBALANCE_REFERENCES.map(({ label, value }) => ({ label, value })),
];

export function normalizeSkillFormulaVersion(value: unknown): SkillFormulaVersion {
  return value === 'rebalance-2022-06' || value === 'rebalance-2026-02' ? value : 'current';
}
