// @flow
import os from 'os';
import drivelist from 'drivelist';
import { ipcConsts } from '../app/vars';

const checkDiskSpace = require('check-disk-space');

const getMountPoint = (drive: any): string => {
  if (drive.mountpoints && drive.mountpoints.length) {
    return `${drive.mountpoints[0].path}${os.type() === 'win32' ? '\\' : ''}`;
  }
  return '/';
};

type Drive = {
  id: string,
  mountPoint: string,
  label: string
};

class DiskStorageManager {
  static getDriveList = ({ event }: { event: any }) => {
    drivelist.list((error, drives) => {
      if (error) {
        event.sender.send(ipcConsts.GET_DRIVE_LIST_FAILURE, error.message);
      } else {
        const filteredDrives = drives.filter((drive: any) => drive.mountpoints && drive.mountpoints.length);
        const mappedDrives: Drive[] = filteredDrives.map((drive: any) => {
          return {
            id: drive.raw,
            mountPoint: getMountPoint(drive),
            label: drive.device
          };
        });
        event.sender.send(ipcConsts.GET_DRIVE_LIST_SUCCESS, mappedDrives);
      }
    });
  };

  static getAvailableSpace = ({ event, path }: { event: any, path: string }) => {
    checkDiskSpace(path).then((diskSpace) => {
      event.sender.send(ipcConsts.GET_AVAILABLE_DISK_SPACE_SUCCESS, diskSpace.free);
    });
  };
}

export default DiskStorageManager;
