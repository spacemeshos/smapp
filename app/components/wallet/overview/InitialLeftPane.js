// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { backup } from '/assets/images';
import { smColors } from '/vars';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Image = styled.img`
  width: 330px;
  height: 190px;
  margin-bottom: 30px;
`;

const Text = styled.div`
  font-size: 16px;
  line-height: 30px;
  color: ${smColors.lighterBlack};
  margin-bottom: 15px;
`;

const LinkBtn = styled.div`
  font-size: 16px;
  line-height: 30px;
  color: ${smColors.green};
  margin-bottom: 30px;
  text-align: left;
  cursor: pointer;
`;

type Props = {
  navigateToBackup: () => void,
  navigateToBackupExplanation: () => void
};

class InitialLeftPane extends PureComponent<Props> {
  render() {
    const { navigateToBackup, navigateToBackupExplanation } = this.props;
    return (
      <Wrapper>
        <Image src={backup} />
        <Text>Your wallet file is encrypted with your Passphrase on your computer, but we recommend that you’ll backup your wallet for additional security.</Text>
        <LinkBtn onClick={navigateToBackup}>Backup your wallet</LinkBtn>
        <LinkBtn onClick={navigateToBackupExplanation}>Learn more about wallet security and backup</LinkBtn>
      </Wrapper>
    );
  }
}

export default InitialLeftPane;
