import { Children, useEffect, useState } from "react";
import type { JSXElementConstructor, ReactElement } from "react";

import Option from "../Option";
import { ERROR_MESSAGES } from "./constants";
import type { OptionProps } from "../Option";

export type OptionChild = ReactElement<OptionProps, string | JSXElementConstructor<any>>;

export type SuperSwitchProps = {
  children: ReactElement<OptionProps> | ReactElement<OptionProps>[];
  mode?: "priority" | "fcfs";
};

const SuperSwitch = ({ children, mode = "fcfs" }: SuperSwitchProps) => {
  const [childToRender, setChildToRender] = useState<OptionChild | null>(null);

  const sortByPriority = (options: OptionChild[]) =>
    options.sort((a, b) => {
      const pa = a.props?.priority;
      const pb = b.props?.priority;

      // Neither has priority → preserve original order (stable sort)
      if (pa === undefined && pb === undefined) return 0;

      // One has priority → that one comes first
      if (pa === undefined) return 1;
      if (pb === undefined) return -1;

      // Both have priority → lower number wins
      if (pa < pb) return -1;
      if (pa > pb) return 1;

      return 0;
    });

  useEffect(() => {
    const collected: OptionChild[] = [];
    let anyChildHasPriority = false;
    let allChildrenHavePriority = true;

    Children.forEach(children, (child) => {
      const isValidOption = child?.type === Option;

      if (!isValidOption) {
        throw new Error(ERROR_MESSAGES.INVALID_CHILDREN_TYPE);
      }

      collected.push(child);

      const hasPriority = child.props.priority !== undefined;
      if (hasPriority) {
        anyChildHasPriority = true;
      } else {
        allChildrenHavePriority = false;
      }
    });

    if (mode === "priority" && anyChildHasPriority && !allChildrenHavePriority) {
      throw new Error(ERROR_MESSAGES.MISSING_PRIORITIES);
    }

    const evaluatedChildren = mode === "priority" ? sortByPriority(collected) : collected;

    const optionToRender =
      evaluatedChildren.find((child) => Boolean(child.props.condition) && !child.props.default) ??
      evaluatedChildren.find((child) => Boolean(child.props.default));

    if (!optionToRender) {
      throw new Error(ERROR_MESSAGES.NO_OPTION_TO_RENDER);
    }

    setChildToRender(optionToRender);
  }, [children, mode]);

  return childToRender;
};

export default SuperSwitch;
