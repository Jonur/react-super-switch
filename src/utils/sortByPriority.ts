import { OptionChild } from "../types";

const sortByPriority = (children: OptionChild[]) =>
  children.sort((a, b) => {
    if ((a.props?.priority || 0) < (b.props?.priority || 0)) return -1;
    if ((a.props?.priority || 0) > (b.props?.priority || 0)) return 1;
    return 0;
  });

export default sortByPriority;
