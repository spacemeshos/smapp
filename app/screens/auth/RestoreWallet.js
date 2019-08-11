// @flow
import { shell } from 'electron';
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { Container } from '/components/common';
import { Button, Link, SecondaryButton } from '/basicComponents';
import { smallHorizontalSideBar } from '/assets/images';
import type { RouterHistory } from 'react-router-dom';

const SideBar = styled.img`
  position: absolute;
  top: -30px;
  right: 0;
  width: 55px;
  height: 15px;
`;

const Buttons = styled.div`
  margin-top: 30px;
`;

type Props = {
  history: RouterHistory
};

class RestoreWallet extends PureComponent<Props> {
  render() {
    const { history } = this.props;
    return (
      <Container width={650} height={400} header="RESTORE EXISTING WALLET" subHeader="choose how you&#39;d like to restore an existing wallet">
        <SideBar src={smallHorizontalSideBar} />
        <SecondaryButton onClick={history.goBack} imgName="chevronLeftWhite" imgWidth={10} imgHeight={15} style={{ position: 'absolute', bottom: 0, left: -35 }} />
        <Buttons>
          <Button text="Restore From File" isPrimary={false} onClick={() => history.push('/auth/file-restore')} width={250} style={{ marginBottom: 15 }} />
          <Button text="Restore With 12 Words" isPrimary={false} onClick={() => history.push('/auth/words-restore')} width={250} />
        </Buttons>
        <Link onClick={this.navigateToWalletGuide} text="WALLET GUIDE" style={{ marginTop: 'auto' }} />
      </Container>
    );
  }

  navigateToWalletGuide = () => shell.openExternal('https://testnet.spacemesh.io/');
}

export default RestoreWallet;
