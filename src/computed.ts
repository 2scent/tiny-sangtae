import { Sangtae } from './sangtae.ts';
import { SubscribeCallback } from './type.ts';

/**
 * Represents a computed value that can be retrieved and subscribed to.
 */
export type Computed<Result> = Omit<Sangtae<Result>, 'set'>;

/**
 * Creates a computed value based on a Sangtae state and a selector function.
 * @param sangtae The Sangtae state object.
 * @param selector A function that computes the result from the state.
 * @returns A Computed object for the computed result.
 */
export function computed<State, Result>(
  sangtae: Sangtae<State> | Computed<State>,
  selector: (value: State) => Result,
): Computed<Result> {
  const get = () => selector(sangtae.get());

  const subscribe = (callback: SubscribeCallback<Result>, key?: unknown) => {
    return sangtae.subscribe(() => callback(get()), key);
  };

  return {
    get,
    subscribe,
  };
}
