const builder = require('electron-builder');
const Platform = builder.Platform;

const args = process.argv.slice(2);
const target = args && args.length ? args[0] : null;

if (target !== 'mac' && target !== 'windows' && target !== 'linux') {
  throw new Error('Wrong target args. Should be either mac, windows or linux. ex: node ./<path to file>/packageConfig.js mac');
}

console.log(`Building for ${target}...`);

const extraFiles = {
  mac: [{ from: 'node/mac/mac-go-spacemesh', to: 'node/mac-go-spacemesh' }],
  windows: [{ from: 'node/windows/go-spacemesh.exe', to: 'node/go-spacemesh.exe' }],
  linux: [{ from: 'node/linux/linux-go-spacemesh', to: 'node/linux-go-spacemesh' }]
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
