import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { UpdateInfo as UpdateInfoT } from 'electron-updater';
import { ipcRenderer } from 'electron';
import { SemVer } from 'semver';

import {
  getError,
  getProgressInfo,
  getUpdateInfo,
  isUpdateDownloaded,
  isUpdateDownloading,
} from '../../redux/updater/selectors';
import { eventsService } from '../../infra/eventsService';
import { ipcConsts, smColors } from '../../vars';
import packageInfo from '../../../package.json';
import { AuthPath } from '../../routerPaths';
import { getNetworkInfo } from '../../redux/network/selectors';
import { checkUpdates as checkUpdatesIco } from '../../assets/images';
import { AppThDispatch } from '../../types';
import updaterSlice from '../../redux/updater/slice';
import { SECOND } from '../../../shared/constants';
import { Loader } from '../../basicComponents';
import UpdateApplicationWarningModal from '../../screens/modal/UpdateApplicationWarningModal';
import FeedbackButton from './Feedback';

const Container = styled.div`
  position: absolute;
  left: 32px;
  bottom: 15px;
  right: 52px;
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

const CheckUpdatesButton = styled.img`
  position: relative;
  bottom: -4px;
  display: flex;
  width: 16px;
  height: 16px;
  cursor: pointer;
  transition: all 0.4s linear;
  margin-right: 1em;

  &:hover,
  &:focus {
    transform: rotate(180deg);
  }
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

const ManualUpdateInfo = ({ version }: { version: string }) => {
  const history = useHistory();
  const curVersion = new SemVer(packageInfo.version);
  const isDowngrade = curVersion.compare(version) === 1;
  return (
    <>
      <Attractor />
      <Chunk>
        {isDowngrade
          ? `This network supports only v${version}`
          : `Update available: v${version}`}
      </Chunk>
      <SecondaryAction
        href={`https://github.com/spacemeshos/smapp/releases/tag/v${version}`}
        target="_blank"
      >
        Download
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
      <ProgressChunk>{Math.round(progress?.percent || 0)}% </ProgressChunk>
    </>
  );
};

const UpdateStatus = () => {
  const progress = useSelector(getProgressInfo);
  const isDownloading = useSelector(isUpdateDownloading);
  const isDownloaded = useSelector(isUpdateDownloaded);
  const error = useSelector(getError);
  const [
    isOpenUpdateApplicationWarningModal,
    setIsOpenUpdateApplicationWarningModal,
  ] = useState(false);
  const [
    showUpdateApplicationLoader,
    setShowUpdateApplicationLoader,
  ] = useState(false);

  const handleRestartNow = () => {
    setIsOpenUpdateApplicationWarningModal(false);
    setShowUpdateApplicationLoader(true);
    eventsService.installUpdate();

    setTimeout(() => {
      setShowUpdateApplicationLoader(false);
    }, 10 * SECOND);
  };

  const handlePostpone = () => {
    setIsOpenUpdateApplicationWarningModal(false);
  };

  if (!isDownloading && !isDownloaded) return null;

  if (progress !== null && !isDownloaded) {
    return <ProgressInfo />;
  } else if (isDownloading) {
    // `download-progress` event might be not triggered due to some reasons
    // in this case we will render "downloading update..." message
    // without progress bar
    return <ProgressChunk>Downloading update...</ProgressChunk>;
  } else if (isDownloaded && !error) {
    return (
      <>
        <ProgressChunk>Update is ready to install</ProgressChunk>
        <PrimaryAction
          onClick={() => setIsOpenUpdateApplicationWarningModal(true)}
        >
          Restart Smapp
        </PrimaryAction>
        <UpdateApplicationWarningModal
          isOpen={isOpenUpdateApplicationWarningModal}
          onApprove={handleRestartNow}
          onCancel={handlePostpone}
        />
        {showUpdateApplicationLoader && (
          <Loader size={Loader.sizes.BIG} note="UPDATE IN PROGESS..." />
        )}
      </>
    );
  }
  return null;
};

const UpdateError = () => {
  const error = useSelector(getError);
  const dispatch: AppThDispatch = useDispatch();
  if (!error) return null;
  return (
    <>
      <PrimaryAction onClick={() => dispatch(updaterSlice.actions.reset())}>
        Cancel
      </PrimaryAction>
      <Error>{error.message}</Error>
    </>
  );
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
    </>
  );
};

const ForceUpdateInfo = ({ updateInfo }: { updateInfo: UpdateInfoT }) => (
  <Attractor>Smapp is auto-updating to version {updateInfo.version}</Attractor>
);

const CheckForUpdates = () => {
  const updateInfo = useSelector(getUpdateInfo);
  const network = useSelector(getNetworkInfo);
  enum CheckState {
    Idle = 0,
    Checking,
    NoUpdates,
    HasUpdate,
    ManualUpdate,
  }
  const [curState, setCurState] = useState(CheckState.Idle);
  const [manualUpdateSmappVersion, setManualUpdateSmappVersion] = useState('');

  useEffect(() => {
    const handleManualUpdate = (_, version: string) => {
      setCurState(CheckState.ManualUpdate);
      setManualUpdateSmappVersion(version);
    };
    const handleNoUpdates = () => setCurState(CheckState.NoUpdates);
    const timer = setTimeout(() => setCurState(CheckState.Idle), 10 * 1000);
    ipcRenderer.on(ipcConsts.AU_NO_UPDATES_AVAILABLE, handleNoUpdates);
    ipcRenderer.on(ipcConsts.AU_DOWNLOAD_MANUALLY, handleManualUpdate);
    return () => {
      clearTimeout(timer);
      ipcRenderer.off(ipcConsts.AU_NO_UPDATES_AVAILABLE, handleNoUpdates);
      ipcRenderer.off(ipcConsts.AU_DOWNLOAD_MANUALLY, handleManualUpdate);
    };
  });

  if (updateInfo) return null;

  const checkUpdates = async () => {
    setCurState(CheckState.Checking);
    await eventsService.listNetworks();
    return eventsService.checkUpdates();
  };

  if (network.genesisID && curState === CheckState.Idle) {
    return (
      <CheckUpdatesButton
        src={checkUpdatesIco}
        onClick={checkUpdates}
        title="Check updates"
      />
    );
  } else if (curState === CheckState.Checking) {
    return <ProgressChunk>Checking for updates...</ProgressChunk>;
  } else if (curState === CheckState.NoUpdates) {
    return <ProgressChunk>No new updates available</ProgressChunk>;
  } else if (curState === CheckState.ManualUpdate) {
    return <ManualUpdateInfo version={manualUpdateSmappVersion} />;
  } else return null;
};

const Version = () => {
  const [forceUpdateInfo, setForceUpdateInfo] = useState<UpdateInfoT | null>(
    null
  );

  useEffect(() => {
    const handler = (_, nextUpdateInfo) => setForceUpdateInfo(nextUpdateInfo);
    ipcRenderer.on(ipcConsts.AU_FORCE_UPDATE_STARTED, handler);
    return () => {
      ipcRenderer.off(ipcConsts.AU_FORCE_UPDATE_STARTED, handler);
    };
  });

  return (
    <Container>
      <Chunk>v{packageInfo.version}</Chunk>
      {forceUpdateInfo && <ForceUpdateInfo updateInfo={forceUpdateInfo} />}
      {!forceUpdateInfo && <CheckForUpdates />}
      <Updater />
      <UpdateError />
      <FeedbackButton />
    </Container>
  );
};

export default Version;
