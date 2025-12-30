import type { PropsWithChildren } from "react";

export type OptionProps = {
  condition?: boolean;
  "data-testid"?: string;
  default?: boolean;
  priority?: number;
};

const Option = ({ children }: PropsWithChildren<OptionProps>) => <>{children}</>;

export default Option;
