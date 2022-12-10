import React from 'react';
import { CorneredContainer, BackButton } from '../../components/common';
import { Button, Link } from '../../basicComponents';
import { AuthPath } from '../../routerPaths';
import { ExternalLinks } from '../../../shared/constants';
import { AuthRouterParams } from './routerParams';

const btnStyle = { margin: '30px 0 15px' };

const RestoreWallet = ({ history }: AuthRouterParams) => {
  const navigateToWalletGuide = () => window.open(ExternalLinks.RestoreGuide);

  return (
    <CorneredContainer
      width={650}
      height={400}
      header="OPEN AN EXISTING WALLET"
      subHeader="Open from a file or restore from 12 words"
    >
      <BackButton action={history.goBack} />
      <Button
        text="OPEN FROM FILE"
        isPrimary={false}
        onClick={() => history.push(AuthPath.RecoverFromFile)}
        width={250}
        style={btnStyle}
      />
      <Button
        text="RESTORE FROM 12 WORDS"
        isPrimary={false}
        onClick={() => history.push(AuthPath.RecoverFromMnemonics)}
        width={250}
      />
      <Link
        onClick={navigateToWalletGuide}
        text="WALLET GUIDE"
        style={{ marginTop: 'auto', marginRight: 'auto' }}
      />
    </CorneredContainer>
  );
};

export default RestoreWallet;
