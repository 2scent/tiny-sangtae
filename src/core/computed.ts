import { Callback, Sangtae } from './sangtae.ts';

export type Computed<State> = Omit<Sangtae<State>, 'set'>;

export function computed<State>(
  sangtae: Sangtae<State>,
  selector: (value: State) => State,
): Computed<State> {
  const get = () => selector(sangtae.get());

  const subscribe = (callback: Callback) => {
    return sangtae.subscribe(callback);
  };

  return {
    get,
    subscribe,
  };
}
