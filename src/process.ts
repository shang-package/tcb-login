import { spawn as originSpawn } from 'child_process';

import { Errors } from './error';

async function spawn(
  cmd: string,
  {
    timeout = 1 * 60 * 1000,
    ...options
  }: Parameters<typeof originSpawn>[2] & { timeout?: number } = {},
) {
  return new Promise<void>((rs, reject) => {
    const cp = originSpawn(cmd, {
      shell: true,
      stdio: 'inherit',
      ...options,
    });

    const timer = setTimeout(() => {
      const e = new Error(`${cmd} timeout`);

      reject(e);

      cp.kill('SIGKILL');
    }, timeout);

    const resolve = () => {
      clearTimeout(timer);
      rs();
    };

    cp.once('error', (e) => {
      console.warn(e);
    });

    cp.once('close', (code) => {
      if (code !== 0) {
        setTimeout(() => {
          cp.kill('SIGKILL');
        }, 1000);

        return reject(new Errors.SpawnError({ code }));
      } else {
        return resolve();
      }
    });
  });
}

export { spawn };
