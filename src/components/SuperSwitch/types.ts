import type { JSXElementConstructor, ReactElement } from "react";

import type { OptionProps } from "../Option";

export type OptionChild = ReactElement<OptionProps, string | JSXElementConstructor<any>>;
