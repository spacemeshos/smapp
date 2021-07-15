import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { eventsService } from '../../infra/eventsService';
import { getCurrentLayer } from '../../redux/network/actions';
import { ScreenErrorBoundary } from '../../components/errorHandler';
import { NetworkStatus } from '../../components/NetworkStatus';
import { WrapperWith2SideBars, Link, Tooltip, CustomTimeAgo } from '../../basicComponents';
import { smColors } from '../../vars';
import { network } from '../../assets/images';
import { RootState } from '../../types';
import { getNodeError } from '../../redux/node/selectors';

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
  const dispatch = useDispatch();

  useEffect(() => {
    const asyncGetCurrentLayer = async () => {
      await dispatch(getCurrentLayer());
    };
    asyncGetCurrentLayer();
  }, [dispatch]);

  const isWalletOnly = useSelector((state: RootState) => state.wallet.meta.isWalletOnly);
  const status = useSelector((state: RootState) => state.node.status);
  const nodeError = useSelector(getNodeError);
  const netName = useSelector((state: RootState) => state.network.netName || 'UNKNOWN NETWORK NAME');
  const genesisTime = useSelector((state: RootState) => state.network.genesisTime);
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

  const openLogFile = () => {
    eventsService.showFileInFolder({ isLogFile: true });
  };

  return (
    <WrapperWith2SideBars width={1000} height={500} header="NETWORK" headerIcon={network} subHeader={netName} isDarkMode={isDarkMode} error={nodeError?.msg}>
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
          {!isWalletOnly && (
            <DetailsRow>
              <DetailsTextWrap>
                <DetailsText>Status</DetailsText>
                <Tooltip width={250} text="tooltip Status" isDarkMode={isDarkMode} />
              </DetailsTextWrap>
              <GrayText>
                <NetworkStatus status={status} error={nodeError} />
              </GrayText>
            </DetailsRow>
          )}
          <DetailsRow>
            <DetailsTextWrap>
              <DetailsText>Current Layer</DetailsText>
              <Tooltip width={250} text="tooltip Current Layer" isDarkMode={isDarkMode} />
            </DetailsTextWrap>
            <GrayText>{status?.topLayer || 0}</GrayText>
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
            <GrayText>{isWalletOnly ? 'Remote Gateway' : 'Managed p2p node'}</GrayText>
          </DetailsRow>
          {!isWalletOnly && (
            <DetailsRow>
              <DetailsTextWrap>
                <DetailsText>Connected neighbors</DetailsText>
                <Tooltip width={250} text="tooltip Connected neighbors" isDarkMode={isDarkMode} />
              </DetailsTextWrap>
              <GrayText>8</GrayText>
            </DetailsRow>
          )}
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
