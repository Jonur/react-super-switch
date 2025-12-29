import React from "react";

import Option from "../Option";
import SuperSwitch from "../SuperSwitch";

const Sandbox: React.FC = () => {
  const condA = true;
  const condB = false;
  const condC = true;

  return (
    <SuperSwitch>
      <Option condition={condA} />
      <Option condition={condB} />
      <Option condition={condC} />
    </SuperSwitch>
  );
};

export default Sandbox;
