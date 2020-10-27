// @flow
import { shell } from 'electron';
import React, { Component } from 'react';
import styled from 'styled-components';
import type { RouterHistory } from 'react-router-dom';
import { WrapperWith2SideBars, Button, Link, SmallHorizontalPanel } from '/basicComponents';
import { eventsService } from '/infra/eventsService';
import { smColors } from '/vars';

const Text = styled.span`
  margin-bottom: 10px;
  font-size: 16px;
  line-height: 22px;
  color: ${({ theme }) => (theme.isDarkModeOn ? smColors.white : smColors.realBlack)};
`;

const MiddleSectionRow = styled.div`
  display: flex;
  flex-direction: row;
`;

const BottomRow = styled(MiddleSectionRow)`
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: flex-end;
  justify-content: space-between;
`;

type Props = {
  history: RouterHistory
};

class FileBackup extends Component<Props> {
  render() {
    return (
      <WrapperWith2SideBars width={820} header="BACKUP EXISTING WALLET" subHeader="A wallet restore file has been saved.">
        <SmallHorizontalPanel />
        <Text>A restore file has been created in your documents folder.</Text>
        <Link onClick={this.showBackupFile} text="Browse file location" />
        <Text>You can use this file to restore your spacemesh wallet on any computer.</Text>
        <BottomRow>
          <Link onClick={this.openBackupGuide} text="BACKUP GUIDE" />
          <Button onClick={this.backToWalletRoot} text="GOT IT" width={95} />
        </BottomRow>
      </WrapperWith2SideBars>
    );
  }

  showBackupFile = () => {
    eventsService.showFileInFolder({ isBackupFile: true });
  };

  backToWalletRoot = () => {
    const { history } = this.props;
    history.push('/main/wallet');
  };

  openBackupGuide = () => shell.openExternal('https://testnet.spacemesh.io/#/backup');
}

export default FileBackup;
