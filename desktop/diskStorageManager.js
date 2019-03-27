// @flow
import os from 'os';
import disk from 'diskusage';
import drivelist from 'drivelist';
import { ipcConsts } from '../app/vars';

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

  static getAvailableSpace = async ({ event, path }: { event: any, path: string }) => {
    try {
      const { available } = await disk.check(path);
      event.sender.send(ipcConsts.GET_AVAILABLE_DISK_SPACE_SUCCESS, available);
    } catch (error) {
      event.sender.send(ipcConsts.GET_AVAILABLE_DISK_SPACE_FAILURE, error.message);
    }
  };
}

export default DiskStorageManager;
