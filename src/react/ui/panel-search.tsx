import { ReactNode, useRef, useState } from 'react';
import { createFuzzyMatcher } from '../../app/utils/fuzzy-search';
import { Icon } from './primitives';

export function PanelSearch({ label, labels, children }: {
  label: string;
  labels: string[];
  children: (matches: (text: string) => boolean) => ReactNode;
}) {
  const [query, setQuery] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const matches = createFuzzyMatcher(query);
  const hasResults = labels.some(matches);
  return <>
    <div className="calc-panel-search">
      <Icon name="search" />
      <input ref={input} type="search" className="ui-inputtext" aria-label={`Buscar ${label}`}
        placeholder={`Buscar ${label}`} value={query} autoComplete="off"
        onChange={event => setQuery(event.target.value)} />
      {query && <button type="button" className="ui-link" aria-label={`Limpar busca de ${label}`}
        onClick={() => { setQuery(''); input.current?.focus(); }}><Icon name="times" /></button>}
    </div>
    {!hasResults && query.trim() ? <p className="calc-search-empty" role="status">Nenhum resultado encontrado.</p> : children(matches)}
  </>;
}
