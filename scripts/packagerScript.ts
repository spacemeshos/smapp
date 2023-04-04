import os from 'os';
import { promises as fs } from 'fs';
import path from 'path';

import { CliOptions, build } from 'electron-builder';
import { notarize } from 'electron-notarize';


async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== 'darwin' || process.env.DONT_SIGN_APP) return;
  if (!process.env.APPLEID || !process.env.APPLEIDPASS || !process.env.APPLETEAMID) {
    console.error([
      'Error: No env variables `APPLEID`, `APPLEIDPASS`, `APPLETEAMID` are set.',
      'To skip signing set `DONT_SIGN_APP=1` explicitly.',
    ].join('\n'));
    process.exit(1);
  }

  const appName = context.packager.appInfo.productFilename;

  return await notarize({
    tool: 'notarytool',
    appBundleId: 'com.spacemesh.wallet',
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLEID,
    appleIdPassword: process.env.APPLEIDPASS,
    teamId: process.env.APPLETEAMID,
  });
}

const args = process.argv.slice(2);
if (args.length < 2 || args[0] !== '--target' || !['mac', 'windows', 'linux', 'mwl'].includes(args[1])) {
  console.error("\nError: No valid flags provided. \nUsage example: 'node ./scripts/packagerScript.js --target {mac|linux|windows|mwl}'");
  process.exit(1);
}
const targets = args[1] === 'mwl' ? ['mac', 'windows', 'linux'] : [args[1]];

const nodeFiles = {
  mac: { from: path.resolve('node/mac/'), to: 'node/' },
  windows: { from: path.resolve('node/windows/'), to: 'node' },
  linux: { from: path.resolve('node/linux/'), to: 'node/' }
};

const getBuildOptions = ({ target }) => {
  const buildOptions: Partial<CliOptions> = {
    publish: 'never',
    config: {
      appId: 'com.spacemesh.wallet',
      files: [
        'desktop/dist/',
        'desktop/index.html',
        'desktop/main.prod.js',
        'desktop/main.prod.js.map',
        'desktop/wasm_exec.js',
        'desktop/bip32_bg.wasm',
        'desktop/ed25519.wasm',
        'desktop/config.json',
        'package.json',
        'proto/',
        '!node_modules/',
        '!node_modules/**/*.ts',
        '!node_modules/**/*.md',
        '!node_modules/**/*.map',
        '!node_modules/**/*.flow',
      ],
      extraResources: [
        'resources/icons/*',
        'resources/icon.icns'
      ],
      extraFiles: [
        nodeFiles[target],
        { from: path.resolve('desktop/'), to: 'config/', filter: '*.json' },
      ],
      mac: {
        hardenedRuntime: true,
        gatekeeperAssess: false,
        entitlements: path.join(__dirname, 'entitlements.mac.plist'),
        entitlementsInherit: path.join(__dirname, 'entitlements.mac.plist'),
        target: {
          target: 'default',
          arch: [os.arch() === 'arm64' ? 'arm64' : 'x64'],
        },
        icon: path.join(__dirname, '..', 'resources', 'icon.icns'),
        binaries: [
          path.join(__dirname, '../node/mac/go-spacemesh'),
          path.join(__dirname, '../node/mac/libgpu-setup.dylib'),
          path.join(__dirname, '../node/mac/libMoltenVK.dylib'),
          path.join(__dirname, '../node/mac/libvulkan.1.dylib')
        ],
        ...(process.env.DONT_SIGN_APP ? { identity: null } : {}),
      },
      dmg: {
        sign: false,
        window: {
          width: 400,
          height: 380
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
        ...(process.env.DONT_SIGN_APP ? {} : {
          publisherName: 'Spacemesh (Unruly Technologies, Inc.)',
        }),
        target: 'nsis',
      },
      nsis: {
        oneClick: false,
        perMachine: false,
        allowElevation: false,
        allowToChangeInstallationDirectory: true,
        runAfterFinish: true,
        deleteAppDataOnUninstall: false,
        createDesktopShortcut: true,
        createStartMenuShortcut: true,
        shortcutName: 'Spacemesh',
        uninstallDisplayName: 'Spacemesh (${version})'
      },
      linux: {
        target: [
          {
            target: 'deb',
            arch: [os.arch() === 'arm64' ? 'arm64' : 'x64'],
          },
          {
            target: 'AppImage',
            arch: [os.arch() === 'arm64' ? 'arm64' : 'x64'],
          }
        ],
        category: 'Utility',
        icon: path.join(__dirname, '..', 'resources', 'icon.icns')
      },
      directories: {
        buildResources: path.join(__dirname, '..', 'resources'),
        output: path.join(__dirname, '..', 'release')
      },
      afterSign: target === 'mac' ? notarizing : null,
      npmRebuild: false,
      publish: {
        provider: 'generic',
        url: 'https://storage.googleapis.com/smapp/',
        channel: 'latest',
      },
    }
  };
  return buildOptions;
};

const preBuild = async () => {
  // Copy bip32_bg.wasm to /desktop/bip32_bg.wasm
  await fs.copyFile(
    path.join(__dirname, '../node_modules/@spacemesh/ed25519-bip32/gen/bip32_bg.wasm'),
    path.join(__dirname, '../desktop/bip32_bg.wasm')
  );

  return true;
};

targets.forEach(async (target) => {
  try {
    await preBuild();
    const res = await build(getBuildOptions({ target }));
    if (res && res.length) {
      console.log(`Artifacts packed for ${target}:`);
      res.forEach((res, index) => console.log(`${index + 1}. ${res}`));
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
});
