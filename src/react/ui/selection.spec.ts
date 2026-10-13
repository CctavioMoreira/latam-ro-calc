import { filteredRows, optionLabel, optionValue, toggleSelection, virtualRange } from './selection';

describe('React selection contracts', () => {
  it('prioritizes literal names over fuzzy matches in item selectors', () => {
    const fuzzy = { label: 'Botas Rochosas Elegantes' };
    const literal = { label: 'Broche' };
    expect(filteredRows([fuzzy, literal], 'BROCHE', false)).toEqual([{ option: literal }, { option: fuzzy }]);
  });
  it('uses fuzzy accent-insensitive matching in grouped selectors and aliases', () => {
    const blessing = { label: 'Bênção', value: 1 };
    const potion = { label: 'Poção de Agilidade', value: 2, searchVal: '12020' };
    const groups = [{ label: 'Buffs', items: [blessing] }, { label: 'Itens', items: [potion] }];
    expect(filteredRows(groups, 'AGI PCAO', true).map(row => row.option)).toEqual([groups[1], potion]);
    expect(filteredRows([potion], '12020', false, 'label,searchVal')).toEqual([{ option: potion }]);
    expect(filteredRows(groups, 'sem resultado', true)).toEqual([]);
    expect(filteredRows([blessing], 'BNCAO', false)).toEqual([{ option: blessing }]);
    expect(filteredRows([blessing], '', false)).toEqual([{ option: blessing }]);
  });
  it('combines panel and dropdown filters without changing the source options', () => {
    const options = [{ label: 'Poção de Agilidade' }, { label: 'Poção da Fúria Selvagem' }, { label: 'Bênção' }];
    const panelFilter = (option: any) => option.label.startsWith('Poção');
    expect(filteredRows(options, 'fr selv', false, 'label', undefined, panelFilter)).toEqual([{ option: options[1] }]);
    expect(options).toHaveLength(3);
  });
  it('keeps falsy primitives and distinguishes object identity from explicit values', () => {
    expect(optionValue(0)).toBe(0);
    expect(optionValue(false)).toBe(false);
    const object = { label: 'Zero', value: 0, id: 3 };
    expect(optionValue(object)).toBe(0);
    expect(optionValue(object, undefined, 'label')).toBe(object);
    expect(optionValue(object, 'id', 'label')).toBe(3);
    expect(optionLabel(false)).toBe('false');
    expect(optionLabel({ value: 0 })).toBe('0');
  });
  it('toggles an object by identity without modifying the current selection', () => {
    const object = { id: 1 };
    const other = { id: 1 };
    const previous = [object];
    expect(toggleSelection(previous, object)).toEqual([]);
    expect(toggleSelection(previous, other)).toEqual([object, other]);
    expect(previous).toEqual([object]);
  });
  it('retains overscan and bounds virtual windows after filtering', () => {
    expect(virtualRange(100, 28, 280, 280)).toEqual({ start: 6, end: 24 });
    expect(virtualRange(2, 28, 280, 280)).toEqual({ start: 2, end: 2 });
    expect(virtualRange(100, 28, 280, -1)).toEqual({ start: 0, end: 14 });
  });
});
