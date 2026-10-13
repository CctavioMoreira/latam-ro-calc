import { PreviewPreferences } from './preview-preferences';
import { ItemPicker } from './pickers';

function storage() {
  const values = new Map<string, string>();
  return { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); } };
}

describe('preview visibility', () => {
  it('defaults on, persists both choices and publishes changes', () => {
    const backend = storage();
    const preference = new PreviewPreferences(backend);
    const changed = vi.fn();
    preference.subscribe(changed);
    expect(preference.getSnapshot()).toBe(true);
    preference.set(false);
    expect(changed).toHaveBeenCalledOnce();
    expect(new PreviewPreferences(backend).getSnapshot()).toBe(false);
    preference.set(true);
    expect(new PreviewPreferences(backend).getSnapshot()).toBe(true);
  });

  it('filters preview enchant and item options without changing the source list', () => {
    const preference = new PreviewPreferences(storage());
    const picker = new ItemPicker(preference);
    const options = [{ label: 'LATAM', value: 1 }, { label: 'Item de prévia', value: 2 }, { label: 'Encantamento de prévia', value: 3, preRelease: true }];
    const request = { mode: 'flat' as const, anchor: null!, title: 'Equipamento', value: null, filterKeys: ['label'], options,
      items: { 2: { id: 2, preRelease: true } } as any };
    preference.set(false);
    void picker.open(request);
    expect((picker.getSnapshot() as any).options.map(option => option.value)).toEqual([1]);
    preference.set(true);
    void picker.open(request);
    expect((picker.getSnapshot() as any).options).toEqual(options);
    expect(options).toHaveLength(3);
    picker.close();
  });
});
