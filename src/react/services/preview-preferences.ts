import { StorageLike } from '../../app/core/calc-storage';
import { Store } from '../state/store';

/** Browser preference, independent of saved/shared builds. */
export class PreviewPreferences extends Store<boolean> {
  constructor(private readonly storage?: StorageLike) {
    super(storage?.getItem('ro-show-previews') !== 'false');
  }

  override set(value: boolean): void {
    this.storage?.setItem('ro-show-previews', String(value));
    super.set(value);
  }
}
