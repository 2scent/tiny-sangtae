# Tiny Sangtae

Tiny Sangtae is a state management library written in TypeScript. It can be used with Vanilla JS and React.

'Sangtae' means 'state' in Korean.

## Install

```shell
npm install tiny-sangtae
```

## Smart Stores

- Persistent (not yet)
- Query (not yet)

## Usage

### Sangtae

`sangtae` can be used to store string, number, array and any type.

```typescript
import { sangtae } from 'sangtae';

const $counter = sangtae(0);
```

`get` can retrieve the saved state.

```typescript
console.log($counter.get()); // 0
```

`set` can modify the saved state.

```typescript
$counter.set(1);
console.log($counter.get()); // 1
```

A function can be passed to `set`, and the current state is provided as an argument.

```typescript
$counter.set(5);
$counter.set((v) => v + 5);
console.log($counter.get()); // 10
```

`subscribe` allows you to register a `callback` that will be called whenever the value changes.

```typescript
$counter.subscribe(() => console.log(`$counter: ${$counter.get()}`));
$counter.set(1); // $counter: 1
```

If `set` is called consecutively, the `callback` is executed only once at the end.

```typescript
$counter.subscribe(() => console.log(`$counter: ${$counter.get()}`));
$counter.set(1);
$counter.set(2);
$counter.set(3); // $counter: 3
```

If the function `unsubscribe` returned by `subscribe` is called, the `callback` will no longer be invoked.

```typescript
const unsubscribe = $counter.subscribe(() => console.log(`$counter: ${$counter.get()}`));
$counter.set(1); // $counter: 1

unsubscribe();
$counter.set(5);
```

### Computed

`computed` can create derived state from `sangtae`.

```typescript
import { computed, sangtae } from 'sangtae';

const $lastName = sangtae('Lee');
const $fullName = computed($lastName, (ln) => ln + ' Hyanggi');
console.log($fullName); // Lee Hyanggi
```

When the original `sangtae` changes, the `computed` state also changes.

```typescript
$lastName.set('Kim');
console.log($fullName); // Kim Hyanggi
```

Just like `sangtae`, you can call `subscribe` on `computed`.

```typescript
const unsubscribe = $fullName.subscribe(() => console.log(fullName));
$lastName.set('Park'); // Park Hyanggi;

unsubscribe();
$lastName.set('Choi');
```

## Integration

### React

```tsx
// src/stores/counter.ts
import { sangate } from 'tiny-sangtae';

export const $counter = sangtae(0);

// src/components/Counter.tsx
import { useStore } from '@tiny-sangtae/react';
import { $counter } from '../stores/counter';

export default function Counter() {
  const [counter, setCounter] = useStore($counter);

  const increase = () => setCounter((c) => c + 1);

  const decrease = () => setCounter((c) => c - 1);

  return (
    <div>
      <h1>{counter}</h1>
      <button type="button" onClick={increase}>+</button>
      <button type="button" onClick={decrease}>-</button>
    </div>
  );
}
```
