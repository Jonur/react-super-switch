import React, { useEffect, useState } from "react";
import Option, { OptionProps } from "../Option";

export type OptionChild = React.ReactElement<
  OptionProps,
  string | React.JSXElementConstructor<any>
>;

export type SuperSwitchProps = {
  children: React.ReactElement<OptionProps> | React.ReactElement<OptionProps>[];
  mode?: "priority" | "fcfs",
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
    let sortedChildren: OptionChild[] = [];

    React.Children.map(children, (child) => {
      const isValidChild = child?.type === Option;

      if (isValidChild) {
        sortedChildren.push(child);
      } else {
        throw Error(
          `Invalid child ${JSON.stringify(child?.type)} passed to SuperSwitch. Only <Option /> is allowed.`
        );
      }
    });

    if (mode === "priority") {
      // Validate priority usage: either ALL Option children must set `priority` or NONE
      const priorityFlags = sortedChildren.map((c) => c.props.priority !== undefined);
      const anyHasPriority = priorityFlags.some(Boolean);
      const allHavePriority = priorityFlags.every(Boolean);

      if (anyHasPriority && !allHavePriority) {
        if (process.env.NODE_ENV !== "production") {
          throw Error(
            "Mixed `priority` usage detected: either all <Option /> children must specify `priority` or none should."
          );
        }
      }

      sortedChildren = sortByPriority(sortedChildren);
    }


    const renderOption =
      sortedChildren.find(
        (child) => Boolean(child.props.condition) && !child.props.default
      ) || sortedChildren.find((child) => Boolean(child.props.default));

    setChildToRender(renderOption);
  }, [children]);

  return childToRender || null;
};

export default SuperSwitch;
