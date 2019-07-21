const { Platform, build } = require('electron-builder');

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
    publish: {
      "provider": "s3",
      "bucket": "app-binaries.spacemesh.io"
    },
    directories: {
      buildResources: 'resources',
      output: 'release'
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
