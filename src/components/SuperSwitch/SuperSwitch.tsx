import React, { useEffect, useState } from "react";
import { OptionChild, SuperSwitchProps } from "../../types";
import Option from "../Option";
import { getErrorMessage, sortByPriority } from "../../utils";

const SuperSwitch: React.FC<SuperSwitchProps> = ({ children }) => {
  const [childToRender, setChildToRender] = useState<OptionChild>();

  useEffect(() => {
    let filteredChildren: OptionChild[] = [];

    React.Children.map(children, (child) => {
      const isValidChild = child?.type === Option;

      if (isValidChild) {
        filteredChildren.push(child);
      } else {
        throw Error(getErrorMessage(JSON.stringify(child?.type)));
      }
    });

    filteredChildren = sortByPriority(filteredChildren);

    const renderOption =
      filteredChildren.find(
        (child) => Boolean(child.props.condition) && !child.props.default
      ) || filteredChildren.find((child) => Boolean(child.props.default));

    setChildToRender(renderOption);
  }, [children]);

  return childToRender || null;
};

export default SuperSwitch;
