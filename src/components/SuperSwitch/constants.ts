export const ERROR_MESSAGES: Record<string, string> = {
  INVALID_CHILDREN_TYPE: `SuperSwitch only accepts <Option /> as children. Received an invalid child instead.`,
  MISSING_PRIORITIES: `SuperSwitch is running in "priority" mode, but not all <Option /> elements define a priority. When using priority mode, every <Option /> must specify a numeric "priority" prop.`,
  NO_OPTION_TO_RENDER: `SuperSwitch could not determine which option to render. No <Option /> had a truthy condition, and no default option was provided.`,
};
