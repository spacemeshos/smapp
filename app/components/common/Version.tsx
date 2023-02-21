import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { UpdateInfo as UpdateInfoT } from 'electron-updater';
import { SemVer } from 'semver';

import {
  getError,
  getProgressInfo,
  getUpdateInfo,
  isUpdateDownloaded,
  isUpdateDownloading,
} from '../../redux/updater/selectors';
import { eventsService } from '../../infra/eventsService';
import { smColors } from '../../vars';
import packageInfo from '../../../package.json';
import { AuthPath } from '../../routerPaths';
import FeedbackButton from './Feedback';

const Container = styled.div`
  position: absolute;
  left: 32px;
  bottom: 15px;
  font-size: 11px;
  color: ${({ theme }) => theme.color.gray};
  display: flex;
  align-items: baseline;
`;

const ChunkStyles = css`
  display: inline-block;
  margin-right: 0.75em;
`;
const Chunk = styled.div`
  ${ChunkStyles}
`;

const Action = css`
  ${ChunkStyles};
  padding: 0.5em;
  margin: 0;
  text-decoration: underline;
  cursor: pointer;
`;

const hoverColor = (normal: string, hover: string) => css`
  color: ${normal};

  &:hover,
  &:focus {
    color: ${hover};
  }
`;

const PrimaryAction = styled.a`
  ${Action}
  ${hoverColor(smColors.orange, smColors.darkOrange)}
`;
const SecondaryAction = styled.a`
  ${Action}
  ${hoverColor(smColors.purple, smColors.darkerPurple)}
`;
const SwitchNetwork = styled.a`
  ${Action}
  ${hoverColor(smColors.blue, smColors.darkerBlue)}
`;

const Attractor = styled.div`
  ${ChunkStyles};
  border-radius: 50%;
  color: ${smColors.orange};
  margin-left: 1em;
  margin-right: 0.3em !important;
  &:before {
    display: inline;
    content: '⟁';
  }
`;

const ProgressChunk = styled(Chunk)`
  color: ${smColors.purple};
`;

const Error = styled(Chunk)`
  color: ${smColors.red};
  max-width: 300px;
`;

const UpdateInfo = ({ info }: { info: UpdateInfoT }) => {
  const history = useHistory();
  const curVersion = new SemVer(packageInfo.version);
  const isDowngrade = curVersion.compare(info.version) === 1;
  return (
    <>
      <Attractor />
      <Chunk>
        {isDowngrade
          ? `This network supports only v${info.version}`
          : `Update available: v${info.version}`}
      </Chunk>
      <PrimaryAction onClick={() => eventsService.downloadUpdate()}>
        Download
      </PrimaryAction>
      <SecondaryAction
        href={`https://github.com/spacemeshos/smapp/releases/tag/v${info.version}`}
        target="_blank"
      >
        Release notes
      </SecondaryAction>
      {isDowngrade && (
        <SwitchNetwork onClick={() => history.push(AuthPath.SwitchNetwork)}>
          Switch network
        </SwitchNetwork>
      )}
    </>
  );
};

const ProgressInfo = () => {
  const progress = useSelector(getProgressInfo);
  const isDownloaded = useSelector(isUpdateDownloaded);
  if (!progress && !isDownloaded) return null;
  const line = (() => {
    const downloaded = Math.round(
      (isDownloaded ? 100 : progress?.percent || 0) / 10
    );
    let line = '';
    for (let i = 0; i < 10; i += 1) {
      const suffix = downloaded > i ? '□' : '■';
      line += suffix;
    }
    return line;
  })();
  return (
    <>
      <ProgressChunk>{line}</ProgressChunk>
      <ProgressChunk>{progress?.percent || 0}%</ProgressChunk>
      {isDownloaded && (
        <PrimaryAction onClick={() => eventsService.installUpdate()}>
          Restart Smapp
        </PrimaryAction>
      )}
    </>
  );
};

const UpdateStatus = () => {
  const progress = useSelector(getProgressInfo);
  const isDownloading = useSelector(isUpdateDownloading);
  const isDownloaded = useSelector(isUpdateDownloaded);
  if (!isDownloading && !isDownloaded) return null;

  if (progress !== null) return <ProgressInfo />;
  // `download-progress` event might be not triggered due to some reasons
  // in this case we will render "downloading update..." message
  // without progress bar

  return (
    <>
      {isDownloading && <ProgressChunk>Downloading update...</ProgressChunk>}
      {isDownloaded && (
        <>
          <ProgressChunk>Update is ready to install</ProgressChunk>
          <PrimaryAction onClick={() => eventsService.installUpdate()}>
            Restart Smapp
          </PrimaryAction>
        </>
      )}
    </>
  );
};

const UpdateError = () => {
  const error = useSelector(getError);
  if (!error) return null;
  return <Error>{error.message}</Error>;
};

const Updater = () => {
  const updateInfo = useSelector(getUpdateInfo);
  const isDownloaded = useSelector(isUpdateDownloaded);
  const isDownloading = useSelector(isUpdateDownloading);
  if (!updateInfo) return null;

  const showUpdateStatus = isDownloaded || isDownloading;
  return (
    <>
      {showUpdateStatus ? <UpdateStatus /> : <UpdateInfo info={updateInfo} />}
      <UpdateError />
    </>
  );
};

const Version = () => {
  return (
    <Container>
      <Chunk>v{packageInfo.version}</Chunk>
      <Updater />
      <FeedbackButton />
    </Container>
  );
};

export default Version;
