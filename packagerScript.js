const fs = require('fs');
const path = require('path');
const util = require('util');
const crypto = require('crypto');

const { Platform, build } = require('electron-builder');

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);
const mkdirAsync = util.promisify(fs.mkdir);
const args = process.argv.slice(2);
const hasArgs = args && args.length;
const targetIdx = args.findIndex((arg) => arg === '--target');
const targetOptions = ['mac', 'windows', 'linux', 'all'];
const hasValidTargetArg = hasArgs && targetIdx >= 0 && !!args[targetIdx + 1] && targetOptions.includes(args[targetIdx + 1]);

if (!hasValidTargetArg) {
  throw new Error("No valid arguments provided. Usage example: 'node ./packagerScript.js --target {mac/linux/windows/all}'");
}

const targets = args[targetIdx + 1] === 'all' ? ['mac', 'windows', 'linux'] : [args[targetIdx + 1]];

const publishArgIdx = args.findIndex((arg) => arg === '--publish');
const publishOptiobns = ['onTag', 'onTagOrDraft', 'always', 'never'];
const hasValidPublishArg = publishArgIdx >= 0 && !!args[publishArgIdx + 1] && publishOptiobns.includes(args[publishArgIdx + 1]);

if (!(publishArgIdx < 0 || hasValidPublishArg)) {
  throw new Error("No valid arguments provided. Usage example: 'node ./packagerScript.js --target {mac/linux/windows/all} --publish {onTag/onTagOrDraft/always/never}'");
}

const publishArg = args[publishArgIdx + 1];

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

const artifactsToPublishFile = path.join(__dirname, 'release', 'publishFilesList.json');

const generateFileHashFile = async ({ destination }) => {
  try {
    const dirname = path.dirname(destination);
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
  const shaSum = crypto.createHash('sha512');
  const fileContent = await readFileAsync(filename);
  const hashSum = shaSum.update(fileContent);
  return hashSum.digest('hex');
};

const compileHashListFile = async ({ artifactsToPublishFile, artifactPaths }) => {
  const acceptedSuffixes = ['dmg', 'exe', 'deb', 'snap', 'AppImage'];
  let hashList = await readFileAsync(artifactsToPublishFile, 'utf8');
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

const getBuildOptions = ({ target, publish }) => {
  const buildOptions = {
    targets: Platform[target.toUpperCase()].createTarget(),
    publish,
    config: {
      appId: 'com.spacemesh.wallet',
      productName: 'Spacemesh',
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
        'resources/icons/*',
        nodeFiles[target]
      ],
      dmg: {
        window: {
          width: '350',
          height: '380'
        },
        background: path.join(__dirname, 'resources', 'background.png'),
        contents: [
          {
            x: 300,
            y: 180,
            type: 'link',
            path: '/Applications'
          },
          {
            x: 70,
            y: 180,
            type: 'file'
          }
        ],
        internetEnabled: true,
        title: 'Spacemesh',
        sign: false
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
          await compileHashListFile({ artifactsToPublishFile, artifactPaths: buildResult.artifactPaths });
          return [artifactsToPublishFile];
        } catch (error) {
          console.error(error.message);
          process.exit(1);
        }
      }
    }
  };

  if (publish !== 'never') {
    buildOptions.config.publish = {
      provider: 's3',
      bucket: 'app-binaries.spacemesh.io'
    };
  }

  return buildOptions;
};

targets.forEach(async (target) => {
  if (['mac', 'windows', 'linux'].indexOf(target) === -1) {
    console.error("Invalid target provided. Usage example: 'node ./packagerScript.js {mac/linux/windows}'");
  } else {
    try {
      const res = await build(getBuildOptions({ target, publish: hasValidPublishArg ? publishArg : 'never' }));
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
