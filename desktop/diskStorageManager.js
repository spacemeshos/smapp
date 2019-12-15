import os from 'os';
import { app } from 'electron';
import { ipcConsts, nodeConsts } from '../app/vars';

const si = require('systeminformation');

class DiskStorageManager {
  static getDriveList = async ({ event }) => {
    Promise.all([si.blockDevices(), si.fsSize()]).then(([mountPoints, sizeMountPoints]) => {
      let mountedDrives;
      let validSizeMountPoints;
      if (os.type() === 'Darwin') {
        mountedDrives = mountPoints.filter((mountPoint) => !!mountPoint.mount && mountPoint.mount.includes('Data')); // yields only mounted and non VM
        mountedDrives[0].mount = `${mountedDrives[0].mount}/${app.getPath('home')}`;
        validSizeMountPoints = sizeMountPoints.filter((mountPoint) => mountPoint.mount.includes('Data'));
        validSizeMountPoints[0].mount = `${validSizeMountPoints[0].mount}/${app.getPath('home')}`;
      } else {
        mountedDrives = mountPoints.filter((mountPoint) => !!mountPoint.mount); // yields only mounted and non VM
        validSizeMountPoints = sizeMountPoints;
      }
      const mappedDrives = [];
      const minimalCommitmentSizeInBytes = nodeConsts.COMMITMENT_SIZE * 1073741824;
      mountedDrives.forEach((mountPoint) => {
        const volume = validSizeMountPoints.find((validSizeMountPoint) => validSizeMountPoint.mount === mountPoint.mount);
        const availableSpace = volume ? volume.size - volume.used : 0;
        if (availableSpace > minimalCommitmentSizeInBytes) {
          const label = (os.type() === 'Darwin' || os.type() === 'Linux') && !!mountPoint.label ? mountPoint.label : mountPoint.name;
          mappedDrives.push({ mountPoint: mountPoint.mount, label, availableDiskSpace: Math.round(availableSpace / 1024 ** 3) });
        }
      });
      event.sender.send(ipcConsts.GET_DRIVE_LIST_RESPONSE, mappedDrives);
    });
  };
}

export default DiskStorageManager;
