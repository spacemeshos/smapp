const fs = require('fs');
const util = require('util');
const crypto = require('crypto');
const readline = require('readline');
const template = require('lodash.template');

const { Platform, build } = require('electron-builder');

const readFileAsync = util.promisify(fs.readFile);
const copyFileAsync = util.promisify(fs.copyFile);
const writeFileAsync = util.promisify(fs.writeFile);
const args = process.argv.slice(2);
const targets = args && args.length ? args : null;

if (!targets) {
  throw new Error("No arguments provided. Usage example: 'node ./packageConfig.js {mac/linux/windows}'");
}

const nodeFiles = {
  mac: { from: 'node/mac/', to: 'node/' },
  windows: { from: 'node/windows/', to: 'node/' },
  linux: { from: 'node/linux/', to: 'node/' }
};

const getFileHash = async ({ filename }) => {
  const shasum = crypto.createHash('sha512');
  const fileContent = await readFileAsync(filename);
  const hashsum = shasum.update(fileContent);
  const hash = hashsum.digest('hex');
  return hash;
};

const generateAuthFile = async ({ sourceTemplate, authFilePath }) => {
  try {
    if (!fs.existsSync(authFilePath)) {
      await copyFileAsync(sourceTemplate, authFilePath);
    }
  } catch (error) {
    throw error;
  }
};

const getCompiledAuthFileLines = async ({ filename, artifactPath, artifactSuffix }) => {
  return new Promise(async (resolve, reject) => {
    const lines = [];
    const hash = await getFileHash({ filename: artifactPath });
    const rd = readline.createInterface({
      input: fs.createReadStream(filename),
      output: false,
      console: false
    });

    rd.on('close', () => {
      resolve(lines);
    });

    rd.on('error', reject);

    rd.on('line', (line) => {
      const compiled = template(line);
      const installerKey = `${artifactSuffix}_installer`;
      const shaKey = `${artifactSuffix}_sha512`;
      let compiledLine = null;
      try {
        compiledLine = compiled({ [installerKey]: artifactPath, [shaKey]: hash });
      } catch (error) {
        compiledLine = line;
      }
      lines.push(compiledLine);
    });
  });
};

const getBuildOptions = (target) => ({
  targets: Platform[target.toUpperCase()].createTarget(),
  publish: 'always',
  config: {
    appId: 'com.spacemesh.wallet',
    productName: 'Spacemesh Wallet',
    files: [
      'desktop/dist/',
      'desktop/app.html',
      'desktop/main.prod.js',
      'desktop/main.prod.js.map',
      'desktop/wasm_exec.js',
      'desktop/ed25519.wasm',
      'package.json',
      'node_modules/',
      'proto/',
      'templates/',
      nodeFiles[target]
    ],
    dmg: {
      window: {
        width: '500',
        height: '300'
      },
      contents: [
        {
          x: 410,
          y: 150,
          type: 'link',
          path: '/Applications'
        },
        {
          x: 130,
          y: 150,
          type: 'file'
        }
      ],
      title: 'Spacemesh Wallet'
    },
    win: {
      target: 'nsis'
    },
    nsis: {
      oneClick: false,
      perMachine: false,
      allowElevation: true,
      allowToChangeInstallationDirectory: true,
      runAfterFinish: true
    },
    linux: {
      target: ['deb', 'snap', 'AppImage'],
      category: 'Utility',
      icon: 'resources/icons'
    },
    directories: {
      buildResources: 'resources',
      output: 'release'
    },
    afterAllArtifactBuild: async (buildResult) => {
      try {
        const sourceTemplate = './templates/auth_template.md';
        const authFilePath = './addToPublish/auth.md';
        await generateAuthFile({ sourceTemplate, authFilePath });
        const acceptedSuffixes = ['dmg', 'exe', 'deb', 'snap', 'AppImage'];
        buildResult.artifactPaths.forEach(async (artifactPath) => {
          const artifactSplit = artifactPath.split('.');
          const artifactSuffix = artifactSplit[artifactSplit.length - 1];
          if (acceptedSuffixes.indexOf(artifactSuffix) >= 0) {
            const lines = await getCompiledAuthFileLines({ filename: authFilePath, artifactPath, artifactSuffix });
            await writeFileAsync(authFilePath, lines.join('\n'));
          }
        });
        return [authFilePath];
      } catch (error) {
        console.error(error.message);
        process.exit(1);
      }
    }
  }
});

targets.forEach(async (target) => {
  if (['mac', 'windows', 'linux'].indexOf(target) === -1) {
    console.error("Invalid target provided. Usage example: 'node ./packageConfig.js {mac/linux/windows}'");
  } else {
    try {
      const res = await build(getBuildOptions(target));
      if (res && res.length) {
        console.log(`Artifacts packed for ${target}:`);
        res.forEach((res, index) => console.log(`${index + 1}. ${res}`));
      }
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }
});
