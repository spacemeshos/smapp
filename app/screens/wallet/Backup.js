// @flow
import { shell } from 'electron';
import React, { Component } from 'react';
import styled from 'styled-components';
import type { RouterHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { fileEncryptionService } from '/infra/fileEncryptionService';
import { fileSystemService } from '/infra/fileSystemService';
import { localStorageService } from '/infra/storageServices';
import { smColors } from '/vars';
import { shieldIconGreenOne, shieldIconOrangeTwo } from '/assets/images';
import type { WalletMeta } from '/types';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 50px;
`;

const Header = styled.span`
  font-size: 31px;
  font-weight: bold;
  line-height: 42px;
  color: ${smColors.lighterBlack};
  margin-bottom: 20px;
`;

const HeaderExplanation = styled.div`
  font-size: 16px;
  color: ${smColors.lighterBlack};
  line-height: 30px;
  margin-bottom: 25px;
`;

const Separator = styled.div`
  border-bottom: 1px solid ${smColors.borderGray};
  margin-bottom: 25px;
`;

const SubHeader = styled.div`
  font-size: 16px;
  font-weight: bold;
  line-height: 30px;
  color: ${smColors.lighterBlack};
  margin-bottom: 25px;
`;

const BackupBoxesWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 25px;
`;

// $FlowStyledIssue
const BackupBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid ${({ borderColor }) => borderColor};
  flex: 1;
  &:first-child {
    margin-right: 16px;
  }
  border-radius: 2px;
  padding: 24px 18px;
`;

const BackupTopWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  margin-bottom: 40px;
`;

const SecurityLogo = styled.img`
  height: 66px;
  width: 54px;
  margin-right: 30px;
`;

const BackupTitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const BaseText = styled.span`
  font-size: 16px;
  font-weight: normal;
  line-height: 22px;
  color: ${smColors.lighterBlack};
`;

const GrayText = styled(BaseText)`
  color: ${smColors.darkGray};
`;

const BackupHeader = styled.span`
  font-size: 24px;
  font-weight: bold;
  line-height: 33px;
  color: ${smColors.darkGray};
`;

const RecommendedText = styled.div`
  font-size: 16px;
  line-height: 22px;
  color: ${smColors.darkGray50Alpha};
  margin-left: 25px;
`;

const TextContentSection = styled(BaseText)`
  margin-bottom: 40px;
`;

// $FlowStyledIssue
const ActionLink = styled(BaseText)`
  user-select: none;
  color: ${({ color }) => color};
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
  &:active {
    opacity: 0.6;
  }
`;

const content = {
  file: {
    text: 'Take your wallet file and save a copy of it in a secure location - We recommend a USB key or a external drive.',
    note: 'NOTE: You will still need your passphrase to restore the wallet from the file.',
    icon: shieldIconGreenOne,
    securityLevel: 'Basic Security',
    backup: 'File Backup',
    actionText: 'Show me the wallet file',
    color: smColors.green
  },
  '12words': {
    text: 'A list of words you keep on a physical paper or in your password manager, that can be used to recover your wallet on any device.',
    note: 'NOTE: Works even if you lost your passphrase or wallet backup file',
    icon: shieldIconOrangeTwo,
    securityLevel: 'Enhanced Security',
    backup: '12 Words Backup',
    actionText: 'Create a paper backup',
    color: smColors.orange
  }
};

type Props = {
  wallet: WalletMeta,
  history: RouterHistory
};

class Backup extends Component<Props> {
  render() {
    return (
      <Wrapper>
        <Header>Wallet Backup</Header>
        <HeaderExplanation>
          Your wallet file is encrypted with your passphrase on your computer, but We recommend that you’ll backup your wallet for additional security.
        </HeaderExplanation>
        <Separator />
        <SubHeader>How would you like to backup your wallet?</SubHeader>
        <BackupBoxesWrapper>
          {this.renderBackupBox('file')}
          {this.renderBackupBox('12words')}
        </BackupBoxesWrapper>
        <ActionLink onClick={this.learnMoreAboutSecurity} color={smColors.green}>
          Learn more about wallet security and backup
        </ActionLink>
      </Wrapper>
    );
  }

  renderBackupBox = (mode: 'file' | '12words') => {
    const linkAction = mode === 'file' ? this.backupWallet : this.navigateTo12WordsBackup;
    return (
      <BackupBox borderColor={content[mode].color}>
        <BackupTopWrapper>
          <SecurityLogo src={content[mode].icon} />
          <BackupTitleWrapper>
            <GrayText>{content[mode].securityLevel}</GrayText>
            <BackupHeader>{content[mode].backup}</BackupHeader>
          </BackupTitleWrapper>
          {mode === '12words' && <RecommendedText>Recommended</RecommendedText>}
        </BackupTopWrapper>
        <TextContentSection>{content[mode].text}</TextContentSection>
        <TextContentSection>{content[mode].note}</TextContentSection>
        <ActionLink onClick={linkAction} color={content[mode].color}>
          {content[mode].actionText}
        </ActionLink>
      </BackupBox>
    );
  };

  navigateTo12WordsBackup = () => {
    const { history } = this.props;
    history.push('/main/wallet/twelve-words-backup');
  };

  backupWallet = async () => {
    const { wallet, history } = this.props;
    try {
      const { meta, accounts, mnemonic, transactions, contacts, fileKey } = wallet;
      const encryptedAccountsData = fileEncryptionService.encryptData({ data: JSON.stringify({ mnemonic, accounts }), key: fileKey });
      const encryptedWallet = { meta, crypto: { cipher: 'AES-128-CTR', cipherText: encryptedAccountsData }, transactions, contacts };
      await fileSystemService.saveFile({ fileContent: JSON.stringify(encryptedWallet), showDialog: true });
      localStorageService.set('hasBackup', true);
      history.goBack();
    } catch (error) {
      throw new Error(error);
    }
  };

  learnMoreAboutSecurity = () => shell.openExternal('https://testnet.spacemesh.io'); // TODO: connect to actual link
}

const mapStateToProps = (state) => ({
  wallet: state.wallet
});

Backup = connect(mapStateToProps)(Backup);

export default Backup;
