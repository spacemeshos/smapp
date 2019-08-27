import os from 'os';
import { ipcConsts, nodeConsts } from '../app/vars';

const si = require('systeminformation');

const convertToGb = (spaceInBytes) => {
  const i = parseInt(Math.floor(Math.log(spaceInBytes) / Math.log(1024)));
  return Math.round(spaceInBytes / 1024 ** i);
};

class DiskStorageManager {
  static getDriveList = async ({ event }) => {
    Promise.all([si.blockDevices(), si.fsSize()]).then(([mountPoints, sizeMountPoints]) => {
      const mountedDrives = mountPoints.filter((mountPoint) => !!mountPoint.mount && !mountPoint.mount.includes('private')); // yields only mounted and non VM
      const validSizeMountPoints = sizeMountPoints.filter((mountPoint) => !mountPoint.mount.includes('private'));
      const mappedDrives = [];
      const minimalCommitmentSizeInBytes = nodeConsts.COMMITMENT_SIZE * 1073741824;
      mountedDrives.forEach((mountPoint) => {
        const volume = validSizeMountPoints.find((validSizeMountPoint) => validSizeMountPoint.mount === mountPoint.mount);
        const availableSpace = volume ? volume.size - volume.used : 0;
        if (availableSpace > minimalCommitmentSizeInBytes) {
          const label = (os.type() === 'Darwin' || os.type() === 'Linux') && !!mountPoint.label ? mountPoint.label : mountPoint.name;
          mappedDrives.push({ mountPoint: mountPoint.mount, label, availableDiskSpace: convertToGb(availableSpace) });
        }
      });
      event.sender.send(ipcConsts.GET_DRIVE_LIST_SUCCESS, mappedDrives);
    });
  };
}

export default DiskStorageManager;
