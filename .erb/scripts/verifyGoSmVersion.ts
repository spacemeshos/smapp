/**
 * CI Workflow uses `../node/use-version` file to identify
 * which version of `go-spacemesh` to use in builds.
 *
 * To avoid dumb mistakes while developing / debugging some issues
 * this script will notify if the version of `go-spacemesh` differs
 * from the version specified in this file.
 *
 * In case that this script are run with `NODE_ENV != development`
 * and versions are differ, it will throw an error and exit
 * with exit code 1. It will stop build workflow.
 */

const { resolve } = require('path');
const { promises } = require('fs');
const os = require('os');
const { exec } = require('child_process');

const NODE_DIR = resolve('.', 'node');
const USE_VERSION_PATH = resolve(NODE_DIR, 'use-version');
const NODE_WIN_PATH = resolve(NODE_DIR, 'windows', 'go-spacemesh.exe');
const NODE_MAC_PATH = resolve(NODE_DIR, 'mac', 'go-spacemesh');
const NODE_NIX_PATH = resolve(NODE_DIR, 'linux', 'go-spacemesh');

const IS_DEV = process.env.NODE_ENV === 'development';

const C_RST = "\x1b[0m";
const C_RED = "\x1b[31m";
const C_YELLOW = "\x1b[33m";
const C_GREEN = "\x1b[32m";

const getBinaryPath = (): string => {
  const platform = os.platform();
  return platform === 'win32' ? NODE_WIN_PATH : platform === 'darwin' ? NODE_MAC_PATH : NODE_NIX_PATH;
};

const parseVersion = (str: string) => {
  const [_, version, build]: Array<string> = str.match(/^(v\d+\.\d+\.\d+(?:-[a-zA-Z0-9]+)?)(?:\.\d+)?(\+.+)?/) as Array<string>;
  return { version, build };
};

const getNodeVersion = (execPath: string): Promise<{ version: string, build: string }> => new Promise((resolve, reject) => {
  exec(`${execPath} version`, (err: Error, stdout: string, _: string) => {
    if (err) return reject(err);
    return resolve(parseVersion(stdout));
  })
});

(async () => {
  try {
    const { version: versionExpected } = parseVersion(await promises.readFile(USE_VERSION_PATH, { encoding: 'utf-8' }));
    const { version } = await getNodeVersion(getBinaryPath());

    if (versionExpected === version) {
      process.stdout.write(`${C_GREEN}OK:${C_RST} Go-spacemesh version matched with specified: ${version}\n`);
      process.exit(0);
    } else {
      const lvl = IS_DEV ? `${C_YELLOW}WARNING:` : `${C_RED}ERROR:`;
      const msg = `Go-spacemesh version mismatch\n${C_RST}Version expected: ${versionExpected}\nVersion installed: ${version}`;
      process.stderr.write(`${lvl} ${msg}\n`);
      process.exit(IS_DEV ? 0 : 1);
    }
  } catch (err) {
    const stream = IS_DEV ? process.stdout : process.stderr;
    stream.write(`${C_RED}ERROR: ${C_RST}Can not run the Node to check the version: ${err}`);
    process.exit(IS_DEV ? 0 : 1);
  }
})();
