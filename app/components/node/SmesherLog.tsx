import React from 'react';
import styled from 'styled-components';
import ReactTimeago from 'react-timeago';
import { formatSmidge } from '../../infra/utils';
import { smColors } from '../../vars';
import { SmallHorizontalPanel } from '../../basicComponents';
import {
  bottomRightCorner,
  bottomRightCornerWhite,
  horizontalPanelBlack,
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
  height: 100%;
  overflow-y: visible;
  overflow-x: hidden;
  margin: 5px -20px -20px -20px;
  padding: 0 20px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
`;

const LogEntry = styled.div`
  display: flex;
  flex-direction: column;
  opacity: 0.6;
  transition: opacity 0.2s linear;
  padding: 0.25em 0 0.3em 0;

  &:hover,
  &:active,
  &:focus {
    opacity: 1;
  }
`;

const LogText = styled.div`
  font-size: 14px;
  line-height: 18px;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.black)};
`;

const LayerNumber = styled(LogText)`
  width: 70px;
`;

const AwardText = styled(LogText)`
  color: ${smColors.green};
  margin-left: auto;
`;

const LayerReward = styled.div`
  display: flex;
  flex-direction: row;
`;

const DateText = styled.div`
  font-size: 12px;
  line-height: 16px;
  color: ${smColors.mediumGray};
`;
const EpochText = styled.div`
  display: block;
  position: relative;
  margin: 1.5em -20px 1em -20px;
  padding: 0 20px;
  font-size: 12px;
  text-align: center;

  text-transform: uppercase;
  letter-spacing: 3px;
  color: ${smColors.lightGray};

  &:before,
  &:after {
    display: block;
    content: '';
    background: no-repeat url(${horizontalPanelBlack}) left center;
    position: absolute;
    height: 12px;
    width: 41px;
    top: 0;
  }
  &:before {
    left: 0;
  }
  &:after {
    right: 0;
    transform: scaleX(-1);
  }
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

      <Wrapper>
        {rewards &&
          (() => {
            let prevEpoch;
            return rewards.map((reward, index) => {
              const curEpoch = epochByLayer(reward.layer);
              const showEpoch = curEpoch !== prevEpoch;
              prevEpoch = curEpoch;
              return (
                <React.Fragment key={`reward_${reward.layer}_${index}`}>
                  {showEpoch && (
                    <EpochText>Epoch {epochByLayer(reward.layer)}</EpochText>
                  )}
                  <div>
                    <LogEntry>
                      <LayerReward>
                        <LayerNumber>{reward.layer}</LayerNumber>
                        <DateText>
                          <ReactTimeago date={timestampByLayer(reward.layer)} />
                        </DateText>
                        <AwardText>+{formatSmidge(reward.total)}</AwardText>
                      </LayerReward>
                    </LogEntry>
                  </div>
                </React.Fragment>
              );
            });
          })()}
        {smeshingTimestamp ? (
          <>
            <LogEntry>
              <DateText>
                <ReactTimeago date={smeshingTimestamp} />
              </DateText>
              <LogText>Started smeshing</LogText>
            </LogEntry>
          </>
        ) : null}
        {initTimestamp ? (
          <>
            <LogEntry>
              <DateText>
                <ReactTimeago date={initTimestamp} />
              </DateText>
              <LogText>Started creating PoS data</LogText>
            </LogEntry>
          </>
        ) : null}
      </Wrapper>
    </CorneredContainer>
  );
};

export default SmesherLog;
