const fs = require('fs');
const path = require('path');
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

const distributablesList = ['<%= dmg_installer %>', '<%= exe_installer %>', '<%= deb_installer %>', '<%= AppImage_installer %>', '<%= auth_md %>'];

const authMdTemplate = [
  '# Verifying the Downloadable Installer',
  '',
  'Follow the steps to verify the integrity and authenticity of the Spacemesh downloadable installer for your platform.',
  '',
  '### OS X',
  '[SPACEMESH_OS_X_INSTALLER](<%= dmg_installer %>)',
  '',
  '1. Open Terminal and run `shasum` on the downloadable installer:',
  '',
  '```bash',
  'shasum -a 512 /path/to/installer',
  '```',
  '',
  '2. Verify that the shasum output you got in terminal matches this checksum:',
  '',
  '<span>',
  '<%= dmg_sha512 %>',
  '</span>',
  '',
  '### Windows 10',
  '[SPACEMESH_WIN10_INSTALLER](<%= exe_installer %>)',
  '',
  '1. Run `certutil` from the Windows command line console:',
  '```shell',
  'certutil -hashfile C:path\toinstaller SHA512',
  '```',
  '',
  '2. Verify that the output you got in the console matches this checksum:',
  '',
  '<span>',
  '<%= exe_sha512 %>',
  '</span>',
  '',
  '### Debian',
  '',
  '[SPACEMESH_DEB_INSTALLER](<%= deb_installer %>)',
  '',
  '1. Run `sha512sum` from the command line:',
  '',
  '```bash',
  'sha512sum path\todownloadedinstaller',
  '```',
  '',
  '2. Verify that the output you got in the console matches this checksum:',
  '',
  '<span>',
  '<%= deb_sha512 %>',
  '</span>',
  '',
  '### Ubuntu or Fedora Linux',
  '',
  '[SPACEMESH_UBUNTU_INSTALLER](<%= AppImage_installer %>)',
  '',
  '1. Run `sha512sum` from the command line:',
  '',
  '```bash',
  'sha512sum path\todownloadedinstaller',
  '```',
  '',
  '2. Verify that the output you got in the console matches this checksum:',
  '',
  '<span>',
  '<%= AppImage_sha512 %>',
  '</span>',
  ''
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
    throw error;
  }
};

const getLinesWithoutLinkSpaces = ({ lines }) =>
  lines.map((line) => {
    const hasLink = line.includes('](') && line[line.indexOf('](') + 2] !== '<';
    if (hasLink) {
      const startIndex = line.indexOf('](');
      const endIndex = line.indexOf(')', startIndex + 2);
      const linkSubstring = line.substring(startIndex, endIndex);

      line = line.replace(/ /g, '&#32;');
    }
    return line;
  });

const getCompiledAuthFileLines = async ({ filename, artifactPath, artifactSuffix }) => {
  const artifactSplit = artifactPath.split('/');
  const artifactName = artifactSplit[artifactSplit.length - 1];
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
        compiledLine = compiled({ [installerKey]: artifactName, [shaKey]: hash });
      } catch (error) {
        compiledLine = line;
      }
      lines.push(compiledLine);
    });
  });
};

const getCompiledPublishListFileLines = async ({ keyToCompile, artifactPath, artifactsToPublishFile }) => {
  const artifactSplit = artifactPath.split('/');
  const artifactName = artifactSplit[artifactSplit.length - 1];
  const areAllLinesProcessed = ({ lines }) => {
    const uncompiledLines = lines.filter((line) => line.startsWith('<%='));
    return uncompiledLines.length === 0;
  };
  return new Promise(async (resolve, reject) => {
    const lines = [];
    const rd = readline.createInterface({
      input: fs.createReadStream(artifactsToPublishFile),
      output: false,
      console: false
    });

    rd.on('close', () => {
      if (areAllLinesProcessed({ lines })) {
        lines.push('');
      }
      resolve(lines);
    });

    rd.on('error', reject);

    rd.on('line', (line) => {
      const compiled = template(line);
      let compiledLine = null;
      try {
        compiledLine = compiled({ [keyToCompile]: artifactName });
      } catch (error) {
        compiledLine = line;
      }
      lines.push(compiledLine);
    });
  });
};

const writePublishFilesList = async ({ artifactsToPublish }) => {
  const artifactsToPublishFile = path.join(__dirname, '..', 'release', 'publishFilesList.txt');
  await generateFile({ destination: artifactsToPublishFile, lines: distributablesList });
  for (const artifactPathToPublish of artifactsToPublish) {
    const artifactPath = artifactPathToPublish.artifactPath;
    const artifactSplit = artifactPath.split('.');
    const artifactSuffix = artifactSplit[artifactSplit.length - 1];
    const keyToCompile = artifactPathToPublish.artifactSuffix === 'md' ? 'auth_md' : `${artifactSuffix}_installer`;
    const lines = await getCompiledPublishListFileLines({ keyToCompile, artifactPath, artifactsToPublishFile });
    await writeFileAsync(artifactsToPublishFile, lines.join('\n'));
  }
};

const getBuildOptions = (target) => ({
  targets: Platform[target.toUpperCase()].createTarget(),
  publish: 'never',
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
    directories: {
      buildResources: 'resources',
      output: 'release'
    },
    afterAllArtifactBuild: async (buildResult) => {
      try {
        const authFilePath = path.join(__dirname, '..', 'release', 'auth.md');
        await generateFile({ destination: authFilePath, lines: authMdTemplate });
        const acceptedSuffixes = ['dmg', 'exe', 'deb', 'snap', 'AppImage'];
        const artifactsToPublish = [{ artifactPath: authFilePath, artifactSuffix: 'md' }];
        for (const artifactPath of buildResult.artifactPaths) {
          const artifactSplit = artifactPath.split('.');
          const artifactSuffix = artifactSplit[artifactSplit.length - 1];
          if (acceptedSuffixes.indexOf(artifactSuffix) >= 0) {
            artifactsToPublish.push({ artifactPath, artifactSuffix });
            const lines = await getCompiledAuthFileLines({ filename: authFilePath, artifactPath, artifactSuffix });
            const linesWithSpacesReplaced = getLinesWithoutLinkSpaces({ lines });
            await writeFileAsync(authFilePath, linesWithSpacesReplaced.join('\n'));
          }
        }
        await writePublishFilesList({ artifactsToPublish });
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
