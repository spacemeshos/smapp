import React from 'react';
import styled from 'styled-components';
import ReactTimeago from 'react-timeago';
import { formatSmidge } from '../../infra/utils';
import { smColors } from '../../vars';
import { SmallHorizontalPanel } from '../../basicComponents';
import {
  bottomRightCorner,
  bottomRightCornerWhite,
  leftSideTIcon,
  leftSideTIconWhite,
  topRightCorner,
  topRightCornerWhite,
} from '../../assets/images';
import { RewardsInfo, SmesherReward } from '../../../shared/types';
import { CorneredContainer } from '../common';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-y: visible;
  overflow-x: hidden;
`;

const LogEntry = styled.div`
  display: flex;
  flex-direction: column;
`;

const LogText = styled.div`
  font-size: 14px;
  line-height: 18px;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.black)};
`;

const AwardText = styled(LogText)`
  color: ${smColors.green};
`;

const LogEntrySeparator = styled(LogText)`
  color: ${smColors.darkGray50Alpha};
  margin: 5px 0 10px;
  line-height: 0;
  user-select: none;
`;

const DateText = styled.div`
  font-size: 14px;
  line-height: 16px;
  color: ${smColors.mediumGray};
`;
const EpochText = styled.span`
  margin-left: 1em;
  font-size: 12px;
  color: ${smColors.mediumGray};
`;

const FullCrossIcon = styled.img`
  position: absolute;

  left: -10px;
  width: 12px;
  height: 12px;
  &.top {
    top: -10px;
    transform: rotate(-90deg);
  }
  &.bottom {
    bottom: -10px;
    transform: rotate(90deg);
  }
`;
const TopRightCorner = styled.img`
  position: absolute;
  top: -10px;
  right: -10px;
  width: 8px;
  height: 8px;
`;

const BottomRightCorner = styled.img`
  position: absolute;
  bottom: -10px;
  right: -10px;
  width: 8px;
  height: 8px;
`;

const Total = styled.div<{ epoch?: boolean }>`
  display: block;
  color: ${({ epoch }) => (epoch ? smColors.purple : smColors.green)};
  margin: 0.25em 0;

  small {
    display: block;
    margin: 0.1em 0;
    color: ${smColors.mediumGray};
  }
`;

type Props = {
  initTimestamp: string | null;
  smeshingTimestamp: string | null;
  rewards: SmesherReward[];
  rewardsInfo: RewardsInfo;
  isDarkMode: boolean;
  epochByLayer: (number) => number;
  timestampByLayer: (number) => number;
};

const SmesherLog = ({
  initTimestamp,
  smeshingTimestamp,
  rewards,
  rewardsInfo,
  isDarkMode,
  epochByLayer,
  timestampByLayer,
}: Props) => {
  const icon = isDarkMode ? leftSideTIconWhite : leftSideTIcon;
  const topRight = isDarkMode ? topRightCornerWhite : topRightCorner;
  const bottomRight = isDarkMode ? bottomRightCornerWhite : bottomRightCorner;

  return (
    <CorneredContainer
      useEmptyWrap
      width={310}
      height={450}
      header="REWARDS"
      isDarkMode={isDarkMode}
    >
      <FullCrossIcon className="top" src={icon} />
      <FullCrossIcon className="bottom" src={icon} />
      <TopRightCorner src={topRight} />
      <BottomRightCorner src={bottomRight} />
      <SmallHorizontalPanel isDarkMode={isDarkMode} />

      {rewardsInfo && (
        <>
          <Total>
            <small title={`within ${rewardsInfo.epochs} epochs`}>
              Total for {rewardsInfo.layers} layers:
            </small>
            {formatSmidge(rewardsInfo.total)}
          </Total>
          <Total epoch>
            <small>Within current epoch:</small>
            {formatSmidge(rewardsInfo.lastEpoch)}
          </Total>
        </>
      )}

      <LogText>--</LogText>
      <Wrapper>
        {rewards &&
          rewards.map((reward, index) => (
            <div key={`reward${index}`}>
              <LogEntry>
                <DateText>
                  <ReactTimeago date={timestampByLayer(reward.layer)} />
                </DateText>
                <LogText>
                  Layer&nbsp;#{reward.layer}
                  <EpochText>(epoch ${epochByLayer(reward.layer)})</EpochText>
                </LogText>
                <AwardText>
                  Layer reward: {formatSmidge(reward.total)}
                </AwardText>
                <AwardText>
                  Fee reward: {formatSmidge(reward.layerReward)}
                </AwardText>
              </LogEntry>
              <LogEntrySeparator>...</LogEntrySeparator>
            </div>
          ))}
        {smeshingTimestamp ? (
          <>
            <LogEntry>
              <DateText>
                <ReactTimeago date={smeshingTimestamp} />
              </DateText>
              <LogText>Started smeshing</LogText>
            </LogEntry>
            <LogEntrySeparator>...</LogEntrySeparator>
          </>
        ) : null}
        {initTimestamp ? (
          <>
            <LogEntry>
              <DateText>
                <ReactTimeago date={initTimestamp} />
              </DateText>
              <LogText>Initializing smesher</LogText>
            </LogEntry>
            <LogEntrySeparator>...</LogEntrySeparator>
          </>
        ) : null}
      </Wrapper>
    </CorneredContainer>
  );
};

export default SmesherLog;
