const fs = require('fs');
const path = require('path');
const util = require('util');
const crypto = require('crypto');

const { Platform, build } = require('electron-builder');

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);
const mkdirAsync = util.promisify(fs.mkdir);
const args = process.argv.slice(2);
const targets = args && args.length ? args : null;

if (!targets) {
  throw new Error("No arguments provided. Usage example: 'node ./packageConfig.js {mac/linux/windows}'");
}

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
  },
  snap: {
    file: 'snap_installer',
    hash: 'snap_sha512'
  },
  AppImage: {
    file: 'AppImage_installer',
    hash: 'AppImage_sha512'
  }
};

const nodeFiles = {
  mac: { from: 'node/mac/', to: 'node/' },
  windows: { from: 'node/windows/', to: 'node/' },
  linux: { from: 'node/linux/', to: 'node/' }
};

const artifactsToPublishFile = path.join(__dirname, '..', 'release', 'publishFilesList.json');

const generateFileHashFile = async ({ destination }) => {
  try {
    var dirname = path.dirname(destination);
    if (!fs.existsSync(dirname)) {
      await mkdirAsync(dirname);
    }
    if (!fs.existsSync(destination)) {
      await writeFileAsync(destination, JSON.stringify(fileHashList));
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

generateFileHashFile({ destination: artifactsToPublishFile });

const getFileHash = async ({ filename }) => {
  const shasum = crypto.createHash('sha512');
  const fileContent = await readFileAsync(filename);
  const hashsum = shasum.update(fileContent);
  const hash = hashsum.digest('hex');
  return hash;
};

const compileHashListFile = async ({ artifactsToPublishFile, artifactPaths }) => {
  const acceptedSuffixes = ['dmg', 'exe', 'deb', 'snap', 'AppImage'];
  const fileContent = await readFileAsync(artifactsToPublishFile);
  let hashList = JSON.stringify(JSON.parse(fileContent));
  for (const fullPath of artifactPaths) {
    const artifactSuffix = fullPath.split('.').pop();
    const artifactName = fullPath.split('/').pop();
    // installers only
    if (acceptedSuffixes.indexOf(artifactSuffix) >= 0) {
      const installerKey = `${artifactSuffix}_installer`;
      const shaKey = `${artifactSuffix}_sha512`;
      const hash = await getFileHash({ filename: fullPath });
      const artifactNameSpacesReplaced = artifactName.replace(/ /g, '+');
      hashList = hashList.replace(installerKey, artifactNameSpacesReplaced);
      hashList = hashList.replace(shaKey, hash);
    }
  }
  await writeFileAsync(artifactsToPublishFile, hashList);
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
      provider: 's3',
      bucket: 'app-binaries.spacemesh.io'
    },
    directories: {
      buildResources: 'resources',
      output: 'release'
    },
    afterAllArtifactBuild: async (buildResult) => {
      try {
        await compileHashListFile({ artifactsToPublishFile, artifactPaths: buildResult.artifactPaths });
        return [artifactsToPublishFile];
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
