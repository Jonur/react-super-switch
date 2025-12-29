import React, { useEffect, useState } from "react";

import Option from "../Option";

import type { OptionProps } from "../Option";

export type OptionChild = React.ReactElement<OptionProps, string | React.JSXElementConstructor<any>>;

export type SuperSwitchProps = {
  children: React.ReactElement<OptionProps> | React.ReactElement<OptionProps>[];
  mode?: "priority" | "fcfs";
};

const SuperSwitch: React.FC<SuperSwitchProps> = ({ children, mode = "fcfs" }) => {
  const [childToRender, setChildToRender] = useState<OptionChild>();

  const sortByPriority = (children: OptionChild[]) =>
    children.sort((a, b) => {
      const pa = a.props?.priority;
      const pb = b.props?.priority;

      // If neither has a priority, preserve original order (stable sort)
      if (pa === undefined && pb === undefined) return 0;

      // If only one has priority, the one with priority comes first
      if (pa === undefined) return 1;
      if (pb === undefined) return -1;

      // Both have priority -> lower number wins (higher priority)
      if (pa < pb) return -1;
      if (pa > pb) return 1;

      return 0;
    });

  useEffect(() => {
    const collected: OptionChild[] = [];
    let anyChildHasPriority = false;
    let allChildrenHavePriority = true;

    React.Children.forEach(children, (child) => {
      const isValidChild = child?.type === Option;

      if (!isValidChild) {
        throw Error(`Invalid child ${JSON.stringify(child?.type)} passed to SuperSwitch. Only <Option /> is allowed.`);
      }

      collected.push(child);

      const hasPriority = child.props.priority !== undefined;
      if (hasPriority) {
        anyChildHasPriority = true;
      }
      if (!hasPriority) {
        allChildrenHavePriority = false;
      }
    });

    if (mode === "priority" && anyChildHasPriority && !allChildrenHavePriority) {
      throw Error(`All <Option /> children must specify a "priority" property when on "priority" mode.`);
    }

    // Only sort if we're in priority mode (and priorities exist). Otherwise keep FCFS order.
    const sortedChildren = mode === "priority" ? sortByPriority(collected) : collected;

    const renderOption =
      sortedChildren.find((child) => Boolean(child.props.condition) && !child.props.default) ||
      sortedChildren.find((child) => Boolean(child.props.default));

    if (!renderOption) {
      throw Error("No conditions met for any <Option /> and no default <Option /> found.");
    }

    setChildToRender(renderOption);
  }, [children, mode]);

  return childToRender || null;
};

export default SuperSwitch;
