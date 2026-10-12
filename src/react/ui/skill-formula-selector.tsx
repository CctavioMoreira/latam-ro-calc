import { SKILL_FORMULA_VERSION_OPTIONS, normalizeSkillFormulaVersion, SkillFormulaVersion } from '../../app/skills/skill-formula-version';

export function SkillFormulaSelector({ value, onChange, disabled = false }: { value?: SkillFormulaVersion; onChange: (value: SkillFormulaVersion) => void; disabled?: boolean }) {
  return <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, maxWidth: '100%', fontSize: 12 }}>
    <span>Fórmulas</span>
    <select aria-label="Versão das fórmulas de habilidades" value={normalizeSkillFormulaVersion(value)} disabled={disabled}
      onChange={event => onChange(normalizeSkillFormulaVersion(event.target.value))}
      style={{ background: 'var(--surface-card)', color: 'var(--text-color)', border: '1px solid var(--surface-border)', borderRadius: 4, padding: '4px 6px', minWidth: 0, maxWidth: '100%', font: 'inherit' }}>
      {SKILL_FORMULA_VERSION_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
    </select>
  </label>;
}
