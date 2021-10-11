const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const { Platform, build } = require('electron-builder');
require('dotenv').config();
const { notarize } = require('electron-notarize');

async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== 'darwin' || process.env.DONT_SIGN_APP) return;

  const appName = context.packager.appInfo.productFilename;

  return await notarize({
    appBundleId: 'com.spacemesh.wallet',
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLEID,
    appleIdPassword: process.env.APPLEIDPASS,
  });
}

const args = process.argv.slice(2);
if (args.length < 2 || args[0] !== '--target' || !['mac', 'windows', 'linux', 'mwl'].includes(args[1])) {
  throw new Error("No valid flags provided. Usage example: 'node ./scripts/packagerScript.js --target {mac|linux|windows|mwl}'");
}
const targets = args[1] === 'mwl' ? ['mac', 'windows', 'linux'] : [args[1]];

if ((args.length > 2 && args.length !== 4) || (args.length === 4 && (args[2] !== '--publish' || !['always', 'never'].includes(args[3])))) {
  throw new Error("No valid flags provided. Usage example: 'node ./scripts/packagerScript.js --target {mac|linux|windows|mwl} --publish {always|never}'");
}
const publishFlagValue = args.length === 4 ? args[3] : 'never';

const fileHashList = {
  dmg: {
    file: 'dmg_installer',
    hash: 'dmg_sha512'
  },
  exe: {
    file: 'exe_installer',
    hash: 'exe_sha512'
  },
  deb: {
    file: 'deb_installer',
    hash: 'deb_sha512'
  }
};

const nodeFiles = {
  mac: { from: path.resolve('node/mac/'), to: 'node/' },
  windows: { from: path.resolve('node/windows/'), to: 'node' },
  linux: { from: path.resolve('node/linux/'), to: 'node/' }
};

const artifactsToPublishFile = path.join(__dirname, '..', 'release', 'publishFilesList.json');
try {
  const dirname = path.dirname(artifactsToPublishFile);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname);
  }
  if (!fs.existsSync(artifactsToPublishFile)) {
    fs.writeFileSync(artifactsToPublishFile, JSON.stringify(fileHashList));
  }
} catch (error) {
  console.error(error);
  process.exit(1);
}

const getFileHash = ({ filename }) => {
  const shaSum = crypto.createHash('sha512');
  const fileContent = fs.readFileSync(filename);
  const hashSum = shaSum.update(fileContent);
  return hashSum.digest('hex');
};

const compileHashListFile = ({ artifactsToPublishFile, artifactPaths }) => {
  const acceptedSuffixes = ['dmg', 'exe', 'deb', 'snap', 'AppImage'];
  let hashList = fs.readFileSync(artifactsToPublishFile, 'utf8');
  for (const fullPath of artifactPaths) {
    const artifactSuffix = fullPath.split('.').pop();
    const artifactName = fullPath.split('/').pop();
    // installers only
    if (acceptedSuffixes.indexOf(artifactSuffix) >= 0) {
      const hash = getFileHash({ filename: fullPath });
      const artifactNameSpacesReplaced = artifactName.replace(/ /g, '+');
      hashList = hashList.replace(`${artifactSuffix}_installer`, artifactNameSpacesReplaced);
      hashList = hashList.replace(`${artifactSuffix}_sha512`, hash);
    }
  }
  fs.writeFileSync(artifactsToPublishFile, hashList);
};

const getBuildOptions = ({ target, publish }) => {
  const buildOptions = {
    targets: Platform[target.toUpperCase()].createTarget(),
    publish,
    config: {
      appId: 'com.spacemesh.wallet',
      files: [
        'desktop/dist/',
        'desktop/index.html',
        'desktop/main.prod.js',
        'desktop/main.prod.js.map',
        'desktop/wasm_exec.js',
        'desktop/ed25519.wasm',
        'desktop/config.json',
        'package.json',
        'node_modules/',
        'proto/',
        'resources/icons/*',
        'app/assets/**'
      ],
      extraFiles: [
        nodeFiles[target],
        { from: path.resolve('desktop/'), to: 'config/', filter: '*.json' }
      ],
      mac: {
        hardenedRuntime: true,
        gatekeeperAssess: false,
        entitlements: path.join(__dirname, 'entitlements.mac.plist'),
        entitlementsInherit: path.join(__dirname, 'entitlements.mac.plist'),
        target: ['zip', 'dmg'],
        binaries: [
          path.join(__dirname, '../node/mac/go-spacemesh'),
          path.join(__dirname, '../node/mac/libgpu-setup.dylib'),
          path.join(__dirname, '../node/mac/libMoltenVK.dylib'),
          path.join(__dirname, '../node/mac/libvulkan.1.dylib')
        ]
      },
      dmg: {
        sign: false,
        window: {
          width: '400',
          height: '380'
        },
        background: path.join(__dirname, '..', 'resources', 'background.png'),
        icon: path.join(__dirname, '..', 'resources', 'icon.icns'),
        contents: [
          {
            x: 245,
            y: 180,
            type: 'link',
            path: '/Applications'
          },
          {
            x: 50,
            y: 180,
            type: 'file'
          }
        ],
        title: 'Spacemesh'
      },
      win: {
        target: 'nsis'
      },
      nsis: {
        oneClick: false,
        perMachine: false,
        allowElevation: true,
        allowToChangeInstallationDirectory: true,
        runAfterFinish: true,
        deleteAppDataOnUninstall: true,
        createDesktopShortcut: true,
        createStartMenuShortcut: true,
        shortcutName: 'Spacemesh',
        uninstallDisplayName: 'Spacemesh (${version})'
      },
      linux: {
        target: ['deb'],
        category: 'Utility',
        icon: path.join(__dirname, '..', 'resources', 'icons', '512x512.png')
      },
      directories: {
        buildResources: path.join(__dirname, '..', 'resources'),
        output: path.join(__dirname, '..', 'release')
      },
      afterAllArtifactBuild: (buildResult) => {
        try {
          compileHashListFile({ artifactsToPublishFile, artifactPaths: buildResult.artifactPaths });
          return [artifactsToPublishFile];
        } catch (error) {
          console.error(error.message);
          process.exit(1);
        }
      },
      npmRebuild: false
    }
  };

  if (target === 'mac') {
    buildOptions.config.afterSign = notarizing;
  }

  if (publish !== 'never') {
    buildOptions.config.publish = {
      provider: 's3',
      bucket: 'app-binaries.spacemesh.io'
    };
  }

  return buildOptions;
};

targets.forEach(async (target) => {
  try {
    const res = await build(getBuildOptions({ target, publish: publishFlagValue }));
    if (res && res.length) {
      console.log(`Artifacts packed for ${target}:`);
      res.forEach((res, index) => console.log(`${index + 1}. ${res}`));
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
});
