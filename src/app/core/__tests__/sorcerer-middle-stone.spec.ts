import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { Sorcerer } from 'src/app/jobs';
import { createMainModel } from 'src/app/utils';
import { equipStatusOf, makeCalculator } from './make-calculator';

const db = JSON.parse(readFileSync('src/assets/demo/data/item.json', 'utf8'));
const STONE = 311012;

// Tracker M7WlH6ZDKwybneXuXQ36. latam-items.json (311012):
// A cada nível de [Pó de Diamante]: Conjuração variável -1%.
function variableCastReduction(level: number, withStone = true): number {
  const cls = new Sorcerer();
  const calc = makeCalculator({ [STONE]: db[STONE] }, cls);
  const passiveSkillIds = cls.passiveSkills.map((skill) => skill.name === 'Diamond Dust' ? level : 0);
  const { learnedSkillMap } = cls.setLearnSkills({ activeSkillIds: [], passiveSkillIds }).getSkillBonusAndName();
  calc.setLearnedSkills(learnedSkillMap);

  const model = createMainModel();
  if (withStone) model.costumeEnchantMiddle = STONE;

  return equipStatusOf(calc, model).vct;
}

describe('Feiticeiro (Meio) variable cast reduction', () => {
  it.each([0, 1, 2, 3, 4, 5])('reduces variable cast by one percentage point per level (Pó de Diamante %i)', (level) => {
    expect(variableCastReduction(level)).toBe(level);
  });

  it('grants no reduction without the stone equipped', () => {
    expect(variableCastReduction(5, false)).toBe(0);
  });
});
