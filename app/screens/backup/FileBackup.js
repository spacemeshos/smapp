// @flow
import { shell } from 'electron';
import React, { Component } from 'react';
import styled from 'styled-components';
import type { RouterHistory } from 'react-router-dom';
import { WrapperWith2SideBars, Button, Link } from '/basicComponents';
import { smallHorizontalSideBar } from '/assets/images';
import { fileSystemService } from '/infra/fileSystemService';

const Text = styled.span`
  font-size: 16px;
  font-weight: normal;
  line-height: 22px;
`;

const BoldText = styled(Text)`
  font-family: SourceCodeProBold;
  margin-bottom: 24px;
`;

const HorizontalBarWrapper = styled.div`
  position: relative;
`;

const HorizontalBar = styled.img`
  position: absolute;
  top: -95px;
  right: -28px;
  width: 70px;
  height: 15px;
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
      <WrapperWith2SideBars width={820} height={370} header="BACKUP EXISTING WALLET">
        <HorizontalBarWrapper>
          <HorizontalBar src={smallHorizontalSideBar} />
        </HorizontalBarWrapper>
        <BoldText>A restore file has been downloaded to your computer.</BoldText>
        <Link onClick={this.showBackupFile} text="Show me where it is!" />
        <Text>You can use this file to restore your spacemesh wallet in another location.</Text>
        <BottomRow>
          <Link onClick={this.openBackupGuide} text="BACKUP GUIDE" style={{ paddingTop: 26 }} />
          <Button onClick={this.backToWalletRoot} text="GOT IT" width={95} />
        </BottomRow>
      </WrapperWith2SideBars>
    );
  }

  showBackupFile = () => fileSystemService.openWalletBackupDirectory({ showLastBackup: true });

  backToWalletRoot = () => {
    const { history } = this.props;
    history.push('/main/wallet');
  };

  openBackupGuide = () => shell.openExternal('https://testnet.spacemesh.io/#/backup');
}

export default FileBackup;
