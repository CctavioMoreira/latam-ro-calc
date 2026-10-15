import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { getEnchants } from 'src/app/constants/enchant_item/_enchant_table';
import { ITEM_BONUS_LABELS } from '../bonus-key-label';
import { createMainModel } from 'src/app/utils';
import { createRawTotalBonus } from 'src/app/utils/create-raw-total-bonus';
import { HighWizard } from 'src/app/jobs/HighWizard';
import { calculateMonsterDamageTaken } from '../monster-damage-taken';
import { defenderReductionMultiplier } from '../pvp';
import { ElementType } from 'src/app/constants/element-type.const';
import { equipStatusOf, INERT_MONSTER, makeCalculator } from './make-calculator';

const db = JSON.parse(readFileSync('src/assets/demo/data/item.json', 'utf8'));
const latam = JSON.parse(readFileSync('src/assets/demo/data/latam-items.json', 'utf8'));
const names = (pool: string[]) => pool.map(aegis => Object.values(db).find((item: any) => item.aegisName === aegis) as any);

function worn(enchant: number, refine = 0, slot = 1, monsterId = 1002) {
  const head = enchant >= 315761;
  const calc = makeCalculator({ 410615: db[410615], 480956: db[480956], [enchant]: db[enchant] })
    .setMonster({ ...INERT_MONSTER, id: monsterId });
  return equipStatusOf(calc, {
    ...createMainModel(), level: 200,
    [head ? 'headMiddle' : 'garment']: head ? 410615 : 480956,
    [head ? 'headMiddleEnchant3' : `garmentEnchant${slot}`]: enchant,
    garmentRefine: refine,
  });
}

