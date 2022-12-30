// eslint-disable-next-line max-classes-per-file
type FilePermissionErrorErrorTypeEnum = {
  Logger: 'Logger';
  ConfigFile: 'ConfigFile';
  WalletFile: 'WalletFile';
};

export class FilePermissionError extends Error {
  type: keyof FilePermissionErrorErrorTypeEnum;

  constructor(
    type: keyof FilePermissionErrorErrorTypeEnum,
    message,
    stack: Error['stack']
  ) {
    super(message);
    this.name = this.constructor.name;
    this.type = type;
    this.stack = stack;
  }
}
export class FilePermissionLoggerError extends FilePermissionError {
  constructor(message, stack: Error['stack']) {
    super('Logger', message, stack);
  }
}

export class FilePermissionConfigError extends FilePermissionError {
  constructor(message, stack: Error['stack']) {
    super('ConfigFile', message, stack);
  }
}

export class FilePermissionWalletError extends FilePermissionError {
  constructor(message, stack: Error['stack']) {
    super('WalletFile', message, stack);
  }
}
