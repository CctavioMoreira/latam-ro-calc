import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { CharacterBase, RuneKnight, Sorcerer } from '../jobs';
import { MainModel } from '../models/main.model';
import { createMainModel } from '../utils';
import { buildAutoCastSimulation } from './auto-cast';
import { makeCalculator } from './__tests__/make-calculator';

const ITEMS = JSON.parse(readFileSync('src/assets/demo/data/item.json', 'utf8'));
const LATAM_ITEMS = JSON.parse(readFileSync('src/assets/demo/data/latam-items.json', 'utf8'));
const MONSTER = JSON.parse(readFileSync('src/assets/demo/data/monster.json', 'utf8'))[21067];

// Card 0xhcfjN8vNAdtUXjiqjv. LATAM's Carta Xamã Imortal description specifies
// 1% on magical attacks, Killing Cloud Lv5, consuming two Red Gemstones.
// Reagent inventory is not tracked by the autocast simulator.
describe('Carta Xamã Imortal autocast', () => {
  const model: MainModel = { ...createMainModel(), int: 100, weapon: 1602, weaponCard1: 31025 };
  const prepare = (character: CharacterBase = new RuneKnight(), equipped: MainModel = model) => {
    const calc = makeCalculator(ITEMS, character)
      .setHpSpTable([{ jobs: { [character.className]: true }, baseHp: Array(251).fill(1000), baseSp: Array(251).fill(100) }] as any)
      .setMonster(MONSTER);
    calc.setModel(equipped).loadItemFromModel(equipped).prepareAllItemBonus();
    calc.calcAllAtk();
    return calc;
  };
  const summary = {
    calc: { hitPerSecs: 4 },
    calcSkill: { dmgType: 'Magical', totalHitPerSec: 2 },
    dmg: { accuracy: 100, criRateToMonster: 0, basicDps: 400 },
    weapon: { rangeType: 'melee' },
    monster: { hp: 10000, race: 'plant', type: 'normal' },
  };

  it('resolves the client rate and fixed level without requiring a learned skill', () => {
    expect(LATAM_ITEMS[31025].description).toContain(
      '1% de chance de consumir 2 Gemas Vermelhas para autoconjurar [Maldição de Jormungand] nv.5.',
    );
    const calc = prepare();
    expect(calc.resolvedItemAutoCasts).toContainEqual(expect.objectContaining({
      itemId: 31025, skillId: 2450, skillLevel: 5, chance: 1, trigger: 'magic-attack',
    }));
    expect(prepare(undefined, { ...model, weaponCard1: undefined }).resolvedItemAutoCasts
      .some(source => source.itemId === 31025)).toBe(false);
  });

  it.each([new RuneKnight(), new Sorcerer()])('calculates magical procs for $className', character => {
    const calc = prepare(character);
    const simulation = buildAutoCastSimulation({ calc, model, summary, hasSelectedEffects: false });
    const source = simulation.sources.find(entry => entry.source.sourceItemId === 31025);
    expect(source).toMatchObject({
      name: 'Maldição de Jormungand',
      source: { skillId: 2450, skillLevel: 5, chance: 1 },
      triggerAttacksPerSecond: 2,
      activationsPerSecond: 0.02,
    });
    expect(source!.expectedDamagePerActivation).toBeGreaterThan(0);
    expect(source!.dps).toBeCloseTo(source!.expectedDamagePerActivation * 0.02);
    expect(simulation.blockedSources.some(entry => entry.icon === 2450)).toBe(false);
  });

  it.each(['Melee', 'Ranged', undefined])('does not proc from a %s attack', dmgType => {
    const simulation = buildAutoCastSimulation({
      calc: prepare(), model, hasSelectedEffects: false,
      summary: { ...summary, calcSkill: { ...summary.calcSkill, dmgType } },
    });
    expect(simulation.sources.some(entry => entry.source.sourceItemId === 31025)).toBe(false);
  });

  it('keeps the magic bonus and requires Jack Wolf for the cast-time bonus', () => {
    expect(prepare().totalEquipStatus).toMatchObject({ matkPercent: 10, vct: 0 });
    expect(prepare(undefined, { ...model, boot: 2401, bootCard: 31026 }).totalEquipStatus)
      .toMatchObject({ matkPercent: 10, vct: 10 });
  });
});
