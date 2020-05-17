import { shell } from 'electron';
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { restoreFile } from '/redux/wallet/actions';
import { BackButton } from '/components/common';
import { DragAndDrop } from '/components/auth';
import { WrapperWith2SideBars, Button, Link, SmallHorizontalPanel } from '/basicComponents';
import type { Action } from '/types';
import type { RouterHistory } from 'react-router-dom';

const DdArea = styled.div`
  display: flex;
  flex: 1;
  margin-bottom: 20px;
`;

const BottomSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
`;

type Props = {
  restoreFile: Action,
  history: RouterHistory
};

type State = {
  fileName: string,
  filePath: string,
  hasError: boolean
};

class FileRestore extends Component<Props, State> {
  state = {
    fileName: '',
    filePath: '',
    hasError: false
  };

  render() {
    const { history } = this.props;
    const { fileName, hasError } = this.state;
    return (
      <WrapperWith2SideBars width={800} height={480} header="RESTORE WALLET FROM FILE" subHeader="Locate wallet restore file.">
        <SmallHorizontalPanel />
        <BackButton action={history.goBack} />
        <DdArea>
          <DragAndDrop onFilesAdded={this.addFile} fileName={fileName} hasError={hasError} />
        </DdArea>
        <BottomSection>
          <Link onClick={this.navigateToBackupGuide} text="BACKUP GUIDE" />
          <Button onClick={this.openWalletFile} text="RESTORE" isDisabled={hasError || !fileName} />
        </BottomSection>
      </WrapperWith2SideBars>
    );
  }

  addFile = ({ fileName, filePath }) => {
    if (fileName.split('.').pop() !== 'json') {
      this.setState({ hasError: true });
    } else {
      this.setState({ fileName, filePath, hasError: false });
    }
  };

  openWalletFile = async () => {
    const { restoreFile, history } = this.props;
    const { fileName, filePath } = this.state;
    try {
      await restoreFile({ fileName, filePath });
      history.push('/auth/unlock');
    } catch {
      this.setState({ hasError: true });
    }
  };

  navigateToBackupGuide = () => shell.openExternal('https://testnet.spacemesh.io/#/backup?id=restoring-from-a-backup-file');
}

const mapDispatchToProps = {
  restoreFile
};

FileRestore = connect(null, mapDispatchToProps)(FileRestore);

export default FileRestore;
