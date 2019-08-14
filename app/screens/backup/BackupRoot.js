// @flow
import { shell } from 'electron';
import React, { Component } from 'react';
import styled from 'styled-components';
import type { RouterHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { WrapperWith2SideBars, Button, Link } from '/basicComponents';
import { fileEncryptionService } from '/infra/fileEncryptionService';
import { fileSystemService } from '/infra/fileSystemService';
import { localStorageService } from '/infra/storageService';
import { bottomLeftCorner, bottomRightCorner, topLeftCorner, topRightCorner, smallHorizontalSideBar } from '/assets/images';
import type { WalletMeta } from '/types';
import smColors from '/vars/colors';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const SmallText = styled.span`
  font-size: 12px;
  font-weight: normal;
  line-height: 20px;
  margin-bottom: 6px;
`;

const GreenText = styled(SmallText)`
  color: ${smColors.green};
`;

const Text = styled.span`
  font-size: 16px;
  font-weight: normal;
  line-height: 22px;
`;

const BoldText = styled(Text)`
  font-weight: bold;
  margin-bottom: 48px;
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 10px;
`;

const RightSection = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
`;

const TopLeftCorner = styled.img`
  position: absolute;
  top: -5px;
  left: -5px;
  width: 8px;
  height: 8px;
`;

const TopRightCorner = styled.img`
  position: absolute;
  top: -5px;
  right: -5px;
  width: 8px;
  height: 8px;
`;

const BottomLeftCorner = styled.img`
  position: absolute;
  bottom: -5px;
  left: -5px;
  width: 8px;
  height: 8px;
`;

const BottomRightCorner = styled.img`
  position: absolute;
  bottom: -5px;
  right: -5px;
  width: 8px;
  height: 8px;
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
  width: 502px;
  height: 100%;
  padding: 25px 15px 15px 15px;
  background-color: ${smColors.black02Alpha};
`;

const MiddleSectionRow = styled.div`
  display: flex;
  flex-direction: row;
`;

const BottomSection = styled(MiddleSectionRow)`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: flex-end;
`;

const BottomRow = styled(MiddleSectionRow)`
  justify-content: space-between;
`;

type Props = {
  wallet: WalletMeta,
  history: RouterHistory
};

class BackupRoot extends Component<Props> {
  render() {
    return (
      <Wrapper>
        <LeftSection>
          <WrapperWith2SideBars width={300} height={480} header="BACKUP">
            <BoldText>How would you like to backup your wallet?</BoldText>
            <Text>Your wallet is encrypted with your password on your computer, but we recommend you backup your wallet for additional security.</Text>
          </WrapperWith2SideBars>
        </LeftSection>
        <RightSection>
          <TopLeftCorner src={topLeftCorner} />
          <TopRightCorner src={topRightCorner} />
          <BottomLeftCorner src={bottomLeftCorner} />
          <BottomRightCorner src={bottomRightCorner} />
          <HorizontalBar src={smallHorizontalSideBar} />
          <MiddleSection>
            <MiddleSectionRow>
              <SmallText style={{ marginRight: 24, width: 224 }}>Basic Security</SmallText>
              <SmallText style={{ width: 224 }}>
                Advanced Security <GreenText>(Recommended)</GreenText>
              </SmallText>
            </MiddleSectionRow>
            <MiddleSectionRow>
              <Button onClick={this.backupWallet} text="File Backup" isPrimary={false} width={224} style={{ marginRight: 24 }} />
              <Button onClick={this.navigateTo12WordsBackup} text="12 Words Backup" isPrimary={false} width={224} />
            </MiddleSectionRow>
            <BottomSection>
              <BottomRow>
                <Link onClick={this.openBackupGuide} text="BACKUP GUIDE" style={{ paddingTop: 26 }} />
              </BottomRow>
            </BottomSection>
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
    const { wallet, history } = this.props;
    try {
      const { meta, accounts, mnemonic, transactions, contacts, fileKey } = wallet;
      const encryptedAccountsData = fileEncryptionService.encryptData({ data: JSON.stringify({ mnemonic, accounts }), key: fileKey });
      const encryptedWallet = { meta, crypto: { cipher: 'AES-128-CTR', cipherText: encryptedAccountsData }, transactions, contacts };
      const fileName = `Wallet_Backup_${Date().toString()}.json`;
      await fileSystemService.saveFile({ fileName, fileContent: JSON.stringify(encryptedWallet), showDialog: false, saveToDocumentsFolder: true });
      localStorageService.set('hasBackup', true);
      localStorageService.set('lastBackupFileName', fileName);
      history.push('/main/backup/file-backup');
    } catch (error) {
      throw new Error(error);
    }
  };

  learnMoreAboutSecurity = () => shell.openExternal('https://testnet.spacemesh.io');

  openBackupGuide = () => shell.openExternal('https://testnet.spacemesh.io/#/backup');
}

const mapStateToProps = (state) => ({
  wallet: state.wallet
});

BackupRoot = connect<any, any, _, _, _, _>(mapStateToProps)(BackupRoot);
export default BackupRoot;
