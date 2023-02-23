import { enumFromStringValue } from './utils';

export enum WarningType {
  Unknown = 'Unknown',
  WriteFilePermission = 'WriteFilePermission',
}

export enum WriteFilePermissionWarningKind {
  Logger = 'Logger',
  ConfigFile = 'ConfigFile',
  WalletFile = 'WalletFile',
}

interface WarningTypeOptions {
  [WarningType.Unknown]: WarningOptions<Record<string, any>>;
  [WarningType.WriteFilePermission]: WarningOptions<{
    kind: WriteFilePermissionWarningKind;
    filePath: string;
  }>;
}

export type AnyWarningType = keyof WarningTypeOptions;

export type WarningPayload<
  T extends WarningType
> = WarningTypeOptions[T]['payload'];

type WarningOptions<P> = {
  message: string;
  stack?: string;
  payload: P;
};

export type WarningObject<T extends keyof WarningTypeOptions> = {
  type: T;
  message: string;
  stack?: string;
  payload: WarningPayload<T>;
};

type WarningType2ObjectMapping = {
  [Property in AnyWarningType]: WarningObject<Property>;
};
export type AnyWarningObject = WarningType2ObjectMapping[AnyWarningType];

export default class Warning extends Error {
  private type: keyof WarningTypeOptions;

  private payload: WarningPayload<typeof this.type>;

  constructor(
    type: keyof WarningTypeOptions,
    options: WarningTypeOptions[typeof type]
  ) {
    super(options.message);
    this.type = type;
    this.payload = options.payload;
    options.stack && (this.stack = options.stack);
  }

  // Unsafe
  static fromObject(opts: AnyWarningObject) {
    const { type, message, stack, payload } = opts;
    if (!type || !message) {
      throw new Error(
        `Warning object can not be constructed from object: ${JSON.stringify(
          opts
        )}`
      );
    }
    const t = enumFromStringValue(WarningType, type);
    if (!t) {
      throw new Error(
        `Warning object can not be constructed from unknown type: ${type}`
      );
    }
    // TODO: Add guards for payload?
    return new Warning(t, {
      message,
      stack,
      payload,
    } as WarningTypeOptions[typeof t]);
  }

  static fromError<T extends WarningType, P extends WarningPayload<T>>(
    type: T,
    payload: P,
    error: Error
  ) {
    return new Warning(type, {
      message: error.message,
      stack: error.stack,
      payload,
    } as WarningTypeOptions[T]);
  }

  getType() {
    return this.type;
  }

  getPayload() {
    return this.payload;
  }

  is(type: WarningType | string) {
    return type === this.type;
  }

  toObject(): WarningObject<typeof this.type> {
    return {
      type: this.type,
      message: this.message,
      stack: this.stack,
      payload: this.payload,
    };
  }

  toString() {
    return [
      `Warning(${this.type}): ${this.message}`,
      JSON.stringify(this.payload, null, 2),
      this.stack,
    ].join('\n');
  }

  toJSON() {
    return JSON.stringify(this.toObject());
  }
}
