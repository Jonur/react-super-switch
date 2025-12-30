interface BaseOptionProps {
  "data-testid"?: string;
  priority?: number;
}

export interface DefaultOptionProps extends BaseOptionProps {
  default: true;
  condition?: never;
}

export interface ConditionalOptionProps extends BaseOptionProps {
  default?: never;
  condition: boolean;
}
