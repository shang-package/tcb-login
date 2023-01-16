import { homedir } from 'os';
import { resolve } from 'path';

// 配置文件 文件名
const ACCOUNT_CONFIG_NAME = '.accounts';
// 配置文件 后缀名
const ACCOUNT_CONFIG_EXTS = ['.json', '.json5'];

// 配置文件 默认目录
const HOME_CONFIG_DIR = resolve(homedir(), '.config/.cloudbase');
// 配置文件 默认路径
const DEFAULT_ACCOUNT_FILE_PATH = resolve(HOME_CONFIG_DIR, `${ACCOUNT_CONFIG_NAME}.json`);

const DEFAULT_ACCOUNT_TEMPLATE = `
[
  {
    "name": "",
    "alias": "",
    "secretId": "",
    "secretKey": ""
  },
  {
    "name": "",
    "alias": "",
    "secretId": "",
    "secretKey": ""
  }
]
`;

export {
  ACCOUNT_CONFIG_NAME,
  ACCOUNT_CONFIG_EXTS,
  HOME_CONFIG_DIR,
  DEFAULT_ACCOUNT_FILE_PATH,
  DEFAULT_ACCOUNT_TEMPLATE,
};
