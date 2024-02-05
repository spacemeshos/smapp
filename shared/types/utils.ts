export type OptionalPropertiesOf<T> = Exclude<
  {
    [K in keyof T]: T extends Record<K, T[K]> ? never : K;
  }[keyof T],
  undefined
>;

export type PickOptionalPropsOf<T> = Pick<T, OptionalPropertiesOf<T>>;
