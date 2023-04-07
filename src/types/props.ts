import React from "react";

export type OptionProps = {
  condition?: boolean;
  default?: boolean;
  priority?: number;
};

export type SuperSwitchProps = {
  children: React.ReactElement<OptionProps> | React.ReactElement<OptionProps>[];
};

export type OptionChild = React.ReactElement<
  OptionProps,
  string | React.JSXElementConstructor<any>
>;
