// @flow
import { shell } from 'electron';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import type { RouterHistory } from 'react-router-dom';
import { WrapperWith2SideBars, Button, Link } from '/basicComponents';
import { smallHorizontalSideBar } from '/assets/images';
import { fileSystemService } from '/infra/fileSystemService';
import { localStorageService } from '/infra/storageService';
import type { WalletMeta } from '/types';

const Text = styled.span`
  font-size: 16px;
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
  history: RouterHistory,
  wallet: WalletMeta
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
          <Link onClick={this.openBackupGuide} text="BACKUP GUIDE" />
          <Button onClick={this.backToWalletRoot} text="GOT IT" width={95} />
        </BottomRow>
      </WrapperWith2SideBars>
    );
  }

  showBackupFile = () => {
    const lastBackupTime = localStorageService.get('lastBackupTime');
    fileSystemService.openWalletBackupDirectory({ lastBackupTime });
  };

  backToWalletRoot = () => {
    const { history } = this.props;
    history.push('/main/wallet');
  };

  openBackupGuide = () => shell.openExternal('https://testnet.spacemesh.io/#/backup');
}

const mapStateToProps = (state) => ({
  wallet: state.wallet
});

FileBackup = connect<any, any, _, _, _, _>(mapStateToProps)(FileBackup);
export default FileBackup;
