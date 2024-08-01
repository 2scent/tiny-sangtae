# Tiny Sangtae

Tiny Sangtae is a state management library written in TypeScript. It can be used with Vanilla JS and React.

'Sangtae' means 'state' in Korean.

## Install

```shell
npm install tiny-sangtae
```

## Usage

```typescript
const counter = sangtae(0);

console.log(counter.get()); // 0

counter.set(v => v + 1);
console.log(counter.get()); // 1

const unsubscribe = counter.subscribe(() => {
  console.log('counter is updated');
});

counter.set(v => v + 1); // counter is updated
counter.set(v => v + 1); // counter is updated

unsubscribe();

counter.set(v => v + 1);
console.log(counter.get()); // 4
```
