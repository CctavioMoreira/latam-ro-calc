import { SKILL_FORMULA_VERSION_OPTIONS, SKILL_REBALANCE_REFERENCES, normalizeSkillFormulaVersion, SkillFormulaVersion } from '../../app/skills/skill-formula-version';
import { useEffect, useId, useState, useSyncExternalStore } from 'react';
import { useServices } from '../services/application';
import { Icon } from './primitives';
import { Popover } from './popover';
import './skill-formula-selector.css';

export function SkillFormulaSelector({ value, onChange, disabled = false }: { value?: SkillFormulaVersion; onChange: (value: SkillFormulaVersion) => void; disabled?: boolean }) {
  const { previews } = useServices().layout;
  const visible = useSyncExternalStore(previews.subscribe, previews.getSnapshot);
  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);
  const id = useId();
  useEffect(() => { if (!visible) setAnchor(null); }, [visible]);
  if (!visible) return null;
  return <div className="skill-formula-selector">
    <label className="skill-formula-field">
      <span>Fórmulas</span>
      <select aria-label="Versão das fórmulas de habilidades" value={normalizeSkillFormulaVersion(value)} disabled={disabled}
        onChange={event => onChange(normalizeSkillFormulaVersion(event.target.value))}
        style={{ background: 'var(--surface-card)', color: 'var(--text-color)', border: '1px solid var(--surface-border)', borderRadius: 4, padding: '4px 6px', minWidth: 0, maxWidth: '100%', font: 'inherit' }}>
        {SKILL_FORMULA_VERSION_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
    <button type="button" className="skill-formula-info" aria-label="Referências dos rebalanceamentos" title="Referências dos rebalanceamentos"
      aria-expanded={!!anchor} aria-controls={anchor ? id : undefined} onClick={event => setAnchor(anchor ? null : event.currentTarget)}>
      <Icon name="info-circle" />
    </button>
    <Popover anchor={anchor} onClose={() => setAnchor(null)} ariaLabel="Referências dos rebalanceamentos" className="skill-formula-references">
      <div id={id}>
        <p>As datas indicam quando cada rebalanceamento chegou ao kRO (servidor coreano).</p>
        {SKILL_REBALANCE_REFERENCES.map(rebalance => <section key={rebalance.value}>
          <h3>{rebalance.label}</h3>
          <ul>{rebalance.references.map(reference => <li key={reference.url}>
            <a href={reference.url} target="_blank" rel="noopener noreferrer">{reference.label} <Icon name="external-link" /></a>
          </li>)}</ul>
        </section>)}
      </div>
    </Popover>
  </div>;
}
