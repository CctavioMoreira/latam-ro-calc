import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { SLOTS_BY_KEY } from '../../app-config/equipment-slots';
import { equipStatusOf, makeCalculator } from '../../core/__tests__/make-calculator';
import { deriveSlot } from '../../core/equipment-slot-derivation';
import { ItemModel } from '../../models/item.model';
import { createMainModel } from '../../utils';
import { ItemTypeEnum } from '../item-type.enum';

// Reported by Rodrigo Shion. Pools: https://browiki.org/wiki/Hugel#Equipamentos_Angelicais
// Effects and ids: LATAM client text. Refine/payment pools are combined, as elsewhere
// in the picker, which does not filter enchant choices by refine or payment method.
const items: Record<number, ItemModel> = JSON.parse(readFileSync('src/assets/demo/data/item.json', 'utf8'));
const latam = JSON.parse(readFileSync('src/assets/demo/data/latam-items.json', 'utf8'));
const mapEnchant = new Map(Object.values(items).filter(item => item.itemTypeId === 11)
  .map(item => [item.aegisName, { ...item, name: latam[item.id]?.name ?? item.name }]));
const armorIds = [15397, 15398, 15399, 15400, 15401, 15402];
const blessingIds = [310076, 310077, 310078, 310079, 310080, 310081];
const baseStats = [4705, 4706, 4707, 4715, 4716, 4717, 4725, 4726, 4727,
  4735, 4736, 4737, 4745, 4746, 4747, 4755, 4756, 4757];
const commonPool = [...baseStats, 4764, 4765, 29241, 4762, 29238, 4794, 4902,
  4786, 4787, 4867, 4900, 4801, 4802];
const garmentBootSlot2 = [...commonPool, 29026, 4788, 4789];
const armorSlot2 = [...commonPool, 4903, 4790, 4820, 4821, 4812, 4826,
  4835, 4836, 4843, 4844, 4873, 4881, ...blessingIds];
const sorted = (ids: number[]) => [...ids].sort((a, b) => a - b);

describe('Angelical equipment enchant pickers', () => {
  it.each([...armorIds, 20947, 22209])('%i offers the published pool in each socket and keeps its card socket', id => {
    const key = id === 20947 ? ItemTypeEnum.garment : id === 22209 ? ItemTypeEnum.boot : ItemTypeEnum.armor;
    const slot = deriveSlot({ descriptor: SLOTS_BY_KEY.get(key)!, item: items[id],
      mapEnchant, refineList: [], shadowRefineList: [] });

    expect(slot.cardSlots).toBe(1);
    expect(slot.enchantLists[0]).toBeNull();
    expect(slot.enchantLists.slice(1).map(list => sorted(list!.map(option => Number(option.value)))))
      .toEqual([armorIds.includes(id) ? armorSlot2 : garmentBootSlot2, commonPool, commonPool].map(sorted));
    for (const list of slot.enchantLists.slice(1)) {
      for (const option of list!) expect(latam[Number(option.value)], `unreachable enchant ${option.value}`).toBeDefined();
    }
  });

  it('keeps DEF +20 for the cape/shoes distinct from the armor DEF +21', () => {
    expect(mapEnchant.get('Def20')?.id).toBe(29026);
    expect(mapEnchant.get('Def21')?.id).toBe(4903);
  });
});

const enchantBonus = (armorId: number, enchantId?: number) => {
  const model = createMainModel();
  model.level = 200;
  model.armor = armorId;
  model.armorRefine = 9;
  model.armorEnchant1 = enchantId;
  return equipStatusOf(makeCalculator(items), model);
};
const delta = (armorId: number, enchantId: number) => {
  const bare = enchantBonus(armorId);
  const enchanted = enchantBonus(armorId, enchantId);
  return (key: string) => (enchanted[key] ?? 0) - (bare[key] ?? 0);
};

describe('Angelical enchant effects', () => {
  it.each([
    [4902, 'def', 18], [4903, 'def', 21], [29026, 'def', 20],
    [4790, 'mdef', 10], [29238, 'flee', 10],
    [4873, 'aspdPercent', 8], [4881, 'aspdPercent', 10],
  ] as const)('%i contributes %s +%i to the build', (id, key, value) => {
    expect(items[id].itemTypeId).toBe(11);
    expect(delta(15397, id)(key)).toBe(value);
  });

  it.each([
    [310076, 15397, { str: 10, atkPercent: 10 }, { atkPercent: 5, p_race_all: 12 }],
    [310077, 15398, { agi: 10, range: 10 }, { aspd: 1, perfectHit: 5 }],
    [310078, 15399, { vit: 10, hpPercent: 10, spPercent: 10 }, { hpPercent: 5, acd: 5 }],
    [310079, 15400, { dex: 10, vct: 10, aspdPercent: 10 }, { fct: 0.3 }],
    [310080, 15401, { int: 10, matkPercent: 10 }, { vct: 10, m_my_element_all: 12 }],
    [310081, 15402, { luk: 10, criDmg: 15 }, { cri: 10, p_size_all: 12 }],
  ])('Bênção %i grants its base effects everywhere and its combo only with Batina %i', (id, armorId, base, combo) => {
    for (const equippedArmor of armorIds) {
      const bonus = delta(equippedArmor, id);
      const expected: Record<string, number> = { def: 25, mdef: 3, ...base };
      for (const [key, value] of Object.entries(combo)) {
        expected[key] = (expected[key] ?? 0) + (equippedArmor === armorId ? value : 0);
      }
      for (const [key, value] of Object.entries(expected)) expect(bonus(key), `${equippedArmor}: ${key}`).toBeCloseTo(value);
    }
  });
});
