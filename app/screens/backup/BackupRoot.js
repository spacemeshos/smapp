// @flow
import { shell } from 'electron';
import React, { Component } from 'react';
import styled from 'styled-components';
import type { RouterHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { backupWallet } from '/redux/wallet/actions';
import { WrapperWith2SideBars, Button, Link, CorneredWrapper } from '/basicComponents';
import { smallHorizontalSideBar } from '/assets/images';
import type { Action } from '/types';
import smColors from '/vars/colors';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const SmallText = styled.span`
  font-size: 12px;
  line-height: 20px;
  margin-bottom: 6px;
  flex: 1;
`;

const GreenText = styled(SmallText)`
  color: ${smColors.green};
`;

const Text = styled.span`
  font-size: 16px;
  line-height: 22px;
`;

const BoldText = styled(Text)`
  font-family: SourceCodeProBold;
  margin-bottom: 50px;
`;

const RightSection = styled(CorneredWrapper)`
  position: relative;
  display: flex;
  flex-direction: row;
`;

const HorizontalBar = styled.img`
  position: absolute;
  top: -25px;
  right: 0;
  width: 70px;
  height: 15px;
`;

const MiddleSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 500px;
  height: 100%;
  padding: 25px 15px 15px 15px;
  background-color: ${smColors.black02Alpha};
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
  backupWallet: Action,
  history: RouterHistory
};

class BackupRoot extends Component<Props> {
  render() {
    return (
      <Wrapper>
        <WrapperWith2SideBars width={300} height={360} header="BACKUP" style={{ marginRight: 10 }}>
          <BoldText>How would you like to backup your wallet?</BoldText>
          <Text>Your wallet is encrypted with your password on your computer, but we recommend you backup your wallet for additional security.</Text>
        </WrapperWith2SideBars>
        <RightSection>
          <HorizontalBar src={smallHorizontalSideBar} />
          <MiddleSection>
            <MiddleSectionRow>
              <SmallText style={{ marginRight: 22 }}>Basic Security</SmallText>
              <SmallText>
                Advanced Security <GreenText>(Recommended)</GreenText>
              </SmallText>
            </MiddleSectionRow>
            <MiddleSectionRow>
              <Button onClick={this.backupWallet} text="File Backup" isPrimary={false} isContainerFullWidth style={{ marginRight: 22 }} />
              <Button onClick={this.navigateTo12WordsBackup} text="12 Words Backup" isPrimary={false} isContainerFullWidth />
            </MiddleSectionRow>
            <BottomRow>
              <Link onClick={this.openBackupGuide} text="BACKUP GUIDE" />
            </BottomRow>
          </MiddleSection>
        </RightSection>
      </Wrapper>
    );
  }

  navigateTo12WordsBackup = () => {
    const { history } = this.props;
    history.push('/main/backup/twelve-words-backup');
  };

  backupWallet = async () => {
    const { history, backupWallet } = this.props;
    try {
      await backupWallet();
      history.push('/main/backup/file-backup');
    } catch (error) {
      this.setState(() => {
        throw error;
      });
    }
  };

  openBackupGuide = () => shell.openExternal('https://testnet.spacemesh.io/#/backup');
}

const mapDispatchToProps = {
  backupWallet
};

BackupRoot = connect<any, any, _, _, _, _>(
  null,
  mapDispatchToProps
)(BackupRoot);
export default BackupRoot;
