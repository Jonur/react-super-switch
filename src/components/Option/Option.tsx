import type { PropsWithChildren } from "react";

export type OptionProps = {
  condition?: boolean;
  default?: boolean;
  priority?: number;
};

const Option = ({ children }: PropsWithChildren<OptionProps>) => <>{children}</>;

export default Option;
