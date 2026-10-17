import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { SLOTS_BY_KEY } from '../app-config/equipment-slots';
import { ItemTypeEnum } from '../constants/item-type.enum';
import { ItemModel } from '../models/item.model';
import { createMainModel } from '../utils';
import { equipStatusOf, makeCalculator } from './__tests__/make-calculator';
import { deriveSlot } from './equipment-slot-derivation';

// https://browiki.org/wiki/Passe_de_Batalha#Encantamento
// Máscara de Pesar accepts one Anti-Horário (1–3), exclusively in slot 4.
const items = JSON.parse(readFileSync('src/assets/demo/data/item.json', 'utf8'));
const latam = JSON.parse(readFileSync('src/assets/demo/data/latam-items.json', 'utf8'));
const MASK = 436031;

describe('Máscara de Pesar — Passe de Batalha', () => {
  it('offers all three localized enchants in slot 4 and retains its card socket', () => {
    const enchants = new Map<string, ItemModel>(Object.values(items)
      .filter((item: any) => item.itemTypeId === 11)
      .map((item: any) => [item.aegisName, { ...item, name: latam[item.id]?.name ?? item.name }]));
    const slot = deriveSlot({
      descriptor: SLOTS_BY_KEY.get(ItemTypeEnum.headMiddle)!,
      item: items[MASK], mapEnchant: enchants, refineList: [], shadowRefineList: [],
    });

    expect(slot.cardSlots).toBe(1);
    expect(slot.enchantLists.slice(0, 3).every(list => !list?.length)).toBe(true);
    expect(slot.enchantLists[3]?.map(({ value, label }) => [value, label])).toEqual([
      [4948, 'Anti-Horário 1'], [4949, 'Anti-Horário 2'], [4950, 'Anti-Horário 3'],
    ]);
  });

  it.each([[undefined, 4], [4948, 6], [4949, 8], [4950, 10]])(
    'sums enchant %s with the mask for %i%% after-cast delay reduction', (enchant, expected) => {
      const model = createMainModel();
      model.headMiddle = MASK;
      model.headMiddleEnchant3 = enchant;
      const bonus = equipStatusOf(makeCalculator(items), model);

      expect(bonus['acd']).toBe(expected);
      expect(bonus['pAtk']).toBe(5);
      expect(bonus['sMatk']).toBe(5);
    },
  );
});
