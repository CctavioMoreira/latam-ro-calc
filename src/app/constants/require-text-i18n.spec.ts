import { describe, expect, it } from 'vitest';
import { localizeRequirement } from './weapon-type-mapper';

/**
 * The "⚠ Requer ..." warning under a skill is read by players, so it may never show the
 * engine's own identifiers. Classes write the requirement with whatever they match on —
 * `verifyItemFn` returns "spear, twohandSpear" for Trindade, "Gatling Gun, Shotgun" for
 * the Night Watch, "Shield" for Escudo Compressor — and this is the single boundary that
 * turns that into pt-BR, so no class has to remember to.
 *
 * Prose written in the class (the Inquisidor's auras, Prévia 27.5's weapon lines) passes
 * through untouched: a string with no identifier in it is already the message.
 */
describe('localizeRequirement', () => {
  it('traduz um tipo de arma só', () => {
    expect(localizeRequirement('katar')).toBe('Katar');
    expect(localizeRequirement('bow')).toBe('Arco');
  });

  it('lista alternativas com "ou"', () => {
    expect(localizeRequirement('spear, twohandSpear')).toBe('Lança ou Lança de duas mãos');
    expect(localizeRequirement('twohandSword, twohandSpear')).toBe('Espada de duas mãos ou Lança de duas mãos');
    expect(localizeRequirement('mace, twohandMace, book')).toBe('Maça, Maça de duas mãos ou Livro');
  });

  it('traduz os subtipos de arma de fogo do Guerrilheiro', () => {
    expect(localizeRequirement('Gatling Gun, Shotgun')).toBe('Metralhadora ou Espingarda');
    expect(localizeRequirement('Rifle, Revolver')).toBe('Rifle ou Revólver');
    expect(localizeRequirement('Shotgun, Gatling Gun, Grenade Launcher')).toBe('Espingarda, Metralhadora ou Lança-granadas');
  });

  it('traduz os equipamentos que não são a arma', () => {
    expect(localizeRequirement('Shield')).toBe('Escudo');
  });

  it('devolve intacto o texto já escrito em pt-BR', () => {
    const aura = 'Auréola do Poder, do Juiz ou das Chamas';
    expect(localizeRequirement(aura)).toBe(aura);
    expect(localizeRequirement('Lança de duas mãos')).toBe('Lança de duas mãos');
    expect(localizeRequirement('Espingarda, metralhadora ou lança-granadas')).toBe('Espingarda, metralhadora ou lança-granadas');
  });

  it('devolve vazio quando não há exigência', () => {
    expect(localizeRequirement('')).toBe('');
  });
});
