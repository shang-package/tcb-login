const ERROR_MAP = {
  OperationalError: 'OperationalError',
  SpawnError: 'spawn error',
  Timeout: {
    message: 'Timeout',
  },
  Unknown: 'Unknown',

  // 配置文件未找到
  ConfigFileNotFound: 'ConfigFileNotFound',
  // 配置格式不正确
  ConfigContentInValid: 'ConfigContentInValid',
  // 配置文件已存在
  ConfigFileExists: 'ConfigFileExists',

  TcbNotFound: {
    message: '请安装cloudbase',
    extra: {
      doc: 'https://docs.cloudbase.net/framework/ci',
      cmd: 'npm install -g @cloudbase/cli@latest',
    },
  },
};

export type ERROR_CODES = keyof typeof ERROR_MAP;

export interface ErrorJSON {
  type: 'error';
  message: string;
  code: ERROR_CODES;
  extra?: any;
  stack?: string;
}

export class OperationalError extends Error {
  public extra: any;

  public code: ERROR_CODES;

  public constructor(extra?: any, message?: string, code: ERROR_CODES = 'OperationalError') {
    super();

    this.code = code;
    this.message = message || 'OperationalError';
    this.extra = extra;

    if (extra instanceof Error) {
      this.cause = extra;
    }
  }

  public toJSON(): ErrorJSON {
    return {
      type: 'error',
      message: this.message,
      code: this.code,
      extra: this.extra,
      stack: this.stack,
    };
  }

  public toString(): string {
    return `${this.code}
${this.extra ? JSON.stringify(this.extra) : ''}
${this.stack || ''}`;
  }
}

export type ERRORS = {
  [name in ERROR_CODES]: typeof OperationalError;
};

function buildErrors(): ERRORS {
  const keys = Object.keys(ERROR_MAP) as [ERROR_CODES];
  const o = keys.reduce((result, code) => {
    let tmp = ERROR_MAP[code];

    let defaultError: Partial<Pick<ErrorJSON, 'code' | 'message' | 'extra'>> =
      typeof tmp === 'string'
        ? {
            message: tmp,
          }
        : tmp;

    class ChildError extends OperationalError {
      public constructor(extra?: any, message?: string) {
        super(
          ['object', 'undefined'].includes(typeof extra)
            ? {
                ...defaultError.extra,
                ...extra,
              }
            : extra,
          message ?? defaultError.message,
          code ?? defaultError.code,
        );

        this.name = code;
      }
    }

    // eslint-disable-next-line no-param-reassign
    result[code] = ChildError;
    return result;
  }, {} as any);

  o.OperationalError = OperationalError;
  return o;
}

const Errors = buildErrors();

function isErrorLike(obj: any): obj is ErrorJSON {
  return !!(obj?.type === 'error' && obj?.code);
}

function try2error<T>(obj: T): OperationalError | T {
  if (isErrorLike(obj)) {
    const code = obj.code;
    if (Errors[code]) {
      return new Errors[code](obj.extra, obj.message);
    }

    return new Errors.Unknown(obj, obj.message);
  }

  return obj;
}

export { Errors, try2error };
