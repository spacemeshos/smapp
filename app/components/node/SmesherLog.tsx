import React from 'react';
import styled from 'styled-components';
import ReactTimeago from 'react-timeago';
import { useSelector } from 'react-redux';
import useVirtual from 'react-cool-virtual';
import { formatSmidge, getFormattedTimestamp, setRef } from '../../infra/utils';
import { smColors } from '../../vars';
import { SmallHorizontalPanel } from '../../basicComponents';
import { horizontalPanelBlack } from '../../assets/images';
import { RewardsInfo, Reward } from '../../../shared/types';
import { CorneredContainer } from '../common';
import { RootState } from '../../types';

const Wrapper = styled.div`
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  margin: 5px -20px -20px -20px;
  padding: 0 20px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
`;

const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const LogEntry = styled.div`
  display: flex;
  flex-direction: column;
  opacity: 0.6;
  transition: opacity 0.2s linear;
  padding: 0.25em 0 0.3em 0;
  font-size: 12px;

  &:hover,
  &:active,
  &:focus {
    opacity: 1;
  }
`;

const LogText = styled.div`
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme: { color } }) => color.primary};
`;

const LayerNumber = styled(LogText)`
  font-size: 12px;
  line-height: 16px;
  width: 4em;
`;

const AwardText = styled(LogText)`
  font-size: 12px;
  color: ${smColors.green};
  margin-left: auto;
  flex-grow: 1;
  text-align: right;
`;

const LayerReward = styled.div`
  font-size: 12px;
  display: flex;
  flex-direction: row;
`;

const DateText = styled.div`
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

const FullCrossIcon = styled.img.attrs(
  ({
    theme: {
      icons: { leftSideTIcon },
    },
  }) => ({ src: leftSideTIcon })
)`
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
const TopRightCorner = styled.img.attrs(
  ({
    theme: {
      icons: {
        corners: { topRight },
      },
    },
  }) => ({ src: topRight })
)`
  position: absolute;
  top: -10px;
  right: -10px;
  width: 8px;
  height: 8px;
`;

const BottomRightCorner = styled.img.attrs(
  ({
    theme: {
      icons: {
        corners: { bottomRight },
      },
    },
  }) => ({ src: bottomRight })
)`
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
  rewards: Reward[];
  rewardsInfo: RewardsInfo;
  epochByLayer: (number) => number;
  timestampByLayer: (number) => number;
};

const SmesherLog = ({
  rewards,
  rewardsInfo,
  epochByLayer,
  timestampByLayer,
}: Props) => {
  const { smeshingStart, posInitStart } = useSelector(
    (state: RootState) => state.smesher.metadata
  );
  const { outerRef, innerRef, items } = useVirtual({
    itemCount: rewards.length, // Provide the total number for the list items
    itemSize: 25,
  });
  const rewardsCount = rewards.length;

  return (
    <CorneredContainer
      useEmptyWrap
      width={310}
      height={'100%'}
      header="REWARDS"
    >
      <FullCrossIcon className="top" />
      <FullCrossIcon className="bottom" />
      <TopRightCorner />
      <BottomRightCorner />
      <SmallHorizontalPanel />

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
            {formatSmidge(rewardsInfo.lastEpochRewards)}
          </Total>
        </>
      )}

      <Wrapper ref={setRef(outerRef)}>
        <InnerWrapper ref={setRef(innerRef)}>
          {rewards &&
            (() => {
              return items.map(({ index, measureRef }) => {
                const i = rewardsCount - 1 - index;
                const reward = rewards[i];
                const curEpoch = epochByLayer(reward.layer);
                const prevLayer = rewards[i + 1]?.layer ?? null;
                const prevEpoch = prevLayer ? epochByLayer(prevLayer) : null;
                const showEpoch = curEpoch !== prevEpoch;
                return (
                  <div key={`reward_${reward.layer}_${index}`} ref={measureRef}>
                    {showEpoch && (
                      <EpochText>Epoch {epochByLayer(reward.layer)}</EpochText>
                    )}
                    <LogEntry>
                      <LayerReward>
                        <LayerNumber>{reward.layer}</LayerNumber>
                        <DateText>
                          <ReactTimeago
                            date={getFormattedTimestamp(
                              timestampByLayer(reward.layer)
                            )}
                          />
                        </DateText>
                        <AwardText>+{formatSmidge(reward.amount)}</AwardText>
                      </LayerReward>
                    </LogEntry>
                  </div>
                );
              });
            })()}
          {posInitStart ? (
            <>
              <LogEntry>
                <DateText>
                  <ReactTimeago date={getFormattedTimestamp(posInitStart)} />
                </DateText>
                <LogText>Started creating PoS data</LogText>
              </LogEntry>
            </>
          ) : null}

          {smeshingStart ? (
            <>
              <LogEntry>
                <DateText>
                  <ReactTimeago date={getFormattedTimestamp(smeshingStart)} />
                </DateText>
                <LogText>Started smeshing</LogText>
              </LogEntry>
            </>
          ) : null}
        </InnerWrapper>
      </Wrapper>
    </CorneredContainer>
  );
};

export default SmesherLog;
