import os from 'os';
import { ipcConsts } from '../app/vars';

const si = require('systeminformation');

class DiskStorageManager {
  static getDriveList = async ({ event }: { event: any }) => {
    si.blockDevices()
      .then((mountpoints) => {
        const mountedDrives = mountpoints.filter((mountPoint) => !!mountPoint.mount && !mountPoint.mount.includes('private'));
        const mappedDrives = mountedDrives.map((mountPoint) => ({
          id: mountPoint.name,
          mountPoint: mountPoint.mount,
          label: (os.type() === 'Darwin' || os.type() === 'Linux') && !!mountPoint.label ? mountPoint.label : mountPoint.name
        }));
        event.sender.send(ipcConsts.GET_DRIVE_LIST_SUCCESS, mappedDrives);
      })
      .catch((error) => {
        event.sender.send(ipcConsts.GET_DRIVE_LIST_FAILURE, error.message);
      });
  };

  static getAvailableSpace = ({ event, path }: { event: any, path: string }) => {
    si.fsSize().then((mountpoints) => {
      const validVolumes = mountpoints.filter((mountPoint) => !mountPoint.mount.includes('private'));
      const volume = validVolumes.find((validVolume) => validVolume.mount === path);
      const availableSpace = volume ? volume.size - volume.used : 0;
      event.sender.send(ipcConsts.GET_AVAILABLE_DISK_SPACE_SUCCESS, availableSpace);
    });
  };
}

export default DiskStorageManager;
