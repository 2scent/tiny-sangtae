type NextFunction<T> = (prev: T) => T;

type Next<T> = T | NextFunction<T>;

type Callback = () => void;

interface Sangtae<State> {
  get: () => State;
  set: (next: Next<State>) => void;
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
