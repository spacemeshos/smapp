const builder = require('electron-builder');
const Platform = builder.Platform;

const getTarget = (args) => {
  const keyIndex = args.findIndex((arg) => arg === '--target');
  if (keyIndex < 0 || (keyIndex >= 0 && keyIndex + 1 >= args.length)) {
    throw new Error(`No --target key param found or no value following it.`);
  }
  const target = args[keyIndex + 1];
  if (target !== 'mac' && target !== 'windows' && target !== 'linux') {
    throw new Error('Wrong target args. Should be either mac, windows or linux. ex: node ./<path to file>/packageConfig.js --target mac');
  }
  return target;
};

const getPublish = (args) => {
  const keyIndex = args.findIndex((arg) => arg === '--publish');
  if (keyIndex >= 0 && keyIndex + 1 >= args.length) {
    throw new Error(`No --publish key param found or no value following it.`);
  }
  const publish = keyIndex < 0 ? null : args[keyIndex + 1];
  if (publish && publish !== 'always' && publish !== 'never') {
    throw new Error('Wrong publish args. Should be either never or always. ex: node ./<path to file>/packageConfig.js --publish always');
  }
  return publish;
};

const args = process.argv.slice(2);
const target = getTarget(args);
const publish = getPublish(args);

console.log(`Building ${publish && publish === 'always' ? '(with publish) ' : ''}for ${target}...`);

const extraFiles = {
  mac: [{ from: 'node/mac/demoNodeExec', to: 'node/demoNodeExec' }],
  windows: [{ from: 'node/windows/demoNodeExec.exe', to: 'node/demoNodeExec.exe' }],
  linux: [{ from: 'node/linux/demoNodeExec', to: 'node/demoNodeExec' }]
};

const buildOptions = {
  targets: Platform[target.toUpperCase()].createTarget(),
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
      'proto/'
    ],
    extraFiles: extraFiles[target],
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
      runAfterFinish: false
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
    publish: [
      {
        provider: 'github',
        owner: 'smapp',
        repo: 'smapp',
        private: false
      }
    ],
    afterPack() {
      console.log('Build completed.');
    }
  }
};

if (publish) {
  buildOptions.publish = publish;
}

builder
  .build(buildOptions)
  .then((results) => {
    if (results && results.length) {
      console.log('Build process files:');
      results.forEach((res, index) => console.log(`${index + 1}. ${res}`));
    }
    process.exit(0);
  })
  .catch((error) => {
    process.exit(1);
  });
