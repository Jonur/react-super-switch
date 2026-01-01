import { Children, useEffect, useState } from "react";
import type { ReactElement } from "react";

import Option from "../Option";
import { ERROR_MESSAGES } from "./constants";
import type { OptionProps } from "../Option";
import type { OptionChild } from "./types";
import { sortByPriority } from "./utils";

export type SuperSwitchProps = {
  children: ReactElement<OptionProps> | ReactElement<OptionProps>[];
  mode?: "priority" | "fcfs";
  optional?: boolean;
};

const SuperSwitch = ({ children, mode = "fcfs", optional = false }: SuperSwitchProps) => {
  const [childToRender, setChildToRender] = useState<OptionChild | null>(null);

  useEffect(() => {
    const collected: OptionChild[] = [];
    let allChildrenHavePriority = true;

    Children.forEach(children, (child) => {
      const isValidOption = child?.type === Option;

      if (!isValidOption) {
        throw new Error(ERROR_MESSAGES.INVALID_CHILDREN_TYPE);
      }

      if (Boolean(child.props.default) && "condition" in child.props) {
        throw new Error(ERROR_MESSAGES.INVALID_OPTION_PROPS);
      }

      collected.push(child);

      if (child.props.priority === undefined) {
        allChildrenHavePriority = false;
      }
    });

    let evaluatedChildren = collected;
    if (mode === "priority") {
      if (!allChildrenHavePriority) {
        throw new Error(ERROR_MESSAGES.MISSING_PRIORITIES);
      }

      evaluatedChildren = sortByPriority(collected);
    }

    const optionToRender =
      evaluatedChildren.find((child) => Boolean(child.props.condition) && !child.props.default) ??
      evaluatedChildren.find((child) => Boolean(child.props.default));

    if (optionToRender) {
      setChildToRender(optionToRender);
    } else if (!optional) {
      throw new Error(ERROR_MESSAGES.NO_OPTION_TO_RENDER);
    }
  }, [children, mode, optional]);

  return childToRender;
};

export default SuperSwitch;
