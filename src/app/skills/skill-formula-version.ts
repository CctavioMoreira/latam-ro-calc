export type SkillFormulaVersion = 'current' | 'rebalance-2026-02';

export const SKILL_FORMULA_VERSION_OPTIONS: { label: string; value: SkillFormulaVersion }[] = [
  { label: 'Atual (LATAM)', value: 'current' },
  { label: 'Rebalance 4th · fev/2026', value: 'rebalance-2026-02' },
];

export function normalizeSkillFormulaVersion(value: unknown): SkillFormulaVersion {
  return value === 'rebalance-2026-02' ? value : 'current';
}
