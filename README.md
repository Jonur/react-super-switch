# React Super Switch

A small React utility component for **deterministic, readable, and safe conditional rendering**.

`react-super-switch` guarantees that **exactly one** view is rendered from a set of mutually exclusive options, even when conditions are complex, unrelated, or derived from business logic.

---

## Why React Super Switch exists

Conditional rendering in React often starts simple and slowly becomes hard to reason about.

### The common problem

```tsx
return (
  <>
    {caseA && <ViewA />}
    {caseB && <ViewB />}
    {caseC && <ViewC />}
    {caseD && <ViewD />}
  </>
);
```

This pattern has several issues:

- Multiple views can accidentally render at the same time
- Ordering and priority are implicit and fragile
- Negating conditions quickly becomes unreadable
- Refactors are risky and hard to review
- React Fragments are often required just to make JSX valid
- React does not support `switch` or `if / else` directly in JSX

As business logic grows, correctness and readability degrade fast.

## The solution

`React Super Switch` introduces a declarative, safe alternative:

- Exactly one option is rendered
- Conditions are clearly scoped
- Priority is explicit (optional)
- A default fallback can be defined

Invalid configurations fail loudly during development

## Installation

```bash
npm install react-super-switch
```

### Requirements

- React 17 or newer
- `react` and `react-dom` are peer dependencies
- No runtime Node.js requirement for consumers

## Basic usage

```tsx
import { SuperSwitch, Option } from "react-super-switch";
```

> The package exposes named exports only.

## Example

### Before

```tsx
return (
  <>
    {businessCaseA && <ViewA />}
    {businessCaseB && <ViewB />}
    {businessCaseC && <ViewC />}
    {businessCaseD && <ViewD />}
  </>
);
```

### After

```tsx
return (
  <SuperSwitch>
    <Option condition={businessCaseA}>
      <ViewA />
    </Option>

    <Option condition={businessCaseB}>
      <ViewB />
    </Option>

    <Option condition={businessCaseC} default>
      <ViewC />
    </Option>

    <Option condition={businessCaseD}>
      <ViewD />
    </Option>
  </SuperSwitch>
);
```

**Only one** `<Option />` will ever render.

## Core concepts

### `<SuperSwitch />`

The parent component that evaluates all `<Option />` children and decides which one to render.

```tsx
<SuperSwitch mode="fcfs | priority">{options}</SuperSwitch>
```

| Prop   | Type                     | Default  | Description                          |
| ------ | ------------------------ | -------- | ------------------------------------ |
| `mode` | `"fcfs"` or `"priority"` | `"fcfs"` | Determines how options are evaluated |

### `<Option />`

Represents a single renderable branch.

```tsx
<Option condition={boolean} priority={number} default>
  {children}
</Option>
```

| Prop          | Type        | Required | Description                              |
| ------------- | ----------- | -------- | ---------------------------------------- |
| `condition`   | `boolean`   | ❌       | Whether this option is eligible          |
| `priority`    | `number`    | ❌       | Ordering hint (lower = higher priority)  |
| `data-testid` | `string`    | ❌       | A unique identifier for testing purposes |
| `default`     | `boolean`   | ❌       | Fallback option if no conditions match   |
| `children`    | `ReactNode` | ✅       | Rendered when this option is selected    |

### Evaluation modes

#### 1. `fcfs` (First-Come-First-Served) — default

Options are evaluated in JSX order.

- The first option with a truthy condition wins
- If no conditions match, the first default option is rendered
- priority is ignored

```tsx
<SuperSwitch>
  <Option condition={a}>
    <A />
  </Option>
  <Option condition={b}>
    <B />
  </Option>
  <Option default>
    <Fallback />
  </Option>
</SuperSwitch>
```

Use this mode when **visual order already represents priority**.

#### 2. `priority`

Options are evaluated by explicit priority.

- All `<Option />` elements must define `priority`
- Lower numbers mean higher priority (`1` beats `2`)
- Order in JSX does not matter
- Default options are still supported

```tsx
<SuperSwitch mode="priority">
  <Option condition={a} priority={2}>
    <A />
  </Option>
  <Option condition={b} priority={1}>
    <B />
  </Option>
  <Option default priority={99}>
    <Fallback />
  </Option>
</SuperSwitch>
```

Use this mode when:

- Business rules are complex
- Priority changes frequently
- You want cleaner diffs and safer refactors

### Default option behaviour

- At most one option is rendered
- If no conditions match:
  - the first default option is rendered
- If no default exists, an error is thrown

## Runtime validation (development safety)

### Invalid children

```tsx
<SuperSwitch>
  <div /> {/* ❌ not allowed */}
</SuperSwitch>
```

### Missing default

```tsx
<SuperSwitch>
  <Option condition={false}>
    <A />
  </Option>
</SuperSwitch>
```

### Invalid priority usage

```tsx
<SuperSwitch mode="priority">
  <Option condition={a} priority={1}>
    <A />
  </Option>
  <Option condition={b}>
    <B />
  </Option>{" "}
  {/* ❌ missing priority */}
</SuperSwitch>
```

## When should you use this library?

- When rendering logic depends on multiple independent conditions
- When only one view must ever render
- When priority must be explicit and reviewable
- When you want fail-fast behaviour instead of silent bugs

### When not to use it

- Simple ternaries
- Binary conditions (`if / else`)
- List rendering (map)

## Comparison with existing libraries

There are a few existing React libraries that aim to improve conditional rendering.
They are useful in certain scenarios, but they solve a **different class of problems**
than `react-super-switch`.

The goal of this library is **deterministic, exclusive rendering** with explicit
prioritisation and fail-fast guarantees.

---

### `react-switch`

`react-switch` provides a JSX-friendly abstraction similar to a `switch / case`
statement.

**What it’s good at:**

- Cleaner syntax than inline `&&` expressions
- Familiar `switch`-like mental model

**Limitations:**

- Multiple cases can render at the same time
- No priority or ordering guarantees
- No enforced default or fallback
- No runtime validation

`react-switch` assumes conditions are mutually exclusive, but does not enforce that
assumption.

---

### `react-if`

`react-if` models imperative `if / else if / else` logic in JSX.

**What it’s good at:**

- Simple, linear conditional flows
- Readable for small, sequential branches

**Limitations:**

- Conditions must be logically chained
- No concept of independent business rules
- No priority system
- Does not guarantee that only one branch renders

This approach works well for simple control flow, but becomes hard to maintain when
conditions are unrelated or derived from complex business logic.

---

### `react-if-vz`

`react-if-vz` is conceptually closer to `react-super-switch` and attempts to introduce
more structured conditional rendering.

**Limitations:**

- Largely unmaintained
- Weak TypeScript support
- No enforced exclusivity
- Priority is implicit rather than guaranteed
- No fail-fast validation

---

### Why `react-super-switch` exists

`react-super-switch` focuses on **correctness and intent**, not just syntax:

- Exactly **one** option is rendered, or an error is thrown
- Priority is a **first-class concept**
- Default behaviour is explicit and enforced
- Invalid configurations fail loudly during development
- JSX remains clean and declarative

If your rendering logic depends on **multiple independent conditions** and only one
view must ever render, `react-super-switch` is designed specifically for that use case.

## License

MIT
