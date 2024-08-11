import { Sangtae } from './sangtae.ts';
import { SubscribeCallback } from './type.ts';

/**
 * Represents a computed value that can be retrieved and subscribed to.
 */
export interface Computed<Result> {
  /**
   * Retrieves the current computed result.
   * @returns The current computed result.
   */
  get: () => Result;

  /**
   * Subscribes to changes in the computed result.
   * @param callback The function to be called when the result changes.
   * @returns {() => void} A function to unsubscribe from the changes.
   */
  subscribe: (callback: SubscribeCallback<Result>) => () => void;
}

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

  const subscribe = (callback: SubscribeCallback<Result>) => {
    return sangtae.subscribe(() => callback(get()));
  };

  return {
    get,
    subscribe,
  };
}
