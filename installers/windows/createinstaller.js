const path = require('path');
const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller;

getInstallerConfig()
  .then(createWindowsInstaller)
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error.message || error);
    process.exit(1);
  });

function getInstallerConfig() {
  // eslint-disable-next-line no-console
  console.log('creating windows installer');
  const rootPath = path.join('./');
  const outPath = path.join(rootPath, 'release-builds');

  return Promise.resolve({
    appDirectory: path.join(outPath, 'smapp-win32-ia32/'),
    authors: 'Spacemesh App Dev',
    noMsi: true,
    outputDirectory: path.join(outPath, 'release-installers', 'windows'),
    exe: './smapp.exe',
    setupExe: 'SmAppSetup.exe',
    setupIcon: path.join(rootPath, 'app', 'assets', 'icons', 'app_icon.ico')
  });
}
