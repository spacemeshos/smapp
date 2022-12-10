import React, { useState } from 'react';
import styled from 'styled-components';
import { formatSmidge, getFormattedTimestamp } from '../../infra/utils';
import { smColors } from '../../vars';
import { RewardView } from '../../redux/wallet/selectors';
import { Bech32Address } from '../../../shared/types';
import Address from '../common/Address';

const Wrapper = styled.div<{ isDetailed: boolean }>`
  display: flex;
  flex-direction: column;
  ${({ isDetailed }) =>
    isDetailed && `background-color: ${smColors.lighterGray};`}
  cursor: pointer;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px 10px 15px 10px;
  cursor: pointer;
  background-color: ${({ theme }) =>
    theme.isDarkMode ? smColors.black : 'transparent'};
  &:hover {
    background-color: ${({ theme }) =>
      theme.isDarkMode ? smColors.dark75Alpha : smColors.disabledGray};
  }
`;

const Icon = styled.img.attrs(
  ({
    theme: {
      icons: { chevronPrimaryLeft },
    },
  }) => ({ src: chevronPrimaryLeft })
)`
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
  color: ${({ theme }) =>
    theme.isDarkMode ? smColors.white : smColors.darkGray50Alpha};
`;

const BlackText = styled(Text)`
  color: ${({ theme }) => theme.color.contrast};
`;

const BoldText = styled(Text)`
  font-weight: 800;
  color: ${({ color, theme }) => {
    if (color) {
      return color;
    } else {
      return theme.color.contrast;
    }
  }};
`;

const DarkGrayText = styled(Text)`
  color: ${({ theme }) =>
    theme.isDarkMode ? smColors.white : smColors.darkGray};
  cursor: inherit;
  text-align: right;
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
  background-color: ${({ theme }) =>
    theme.isDarkMode ? smColors.black : 'transparent'};
`;

const TextRow = styled.div<{ isLast?: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  overflow: hidden;
  white-space: nowrap;
  padding: 5px 0;
  border-bottom: ${({ isLast, theme }) =>
    isLast
      ? '0px'
      : `1px solid ${
          theme.isDarkMode ? smColors.dMBlack1 : smColors.darkGray10Alpha
        };`};
  :first-child {
    border-top: ${({ theme }) =>
      `1px solid ${
        theme.isDarkMode ? smColors.dMBlack1 : smColors.darkGray10Alpha
      };`};
  }
  :last-child {
    border-bottom: none;
  }
`;

type Props = {
  address: Bech32Address;
  tx: RewardView;
};

const RewardRow = ({ tx, address }: Props) => {
  const [isDetailed, setIsDetailed] = useState(false);

  const { layer, layerReward, amount, timestamp } = tx;

  const toggleTxDetails = () => {
    setIsDetailed(!isDetailed);
  };

  const renderDetails = () => (
    <DetailsSection>
      {layer ? (
        <TextRow>
          <BlackText>LAYER ID</BlackText>
          <BoldText>{layer}</BoldText>
        </TextRow>
      ) : null}
      <TextRow>
        <BlackText>TO</BlackText>
        <BoldText>
          <Address address={address} suffix="(Me)" />
        </BoldText>
      </TextRow>
      <TextRow>
        <BlackText>SMESHING REWARD</BlackText>
        <BoldText>{formatSmidge(amount)}</BoldText>
      </TextRow>
      {/* layerReward is not a fee, so do not show it until we can retrieve a fee */}
      <TextRow>
        <BlackText>SMESHING FEE REWARD</BlackText>
        <BoldText>{formatSmidge(amount - layerReward)}</BoldText>
      </TextRow>
    </DetailsSection>
  );

  return (
    <Wrapper isDetailed={isDetailed}>
      <Header onClick={toggleTxDetails}>
        <Icon />
        <HeaderInner>
          <HeaderSection>
            <DarkGrayText>SMESHING REWARD</DarkGrayText>
          </HeaderSection>
          <HeaderSection>
            <Amount color={smColors.darkerGreen}>
              +{formatSmidge(amount)}
            </Amount>
            <DarkGrayText>{getFormattedTimestamp(timestamp)}</DarkGrayText>
          </HeaderSection>
        </HeaderInner>
      </Header>
      {isDetailed && renderDetails()}
    </Wrapper>
  );
};

export default RewardRow;
