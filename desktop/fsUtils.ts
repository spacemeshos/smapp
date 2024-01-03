import util from 'util';
import fs from 'fs';
import { F_OK } from 'constants';

export const readFileAsync = util.promisify(fs.readFile);

export const writeFileAsync = util.promisify(fs.writeFile);
export const deleteFileAsync = util.promisify(fs.unlink);

export const isFileExists = (filePath: string) =>
  fs.promises
    .access(filePath, F_OK)
    .then(() => true)
    .catch(() => false);

export const isEmptyDir = async (path: string) => {
  try {
    const fsp = fs.promises;
    const directory = await fsp.opendir(path);
    const entry = await directory.read();
    await directory.close();
    return entry === null;
  } catch (error) {
    return false;
  }
};
