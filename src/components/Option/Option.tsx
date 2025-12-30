import type { PropsWithChildren } from "react";

import type { ConditionalOptionProps, DefaultOptionProps } from "./types";

export type OptionProps = DefaultOptionProps | ConditionalOptionProps;

const Option = ({ children }: PropsWithChildren<OptionProps>) => <>{children}</>;

export default Option;
