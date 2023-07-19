import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import useVirtual from 'react-cool-virtual';

import {
  WrapperWith2SideBars,
  CustomTimeAgo,
  ColorStatusIndicator,
  Button,
} from '../../basicComponents';
import { smColors } from '../../vars';
import { RootState } from '../../types';
import { NodeEvent } from '../../../shared/types';
import { epochByLayer, nextEpochTime } from '../../../shared/layerUtils';
import { BackButton, CorneredContainer } from '../../components/common';
import { safeReactKey, setRef } from '../../infra/utils';
import { MainPath } from '../../routerPaths';
import { getNodeEventStatusColor } from './nodeEventUtils';
import NodeEventActivityRow from './NodeEventActivityRow';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const Filler = styled.div`
  flex: 1;
`;

const LineWrap = styled.div`
  position: relative;
  width: 100%;
  &:after {
    position: absolute;
    bottom: 0;
    content: '';
    left: 0;
    width: 100%;
    height: 1px;
    background: ${({ theme }) =>
      theme.isDarkMode ? smColors.disabledGray10Alpha : smColors.black};
  }
`;

const EventRow = styled(LineWrap)`
  font-size: 14px;
  line-height: 18px;
  padding: 0.6em 0.5em;
  color: ${({ isError }: { isError: boolean }) =>
    isError ? smColors.red : smColors.mediumGray};

  &:hover {
    background: ${smColors.black20Alpha};
  }
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  & > ${ColorStatusIndicator} {
    margin-right: 1em;
  }
`;

const Text = styled.div`
  text-align: left;
  flex-grow: 1;
  margin-left: 1em;

  color: ${({ theme }) => theme.color.contrast};

  &.progress {
    min-width: 170px;
  }
`;

const EventText = styled(Text)`
  display: block;

  & > * {
    display: inline-block;
  }
`;

const EventsWrapper = styled.div`
  overflow-y: auto;
`;

const InfoWrapper = styled.div`
  display: block;
  flex-grow: 1;
  font-size: 12px;
  margin-top: 1em;
  & > * {
    display: block;
    margin-bottom: 1em;
    padding: 0.5em;
  }

  & ${Text} {
    margin-left: 0;
    white-space: nowrap;
    font-size: 12px;

    &:nth-child(2n) {
      text-align: right;
    }
  }
`;

const NoWrap = styled.span`
  white-space: nowrap;
`;

const NodeEventsLog = ({ history }: RouteComponentProps) => {
  const status = useSelector((state: RootState) => state.node.status);
  const genesisTime = useSelector(
    (state: RootState) => state.network.genesisTime
  );
  const layerDurationSec = useSelector(
    (state: RootState) => state.network.layerDurationSec
  );
  const layersPerEpoch = useSelector(
    (state: RootState) => state.network.layersPerEpoch
  );

  const getEpochByLayer = epochByLayer(layersPerEpoch);
  const getNextEpochTime = nextEpochTime(
    genesisTime,
    layerDurationSec,
    layersPerEpoch
  );
  const currentEpoch = getEpochByLayer(status?.topLayer || 0);
  const events = useSelector((state: RootState) => state.smesher.events);

  const [shouldSticky, setShouldSticky] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const { outerRef, innerRef, items, scrollToItem } = useVirtual({
    itemCount: events.length, // Provide the total number for the list items
    itemSize: 40, // The size of each item (default = 50)
    scrollDuration: 50,
    onScroll: ({ userScroll }) => {
      // If the user scrolls and isn't automatically scrolling, cancel stick to bottom
      if (userScroll && !isScrolling) setShouldSticky(false);
    },
  });

  useEffect(() => {
    // Automatically stick to bottom, using smooth scrolling for better UX
    if (shouldSticky) {
      setIsScrolling(true);
      scrollToItem({ index: events.length - 1, smooth: true }, () => {
        setIsScrolling(false);
      });
    }
  }, [events.length, shouldSticky, scrollToItem]);

  const renderRow = (e: NodeEvent, idx: number) => {
    // TODO: Refactor screen and Node Dashboard
    //       to avoid excessive re-rendering of the whole screen
    //       on each progress update, which causes blinking
    return (
      <EventRow
        key={`${e.timestamp}_${e.details}_${idx}`}
        isError={!!e?.failure}
      >
        <TextWrapper>
          <ColorStatusIndicator
            color={getNodeEventStatusColor(e)}
            style={{ marginRight: '1em' }}
          />
          <NoWrap>
            <CustomTimeAgo time={e.timestamp} />
          </NoWrap>
          <EventText>{NodeEventActivityRow(e)}</EventText>
        </TextWrapper>
      </EventRow>
    );
  };

  return (
    <Wrapper>
      <WrapperWith2SideBars width={682} header="NODE ACTIVITY LOG">
        <BackButton action={() => history.push(MainPath.Smeshing)} />
        <EventsWrapper ref={setRef(outerRef)}>
          <div ref={setRef(innerRef)}>
            {items.length === 0 && (
              <TextWrapper>
                <EventText style={{ marginLeft: 0 }}>
                  Node is preparing, please wait...
                </EventText>
              </TextWrapper>
            )}
            {items.map(({ index, measureRef }) => (
              // Use the `measureRef` to measure the item size
              <div key={index} ref={measureRef}>
                {renderRow(events[index], index)}
              </div>
            ))}
          </div>
        </EventsWrapper>
      </WrapperWith2SideBars>
      <CorneredContainer useEmptyWrap width={310} height="100%" header="INFO">
        <InfoWrapper>
          {([
            ['Synced layer', status?.syncedLayer || 0],
            ['Top layer', status?.topLayer || 0],
            ['Current epoch', currentEpoch],
            [
              'Next epoch in',
              <CustomTimeAgo time={getNextEpochTime(status?.topLayer || 0)} />,
            ],
          ] as const).map(([label, value], idx) => (
            <LineWrap key={`${safeReactKey(label)}_${idx}`}>
              <TextWrapper>
                <Text>{label}</Text>
                <Text>{value}</Text>
              </TextWrapper>
            </LineWrap>
          ))}
        </InfoWrapper>
        <Filler />
        <Button
          isContainerFullWidth
          onClick={() => setShouldSticky(true)}
          text="Stick to bottom"
          isDisabled={shouldSticky}
        />
      </CorneredContainer>
    </Wrapper>
  );
};

export default NodeEventsLog;
