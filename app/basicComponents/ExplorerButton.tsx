import { AddressType } from 'app/components/common/Address';
import { RootState } from 'app/types';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { explorer } from '../assets/images';

type Props = {
  address: string;
  type?: AddressType;
  isDarkMode?: boolean;
};

const Wrapper = styled.div`
  display: flex;
`;

const ExplorerIcon = styled.img`
  width: 20px;
  height: 20px;
  cursor: pointer;
  margin-top: 2px;
`;

const ExplorerButton = ({ address, isDarkMode, type }: Props) => {
  const explorerUrl = useSelector(
    (state: RootState) => state.network.explorerUrl
  );

  const onClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    window.open(
      explorerUrl.concat(
        `${type || 'accounts'}/${address}${isDarkMode ? '?dark' : ''}`
      )
    );
  };

  return (
    <Wrapper>
      <ExplorerIcon src={explorer} onClick={onClick} />
    </Wrapper>
  );
};

export default ExplorerButton;
