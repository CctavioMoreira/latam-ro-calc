import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { Calculator } from '../core/calculator';
import { buildAutoCastSimulation } from '../core/auto-cast';
import { ITEM_AUTO_CAST_SKILLS } from '../skills/item-auto-cast-skills';
import { createMainModel } from '../utils';
import { RuneKnight } from './RuneKnight';
import { DragonKnight } from './DragonKnight';

// Tracker Tf12qziJIvTh7EsEUE8s. LATAM Runa Wyrd (12732) says melee + critical.
// Ratio: https://browiki.org/wiki/Explos%C3%A3o_R%C3%BAnica
// Half critical damage bonus: https://browiki.org/wiki/Categoria:Habilidades_cr%C3%ADticas
const items = JSON.parse(readFileSync('src/assets/demo/data/item.json', 'utf8'));
const monster = JSON.parse(readFileSync('src/assets/demo/data/monster.json', 'utf8'))[21067];
const stormBlast = ITEM_AUTO_CAST_SKILLS.find(skill => skill.name === 'Storm Blast')!;

function prepare(cls: RuneKnight, opts: { mastery?: number; melee?: number; range?: number; critDamage?: number; luxanima?: boolean; item?: boolean } = {}) {
  const model = { ...createMainModel(), level: 200, str: 90, luk: 100, weapon: 1201,
    armor: opts.item ? 15037 : undefined, accLeft: opts.item ? 2884 : undefined,
    boot: opts.item ? 2476 : undefined, garment: opts.item ? 2575 : undefined };
  const calc = new Calculator().setMasterItems(items).setClass(cls).setMonster(monster);
  cls.setLearnSkills({
    activeSkillIds: cls.activeSkills.map(skill => skill.name === 'Lux Anima Runestone' && opts.luxanima ? 2 : 0),
    passiveSkillIds: cls.passiveSkills.map(skill => skill.name === 'Rune Mastery' ? opts.mastery ?? 10 : 0),
  }).getSkillBonusAndName();
  calc.setHpSpTable([{ jobs: { [cls.className]: true }, baseHp: Array(251).fill(1000), baseSp: Array(251).fill(100) }] as any);
  calc.setModel(model).loadItemFromModel(model).setConsumables([
    { melee: [String(opts.melee ?? 0)], range: [String(opts.range ?? 0)], criDmg: [String(opts.critDamage ?? 0)] },
  ]).prepareAllItemBonus();
  return { calc, model, solved: calc.solveAutoCast('Storm Blast==1', stormBlast) };
}

describe('Explosão Rúnica', () => {
  it.each([[100, 90, 0, 1575], [200, 91, 10, 5985], [250, 120, 10, 8750]])(
    'uses base level %i, STR %i and Rune Mastery %i', (level, str, mastery, ratio) => {
      expect(stormBlast.formula({ model: { level }, status: { totalStr: str },
        skills: { learnedLevel: () => mastery } } as any)).toBe(ratio);
    },
  );

  it.each([new RuneKnight(), new DragonKnight()])('solves critical melee damage for $className', cls => {
    const { solved } = prepare(cls);
    expect(solved.baseSkillDamage).toBe(5950);
    expect(solved.dmgType).toBe('Melee');
    expect(solved.skillCanCri).toBe(true);
    expect(solved.skillCriRateToMonster).toBeGreaterThan(0);
    expect(solved.skillCriDmgPercentage).toBe(0.5);
    expect(solved.skillMinDamage).toBeGreaterThan(solved.skillMinDamageNoCri);
    expect(prepare(new RuneKnight(), { mastery: 0 }).solved.baseSkillDamage).toBe(3150);
  });

  it('applies melee bonuses and ignores ranged bonuses', () => {
    const baseline = prepare(new RuneKnight()).solved;
    const melee = prepare(new RuneKnight(), { melee: 100 }).solved;
    const ranged = prepare(new RuneKnight(), { range: 100 }).solved;
    expect(melee.skillMaxDamageNoCri).toBeGreaterThan(baseline.skillMaxDamageNoCri);
    expect(melee.skillFormulaGraphNoCri!.max.nodes.find(node => node.keys?.includes('melee'))?.percent).toBe(100);
    expect(ranged.skillMaxDamageNoCri).toBe(baseline.skillMaxDamageNoCri);
    expect(ranged.skillMaxDamage).toBe(baseline.skillMaxDamage);
  });

  it('uses half the equipment critical damage bonus without changing noncritical damage', () => {
    const baseline = prepare(new RuneKnight()).solved;
    const boosted = prepare(new RuneKnight(), { critDamage: 100 }).solved;
    expect(boosted.skillCriDmgToMonster - baseline.skillCriDmgToMonster).toBe(50);
    expect(boosted.skillMaxDamageNoCri).toBe(baseline.skillMaxDamageNoCri);
    expect(boosted.skillMaxDamage).toBeGreaterThan(baseline.skillMaxDamage);
  });

  it.each([{ luxanima: true }, { item: true }])('uses corrected damage for both Luxanima and equipment procs: %j', opts => {
    const { calc, model, solved } = prepare(new DragonKnight(), opts);
    const simulation = buildAutoCastSimulation({ calc, model, hasSelectedEffects: false, summary: {
      calc: { hitPerSecs: 4 }, dmg: { accuracy: 100, criRateToMonster: 0, basicDps: 400 },
      weapon: { rangeType: 'melee' }, monster: { hp: 10000 },
    } });
    const source = simulation.sources.find(entry => entry.icon === 2017)!;
    expect(source).toBeDefined();
    expect(source.summary.baseSkillDamage).toBe(solved.baseSkillDamage);
    expect(source.canCrit).toBe(true);
    expect(source.summary.dmgType).toBe('Melee');
    expect(source.damageRanges.map(range => range.kind)).toEqual(['nocri', 'cri']);
    expect(source.dps).toBeGreaterThan(0);
  });
});
