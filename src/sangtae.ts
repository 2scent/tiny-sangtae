/**
 * A function type that takes the previous state and returns a new state
 * @template T The type of the state
 */
type NextFunction<T> = (prev: T) => T;

/**
 * Represents either a new state value or a function to update the state
 * @template T The type of the state
 */
type Next<T> = T | NextFunction<T>;

/**
 * Callback function type
 */
export type Callback = () => void;

/**
 * Interface for state management
 * @template State The type of the state
 */
export interface Sangtae<State> {
  /**
   * Returns the current state
   * @returns {State} The current state
   */
  get: () => State;

  /**
   * Updates the state
   * @param {Next<State>} next The new state value or a function to update the state
   */
  set: (next: Next<State>) => void;

  /**
   * Subscribes to state changes
   * @param {Callback} callback The function to be called when the state changes
   * @returns {() => void} A function to unsubscribe
   */
  subscribe: (callback: Callback) => () => void;
}

function batch(callback: Callback) {
  if (typeof window !== 'undefined') {
    const id = requestAnimationFrame(callback);
    return () => cancelAnimationFrame(id);
  } else {
    const id = setTimeout(callback, 0);
    return () => clearTimeout(id);
  }
}

/**
 * Creates a state management object
 * @template State The type of the state
 * @param {State} initialState The initial state
 * @returns {Sangtae<State>} A state management object
 */
export function sangtae<State>(initialState: State): Sangtae<State> {
  let state = initialState;

  const callbacks = new Set<Callback>();

  const get = () => state;

  let nextQueue: Array<Next<State>> = [];
  let cancelBatch: (() => void) | null = null;

  const set = (next: Next<State>) => {
    nextQueue.push(next);
    cancelBatch?.();

    cancelBatch = batch(() => {
      const prev = state;

      for (const next of nextQueue) {
        if (typeof next === 'function') {
          state = (next as NextFunction<State>)(state);
        } else {
          state = next;
        }
      }

      nextQueue = [];
      cancelBatch = null;

      if (prev !== state) {
        for (const callback of callbacks) {
          callback();
        }
      }
    });
  };

  const subscribe = (callback: Callback) => {
    callbacks.add(callback);
    return () => {
      callbacks.delete(callback);
    };
  };

  return {
    get,
    set,
    subscribe,
  };
}
