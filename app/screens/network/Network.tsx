import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { ScreenErrorBoundary } from '../../components/errorHandler';
import { WrapperWith2SideBars, Link, Tooltip, CustomTimeAgo } from '../../basicComponents';
import { smColors } from '../../vars';
import { network } from '../../assets/images';
import { eventsService } from '../../infra/eventsService';
import { RootState } from '../../types';
import { NetworkStatus } from '../../components/NetworkStatus';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
`;

const DetailsWrap = styled.div`
  display: flex;
  flex-direction: column;
`;

const FooterWrap = styled.div`
  display: flex;
  flex-direction: row;
`;

const DetailsRow = styled.div<{ isLast?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom: ${({ isLast, theme }) => (isLast ? `0px` : `1px solid ${theme.isDarkMode ? smColors.white : smColors.darkGray10Alpha};`)};
`;

const DetailsText = styled.div`
  font-size: 16px;
  line-height: 20px;
  margin: 10px 0;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.realBlack)};
`;

const GrayText = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 14px;
  text-transform: uppercase;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.dark75Alpha)};
`;

const DetailsTextWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Network = () => {
  const status = useSelector((state: RootState) => state.node.status);
  const genesisTime = useSelector((state: RootState) => state.node.genesisTime);
  const nodeIndicator = useSelector((state: RootState) => state.node.nodeIndicator);
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

  const networkName = 'TweedleDee 0.1.0';

  const openLogFile = () => {
    eventsService.showFileInFolder({ isBackupFile: true });
  };

  return (
    <WrapperWith2SideBars width={1000} height={500} header="NETWORK" headerIcon={network} subHeader={networkName} isDarkMode={isDarkMode}>
      <Container>
        <DetailsWrap>
          <DetailsRow>
            <DetailsTextWrap>
              <DetailsText>Age</DetailsText>
              <Tooltip width={250} text="tooltip age" isDarkMode={isDarkMode} />
            </DetailsTextWrap>
            <GrayText>
              <CustomTimeAgo time={genesisTime} />
            </GrayText>
          </DetailsRow>
          <DetailsRow>
            <DetailsTextWrap>
              <DetailsText>Status</DetailsText>
              <Tooltip width={250} text="tooltip Status" isDarkMode={isDarkMode} />
            </DetailsTextWrap>
            <GrayText>
              <NetworkStatus nodeIndicator={nodeIndicator} status={status} />
            </GrayText>
          </DetailsRow>
          <DetailsRow>
            <DetailsTextWrap>
              <DetailsText>Current Layer</DetailsText>
              <Tooltip width={250} text="tooltip Current Layer" isDarkMode={isDarkMode} />
            </DetailsTextWrap>
            <GrayText>{status?.currentLayer || 0}</GrayText>
          </DetailsRow>
          <DetailsRow>
            <DetailsTextWrap>
              <DetailsText>Verified Layer</DetailsText>
              <Tooltip width={250} text="tooltip Verified Layer" isDarkMode={isDarkMode} />
            </DetailsTextWrap>
            <GrayText>{status?.verifiedLayer || 0}</GrayText>
          </DetailsRow>
          <DetailsRow>
            <DetailsTextWrap>
              <DetailsText>Connection Type</DetailsText>
              <Tooltip width={250} text="tooltip Connection Type" isDarkMode={isDarkMode} />
            </DetailsTextWrap>
            <GrayText>Managed p2p node</GrayText>
          </DetailsRow>
          <DetailsRow>
            <DetailsTextWrap>
              <DetailsText>Connected neighbors</DetailsText>
              <Tooltip width={250} text="tooltip Connected neighbors" isDarkMode={isDarkMode} />
            </DetailsTextWrap>
            <GrayText>8</GrayText>
          </DetailsRow>
        </DetailsWrap>
        <FooterWrap>
          <Link onClick={openLogFile} text="BROWSE LOG FILE" />
          <Tooltip width={250} text="tooltip BROWSE LOG FILE" isDarkMode={isDarkMode} />
        </FooterWrap>
      </Container>
    </WrapperWith2SideBars>
  );
};

export default ScreenErrorBoundary(Network);
