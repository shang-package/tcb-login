import commander from 'commander';
import { ensureFile, pathExists, writeFile } from 'fs-extra';
import open from 'open';
import prompts from 'prompts';
import which from 'which';

import { Config, getAccountConfig, getConfigPath } from './account';
import { DEFAULT_ACCOUNT_FILE_PATH, DEFAULT_ACCOUNT_TEMPLATE, HOME_CONFIG_DIR } from './constants';
import { Errors, OperationalError } from './error';
import { spawn } from './process';

const { program, Option } = commander;
program
  .description('登录腾讯云开发 CloudBase')
  .version('0.0.1')
  .addOption(new Option('-a, --account <account>', '登录账户'))
  .addOption(new Option('-o, --open', '打开默认配置文件'))
  .addOption(new Option('--init', '生成默认配置文件'));

program.parse(process.argv);

let options = program.opts();

prompts.override(options);

async function getArgs(configs: Config[]) {
  const { account } = options;

  if (account) {
    const config = configs.find(({ name, alias }) => {
      return alias === account || name === account;
    });

    // 存在 account 且 配置文件匹配, 直接返回
    if (config) {
      return config;
    }
  }

  // prompt
  const choices = configs.map(({ name, secretId, secretKey }) => {
    return {
      title: name,
      value: encodeURIComponent(name) + '|' + secretId + '|' + secretKey,
    };
  });

  const questions = [
    {
      type: 'select' as const,
      name: 'secret',
      message: '登录账户',
      choices: choices,
    },
  ];

  const { secret } = await prompts(questions, {
    onCancel: () => {
      process.exit();
    },
  });

  const [name, secretId, secretKey] = secret.split('|');

  return {
    name: decodeURIComponent(name),
    secretId,
    secretKey,
  };
}

async function doDefaultAccount() {
  if (options.init) {
    const isExists = await pathExists(DEFAULT_ACCOUNT_FILE_PATH);

    if (isExists) {
      throw new Errors.ConfigFileExists(undefined, '默认配置文件已存在, 无法重新生成');
    }

    await ensureFile(DEFAULT_ACCOUNT_FILE_PATH);
    await writeFile(DEFAULT_ACCOUNT_FILE_PATH, DEFAULT_ACCOUNT_TEMPLATE);
  }

  if (options.open) {
    const path = await getConfigPath(HOME_CONFIG_DIR);
    console.log(path);

    if (!path) {
      throw new Errors.ConfigFileNotFound(undefined, '请使用 --init 生成默认配置文件');
    }

    if (path.endsWith('.json5')) {
      await spawn(`code ${path}`);
    } else {
      await open(path);
    }
  }

  return options.init || options.open;
}

async function main() {
  // 检测 配置文件 打开/初始化
  const isDoAction = await doDefaultAccount();
  if (isDoAction) {
    return false;
  }

  // 检查 tcb 是否存在
  await which('tcb').catch(() => {
    throw new Errors.TcbNotFound();
  });

  const { configs } = await getAccountConfig();

  const { secretId, secretKey } = await getArgs(configs);

  await spawn(`tcb logout`);
  await spawn(`tcb login --apiKeyId ${secretId} --apiKey ${secretKey}`, {
    stdio: ['inherit', 'ignore', 'inherit'],
  });
  await spawn(`tcb env list`);
}

main()
  .then((isLogin) => {
    if (isLogin) {
      console.log('登录成功');
    }
  })
  .catch((e: OperationalError) => {
    console.error(e);

    if (e instanceof Errors.ConfigFileNotFound) {
      console.error('配置文件不存在');
      console.warn(
        `请确认配置文件 ${DEFAULT_ACCOUNT_FILE_PATH}, 可以用  -o --init 生成并打开默认配置文件`,
      );
    }
  });
