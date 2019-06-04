// @flow
import { ipcConsts } from '../app/vars';

const drivelist = require('drivelist');
const checkDiskSpace = require('check-disk-space');

type Volume = {
  id: string,
  mountPoint: string,
  label: string
};

class DiskStorageManager {
  static getDriveList = async ({ event }: { event: any }) => {
    try {
      const drives = await drivelist.list();
      const mountedDrives = drives.filter((drive: any) => drive.mountpoints && drive.mountpoints.length);
      const mappedDrives = mountedDrives.reduce((volumes: Volume[], drive) => {
        drive.mountpoints.forEach((mountPoint) => {
          if (!mountPoint.path.includes('private')) {
            volumes.push({
              id: mountPoint.path,
              mountPoint: mountPoint.path,
              label: mountPoint.label
            });
          }
        });
        return volumes;
      }, []);
      event.sender.send(ipcConsts.GET_DRIVE_LIST_SUCCESS, mappedDrives);
    } catch (error) {
      event.sender.send(ipcConsts.GET_DRIVE_LIST_FAILURE, error.message);
    }
  };

  static getAvailableSpace = ({ event, path }: { event: any, path: string }) => {
    checkDiskSpace(path).then((diskSpace) => {
      event.sender.send(ipcConsts.GET_AVAILABLE_DISK_SPACE_SUCCESS, diskSpace.free);
    });
  };
}

export default DiskStorageManager;
