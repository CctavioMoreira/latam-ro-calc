import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { AbyssChaser } from '../jobs';
import { createMainModel } from '../utils';
import { equipStatusOf, makeCalculator } from './__tests__/make-calculator';

const db = JSON.parse(readFileSync('src/assets/demo/data/item.json', 'utf8'));
const latam = JSON.parse(readFileSync('src/assets/demo/data/latam-items.json', 'utf8'));
const set = {
  shadowWeapon: 24594,
  shadowArmor: 24584,
  shadowShield: 24585,
  shadowBoot: 24586,
  shadowEarring: 24587,
  shadowPendant: 24588,
};
const items = Object.fromEntries([...Object.values(set), 24595].map((id) => [id, {
  ...db[id], enName: db[id].name, name: latam[id].name,
}]));

// SYIhioadKMUxuGZ9HZvL: the client description grants flat ASPD +2 with all five
// partners. The armor's own ASPD +1 must survive when the weapon combo is broken.
function totals(gear: Record<string, number>) {
  return equipStatusOf(makeCalculator(items, new AbyssChaser()), { ...createMainModel(), ...gear });
}

describe('Manopla Sombria de Apoio Sinistro', () => {
  it('adds the described flat ASPD +2 with the complete localized set', () => {
    expect(totals(set)).toMatchObject({
      aspd: 3, aspdPercent: 7, acd: 15, p_pene_race_all: 70, m_pene_race_all: 70,
      m_my_element_neutral: 10, 2284: 15, 2288: 15,
    });
  });

  it.each(Object.keys(set))('does not grant combo ASPD without %s', (missing) => {
    const gear = { ...set, [missing]: 0 };
    expect(totals(gear).aspd).toBe(missing === 'shadowArmor' ? 0 : 1);
  });

  it('does not grant combo ASPD with another shadow weapon', () => {
    expect(totals({ ...set, shadowWeapon: 24595 }).aspd).toBe(1);
    expect(totals({ shadowWeapon: set.shadowWeapon }).aspd).toBe(0);
  });
});
