# Tiny Sangtae

Tiny Sangtae is a state management library written in TypeScript. It can be used with Vanilla JS and React.

'Sangtae' means 'state' in Korean.

## Install

```shell
npm install tiny-sangtae
```

## Usage

### Sangtae

`sangtae` can be used to store string, number, array and any type.

```typescript
import { sangtae } from 'tiny-sangtae';

const $counter = sangtae(0);
```

`get` can get the saved state.

```typescript
console.log($counter.get()); // 0
```

`set` can set the saved state.

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

`subscribe` allows you to register a `callback` that will be called when the state changes.

```typescript
$counter.subscribe(() => console.log(`$counter: ${$counter.get()}`));
$counter.set(1); // $counter: 1
```

The `callback` is called as many times as the set is invoked.

```typescript
$counter.subscribe(() => console.log(`$counter: ${$counter.get()}`));
$counter.set(1); // $counter: 1
$counter.set(2); // $counter: 2
$counter.set(3); // $counter: 3
```

If the function `unsubscribe` returned by `subscribe` is called, the `callback` will no longer be invoked.

```typescript
const unsubscribe = $counter.subscribe(() => console.log(`$counter: ${$counter.get()}`));
$counter.set(1); // $counter: 1

unsubscribe();
$counter.set(2);
$counter.set(3);
```

### Computed

`computed` can create derived state from `sangtae`.

```typescript
import { computed, sangtae } from 'tiny-sangtae';

const $lastName = sangtae('Lee');
const $fullName = computed($lastName, ln => ln + ' Hyanggi');
console.log($fullName.get()); // Lee Hyanggi
```

`computed` can also create derived state from `computed`.

```typescript
import { computed, sangtae } from 'tiny-sangtae';

const $lastName = sangtae('Lee');
const $fullName = computed($lastName, ln => ln + ' Hyanggi');
const $info = computed($fullName, fn => ({ name: fn, age: 20 }));
console.log($info.get()); // { name: Lee Hyanggi, age: 20 }
```

`computed` can also create derived state from multiple `sangtae` or `computed`.

```typescript
import { computed, sangtae } from 'tiny-sangtae';

const $lastName = sangtae('Lee');
const $firstName = sangtae('Hyanggi');
const $fullName = computed([$lastName, $firstName], (ln, fn) => `${ln} ${fn}`);
console.log($fullName.get()); // Lee Hyanggi
```

When the original `sangtae` changes, the `computed` state also changes.

```typescript
$lastName.set('Kim');
console.log($fullName.get()); // Kim Hyanggi
```

Just like `sangtae`, you can call `subscribe` on `computed`.

```typescript
const unsubscribe = $fullName.subscribe(() => console.log(fullName));
$lastName.set('Park'); // Park Hyanggi;

unsubscribe();
$lastName.set('Choi');
```

### Action

If `set` is called consecutively in `action`, the `callback` is called only once at the end.

```typescript
$counter.subscribe(() => console.log(`$counter: ${$counter.get()}`));
action(() => {
  $counter.set(1);
  $counter.set(2);
  $counter.set(3);
  $counter.set(4); // $counter: 4
});
```

If an `asynchronous` task is called within `action`, subsequent tasks are not included in the `action`.

```typescript
import { resolve } from 'path';

$counter.subscribe(() => console.log(`$counter: ${$counter.get()}`));
action(async () => {
  $counter.set(1);
  $counter.set(2);

  await new Promise(resolve => setTimeout(resolve, 0));

  $counter.set(3);
  $counter.set(4);
});
```

This code will first print `$counter: 2` to the console, and after 1 second, it will print`$counter: 3` and `$counter: 4`.

## Integration

### React

[`@tiny-sangtae/react`](https://github.com/2scent/tiny-sangtae-react) provides `useSangtae` hook.

This hook takes either a `sangtae` or `computed` as an argument and returns the state.

```tsx
// counter.ts
import { sangtae, computed } from 'tiny-sangtae';

export const $counter = sangtae(0);

export const $counterAdded10 = computed($counter, v => v + 10);

export const increase = () => $counter.set(v => v + 1);
export const decrease = () => $counter.set(v => v - 1);

// Counter.tsx
import { useSangtae } from '@tiny-sangtae/react';
import { $counter, $counterAdded10, increase, decrease } from './counter';

export default function Counter() {
  const counter = useSangtae($counter);
  const counterAdded10 = useSangtae($counterAdded10);

  return (
    <div>
      <h1>{counter} + 10 = {counterAdded10}</h1>
      <button type="button" onClick={increase}>+</button>
      <button type="button" onClick={decrease}>-</button>
    </div>
  );
}
```
