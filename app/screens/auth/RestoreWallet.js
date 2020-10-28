// @flow
import { shell } from 'electron';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { CorneredContainer, BackButton } from '/components/common';
import { Button, Link, SmallHorizontalPanel } from '/basicComponents';
import type { RouterHistory } from 'react-router-dom';

const btnStyle = { margin: '30px 0 15px' };

type Props = {
  history: RouterHistory,
  isDarkModeOn: boolean
};

class RestoreWallet extends PureComponent<Props> {
  render() {
    const { history, isDarkModeOn } = this.props;
    return (
      <CorneredContainer width={650} height={400} header="RESTORE AN EXISTING WALLET" subHeader="Choose how you&#39;d like to restore your wallet." isDarkModeOn={isDarkModeOn}>
        <SmallHorizontalPanel />
        <BackButton action={history.goBack} />
        <Button text="RESTORE FROM FILE" isPrimary={false} onClick={() => history.push('/auth/file-restore')} width={250} style={btnStyle} />
        <Button text="RESTORE FROM 12 WORDS" isPrimary={false} onClick={() => history.push('/auth/words-restore')} width={250} />
        <Link onClick={this.navigateToWalletGuide} text="WALLET GUIDE" style={{ marginTop: 'auto', marginRight: 'auto' }} />
      </CorneredContainer>
    );
  }

  navigateToWalletGuide = () => shell.openExternal('https://testnet.spacemesh.io/');
}


const mapStateToProps = (state) => ({
  isDarkModeOn: state.ui.isDarkMode
});

RestoreWallet = connect(mapStateToProps, null)(RestoreWallet);
export default RestoreWallet;
