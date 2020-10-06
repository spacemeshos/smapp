// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { Link } from '/basicComponents';
import { posDirectoryBlack, posDirectoryWhite } from '/assets/images';
import { eventsService } from '/infra/eventsService';
import { formatBytes } from '/infra/utils';
import { smColors } from '/vars';
import PoSFooter from './PoSFooter';
import type { NodeStatus } from '/types';

const isDarkModeOn = localStorage.getItem('dmMode') === 'true';
const icon = isDarkModeOn ? posDirectoryWhite : posDirectoryBlack;

const Wrapper = styled.div`
  flex-direction: row;
  padding: 15px 25px;
  background-color: ${smColors.disabledGray10Alpha};
  border-top: 1px solid ${isDarkModeOn ? smColors.white : smColors.realBlack};
  clip-path: polygon(0% 0%, 0% 0%, 0% 0%, 100% 0%, 100% 100%, 0% 100%, 5% 100%, 0% 85%);
`;

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: end;
`;

const HeaderIcon = styled.img`
  width: 19px;
  height: 20px;
  margin-right: 5px;
`;

const Header = styled.div`
  margin-bottom: 5px;
  font-size: 17px;
  line-height: 19px;
  color: ${isDarkModeOn ? smColors.white : smColors.black};
`;

const ErrorText = styled.div`
  height: 20px;
  margin: 10px 0px 20px;
  font-size: 15px;
  line-height: 17px;
  color: ${smColors.orange};
`;

const FreeSpaceHeader = styled.div`
  margin-bottom: 5px;
  font-size: 17px;
  line-height: 19px;
  color: ${isDarkModeOn ? smColors.white : smColors.black};
`;

const FreeSpace = styled.div`
  font-size: 17px;
  line-height: 19px;
  ${({ error, selected }) => {
    if (error) {
      return `color: ${smColors.orange}`;
    }
    if (selected) {
      return `color: ${smColors.green}`;
    }
    return `color: ${isDarkModeOn ? smColors.white : smColors.black}`;
  }}
`;

const linkStyle = { fontSize: '17px', lineHeight: '19px', marginBottom: 5 };

type Props = {
  nextAction: () => void,
  folder: string,
  minCommitmentSize: string,
  status: NodeStatus
};

type State = {
  folder: string,
  freeSpace: number,
  formattedFreeSpace: string,
  errorMessage: string
};

class PoSDirectory extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      folder: props.folder || '',
      freeSpace: 0,
      formattedFreeSpace: '',
      errorMessage: ''
    };
  }

  render() {
    const { nextAction, status } = this.props;
    const { folder, freeSpace, formattedFreeSpace, errorMessage } = this.state;
    return (
      <>
        <Wrapper>
          <HeaderWrapper>
            <HeaderIcon src={icon} />
            <Header>PoS data folder directory:</Header>
          </HeaderWrapper>
          <Link onClick={this.openFolderSelectionDialog} text={folder || 'CLICK TO SELECT'} style={linkStyle} />
          <ErrorText>{errorMessage}</ErrorText>
          <FreeSpaceHeader>FREE SPACE...</FreeSpaceHeader>
          <FreeSpace error={!!errorMessage} selected={!!freeSpace}>
            {formattedFreeSpace || 'UNDESIGNATED'}
          </FreeSpace>
        </Wrapper>
        <PoSFooter action={() => nextAction({ folder, freeSpace })} isDisabled={!folder || errorMessage || !status} />
      </>
    );
  }

  async componentDidMount() {
    const { folder } = this.props;
    if (folder) {
      const { freeSpace } = await eventsService.checkDiskSpace({ folder });
      this.setState({ freeSpace, formattedFreeSpace: formatBytes(freeSpace) });
    }
  }

  openFolderSelectionDialog = async () => {
    const { minCommitmentSize } = this.props;
    const { error, selectedFolder, freeSpace } = await eventsService.selectPostFolder();
    if (error) {
      this.setState({ errorMessage: `SELECTED FOLDER HAS NO WRITING PERMISSIONS` });
    } else if (freeSpace < minCommitmentSize) {
      this.setState({ errorMessage: `SELECT FOLDER WITH MINIMUM ${formatBytes(minCommitmentSize)} TO PROCEED` });
    } else {
      this.setState({ folder: selectedFolder, freeSpace, formattedFreeSpace: formatBytes(freeSpace), errorMessage: '' });
    }
  };
}

export default PoSDirectory;
