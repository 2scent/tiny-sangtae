interface Sangtae<T> {
  get: () => T;
}

export function sangtae<T>(initialState: T): Sangtae<T> {
  const state = initialState;

  const get = () => state;

  return {
    get,
  };
}
