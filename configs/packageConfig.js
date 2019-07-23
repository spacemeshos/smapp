const fs = require('fs');
const path = require('path');
const util = require('util');
const crypto = require('crypto');
const readline = require('readline');

const { Platform, build } = require('electron-builder');

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);
const args = process.argv.slice(2);
const targets = args && args.length ? args : null;

if (!targets) {
  throw new Error("No arguments provided. Usage example: 'node ./packageConfig.js {mac/linux/windows}'");
}

const fileHashList = [
  'File="dmg_installer" | Hash=dmg_sha512',
  'File="exe_installer" | Hash=exe_sha512',
  'File="deb_installer" | Hash=deb_sha512',
  'File="snap_installer" | Hash=snap_sha512',
  'File="AppImage_installer" | Hash=AppImage_sha512'
];

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

const generateFile = async ({ destination, lines }) => {
  try {
    if (!fs.existsSync(destination)) {
      await writeFileAsync(destination, lines.join('\n'));
    }
  } catch (error) {
    process.exit(1);
  }
};

const getCompiledLines = async ({ artifactsToPublishFile, artifactPaths }) => {
  const acceptedSuffixes = ['dmg', 'exe', 'deb', 'snap', 'AppImage'];
  const getArtifactNameAndSuffix = ({ fullPath }) => {
    const artifactSuffixSplit = fullPath.split('.');
    const artifactSuffix = artifactSuffixSplit[artifactSuffixSplit.length - 1];
    const artifactNameSplit = fullPath.split('/');
    const artifactName = artifactNameSplit[artifactNameSplit.length - 1];
    return { artifactName, artifactSuffix };
  };
  const fileContent = await readFileAsync(artifactsToPublishFile, 'utf8');
  const lines = fileContent.split('\n');
  for (const fullPath of artifactPaths) {
    const { artifactName, artifactSuffix } = getArtifactNameAndSuffix({ fullPath });
    // installers only
    if (acceptedSuffixes.indexOf(artifactSuffix) >= 0) {
      const installerKey = `${artifactSuffix}_installer`;
      const shaKey = `${artifactSuffix}_sha512`;
      const lineIndex = lines.findIndex((editedLine) => editedLine.includes(installerKey));
      if (lineIndex >= 0) {
        const hash = await getFileHash({ filename: fullPath });
        const installerRegex = new RegExp(installerKey, 'g');
        const shaRegex = new RegExp(shaKey, 'g');
        const artifactNameSpacesReplaced = artifactName.replace(/ /g, '+');
        lines[lineIndex] = lines[lineIndex].replace(installerRegex, artifactNameSpacesReplaced);
        lines[lineIndex] = lines[lineIndex].replace(shaRegex, hash);
      }
    }
  }
  return lines;
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
        const artifactsToPublishFile = path.join(__dirname, '..', 'release', 'publishFilesList.txt');
        await generateFile({ destination: artifactsToPublishFile, lines: fileHashList });
        const lines = await getCompiledLines({ artifactsToPublishFile, artifactPaths: buildResult.artifactPaths });
        await writeFileAsync(artifactsToPublishFile, lines.join('\n'));
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
