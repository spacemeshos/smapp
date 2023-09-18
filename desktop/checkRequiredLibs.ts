import { promisify } from 'util';
import { exec as execCallback } from 'child_process';
import path from 'path';
import { access } from 'fs/promises';
import { ipcConsts } from '../app/vars';
import { NodeError, NodeErrorLevel, NodeErrorType } from '../shared/types';
import Logger from './logger';
import { isLinux, isWindows } from './osSystem';

const logger = Logger({ className: 'getNodeRequiredLibs' });

const exec = promisify(execCallback);

const generateInstallationError = (packageName, type): NodeError => ({
  msg: `Oops! It looks like ${packageName} is missing or not set up on your system.\n`,
  stackTrace: '',
  type,
  level: NodeErrorLevel.LOG_LEVEL_FATAL,
  module: 'NodeManager',
});

const checkVisualCppRedist = async () => {
  // Find software names containing "Microsoft Visual C++"
  const command =
    'wmic product where "name like \'%%Microsoft Visual C++%%\'" get name';

  try {
    const { stdout, stderr } = await exec(command);

    return Boolean(!stderr && stdout && stdout.trim() !== '');
  } catch (error: any) {
    logger.error(ipcConsts.NODE_INSTALLED_LIBRARIES, command, error);

    return false;
  }
};

async function checkLibrary(libraryName, directory) {
  const libraryPath = path.join(directory, libraryName);

  try {
    await access(libraryPath);
    return true;
  } catch (error) {
    logger.error(ipcConsts.NODE_INSTALLED_LIBRARIES, libraryPath, error);
    return false;
  }
}
const checkWindowsOpenCLDll = async () => {
  // List of common OpenCL library names on Windows
  const openCLLibrariesWindows = [
    'OpenCL.dll', // Windows common library name
    'amdocl.dll', // For AMD GPUs on Windows
    'amdocl64.dll', // For AMD GPUs on Windows 64-bit
    'IntelOpenCL.dll', // For Intel GPUs on Windows
    'IntelOpenCL64.dll', // For Intel GPUs on Windows 64-bit
    'nvcuda.dll', // For NVIDIA GPUs on Windows (CUDA)
  ];

  // Common system directories on Windows
  const systemDirectories = ['C:\\Windows\\System32', 'C:\\Windows\\SysWow64'];

  // eslint-disable-next-line no-restricted-syntax
  for (const library of openCLLibrariesWindows) {
    // eslint-disable-next-line no-restricted-syntax
    for (const directory of systemDirectories) {
      // eslint-disable-next-line no-await-in-loop
      if (await checkLibrary(library, directory)) {
        return true; // Library found
      }
    }
  }

  return false;
};

const checkUbuntuOpenCLLibrary = async (): Promise<boolean> => {
  const openCLLibrariesLinux = [
    'libOpenCL.so', // Linux common library name
    'libOpenCL.so.1', // Linux common library name with version
    'libamdocl64.so', // For AMD GPUs on Linux 64-bit
    'libIntelOpenCL.so', // For Intel GPUs on Linux
    'libnvidia-opencl.so', // For NVIDIA GPUs on Linux
  ];

  const searchCommands = openCLLibrariesLinux.map(
    (libraryName) => `ldconfig -v 2>&1 | grep ${libraryName}`
  );

  // eslint-disable-next-line no-restricted-syntax
  for (const searchCommand of searchCommands) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const { stdout, stderr } = await exec(searchCommand);

      if (stderr) {
        logger.log(ipcConsts.NODE_INSTALLED_LIBRARIES, searchCommand, stderr);
      }

      if (!stderr && stdout) {
        return true; // Library found
      }
    } catch (error) {
      // Error occurred, continue searching
      logger.error(ipcConsts.NODE_INSTALLED_LIBRARIES, searchCommand, error);
    }
  }

  return false; // Library not found
};

type RequiredLibraries = {
  openCL?: boolean;
  visualCpp?: boolean;
};
const checkWindowsLibs = async (): Promise<RequiredLibraries> => ({
  openCL: await checkWindowsOpenCLDll(),
  visualCpp: await checkVisualCppRedist(),
});

const checkLinuxLibs = async (): Promise<RequiredLibraries> => ({
  openCL: await checkUbuntuOpenCLLibrary(),
});

export const checkRequiredLibs = async (): Promise<RequiredLibraries> => {
  if (isWindows()) {
    return checkWindowsLibs();
  }

  if (isLinux()) {
    return checkLinuxLibs();
  }

  return {};
};

export const requiredLibsCrashErrors = {
  openCL: generateInstallationError(
    'OpenCL',
    NodeErrorType.OPEN_CL_NOT_INSTALLED
  ),
  visualCpp: generateInstallationError(
    'the required Microsoft Visual C++ Redistributable package',
    NodeErrorType.REDIST_NOT_INSTALLED
  ),
};