describe('Liga dos Desbravadores enchants', () => {
  it('offers only Florzinha 1–3 in Jardinzinho slot 4', () => {
    const [slot1, slot2, slot3, slot4] = getEnchants('LittleGarden_LT');
    expect([slot1, slot2, slot3]).toEqual([null, null, null]);
    expect(names(slot4).map(item => item.id)).toEqual([315761, 315762, 315763]);
  });

  it('offers all eight Motor enchants in each of slots 2–4', () => {
    const [slot1, ...slots] = getEnchants('Explorer_Engine_LT');
    expect(slot1).toBeNull();
    for (const pool of slots) {
      expect(names(pool).map(item => item.id)).toEqual([315753, 315754, 315755, 315756, 315757, 315758, 315759, 315760]);
      for (const item of names(pool)) {
        expect(item.itemTypeId).toBe(11);
        expect(item.name).toBe(latam[item.id].name);
      }
    }
  });

  it.each([1, 2, 3])('Florzinha %i restores HP/SP on kill through the head socket', tier => {
    expect(worn(315760 + tier)).toMatchObject({ hpRestoreOnKill: tier * 50, spRestoreOnKill: tier * 5 });
  });

  it.each([1, 2, 3])('applies X enchants through Motor socket %i', slot => {
    expect(worn(315753, 0, slot).vct).toBe(15);
    expect(worn(315754, 0, slot).perfectHit - worn(315753).perfectHit).toBe(15);
    expect(worn(315755, 0, slot)).toMatchObject({ hpRegenPerSecond: 100, spRegenPerSecond: 4 });
    expect(worn(315756, 0, slot)).toMatchObject({ perfectDodge: 12, petrificationResist: 100, freezeResist: 100 });
  });

  it.each([
    [315757, 'holy', 'ghost'], [315758, 'fire', 'earth'],
    [315759, 'water', 'wind'], [315760, 'dark', 'undead'],
  ])('%i applies elemental resistance only at Motor refine +8', (id, first, second) => {
    for (const element of [first, second]) {
      expect(worn(Number(id), 7)[`subele_${element}`]).toBe(0);
      expect(worn(Number(id), 8)[`subele_${element}`]).toBe(30);
      expect(worn(Number(id), 9)[`subele_${element}`]).toBe(30);
    }
  });

  it('registers recovery and status tolerance as labelled display-only stats', () => {
    const bare = createRawTotalBonus();
    for (const key of ['hpRegenPerSecond', 'spRegenPerSecond', 'petrificationResist', 'freezeResist']) {
      expect(bare[key]).toBe(0);
      expect(ITEM_BONUS_LABELS[key]).toBeTruthy();
    }
  });

  const groups = [
    [315757, [1698, 1700, 1701, 1702, 1703, 1704, 1705, 1706, 1707, 1709, 1710, 1711, 1712,
      20773, 20774, 20775, 20776, 20777, 20778, 20779, 20780, 20781, 20782, 20783,
      20787, 20788, 20789, 20790, 20791, 20792, 20793, 20794, 20795, 20796, 20797, 20798, 20799, 20800, 20844]],
    [315758, [21386, 21387, 21388, 21389, 21390, 21391, 21392, 21393, 21394, 21395]],
    [315759, [20801, 20802, 20803, 20804, 20805, 20806, 20807, 20808, 20809, 20810, 20811, 20843,
      20877, 20878, 20879, 20880, 20881, 20882, 20883, 20884, 20885]],
    [315760, [20612, 20613, 20614, 20615, 20616, 20617, 20618]],
  ] as const;

  it.each(groups)('%i pays 5/10/25%% only against its listed targets', (enchant, targets) => {
    for (const target of targets) {
      for (const [refine, bonus] of [[0, 5], [6, 5], [7, 10], [8, 10], [9, 25], [12, 25]]) {
        expect(worn(enchant, refine, 1, target)).toMatchObject({ p_monster: bonus, m_monster: bonus, submonster: bonus });
      }
    }
    for (const target of [1002, 1708, 20784, 20785, ...groups.filter(([id]) => id !== enchant).map(([, ids]) => ids[0])]) {
      expect(worn(enchant, 9, 1, target)).toMatchObject({ p_monster: 0, m_monster: 0, submonster: 0 });
    }
  });

  it('clears target bonuses when the selected monster changes on the same calculator', () => {
    const calc = makeCalculator({ 480956: db[480956], 315758: db[315758] });
    const model = { ...createMainModel(), garment: 480956, garmentRefine: 9, garmentEnchant1: 315758 };
    for (const [id, expected] of [[21386, 25], [1002, 0], [21393, 25]]) {
      calc.setMonster({ ...INERT_MONSTER, id });
      expect(equipStatusOf(calc, model).p_monster).toBe(expected);
    }
  });

  it('multiplies physical and magical damage independently of the class category', () => {
    const solve = (script: Record<string, string[]>) => {
      const calc = makeCalculator({ 1601: db[1601], 480956: { ...db[480956], script } }, new HighWizard());
      calc.setMonster({ ...INERT_MONSTER, stats: { ...INERT_MONSTER.stats, elementName: 'Neutral 1', luk: 0 } });
      calc.setHpSpTable(JSON.parse(readFileSync('src/assets/demo/data/hp_sp_table.json', 'utf8')));
      calc.loadItemFromModel({ ...createMainModel(), level: 200, str: 100, int: 100, weapon: 1601, garment: 480956 })
        .setOffensiveSkill('Fire Bolt==10').prepareAllItemBonus().calcAllAtk().calcAllDefs()
        .calculateHpSp({ isUseHpL: false }).calculateAllDamages('Fire Bolt==10');
      return calc.getTotalSummary().dmg;
    };
    const base = solve({ p_class_all: ['20'], m_class_all: ['20'] });
    const specific = solve({ p_class_all: ['20'], m_class_all: ['20'], p_monster: ['25'], m_monster: ['25'] });
    expect(specific.basicMaxDamage).toBeGreaterThan(base.basicMaxDamage);
    expect(specific.skillMaxDamage).toBeGreaterThan(base.skillMaxDamage);
    const magicStage = specific.skillFormulaGraph.max.nodes.find(node => node.id === 'monster');
    const before = specific.skillFormulaGraph.max.nodes.find(node => node.id === magicStage.inputs[0]);
    expect(magicStage.value).toBe(Math.floor(before.value * 1.25));
    expect(magicStage.keys).toEqual(['m_monster']);
  });

  it('uses the target resistance as a separate incoming PvE category and excludes PvP', () => {
    const bonus = { ...worn(315758, 9, 1, 21386), subclass_normal: 20 };
    const incoming = calculateMonsterDamageTaken({
      attacker: { id: 21386, race: 'insect', size: 'm', type: 'normal', attackRange: 1,
        attack: { minimum: 1000, maximum: 1000 }, magicAttack: { minimum: 100, maximum: 100 } },
      defender: { hp: 10000, def: 0, softDef: 0, mdef: 0, softMdef: 0, res: 0, mres: 0,
        armorElement: ElementType.Neutral, bonus },
    }, 0)!;
    expect(incoming.max).toBe(480); // 1000 × 80% Neutral from Motor × 80% normal × 75% target
    expect(incoming.steps.find(step => step.keys.includes('submonster'))?.factor).toBe(0.75);
    expect(defenderReductionMultiplier({ bonus: { submonster: 100 }, dmgType: 'physical',
      attackerRace: 'player_human', attackerElement: 'neutral', attackerSize: 'm', attackerType: 'normal' })).toBe(1);
  });
});
