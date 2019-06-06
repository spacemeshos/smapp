import os from 'os';
import { ipcConsts } from '../app/vars';

const si = require('systeminformation');

const getBytesfromGb = (Gb: number) => Gb * 1073741824;

const getReadableSpace = (spaceInBytes: number) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (spaceInBytes === 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(spaceInBytes) / Math.log(1024)));
  return `${Math.round(spaceInBytes / 1024 ** i)} ${sizes[i]}`;
};

const COMMITMENT_DEFAULT_SIZE = 200; // GB
const DRIVE_SPACE_BUFFER = 50; // GB

const getAllocatedSpaceList = (availableDiskSpace: ?number, increment: number = getBytesfromGb(COMMITMENT_DEFAULT_SIZE)): { id: number, label: string }[] => {
  const allocatedSpaceList = [];
  if (availableDiskSpace) {
    for (let i = increment; i < availableDiskSpace; i += increment) {
      allocatedSpaceList.push({
        id: i,
        label: getReadableSpace(i)
      });
    }
  }
  return allocatedSpaceList;
};

class DiskStorageManager {
  static getDriveList = async ({ event }: { event: any }) => {
    Promise.all([si.blockDevices(), si.fsSize()])
      .then(([mountpoints, sizeMountpoints]) => {
        const mountedDrives = mountpoints.filter((mountPoint) => !!mountPoint.mount && !mountPoint.mount.includes('private')); // yields only mounted and non VM
        const validSizeMountpoints = sizeMountpoints.filter((mountPoint) => !mountPoint.mount.includes('private'));
        const mappedDrives = mountedDrives.map((mountPoint) => {
          const volume = validSizeMountpoints.find((validVolume) => validVolume.mount === mountPoint.mount);
          const availableSpace = volume ? volume.size - volume.used - Math.max(0, getBytesfromGb(DRIVE_SPACE_BUFFER)) : 0;
          return {
            id: mountPoint.name,
            mountPoint: mountPoint.mount,
            label: (os.type() === 'Darwin' || os.type() === 'Linux') && !!mountPoint.label ? mountPoint.label : mountPoint.name,
            availableDiskSpace: { bytes: availableSpace, readable: getReadableSpace(availableSpace) },
            capacityAllocationsList: getAllocatedSpaceList(availableSpace)
          };
        });
        event.sender.send(ipcConsts.GET_DRIVE_LIST_SUCCESS, mappedDrives);
      })
      .catch((error) => {
        event.sender.send(ipcConsts.GET_DRIVE_LIST_FAILURE, error.message);
      });
  };
}

export default DiskStorageManager;
