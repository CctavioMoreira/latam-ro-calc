import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { Calculator } from '../core/calculator';
import { CalculatorController } from '../core/calculator-controller';
import { SkillType } from '../models/damage-summary.model';
import { SKILL_META } from '../skills';
import { BACK_STAB, SIGHTLESS_MIND } from '../skills/shared-skills';
import { createMainModel } from '../utils';
import { AtkSkillFormulaInput } from './_character-base.abstract';
import { HyperNovice, SuperNovice } from './index';
import { Stalker } from './Stalker';

// Tracker rl5zoea9qAp3zaYVXVd6. Learned in the expanded Super Novice tree:
// https://browiki.org/wiki/Superaprendizes#Expansão
// Ratios: pt-BR client descriptions, ids 212 and 214. Dagger packets:
// https://browiki.org/wiki/Apunhalar
const items = JSON.parse(readFileSync('src/assets/demo/data/item.json', 'utf8'));
const monsters = JSON.parse(readFileSync('src/assets/demo/data/monster.json', 'utf8'));
const hpSpTable = JSON.parse(readFileSync('src/assets/demo/data/hp_sp_table.json', 'utf8'));

function solve(skill: string, level = 115, weapon = 510039) {
  const cls = new SuperNovice();
  const { equipAtks, masteryAtks, activeSkillNames, learnedSkillMap } = cls
    .setLearnSkills({ activeSkillIds: [], passiveSkillIds: [] }).getSkillBonusAndName();
  const model = Object.assign(createMainModel(), {
    class: 30, level, jobLevel: 70, str: 100, agi: 50, vit: 1, int: 1, dex: 100, luk: 1,
    weapon, selectedAtkSkill: skill,
  });
  const calc = new Calculator().setMasterItems(items).setHpSpTable(hpSpTable).setClass(cls);
  calc.loadItemFromModel(model);
  new CalculatorController().runChain(calc, {
    monster: monsters[21067], equipAtks, masteryAtks, buffEquips: {}, buffMasterys: {},
    consumeData: [], aspdPotion: 0, extraOptionScripts: [], activeSkillNames, learnedSkillMap,
    selectedAtkSkill: skill, selectedChances: [], usedHpL: false,
  });
  return { damage: calc.getTotalSummary().dmg, bonus: calc.totalEquipStatus };
}

describe('Superaprendiz — Apunhalar e Ataque Surpresa', () => {
  it.each([new SuperNovice(), new HyperNovice()])('offers both learned skills at every level on $className', cls => {
    for (const [skill, id, label, max] of [
      [BACK_STAB, 212, 'Apunhalar', 10],
      [SIGHTLESS_MIND, 214, 'Ataque Surpresa', 5],
    ] as const) {
      expect(cls.atkSkills.filter(s => s.name === skill.name)).toEqual([skill]);
      expect(SKILL_META[skill.name]).toMatchObject({ id, label });
      expect(skill.verifyItemFn).toBeUndefined();
      expect(skill.levelList.map(l => l.value)).toEqual(Array.from({ length: max }, (_, i) => `${skill.name}==${i + 1}`));
    }
  });

  it('shares Ataque Surpresa with the Rogue line', () => {
    expect(new Stalker().atkSkills.find(s => s.name === 'Sightless Mind')).toBe(SIGHTLESS_MIND);
  });

  it.each([
    ['dagger', 340, 700, 2], ['sword', 340, 700, 1], ['bow', 170, 350, 1],
  ])('Apunhalar with %s uses the client ratio and full-ratio packet count', (typeName, first, last, hits) => {
    const input = { weapon: { data: { typeName } }, skillLevel: 1 } as AtkSkillFormulaInput;
    expect(BACK_STAB.formula(input)).toBe(first);
    expect(BACK_STAB.formula({ ...input, skillLevel: 10 })).toBe(last);
    expect(typeof BACK_STAB.totalHit === 'function' && BACK_STAB.totalHit(input)).toBe(hits);
  });

  it.each([1, 2, 3, 4, 5])('calculates Ataque Surpresa Nv%i from the client table', skillLevel => {
    const { damage } = solve(`Sightless Mind==${skillLevel}`);
    expect(damage.baseSkillDamage).toBe([200, 350, 500, 650, 800][skillLevel - 1]);
    expect(damage.skillTotalHit).toBe(1);
    expect(damage.dmgType).toBe(SkillType.MELEE);
    expect(damage.skillMaxDamage).toBeGreaterThan(0);
  });

  it('calculates both Apunhalar dagger packets without doubling the ratio', () => {
    const { damage } = solve('Back Stab==10');
    expect(damage.baseSkillDamage).toBe(700);
    expect(damage.skillTotalHit).toBe(2);
    expect(damage.dmgType).toBe(SkillType.MELEE);
    expect(damage.skillMaxDamage).toBeGreaterThan(0);
    expect(solve('Back Stab==1', 115, 0).damage.skillTotalHit).toBe(1);
  });

  it.each(['Back Stab==10', 'Sightless Mind==5'])('applies the Éden dagger level gates to %s', skill => {
    // Adaga Superaprendiz do Éden (510039), pt-BR description:
    // Nv105: +25% to both skills; Nv115: another +15%.
    for (const [level, expected] of [[104, 0], [105, 25], [114, 25], [115, 40]]) {
      const { damage, bonus } = solve(skill, level);
      expect(bonus['212'] ?? 0).toBe(expected);
      expect(bonus['214'] ?? 0).toBe(expected);
      expect(damage.skillBonusFromEquipment).toBe(expected);
    }
    expect(solve(skill, 115, 0).damage.skillBonusFromEquipment).toBe(0);
  });
});
