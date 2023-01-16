import { pathExists, readFile } from 'fs-extra';
import json5 from 'json5';
import { resolve } from 'path';

import { ACCOUNT_CONFIG_EXTS, ACCOUNT_CONFIG_NAME, HOME_CONFIG_DIR } from './constants';
import { Errors } from './error';

interface Config {
  name: string;
  alias?: string;
  secretId: string;
  secretKey: string;
}

async function getConfigPath(dir: string) {
  for (const ext of ACCOUNT_CONFIG_EXTS) {
    const path = resolve(dir, `${ACCOUNT_CONFIG_NAME}${ext}`);
    const isExists = await pathExists(path);

    if (isExists) {
      return path;
    }
  }
}

function checkConfigContent(configs?: Config[]) {
  if (!configs) {
    throw new Errors.ConfigContentInValid('空文件');
  }

  if (!configs?.length) {
    throw new Errors.ConfigContentInValid('配置长度为0');
  }

  const invalidConfig = configs.find(({ name, secretId, secretKey }) => {
    return !name || !secretId || !secretKey;
  });

  if (invalidConfig) {
    throw new Errors.ConfigContentInValid('缺少 name 或者 secretId 或者 secretKey');
  }

  return configs;
}

async function getConfigFromDir(dir: string) {
  const path = await getConfigPath(dir);
  const isExists = !!path;

  if (!isExists) {
    return {
      isExists,
      path: undefined,
      configs: undefined,
    };
  }

  const content = await readFile(path, { encoding: 'utf8' });
  const configs = json5.parse(content) as Config[];
  checkConfigContent(configs);

  return {
    isExists,
    path,
    configs,
  };
}

async function getAccountConfig() {
  const cwdConfig = await getConfigFromDir(process.cwd());

  if (cwdConfig.isExists) {
    return cwdConfig;
  }

  const homeConfig = await getConfigFromDir(HOME_CONFIG_DIR);

  if (homeConfig.isExists) {
    return homeConfig;
  }

  throw new Errors.ConfigFileNotFound({ homeConfig, cwdConfig });
}

export type { Config };
export { getAccountConfig };
