import { describe, expect, it } from 'vitest';
import { AtkSkillFormulaInput, AtkSkillModel } from './_character-base.abstract';
import { RoyalGuard } from './RoyalGuard';

/**
 * Trindade (Hesperus Lit, LG_HESPERUSLIT 2324) — the Royal Guard's spear-only melee hit,
 * held to the two-column table in the client's own pt-BR description:
 *
 *   Nível l ATQ l ATQ (Consagração)
 *   Nv 1    300%    450%
 *   Nv 2    600%    900%
 *   Nv 3    900%  1.350%
 *   Nv 4  1.200%  1.800%
 *   Nv 5  1.500%  2.250%
 *
 * VIT and the base level also scale it, per bROWiki's formula
 * (https://browiki.org/wiki/Trindade):
 *
 *   Normal:      Dano = [(Dano base + VIT) x (Nv. de base / 100)]%
 *   Consagração: Dano = [(Dano base + VIT x 2) x (Nv. de base / 100)]%
 *
 * 'Inspiration' is this engine's internal name for Consagração (skill id 2325), the same
 * toggle Luz da Criação and Toque do Oblívio already read.
 */

const BASE_LEVEL = 100; // x baseLevel/100 = x1, so the ratio reads as the client's %

/** The class with an empty skill state — every mastery at 0, no toggle active. */
function bare(active: string[] = []): RoyalGuard {
  const cls = new RoyalGuard();
  (cls as any).bonuses = {
    activeSkillNames: new Set<string>(active),
    equipAtks: {},
    masteryAtks: {},
    learnedSkillMap: new Map<string, number>(),
    usedSkillMap: new Map<string, number>(),
  };
  return cls;
}

function skillOf(cls: RoyalGuard): AtkSkillModel {
  const skill = cls.atkSkills.find((s: AtkSkillModel) => s.name === 'Hesperus Lit');
  if (!skill) throw new Error('atk skill not found: Hesperus Lit');

  return skill;
}

function ratioOf(cls: RoyalGuard, skillLevel: number, totalVit = 0): number {
  const input = {
    model: { level: BASE_LEVEL },
    skillLevel,
    status: { totalVit, totalStr: 0, totalDex: 0 },
    equipmentBonus: {},
  } as unknown as AtkSkillFormulaInput;

  // The server int-casts the ratio; see [[skill-ratio-truncation]].
  return Math.floor(skillOf(cls).formula(input));
}

describe('Trindade — a tabela do cliente, sem Consagração', () => {
  it.each([
    [1, 300],
    [2, 600],
    [3, 900],
    [4, 1200],
    [5, 1500],
  ])('Nv %i = %i%%', (level, expected) => {
    expect(ratioOf(bare(), level)).toBe(expected);
  });

  it('soma a VIT uma vez', () => {
    expect(ratioOf(bare(), 5, 120)).toBe(1500 + 120);
  });
});

describe('Trindade — com Consagração ativa', () => {
  it.each([
    [1, 450],
    [2, 900],
    [3, 1350],
    [4, 1800],
    [5, 2250],
  ])('Nv %i = %i%%', (level, expected) => {
    expect(ratioOf(bare(['Inspiration']), level)).toBe(expected);
  });

  it('soma a VIT em dobro', () => {
    expect(ratioOf(bare(['Inspiration']), 5, 120)).toBe(2250 + 240);
  });
});

describe('Trindade — nível de base e restrições', () => {
  it('escala pelo nível de base', () => {
    const input = {
      model: { level: 250 },
      skillLevel: 5,
      status: { totalVit: 100 },
      equipmentBonus: {},
    } as unknown as AtkSkillFormulaInput;

    expect(Math.floor(skillOf(bare()).formula(input))).toBe(Math.floor((1500 + 100) * 2.5));
  });

  it('oferece todos os cinco níveis no seletor', () => {
    const skill = skillOf(bare());
    expect(skill.value).toBe('Hesperus Lit==5');
    expect(skill.levelList.map((entry) => entry.value)).toEqual([
      'Hesperus Lit==1',
      'Hesperus Lit==2',
      'Hesperus Lit==3',
      'Hesperus Lit==4',
      'Hesperus Lit==5',
    ]);
  });

  it('exige lança (uma ou duas mãos) e é corpo a corpo', () => {
    const skill = skillOf(bare());
    expect(skill.isMelee).toBe(true);

    const withType = (type: string) =>
      skill.verifyItemFn({ weapon: { isType: (t: string) => t === type } } as any);
    expect(withType('spear')).toBe('');
    expect(withType('twohandSpear')).toBe('');
    expect(withType('twohandSword')).toBe('spear, twohandSpear');
  });

  it('usa os tempos da janela do cliente (pós 0,5 s, recarga 0,2 s)', () => {
    const skill = skillOf(bare());
    expect([skill.fct, skill.vct, skill.acd, skill.cd]).toEqual([0, 0, 0.5, 0.2]);
  });
});
