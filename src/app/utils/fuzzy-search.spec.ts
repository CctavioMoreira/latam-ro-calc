import { createFuzzyMatcher } from './fuzzy-search';

describe('fuzzy name search (tracker guMcAuwzoEK5CyIY4CZ6)', () => {
  it('ignores case, accents, repeated spaces and word order', () => {
    expect(createFuzzyMatcher('  agilidade   POCAO  ')('Poção de Agilidade')).toBe(true);
    expect(createFuzzyMatcher('benção')('Bênção')).toBe(true);
    expect(createFuzzyMatcher('cafe')('Cafe\u0301')).toBe(true);
  });
  it('matches abbreviated character sequences but requires every token', () => {
    expect(createFuzzyMatcher('chp tste')('Chapéu de Teste')).toBe(true);
    expect(createFuzzyMatcher('chp botas')('Chapéu de Teste')).toBe(false);
    expect(createFuzzyMatcher('uz')('Bênção')).toBe(false);
    expect(createFuzzyMatcher('123')('Monstro 213')).toBe(false);
  });
  it('restores all entries for empty or whitespace-only searches', () => {
    expect(['', ' ', '  \t '].every(query => createFuzzyMatcher(query)('Bênção'))).toBe(true);
    expect(createFuzzyMatcher('')('')).toBe(true);
  });
});
