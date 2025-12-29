import React, { useEffect, useState } from "react";
import { OptionChild, SuperSwitchProps } from "../../types";
import Option from "../Option";
import { getErrorMessage, sortByPriority } from "../../utils";

const SuperSwitch: React.FC<SuperSwitchProps> = ({ children }) => {
  const [childToRender, setChildToRender] = useState<OptionChild>();

  useEffect(() => {
    let sortedChildren: OptionChild[] = [];

    React.Children.map(children, (child) => {
      const isValidChild = child?.type === Option;

      if (isValidChild) {
        sortedChildren.push(child);
      } else {
        throw Error(getErrorMessage(JSON.stringify(child?.type)));
      }
    });

    sortedChildren = sortByPriority(sortedChildren);

    const renderOption =
      sortedChildren.find(
        (child) => Boolean(child.props.condition) && !child.props.default
      ) || sortedChildren.find((child) => Boolean(child.props.default));

    setChildToRender(renderOption);
  }, [children]);

  return childToRender || null;
};

export default SuperSwitch;
