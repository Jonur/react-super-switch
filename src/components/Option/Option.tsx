import React from "react";
import { OptionProps } from "../../types";

const Option: React.FC<React.PropsWithChildren<OptionProps>> = ({
  children,
}) => <>{children}</>;

export default Option;
