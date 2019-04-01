// @flow
import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import { smColors } from '/vars';
import { shieldIconGreenOne, shieldIconOrangeTwo } from '/assets/images';

const Actionable = css`
  &:hover {
    opacity: 0.8;
  }
  &:active {
    opacity: 0.6;
  }
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
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

const BoldText = styled(BaseText)`
  font-weight: bold;
`;

const GrayText = styled(BaseText)`
  color: ${smColors.darkGray};
`;

const Separator = styled.div`
  border-bottom: 1px solid ${smColors.borderGray};
  margin: 12px 0;
`;

const BackupBoxesWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 12px 0;
`;

// $FlowStyledIssue
const ActionLink = styled(BaseText)`
  user-select: none;
  color: ${({ theme }) => (theme === 'orange' ? smColors.orange : smColors.green)};
  cursor: pointer;
  ${Actionable}
`;

// $FlowStyledIssue
const BackupBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  ${({ borderColor }) =>
    borderColor &&
    `
    border: 1px solid ${borderColor};
    
    `}
  /* max-width: 468px; */
  height: 384px;
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

type Props = {};

class Backup extends Component<Props> {
  render() {
    return (
      <Wrapper>
        <Header>Wallet Backup</Header>
        <BaseText>Your wallet file is encrypted with your passphrase on your computer, but We recommend that you’ll backup your wallet for additional security.</BaseText>
        <Separator />
        <BoldText>How would you like to backup your wallet?</BoldText>
        <BackupBoxesWrapper>
          {this.renderBackupBox('file')}
          {this.renderBackupBox('mnemonic')}
        </BackupBoxesWrapper>
        <ActionLink onClick={this.learnMoreAboutSecurity}>Learn more about wallet security and backup</ActionLink>
      </Wrapper>
    );
  }

  renderBackupBox = (mode: 'file' | 'mnemonic') => {
    const shieldLogo = mode === 'file' ? shieldIconGreenOne : shieldIconOrangeTwo;
    const securityLevel = `${mode === 'file' ? 'Basic' : 'Enhanced'} Security`;
    const backupMode = `${mode === 'file' ? 'File' : '12 Words'} Backup`;
    const bodyText = {
      file: 'Take your wallet file and save a copy of it in a secure location - We recommend a USB key or a external drive.',
      mnemonic: 'A list of words you keep on a physical paper or in your password manager, that can be used to recover your wallet on any device.'
    };
    const noteText = {
      file: 'NOTE: You will still need your passphrase to restore the wallet from the file.',
      mnemonic: 'NOTE: Works even if you lost your passphrase or wallet backup file'
    };
    const linkText = mode === 'file' ? 'Show me the wallet file' : 'Create a paper backup';
    const linkActions = {
      file: this.showWalletFile,
      mnemonic: this.createPaperBackup
    };

    return (
      <BackupBox borderColor={mode === 'file' ? smColors.green : smColors.orange}>
        <BackupTopWrapper>
          <SecurityLogo src={shieldLogo} />
          <BackupTitleWrapper>
            <GrayText>{securityLevel}</GrayText>
            <BackupHeader>{backupMode}</BackupHeader>
          </BackupTitleWrapper>
          {mode === 'mnemonic' && (
            <Recommended>
              <GrayText>Recommended</GrayText>
            </Recommended>
          )}
        </BackupTopWrapper>
        <BaseText>{bodyText[mode]}</BaseText>
        <BaseText>{noteText[mode]}</BaseText>
        <ActionLink onClick={linkActions[mode]} theme={mode === 'file' ? 'green' : 'orange'}>
          {linkText}
        </ActionLink>
      </BackupBox>
    );
  };

  createPaperBackup = () => {};

  showWalletFile = () => {};

  learnMoreAboutSecurity = () => {};
}

export default Backup;
