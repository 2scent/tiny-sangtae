import { useSangtae } from '@tiny-sangtae/react';
import { $counter, $counterAdded100, increase, decrease } from './store';

function CounterAdded100() {
  const counter = useSangtae($counter);
  const counterAdded100 = useSangtae($counterAdded100);

  return (
    <div>
      <h1>
        {counter} + 100 = {counterAdded100}
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

export default CounterAdded100;
