// https://github.com/spacemeshos/smapp/issues/1377

import { resolve } from 'path';
import { appendFile, rename } from 'fs/promises';
import { hash } from '@spacemesh/sm-codec';
import { pathExists } from 'fs-extra';
import { HexString } from '../../shared/types';
import { getCustomNodeConfigPath } from '../main/NodeConfig';
import StoreService from '../storeService';
import { getShortGenesisId, toHexString } from '../../shared/utils';
import { getNodeLogsPath } from '../main/utils';

const renameIfNeeded = async (prevPath: string, nextPath: string) => {
  if ((await pathExists(prevPath)) && !(await pathExists(nextPath))) {
    await rename(prevPath, nextPath);
  }
};

const getISOTimeWithTimezone = (date: Date) => {
  const isoString = date.toISOString();
  const timezoneOffset = date.getTimezoneOffset();
  const timezoneOffsetSign = timezoneOffset < 0 ? '+' : '-';
  const timezoneOffsetHours = String(
    Math.floor(Math.abs(timezoneOffset) / 60)
  ).padStart(2, '0');
  const timezoneOffsetMinutes = String(Math.abs(timezoneOffset) % 60).padStart(
    2,
    '0'
  );
  const timezoneOffsetString = `${timezoneOffsetSign}${timezoneOffsetHours}${timezoneOffsetMinutes}`;

  const formattedDate = isoString.replace('Z', timezoneOffsetString);
  return formattedDate;
};

export const getWrongGenesisID = (genesisTime: string, extraData: string) =>
  `${toHexString(hash(genesisTime + extraData)).substring(0, 40)}`;

export default async (prevGenesisId: HexString, nextGenesisId: HexString) => {
  if (prevGenesisId === nextGenesisId) return;

  const nodeDataDir = StoreService.get('node.dataPath');
  await Promise.all([
    // Node data
    renameIfNeeded(
      resolve(nodeDataDir, getShortGenesisId(prevGenesisId)),
      resolve(nodeDataDir, getShortGenesisId(nextGenesisId))
    ),
    // Node config (custom)
    renameIfNeeded(
      getCustomNodeConfigPath(prevGenesisId),
      getCustomNodeConfigPath(nextGenesisId)
    ),
    // Node log message
    (async () => {
      if (await pathExists(getNodeLogsPath(prevGenesisId))) {
        await appendFile(
          getNodeLogsPath(nextGenesisId),
          `${[
            getISOTimeWithTimezone(new Date()),
            'INFO',
            'Smapp',
            `Smapp fixed computing Genesis ID(${prevGenesisId} -> ${nextGenesisId}). Previous logs see in spacemesh-log-${getShortGenesisId(
              prevGenesisId
            )}.txt`,
          ].join('\t')}\n`,
          'utf-8'
        );
      }
    })(),
  ]);
};
