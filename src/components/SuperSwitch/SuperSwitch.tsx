import React, { useEffect, useState } from "react";

import Option from "../Option";

import type { OptionProps } from "../Option";

export type OptionChild = React.ReactElement<OptionProps, string | React.JSXElementConstructor<any>>;

export type SuperSwitchProps = {
  children: React.ReactElement<OptionProps> | React.ReactElement<OptionProps>[];
  mode?: "priority" | "fcfs";
};

const SuperSwitch: React.FC<SuperSwitchProps> = ({ children, mode = "fcfs" }) => {
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

    React.Children.forEach(children, (child) => {
      const isValidOption = child?.type === Option;

      if (!isValidOption) {
        throw new Error(`SuperSwitch only accepts <Option /> as children. Received an invalid child instead.`);
      }

      collected.push(child);

      const hasPriority = child.props.priority !== undefined;
      if (hasPriority) anyChildHasPriority = true;
      if (!hasPriority) allChildrenHavePriority = false;
    });

    if (mode === "priority" && anyChildHasPriority && !allChildrenHavePriority) {
      throw new Error(
        `SuperSwitch is running in "priority" mode, but not all <Option /> elements define a priority. When using priority mode, every <Option /> must specify a numeric "priority" prop.`
      );
    }

    const evaluatedChildren = mode === "priority" ? sortByPriority(collected) : collected;

    const optionToRender =
      evaluatedChildren.find((child) => Boolean(child.props.condition) && !child.props.default) ??
      evaluatedChildren.find((child) => Boolean(child.props.default));

    if (!optionToRender) {
      throw new Error(
        `SuperSwitch could not determine which option to render. No <Option /> had a truthy condition, and no default option was provided.`
      );
    }

    setChildToRender(optionToRender);
  }, [children, mode]);

  return childToRender;
};

export default SuperSwitch;
