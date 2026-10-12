import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { Calculator } from '../core/calculator';
import { CalculatorController, collectConsumables } from '../core/calculator-controller';
import { ElementType } from '../constants/element-type.const';
import { createMainModel } from '../utils/create-main-model';
import { Inquisitor } from './Inquisitor';
import { Sura } from './Sura';

const items = JSON.parse(readFileSync('src/assets/demo/data/item.json', 'utf8'));
const monsters = JSON.parse(readFileSync('src/assets/demo/data/monster.json', 'utf8'));
const hpSpTable = JSON.parse(readFileSync('src/assets/demo/data/hp_sp_table.json', 'utf8'));

function simulate(Job: typeof Sura, options: {
  level?: number; sp?: number; spheres?: number; skillLevel?: number;
  consumables?: number[]; defense?: number; element?: number; propertyAtk?: ElementType;
} = {}) {
  const cls = new Job();
  const model = { ...createMainModel(), level: options.level ?? (Job === Inquisitor ? 240 : 175), jobLevel: 50,
    str: 110, int: 90, dex: 90, selectedAtkSkill: `Asura Strike==${options.skillLevel ?? 5}`,
    consumables: options.consumables ?? [], propertyAtk: options.propertyAtk ?? ElementType.Neutral };
  const active: Record<string, number> = { 'Current SP': options.sp ?? 0, 'Total Spirit': options.spheres ?? 0 };
  const { equipAtks, masteryAtks, activeSkillNames, learnedSkillMap } = cls
    .setLearnSkills({ activeSkillIds: cls.activeSkills.map((s) => active[s.name] ?? 0),
      passiveSkillIds: cls.passiveSkills.map(() => 0) }).getSkillBonusAndName();
  const calc = new Calculator().setMasterItems(items).setHpSpTable(hpSpTable).setClass(cls);
  calc.loadItemFromModel(model);
  const target = structuredClone(monsters['21077']);
  Object.assign(target.stats, { defense: options.defense ?? 0, vit: options.defense ?? 0,
    flee: 10000, element: options.element ?? 20,
    elementName: options.element === 88 ? 'Ghost 4' : 'Neutral 1',
    elementShortName: options.element === 88 ? 'Ghost' : 'Neutral' });
  new CalculatorController().runChain(calc, {
    monster: target, equipAtks, masteryAtks, buffEquips: {}, buffMasterys: {},
    consumeData: collectConsumables(model, items).scripts, aspdPotion: undefined,
    extraOptionScripts: [], activeSkillNames, learnedSkillMap, selectedAtkSkill: model.selectedAtkSkill,
    selectedChances: [], usedHpL: false,
  } as any);
  return { cls, summary: calc.getTotalSummary() as ReturnType<Calculator['getTotalSummary']> & Record<string, number> };
}

describe.each([{ name: 'Shura', Job: Sura }, { name: 'Inquisidor', Job: Inquisitor }])('Asura for $name', ({ Job }) => {
  it('offers levels 1–5, neutral melee damage, and LATAM client cast timings', () => {
    const skill = new Job().atkSkills.find((s) => s.name === 'Asura Strike')!;
    expect(skill.levelList?.map((s) => s.value)).toEqual([1, 2, 3, 4, 5].map((lv) => `Asura Strike==${lv}`));
    expect(skill.element).toBe(ElementType.Neutral);
    expect(skill.isMelee).toBe(true);
    for (const level of [1, 5]) {
      expect((skill.fct as Function)(level)).toBe(2.25 - level / 4);
      expect((skill.vct as Function)(level)).toBe(2.25 - level / 4);
      expect(skill.acd).toBe(1);
    }
  });

  it('uses current SP and adds the level bonus without scaling it by ATK', () => {
    const full = simulate(Job).summary.dmg;
    const half = simulate(Job, { sp: 50 }).summary.dmg;
    expect(half.currentSp).toBe(Math.floor(full.currentSp / 2));
    expect(half.skillMinDamage).toBeLessThan(full.skillMinDamage);
    const graph = full.skillFormulaGraph!.min.nodes;
    const atk = graph.find((n) => n.id === 'ranged')!.value;
    expect(full.skillMinDamage).toBe(Math.floor(atk * (8 + full.currentSp / 10)) + 1000);
    const firstLevel = simulate(Job, { skillLevel: 1 }).summary.dmg;
    expect(full.skillMinDamage - firstLevel.skillMinDamage).toBe(600);
    expect(graph.at(-1)!.value).toBe(full.skillMinDamage);
  });

  it('doubles both the ratio and flat bonus at six spheres', () => {
    const { cls } = simulate(Job, { spheres: 6 });
    const skill = cls.atkSkills.find((s) => s.name === 'Asura Strike')!;
    expect(skill.formula({ currentSp: 2000 } as any)).toBe(41600);
    expect(skill.flatDamage!({ skillLevel: 5 } as any)).toBe(2000);
    const five = simulate(Job, { spheres: 5 }).cls.atkSkills.find((s) => s.name === 'Asura Strike')!;
    expect(five.formula({ currentSp: 2000 } as any)).toBe(20800);
    expect(five.flatDamage!({ skillLevel: 5 } as any)).toBe(1000);
  });

  it('ignores hard/soft DEF and flee, and keeps Neutral against Ghost', () => {
    const plain = simulate(Job).summary.dmg;
    const armored = simulate(Job, { defense: 1000 }).summary.dmg;
    expect(armored.skillMinDamage).toBe(plain.skillMinDamage);
    expect(armored.skillAccuracy).toBe(100);
    const ghost = simulate(Job, { element: 88, propertyAtk: ElementType.Fire }).summary.dmg;
    expect(ghost.skillPropertyAtk).toBe(ElementType.Neutral);
    expect(ghost.skillMinDamage).toBe(0);
  });
});

describe('SP consumables', () => {
  it.each([[9, 5], [99, 14], [175, 22], [250, 30]])('Grande de SP at level %i gives +%i%%', (level, percent) => {
    const plain = simulate(Sura, { level }).summary;
    const boosted = simulate(Sura, { level, consumables: [12427] }).summary;
    expect((boosted.spPercent ?? 0) - (plain.spPercent ?? 0)).toBe(percent);
    const selected = collectConsumables({ consumables: [12427], consumables2: [], aspdPotions: [], level }, items);
    expect(selected.sources.consumable_12427).toEqual({ spPercent: percent });
  });

  it('stacks all three SP buffs and feeds the new max SP into Asura', () => {
    const plain = simulate(Sura).summary;
    const boosted = simulate(Sura, { consumables: [12427, 14600, 12436] }).summary;
    expect((boosted.spPercent ?? 0) - (plain.spPercent ?? 0)).toBe(37);
    expect(boosted.spCostPercent).toBe(-10);
    expect(boosted.spRecovRate).toBe(20);
    expect(boosted.dmg.currentSp).toBeGreaterThan(plain.dmg.currentSp);
    expect(boosted.dmg.skillMinDamage).toBeGreaterThan(plain.dmg.skillMinDamage);
    for (const id of [12427, 14600, 12436]) expect(items[id].itemTypeId).toBe(3);
  });
});
