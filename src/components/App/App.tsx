import React from "react";
import "./App.css";
import SuperSwitch from "../SuperSwitch";
import Option from "../Option";

const App = () => {
  const truthyCondition = 1 + 1 === 2;
  const falsyCondition = 2 + 2 === 3;

  return (
    <div className="App">
      <SuperSwitch>
        <Option condition={truthyCondition}>This should be displayed.</Option>
        <Option condition={falsyCondition}>
          This should NOT be displayed.
        </Option>
        <Option condition={truthyCondition} default>
          This is the default. It is visible when every other option has a falsy
          condition.
        </Option>
      </SuperSwitch>
    </div>
  );
};

export default App;
