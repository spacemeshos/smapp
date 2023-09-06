import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { ExternalLinks } from '../../../shared/constants';
import { eventsService } from '../../infra/eventsService';
import Modal from '../../components/common/Modal';
import { Button, Link } from '../../basicComponents';
import {
  isWindows as isWindowsSelector,
  isLinux as isLinuxSelector,
  isMacOS as isMacOSSelector,
} from '../../redux/ui/selectors';

const ListContainer = styled.ol`
  padding: 20px;
  list-style: decimal;

  li {
    padding: 5px 0;
    line-height: 21px;
  }
`;

const ModalFooterContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 10px;
`;

const ErrorCheckListModal = ({ onClose }: { onClose: () => void }) => {
  const isWindows = useSelector(isWindowsSelector);
  const isLinux = useSelector(isLinuxSelector);
  const isMacOS = useSelector(isMacOSSelector);
  const openDiscord = () => window.open(ExternalLinks.Discord);
  const openSmappIssuePage = () =>
    window.open(ExternalLinks.GithubSMAppIssuePage);

  const navigateToOpenWindowsCLInstallationGuide = () =>
    window.open(ExternalLinks.OpenCLWindowsInstallGuide);
  const navigateToOpenUbuntuCLInstallationGuide = () =>
    window.open(ExternalLinks.OpenCLUbuntuInstallGuide);
  const navigateToRedistInstallationGuide = () =>
    window.open(ExternalLinks.RedistWindowsInstallOfficialSite);
  const openLogFile = () => {
    eventsService.showFileInFolder({ isLogFile: true });
  };
  return (
    <Modal header="NODE ERROR CHECKLIST" width={650} height={450}>
      <ListContainer>
        {!isMacOS && (
          <li>
            Please ensure that you have installed:{' '}
            {isLinux && (
              <Link
                onClick={navigateToOpenUbuntuCLInstallationGuide}
                text="OPEN CL"
                style={{ display: 'inline-block' }}
              />
            )}
            {isWindows && (
              <>
                <Link
                  onClick={navigateToOpenWindowsCLInstallationGuide}
                  text="OPEN CL"
                  style={{ display: 'inline-block' }}
                />{' '}
                and{' '}
                <Link
                  onClick={navigateToRedistInstallationGuide}
                  text="REDIST PACKAGE"
                  style={{ display: 'inline-block' }}
                />
              </>
            )}
          </li>
        )}
        <li>
          Check your firewall settings and ensure that your ports are open.
        </li>
        <li>Update your GPU drivers.</li>
        <li>
          Please check for ERROR and FATAL messages and investigate them on your
          end{' '}
          <Link
            onClick={openLogFile}
            text="BROWSE LOG FILE."
            style={{ display: 'inline-block' }}
          />
        </li>
      </ListContainer>
      <p>
        If none of these solutions have worked, please do not hesitate to report
        the error or seek help on{' '}
        <Link
          onClick={openDiscord}
          text="DISCORD."
          style={{ display: 'inline-block' }}
        />
      </p>
      <p>
        Alternatively, you can submit your logs on GitHub if you have an account
        there{' '}
        <Link
          onClick={openSmappIssuePage}
          text="OPEN ISSUE."
          style={{ display: 'inline-block' }}
        />
      </p>
      <ModalFooterContainer>
        <Button onClick={onClose} text="CLOSE" />
      </ModalFooterContainer>
    </Modal>
  );
};

export default ErrorCheckListModal;
