import reactLogo from './assets/react.svg';
import './App.css';
import Counter from './Counter.tsx';
import CounterAdded10 from './CounterAdded10.tsx';
import CounterAdded100 from './CounterAdded100.tsx';

function App() {
  return (
    <>
      <div>
        <img src={reactLogo} className="logo react" alt="React logo" />
      </div>
      <h1>Tiny Sangtae Counter</h1>
      <div className="card">
        <Counter />
        <CounterAdded10 />
        <CounterAdded100 />
      </div>
    </>
  );
}

export default App;
