import { useSangtae } from '@tiny-sangtae/react';
import { $counter, $counterAdded10, increase, decrease } from './store';

function CounterAdded10() {
  const counter = useSangtae($counter);
  const counterAdded10 = useSangtae($counterAdded10);

  return (
    <div>
      <h1>
        {counter} + 10 = {counterAdded10}
      </h1>
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

export default CounterAdded10;
