const path = require('path');
const os = require('os');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const flowTypedFolder = path.resolve('../', 'flow-typed');
const command =
  os.type() === 'Windows_NT'
    ? `rmdir /q/s flow-typed && flow-typed install`
    : `rm -rf ${flowTypedFolder} && flow-typed install`;

const func = async () => {
  const { stderr } = await exec(command);
  if (stderr) {
    console.error(`error: ${stderr}`);
  }
};

func();
