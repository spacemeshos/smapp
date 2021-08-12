import React from 'react';
import { useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { CorneredContainer, BackButton } from '../../components/common';
import { Button, Link } from '../../basicComponents';
import { RootState } from '../../types';

const btnStyle = { margin: '30px 0 15px' };

const RestoreWallet = ({ history }: RouteComponentProps) => {
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

  const navigateToWalletGuide = () => window.open('https://testnet.spacemesh.io/');

  return (
    <CorneredContainer width={650} height={400} header="RESTORE AN EXISTING WALLET" subHeader="Choose how you&#39;d like to restore your wallet." isDarkMode={isDarkMode}>
      <BackButton action={history.goBack} />
      <Button text="RESTORE FROM FILE" isPrimary={false} onClick={() => history.push('/auth/file-restore')} width={250} style={btnStyle} />
      <Button text="RESTORE FROM 12 WORDS" isPrimary={false} onClick={() => history.push('/auth/words-restore')} width={250} />
      <Link onClick={navigateToWalletGuide} text="WALLET GUIDE" style={{ marginTop: 'auto', marginRight: 'auto' }} />
    </CorneredContainer>
  );
};

export default RestoreWallet;
