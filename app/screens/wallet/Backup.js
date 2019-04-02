// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { smColors } from '/vars';
import { shieldIconGreenOne, shieldIconOrangeTwo } from '/assets/images';

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

const BaseText = styled.span`
  font-size: 16px;
  font-weight: normal;
  line-height: 22px;
  color: ${smColors.lighterBlack};
`;

const TextContentSection = styled(BaseText)`
  margin-bottom: 42px;
`;

const SubHeader = styled(BaseText)`
  margin-bottom: 24px;
`;

const BoldBackupOptiosHeader = styled(BaseText)`
  font-weight: bold;
  margin-bottom: 24px;
`;

const GrayText = styled(BaseText)`
  color: ${smColors.darkGray};
`;

const Separator = styled.div`
  border-bottom: 1px solid ${smColors.borderGray};
  margin-bottom: 24px;
`;

const BackupBoxesWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 24px;
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
  justify-content: flex-start;
  margin-bottom: 40px;
`;

const SecurityLogo = styled.img`
  height: 66px;
  width: 54px;
  margin-right: 30px;
`;

const BackupHeader = styled.span`
  font-size: 24px;
  font-weight: bold;
  line-height: 33px;
  color: ${smColors.darkGray};
`;

const BackupTitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Recommended = styled.div`
  align-self: flex-end;
  padding-left: 24px;
`;

const backupBoxContent = {
  bodyText: {
    file: 'Take your wallet file and save a copy of it in a secure location - We recommend a USB key or a external drive.',
    mnemonic: 'A list of words you keep on a physical paper or in your password manager, that can be used to recover your wallet on any device.'
  },
  noteText: {
    file: 'NOTE: You will still need your passphrase to restore the wallet from the file.',
    mnemonic: 'NOTE: Works even if you lost your passphrase or wallet backup file'
  },
  shieldLogo: {
    file: shieldIconGreenOne,
    mnemonic: shieldIconOrangeTwo
  },
  securityLevel: {
    file: 'Basic Security',
    mnemonic: 'Enhanced Security'
  },
  backupMode: {
    file: 'File Backup',
    mnemonic: '12 Words Backup'
  },
  linkText: {
    file: 'Show me the wallet file',
    mnemonic: 'Create a paper backup'
  }
};

type Props = {};

class Backup extends Component<Props> {
  render() {
    return (
      <Wrapper>
        <Header>Wallet Backup</Header>
        <SubHeader>Your wallet file is encrypted with your passphrase on your computer, but We recommend that you’ll backup your wallet for additional security.</SubHeader>
        <Separator />
        <BoldBackupOptiosHeader>How would you like to backup your wallet?</BoldBackupOptiosHeader>
        <BackupBoxesWrapper>
          {this.renderBackupBox('file')}
          {this.renderBackupBox('mnemonic')}
        </BackupBoxesWrapper>
        <ActionLink onClick={this.learnMoreAboutSecurity} color={smColors.green}>
          Learn more about wallet security and backup
        </ActionLink>
      </Wrapper>
    );
  }

  renderBackupBox = (mode: 'file' | 'mnemonic') => {
    const isFileMode = mode === 'file';
    const linkAction = isFileMode ? this.showWalletFile : this.createPaperBackup;

    return (
      <BackupBox borderColor={isFileMode ? smColors.green : smColors.orange}>
        <BackupTopWrapper>
          <SecurityLogo src={backupBoxContent.shieldLogo[mode]} />
          <BackupTitleWrapper>
            <GrayText>{backupBoxContent.securityLevel[mode]}</GrayText>
            <BackupHeader>{backupBoxContent.backupMode[mode]}</BackupHeader>
          </BackupTitleWrapper>
          {mode === 'mnemonic' && (
            <Recommended>
              <GrayText>Recommended</GrayText>
            </Recommended>
          )}
        </BackupTopWrapper>
        <TextContentSection>{backupBoxContent.bodyText[mode]}</TextContentSection>
        <TextContentSection>{backupBoxContent.noteText[mode]}</TextContentSection>
        <ActionLink onClick={linkAction} color={isFileMode ? smColors.green : smColors.orange}>
          {backupBoxContent.linkText[mode]}
        </ActionLink>
      </BackupBox>
    );
  };

  createPaperBackup = () => {};

  showWalletFile = () => {};

  learnMoreAboutSecurity = () => {};
}

export default Backup;
