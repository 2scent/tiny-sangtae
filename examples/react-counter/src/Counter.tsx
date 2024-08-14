import { useSangtae } from '@tiny-sangtae/react';
import { $counter, increase, decrease } from './store';

function Counter() {
  const counter = useSangtae($counter);

  return (
    <div>
      <h1>{counter}</h1>
      <button type="button" onClick={increase}>
        +
      </button>
      &nbsp;
      <button type="button" onClick={decrease}>
        -
      </button>
    </div>
  );
}

export default Counter;
