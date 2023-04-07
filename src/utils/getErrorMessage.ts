const getErrorMessage = (childType = ""): string =>
  `Invalid child ${childType} passed to SuperSwitch. Only <Option /> is allowed.`;

export default getErrorMessage;
