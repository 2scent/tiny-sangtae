interface Sangtae<T> {
  get: () => T;
  set: (next: T | ((prev: T) => T)) => void;
}

export function sangtae<T>(initialState: T): Sangtae<T> {
  let state = initialState;

  const get = () => state;

  const set = (next: T | ((prev: T) => T)) => {
    if (typeof next === 'function') {
      state = (next as (prev: T) => T)(state);
    } else {
      state = next;
    }
  };

  return {
    get,
    set,
  };
}
