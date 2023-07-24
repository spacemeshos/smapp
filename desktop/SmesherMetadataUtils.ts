import path from 'path';
import {
  deleteFileAsync,
  isFileExists,
  readFileAsync,
  writeFileAsync,
} from './utils';

interface SmesherMetadata {
  smeshingStart?: number;
  posInitStart?: number;
}

export const updateSmeshingMetadata = async (
  dataDir: string,
  data: SmesherMetadata
): Promise<SmesherMetadata> => {
  const metadataPath = path.resolve(dataDir, 'smeshing_metadata.json');
  const isExists = await isFileExists(metadataPath);

  if (!isExists) {
    await writeFileAsync(metadataPath, JSON.stringify(data));
    return data;
  }

  const metadata = await readFileAsync(metadataPath, 'utf8');
  const parsedMetadata = JSON.parse(metadata);

  // skip smeshingStart update if it was already set
  if (!!parsedMetadata.smeshingStart && !!data.smeshingStart) {
    return parsedMetadata;
  }

  const update = {
    ...parsedMetadata,
    ...data,
  };

  await writeFileAsync(metadataPath, JSON.stringify(update));
  return update;
};

export const getSmeshingMetadata = async (
  dataDir: string
): Promise<SmesherMetadata | null> => {
  const metadataPath = path.resolve(dataDir, 'smeshing_metadata.json');
  const isExists = await isFileExists(metadataPath);

  if (!isExists) {
    return {};
  }

  const metadata = await readFileAsync(metadataPath, 'utf8');
  const parsedMetadata = JSON.parse(metadata);

  return parsedMetadata;
};

export const deleteSmeshingMetadata = async (
  dataDir: string
): Promise<void> => {
  const metadataPath = path.resolve(dataDir, 'smeshing_metadata.json');
  const isExists = await isFileExists(metadataPath);

  if (isExists) {
    await deleteFileAsync(metadataPath);
  }
};
