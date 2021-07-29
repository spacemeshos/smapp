import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { chevronLeftBlack, chevronLeftWhite } from '../../assets/images';
import { getFormattedTimestamp, formatSmidge } from '../../infra/utils';
import { smColors } from '../../vars';
import { Reward, RootState, TxState } from '../../types';

const Wrapper = styled.div<{ isDetailed: boolean }>`
  display: flex;
  flex-direction: column;
  ${({ isDetailed }) => isDetailed && `background-color: ${smColors.lighterGray};`}
  cursor: pointer;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px 10px 15px 10px;
  cursor: pointer;
  background-color: ${({ theme }) => (theme.isDarkMode ? smColors.black : 'transparent')};
  &:hover {
    background-color: ${({ theme }) => (theme.isDarkMode ? smColors.dark75Alpha : smColors.disabledGray)};
  }
`;

const Icon = styled.img`
  width: 10px;
  height: 20px;
  margin-right: 10px;
`;

const HeaderInner = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: relative;
  width: 100%;
  cursor: inherit;
`;

const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  cursor: pointer;
`;

const Text = styled.span`
  font-size: 13px;
  line-height: 17px;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.darkGray50Alpha)};
`;

const BlackText = styled(Text)`
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.realBlack)};
`;

const BoldText = styled(Text)`
  font-family: SourceCodeProBold;
  color: ${({ color, theme }) => {
    if (color) {
      return color;
    } else {
      return theme.isDarkMode ? smColors.white : smColors.realBlack;
    }
  }};
`;

const DarkGrayText = styled(Text)`
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.darkGray)};
  cursor: inherit;
`;

const Amount = styled.div`
  font-size: 13px;
  margin: 2px 0px;
  text-align: right;
  color: ${({ color }) => color};
  cursor: inherit;
`;

const DetailsSection = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: space-between;
  padding: 6px 12px 12px 20px;
  background-color: ${({ theme }) => (theme.isDarkMode ? smColors.black : 'transparent')};
`;

const TextRow = styled.div<{ isLast?: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  overflow: hidden;
  white-space: nowrap;
  padding: 5px 0;
  border-bottom: ${({ isLast, theme }) => (isLast ? `0px` : `1px solid ${theme.isDarkMode ? smColors.dMBlack1 : smColors.darkGray10Alpha};`)};
  :first-child {
    border-top: ${({ theme }) => `1px solid ${theme.isDarkMode ? smColors.dMBlack1 : smColors.darkGray10Alpha};`};
  }
  :last-child {
    border-bottom: none;
  }
`;

type Props = {
  tx: Reward;
};

const RewardRow = ({ tx }: Props) => {
  const [isDetailed, setIsDetailed] = useState(false);

  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

  const { status, layerId, layerReward, total, timestamp } = tx;
  const statuses: Array<string> = Object.keys(TxState);

  const toggleTxDetails = () => {
    setIsDetailed(!isDetailed);
  };

  const renderDetails = () => (
    <DetailsSection>
      <TextRow>
        <BlackText>STATUS</BlackText>
        <BoldText color={smColors.darkerGreen}>{statuses[status]}</BoldText>
      </TextRow>
      {layerId ? (
        <TextRow>
          <BlackText>LAYER ID</BlackText>
          <BoldText>{layerId}</BoldText>
        </TextRow>
      ) : null}
      <TextRow>
        <BlackText>TO</BlackText>
        <BoldText>ME</BoldText>
      </TextRow>
      <TextRow>
        <BlackText>SMESHING REWARD</BlackText>
        <BoldText>{formatSmidge(total)}</BoldText>
      </TextRow>
      <TextRow>
        <BlackText>SMESHING FEE REWARD</BlackText>
        <BoldText>{formatSmidge(layerReward)}</BoldText>
      </TextRow>
    </DetailsSection>
  );

  return (
    <Wrapper isDetailed={isDetailed}>
      <Header onClick={toggleTxDetails}>
        <Icon src={isDarkMode ? chevronLeftWhite : chevronLeftBlack} />
        <HeaderInner>
          <HeaderSection>
            <DarkGrayText>SMESHING REWARD</DarkGrayText>
          </HeaderSection>
          <HeaderSection>
            <Amount color={smColors.darkerGreen}>+{formatSmidge(total)}</Amount>
            <DarkGrayText>{getFormattedTimestamp(timestamp)}</DarkGrayText>
          </HeaderSection>
        </HeaderInner>
      </Header>
      {isDetailed && renderDetails()}
    </Wrapper>
  );
};

export default RewardRow;
