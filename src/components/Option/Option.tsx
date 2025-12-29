import React from "react";

export type OptionProps = {
  condition?: boolean;
  default?: boolean;
  priority?: number;
};

const Option: React.FC<React.PropsWithChildren<OptionProps>> = ({
  children,
}) => <>{children}</>;

export default Option;
