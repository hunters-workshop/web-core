import type { Atom } from 'jotai';

class JotaiState {
  fields: Record<string, Atom<unknown>>;

  constructor() {
    this.fields = {};
  }

  getField(field: string): Atom<unknown> {
    return this.fields[field];
  }

  setField(field: string, atom: Atom<unknown>): void {
    this.fields[field] = atom;
  }

  clear() {
    this.fields = {};
  }
}

const jotaiState = new JotaiState();

export const clearJotaiState = () => jotaiState.clear();

export const getJotaiState = (field: string): Atom<unknown> =>
  jotaiState.getField(field);

export const setJotaiState = (
  field: string,
  atom: Atom<unknown>,
): void => jotaiState.setField(field, atom);