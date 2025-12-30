import type { OptionChild } from "./types";

export const sortByPriority = (options: OptionChild[]) =>
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
