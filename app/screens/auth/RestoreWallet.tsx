import React from 'react';
import { useHistory } from 'react-router';
import { CorneredContainer, BackButton } from '../../components/common';
import { captureReactBreadcrumb } from '../../sentry';
import { Button, Link } from '../../basicComponents';
import { AuthPath } from '../../routerPaths';
import { ExternalLinks } from '../../../shared/constants';

const btnStyle = { margin: '7px 0' };

const RestoreWallet = () => {
  const history = useHistory();
  const navigateToWalletGuide = () => {
    window.open(ExternalLinks.RestoreGuide);
    captureReactBreadcrumb({
      category: 'Restore wallet',
      data: {
        action: 'Navigate to wallet guide',
      },
      level: 'info',
    });
  };

  const navigateToOpenFromFile = () => {
    history.push(AuthPath.RecoverFromFile);
    captureReactBreadcrumb({
      category: 'Restore wallet',
      data: {
        action: 'Navigate to open from file',
      },
      level: 'info',
    });
  };

  const navigateToRestoreFrom12Words = () => {
    history.push(AuthPath.RecoverFromMnemonics);
    captureReactBreadcrumb({
      category: 'Unlock wallet',
      data: {
        action: 'Navigate to restore from 12 words',
      },
      level: 'info',
    });
  };

  const navigateToRestoreFrom24Words = () => {
    history.push(AuthPath.RecoverFromMnemonics, { wordsAmount: 24 });
    captureReactBreadcrumb({
      category: 'Unlock wallet',
      data: {
        action: 'Navigate to restore from 24 words',
      },
      level: 'info',
    });
  };

  return (
    <CorneredContainer
      width={650}
      height={400}
      header="OPEN AN EXISTING WALLET"
      subHeader="Open from a file or restore from 12 or 24 words"
    >
      <BackButton action={history.goBack} />
      <Button
        text="OPEN FROM FILE"
        isPrimary={false}
        onClick={navigateToOpenFromFile}
        width={250}
        style={btnStyle}
      />
      <Button
        text="RESTORE FROM 12 WORDS"
        isPrimary={false}
        onClick={navigateToRestoreFrom12Words}
        width={250}
        style={btnStyle}
      />
      <Button
        text="RESTORE FROM 24 WORDS"
        isPrimary={false}
        onClick={navigateToRestoreFrom24Words}
        width={250}
        style={btnStyle}
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
