import React from 'react';
import styled from 'styled-components';
import { CorneredContainer } from '../common';
import { getFormattedTimestamp, formatSmidge } from '../../infra/utils';
import { smColors } from '../../vars';
import { Reward } from '../../types';
import { SmallHorizontalPanel } from '../../basicComponents';
import {
  bottomRightCorner,
  bottomRightCornerWhite,
  leftSideTIcon,
  leftSideTIconWhite,
  topRightCorner,
  topRightCornerWhite,
} from '../../assets/images';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-y: visible;
  overflow-x: hidden;
  margin-left: 10px;
  padding: 0 10px;
`;

const LogEntry = styled.div`
  display: flex;
  flex-direction: column;
`;

const LogText = styled.div`
  font-size: 16px;
  line-height: 20px;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.black)};
`;

const AwardText = styled(LogText)`
  color: ${smColors.green};
`;

const LogEntrySeparator = styled(LogText)`
  margin: 15px 0;
  line-height: 16px;
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

type Props = {
  initTimestamp: string | null;
  smeshingTimestamp: string | null;
  rewards: Reward[];
  isDarkMode: boolean;
};

const SmesherLog = ({
  initTimestamp,
  smeshingTimestamp,
  rewards,
  isDarkMode,
}: Props) => {
  const icon = isDarkMode ? leftSideTIconWhite : leftSideTIcon;
  const topRight = isDarkMode ? topRightCornerWhite : topRightCorner;
  const bottomRight = isDarkMode ? bottomRightCornerWhite : bottomRightCorner;
  return (
    <CorneredContainer
      useEmptyWrap
      width={310}
      height={450}
      header="SMESHER LOG"
      isDarkMode={isDarkMode}
    >
      <FullCrossIcon className="top" src={icon} />
      <FullCrossIcon className="bottom" src={icon} />
      <TopRightCorner src={topRight} />
      <BottomRightCorner src={bottomRight} />
      <SmallHorizontalPanel isDarkMode={isDarkMode} />

      <LogText>--</LogText>
      <Wrapper>
        {initTimestamp ? (
          <>
            <LogEntry>
              <LogText>{initTimestamp}</LogText>
              <LogText>Initializing smesher</LogText>
            </LogEntry>
            <LogEntrySeparator>...</LogEntrySeparator>
          </>
        ) : null}
        {smeshingTimestamp ? (
          <>
            <LogEntry>
              <LogText>{smeshingTimestamp}</LogText>
              <LogText>Started smeshing</LogText>
            </LogEntry>
            <LogEntrySeparator>...</LogEntrySeparator>
          </>
        ) : null}
        {rewards &&
          rewards.map((reward, index) => (
            <div key={`reward${index}`}>
              <LogEntry>
                <LogText>{getFormattedTimestamp(reward.timestamp)}</LogText>
                <AwardText>
                  Smeshing reward: {formatSmidge(reward.total)}
                </AwardText>
                <AwardText>
                  Smeshing fee reward: {formatSmidge(reward.layerReward)}
                </AwardText>
              </LogEntry>
              <LogEntrySeparator>...</LogEntrySeparator>
            </div>
          ))}
      </Wrapper>
    </CorneredContainer>
  );
};

export default SmesherLog;
