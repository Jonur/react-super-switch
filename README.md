# React Super Switch

## Installation

- Requirements: Node.js for development (use the project's `.nvmrc` to pick a compatible Node).
- Recommended for development: Node 18+ or the version in `.nvmrc` (the library itself does not require a Node runtime for consumers).
- Peer dependencies: this package declares `react` and `react-dom` as peer dependencies and supports React v17 and above. Consumers should provide React in their project; e.g. in a consumer app install React (v17+) and ReactDOM.

Install dev dependencies locally for building and testing:

```bash
# As a consumer of this libary
npm install react-super-switch
```

```bash
# If you are working on the library
npm install
npm run typecheck
npm run build
```

## Usage (consumer):

```ts
import { SuperSwitch, Option } from "react-super-switch";
```

The package exposes named exports only — do not import a default export.


## Problems

What we are trying to solve.

### Problematic component

```typescript
import React from "react";

import ViewForBusinessCaseA from "./ViewForBusinessCaseA";
import ViewForBusinessCaseB from "./ViewForBusinessCaseB";
import ViewForBusinessCaseC from "./ViewForBusinessCaseC";
import ViewForBusinessCaseD from "./ViewForBusinessCaseD";
import { getClientConfig } from "../utils";

type ViewSelectorProps = {
  propA: boolean;
  propB: boolean;
  propC: number;
};

const ViewSelector: React.FC<ViewSelectorProps> = ({ propA, propB, propC }) => {
  const clientConfig = getClientConfig();

  const businessCaseA = propA && propB;
  const businessCaseB = propB && propC > 3;
  const businessRequiementC = clientConfig.setting === "TYPE_A" && propC <= 10;
  const businessCaseD = clientConfig.setting === "TYPE_B" && propA;

  return (
    <>
      {businessCaseA && <ViewForBusinessCaseA />}
      {businessCaseB && <ViewForBusinessCaseB />}
      {businessCaseC && <ViewForBusinessCaseC />}
      {businessCaseD && <ViewForBusinessCaseD />}
    </>
  );
};
```

### Issues

The above component renders something different depending on different business business requirements. The values for each requirement are not necessarily relating to each other to be able to use a ternary on a value. So even in this example which does not have values after a user interraction or local state values, or API responses, it is still quite complicated to understand in a real world scenario where the variable names are going to be longer to be more descriptive. Also it is prone to bugs, as you either have to negate all options you are not rendering manually ending up with unreadable code, or you end up with this which is slightly cleaner but vulnerable to potential bugs of rendering multiple JSXs. It is difficult to organise and prioritise. Finally, it necessaties very often using React Fragments to have a valid render.

React does not support switch() of if-else inside the return statement.

## Solution

This library introduces React Super Switch. Now rendering multiple options is prevented, there is a default option to be rendered even if everything is falsy, optionally, and the user can optionally add a priority to the options to avoid having to change multiple lines if they want to obscuring the intended changes on Github diff views. Also, no React fragments

```typescript
import React from "react";

import ViewForBusinessCaseA from "./ViewForBusinessCaseA";
import ViewForBusinessCaseB from "./ViewForBusinessCaseB";
import ViewForBusinessCaseC from "./ViewForBusinessCaseC";
import ViewForBusinessCaseD from "./ViewForBusinessCaseD";
import { getClientConfig } from "../utils";

type ViewSelectorProps = {
  propA: boolean;
  propB: boolean;
  propC: number;
};

const ViewSelector: React.FC<ViewSelectorProps> = ({ propA, propB, propC }) => {
  const clientConfig = getClientConfig();

  const businessCaseA = propA && propB;
  const businessCaseB = propB && propC > 3;
  const businessRequiementC = clientConfig.setting === "TYPE_A" && propC <= 10;
  const businessCaseD = clientConfig.setting === "TYPE_B" && propA;

  return (
    <SuperSwitch>
      <Option condition={businessCaseA} priority={2}>
       <ViewForBusinessCaseA />
      </Option>

      <Option condition={businessCaseB} priority={1}>
        <ViewForBusinessCaseB />
      </Option>

      <Option condition={businessRequiementC} priority={4} default>
        <ViewForBusinessCaseC />
      </Option>

      <Option condition={businessCaseD} priority={3}>
        <ViewForBusinessCaseD />
      </Option>
    </SuperSwitch>
  );
};
