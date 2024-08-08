import { Sangtae } from './sangtae.ts';
import { Callback } from './type.ts';

/**
 * Represents a computed state derived from another state, without the ability to set it directly
 * @template State The type of the state
 */
export type Computed<State> = Omit<Sangtae<State>, 'set'>;

/**
 * Creates a computed state object based on a selector function applied to another state
 * @template State The type of the state
 * @param {Sangtae<State>} sangtae The original state object
 * @param {function(State): State} selector A function that selects or transforms the original state
 * @returns {Computed<State>} A computed state object
 */
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
