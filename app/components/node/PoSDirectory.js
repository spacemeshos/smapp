// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { Link } from '/basicComponents';
import { posDirectoryBlack, posDirectoryWhite } from '/assets/images';
import { eventsService } from '/infra/eventsService';
import { formatBytes } from '/infra/utils';
import { smColors } from '/vars';
import PoSFooter from './PoSFooter';

const Wrapper = styled.div`
  flex-direction: row;
  padding: 15px 25px;
  background-color: ${smColors.disabledGray10Alpha};
  border-top: 1px solid ${({ theme }) => `1px solid ${theme.isDarkModeOn ? smColors.white : smColors.realBlack}`};
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
  color: ${({ theme }) => (theme.isDarkModeOn ? smColors.white : smColors.black)};
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
  color: ${({ theme }) => (theme.isDarkModeOn ? smColors.white : smColors.black)};
`;

const FreeSpace = styled.div`
  font-size: 17px;
  line-height: 19px;
  ${({ error, selected, theme }) => {
    if (error) {
      return `color: ${smColors.orange}`;
    }
    if (selected) {
      return `color: ${smColors.green}`;
    }
    return `color: ${theme.isDarkModeOn ? smColors.white : smColors.black}`;
  }}
`;

const linkStyle = { fontSize: '17px', lineHeight: '19px', marginBottom: 5 };

type Props = {
  nextAction: () => void,
  folder: string,
  freeSpace: string,
  commitmentSize: string,
  status: Object,
  isDarkModeOn: boolean
};

type State = {
  folder: string,
  freeSpace: number,
  hasPermissionError: boolean
};

class PoSDirectory extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      folder: props.folder || '',
      freeSpace: props.freeSpace || 0,
      hasPermissionError: false
    };
  }

  render() {
    const { commitmentSize, nextAction, status, isDarkModeOn } = this.props;
    const { folder, freeSpace, hasPermissionError } = this.state;
    const icon = isDarkModeOn ? posDirectoryWhite : posDirectoryBlack;

    return (
      <>
        <Wrapper>
          <HeaderWrapper>
            <HeaderIcon src={icon} />
            <Header>PoS data folder directory:</Header>
          </HeaderWrapper>
          <Link onClick={this.openFolderSelectionDialog} text={folder || 'CLICK TO SELECT'} style={linkStyle} />
          <ErrorText>{hasPermissionError ? `SELECT FOLDER WITH MINIMUM ${commitmentSize} GB FREE TO PROCEED` : ''}</ErrorText>
          <FreeSpaceHeader>FREE SPACE...</FreeSpaceHeader>
          <FreeSpace error={hasPermissionError} selected={!!freeSpace}>
            {freeSpace ? `${freeSpace} GB` : 'UNDESIGNATED'}
          </FreeSpace>
        </Wrapper>
        <PoSFooter action={() => nextAction({ folder, freeSpace })} isDisabled={!folder || hasPermissionError || !status} />
      </>
    );
  }

  openFolderSelectionDialog = async () => {
    const { error, selectedFolder, freeSpace } = await eventsService.selectPostFolder();
    if (error) {
      this.setState({ hasPermissionError: true });
    } else {
      this.setState({ folder: selectedFolder, freeSpace: formatBytes(freeSpace), hasPermissionError: false });
    }
  };
}

export default PoSDirectory;
