import type { Sangtae } from './sangtae.ts';

export interface Computed<State> {
  get: () => State;
}

export function computed<State>(
  sangtae: Sangtae<State>,
  selector: (value: State) => State,
): Computed<State> {
  const get = () => selector(sangtae.get());

  return {
    get,
  };
}
