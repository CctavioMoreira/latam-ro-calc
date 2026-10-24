import { readFileSync } from 'node:fs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { isCoarsePointer, trapFocus } from '../../react/ui/layers';
import { ItemPickerOverlayComponent } from '../../react/controllers/item-picker-overlay';
import { DescriptionStore } from '../../react/services/data-client';

const topbarTsx = readFileSync('src/react/views/content/app.topbar.tsx', 'utf8');
const calcTsx = readFileSync('src/react/views/content/ro-calculator.tsx', 'utf8');
const notificationsTsx = readFileSync('src/react/ui/notifications.tsx', 'utf8');
const equipGridCss = readFileSync('src/react/views/equipment-grid.css', 'utf8');
const mobileCss = readFileSync('src/react/views/mobile-responsive.css', 'utf8');

describe('mobile responsiveness & touch UX contracts', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('removes hardcoded min-width: 1500px from topbar and calculator root grid', () => {
    expect(topbarTsx).not.toContain('min-width: 1500px');
    expect(calcTsx).not.toContain('min-width: 1500px');
  });

  it('bounds dialog widths with maxWidth in vw rather than raw 25vw/50vw', () => {
    expect(topbarTsx).not.toContain('"width": "50vw"');
    expect(calcTsx).not.toContain('"width": "25vw"');
    expect(notificationsTsx).not.toContain("width: '25vw'");
    expect(notificationsTsx).toContain("maxWidth: '92vw'");
  });

  it('uses a responsive minmax(min(100%, 480px), 1fr) track on equipment-grid columns', () => {
    expect(equipGridCss).toContain('minmax(min(100%, 480px), 1fr)');
  });

  it('includes Sticky Mini-HUD and Bottom Sheet rules in mobile-responsive.css', () => {
    expect(calcTsx).toContain('className="ro-mobile-hud"');
    expect(mobileCss).toContain('.ro-mobile-hud');
    expect(mobileCss).toContain('.ui-item-picker-pane--sheet');
    expect(mobileCss).toContain('touch-action: none');
  });

  it('skips auto-focusing text inputs inside trapFocus on coarse pointers to prevent virtual keyboard popups', async () => {
    const inputFocus = vi.fn();
    const buttonFocus = vi.fn();
    const panelFocus = vi.fn();
    const input = {
      tagName: 'INPUT',
      tabIndex: 0,
      matches: (sel: string) => sel.includes('input'),
      closest: () => null,
      getClientRects: () => [{}],
      focus: inputFocus,
    } as unknown as HTMLElement;
    const closeBtn = {
      tagName: 'BUTTON',
      tabIndex: 0,
      matches: () => false,
      closest: () => null,
      getClientRects: () => [{}],
      focus: buttonFocus,
    } as unknown as HTMLElement;
    const panel = {
      querySelector: (sel: string) => (sel === '[data-focus-initial]' ? input : null),
      querySelectorAll: () => [input, closeBtn],
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      focus: panelFocus,
    } as unknown as HTMLElement;

    vi.stubGlobal('document', { activeElement: null });
    vi.stubGlobal('getComputedStyle', () => ({ visibility: 'visible' }));
    vi.stubGlobal('window', {
      matchMedia: (query: string) => ({ matches: query === '(pointer: coarse)' }),
    });

    expect(isCoarsePointer()).toBe(true);
    const cleanup = trapFocus(panel);
    await new Promise<void>(resolve => queueMicrotask(resolve));
    expect(inputFocus).not.toHaveBeenCalled();
    expect(buttonFocus).toHaveBeenCalledWith({ preventScroll: true });
    cleanup();
  });

  it('toggles item description preview in ItemPickerOverlayComponent without committing selection', () => {
    const host = { nativeElement: { querySelector: () => null } as unknown as HTMLElement };
    const descriptions = { get: vi.fn(), version: 1, subscribe: vi.fn(), getSnapshot: () => 1 } as unknown as DescriptionStore;
    const vm = new ItemPickerOverlayComponent(host, descriptions);
    vm.init({
      mode: 'flat',
      title: 'Topo',
      anchor: {} as HTMLElement,
      value: null,
      options: [{ label: 'Chapéu', value: 1001 }],
      filterKeys: ['label'],
    });
    const stopPropagation = vi.fn();
    expect(vm.previewValue).toBeNull();
    vm.togglePreview(1001, { stopPropagation });
    expect(stopPropagation).toHaveBeenCalledOnce();
    expect(vm.previewValue).toBe(1001);
    vm.togglePreview(1001, { stopPropagation });
    expect(vm.previewValue).toBeNull();
  });
});
