import React from "react";
import "./App.css";
import SuperSwitch from "../SuperSwitch";
import Option from "../Option";

const App: React.FC = () => {
  const truthyCondition = 1 + 1 === 2;
  const falsyCondition = 2 + 2 === 3;

  return (
    <div className="App">
      <SuperSwitch>
        <Option condition={truthyCondition}>
          <span data-testid="truthy-condition">This should be displayed.</span>
        </Option>

        <Option condition={falsyCondition}>
          <span data-testid="falsy-condition">
            This should NOT be displayed.
          </span>
        </Option>

        <Option condition={truthyCondition} default>
          <span data-testid="default">
            This is the default. It is visible when every other option has a
            falsy condition.
          </span>
        </Option>
      </SuperSwitch>
    </div>
  );
};

export default App;
