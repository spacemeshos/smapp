import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { SmesherIntro, SmesherLog } from '../../components/node';
import { WrapperWith2SideBars, Button, ProgressBar, Link } from '../../basicComponents';
import { ScreenErrorBoundary } from '../../components/errorHandler';
import { getFormattedTimestamp } from '../../infra/utils';
import { posIcon, posSmesher, posDirectoryBlack, posDirectoryWhite, explorer, pauseIcon, walletSecond, posSmesherOrange } from '../../assets/images';
import { smColors } from '../../vars';
import { RootState, Status } from '../../types';
import { eventsService } from '../../infra/eventsService';
import { hideSmesherLeftPanel } from '../../redux/ui/actions';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const Text = styled.div`
  font-size: 15px;
  display: flex;
  line-height: 20px;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.realBlack)};
  &.progress {
    min-width: 170px;
  }
`;

const BoldText = styled(Text)`
  font-family: SourceCodeProBold;
`;

const SubHeader = styled(Text)`
  margin-bottom: 15px;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.realBlack)};
`;

const Footer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: flex-end;
`;

const SmesherId = styled.span`
  margin: 0 5px;
  color: ${smColors.blue};
  text-decoration: underline;
`;

const StatusSpan = styled.span<{ status?: Status | null }>`
  color: ${({ status }) => (status ? smColors.green : smColors.orange)};
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
  justify-content: space-between;
  width: 100%;
`;

const TextWrapperFirst = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
  justify-content: flex-start;
  width: 100%;
`;

const LineWrap = styled.div`
  position: relative;
  width: 100%;
  &:after {
    position: absolute;
    bottom: 5px;
    content: '';
    left: 0;
    width: 100%;
    height: 1px;
    background: ${({ theme }) => (theme.isDarkMode ? smColors.disabledGray10Alpha : smColors.black)};
  }
`;

const PosSmesherIcon = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 5px;
`;

const PosFolderIcon = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 5px;
`;

const PathDir = styled.span`
  color: ${smColors.blue};
  text-decoration: underline;
`;

const ExplorerIcon = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 5px;
  cursor: pointer;
`;

interface Props extends RouteComponentProps {
  location: {
    hash: string;
    pathname: string;
    search: string;
    state: { showIntro?: boolean };
  };
}

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 25px;
`;

const Icon = styled.img`
  display: flex;
  width: 20px;
  height: 20px;
  margin-right: 5px;
`;

const IconSmesher = styled.img`
  display: flex;
  width: 40px;
  height: 25px;
  margin-right: 5px;
  color: ${smColors.darkOrange};
`;

const RowText = styled.div<{ weight: number }>`
  display: flex;
  font-size: 16px;
  font-weight: ${({ weight }) => weight};
  line-height: 20px;
  color: ${({ color }) => color};
`;

const BottomPart = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
`;

const Node = ({ history, location }: Props) => {
  const [showIntro, setShowIntro] = useState(location?.state?.showIntro);

  const status = useSelector((state: RootState) => state.node.status);
  const networkId = useSelector((state: RootState) => state.network.netId);
  const posDataPath = useSelector((state: RootState) => state.smesher.dataDir);
  const commitmentSize = useSelector((state: RootState) => state.smesher.commitmentSize);
  const isSmeshing = useSelector((state: RootState) => state.smesher.isSmeshing);
  const isCreatingPosData = useSelector((state: RootState) => state.smesher.isCreatingPosData);
  const rewards = useSelector((state: RootState) => state.smesher.rewards);
  // const rewardsAddress = useSelector((state: RootState) => state.node.rewardsAddress);
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

  let smesherInitTimestamp = localStorage.getItem('smesherInitTimestamp');
  smesherInitTimestamp = smesherInitTimestamp ? getFormattedTimestamp(JSON.parse(smesherInitTimestamp)) : '';
  let smesherSmeshingTimestamp = localStorage.getItem('smesherSmeshingTimestamp');
  smesherSmeshingTimestamp = smesherSmeshingTimestamp ? getFormattedTimestamp(JSON.parse(smesherSmeshingTimestamp)) : '';

  const dispatch = useDispatch();

  const renderNodeDashboard = () => {
    const isCreatingPoSData = !isSmeshing && isCreatingPosData;
    return (
      <>
        <SubHeader>
          Smesher
          <SmesherId> 0x12344...244AF </SmesherId>
          is&nbsp;
          <StatusSpan status={status}> {status ? 'ONLINE' : ' OFFLINE'} </StatusSpan>
          &nbsp;on Network {networkId} (Testnet).
        </SubHeader>
        <br />
        <TextWrapper>
          <Text>
            <PosSmesherIcon src={posSmesher} />
            <BoldText>Proof of Space Status</BoldText>
          </Text>
        </TextWrapper>
        <LineWrap>
          <TextWrapper>
            <Text>
              <PosFolderIcon src={isDarkMode ? posDirectoryWhite : posDirectoryBlack} />
              <PathDir>{posDataPath} </PathDir> - {commitmentSize}GB allocated
            </Text>
          </TextWrapper>
        </LineWrap>
        <LineWrap>
          <TextWrapper>
            <Text>Status</Text>
            <Text>{isCreatingPoSData ? 'Creating PoS data' : 'Smeshing'}</Text>
          </TextWrapper>
        </LineWrap>
        <LineWrap>
          <TextWrapper>
            <Text>Started creating</Text>
            <Text>{smesherInitTimestamp}</Text>
          </TextWrapper>
        </LineWrap>
        <LineWrap>
          <TextWrapper>
            <Text>Progress</Text>
            <Text>
              <Text className="progress">150GB / 200GB, 30%</Text>
              <ProgressBar progress={30} />
            </Text>
          </TextWrapper>
        </LineWrap>

        <TextWrapper>
          <Text>{isCreatingPoSData ? 'Estimated finish time' : 'Finished creating'}</Text>
          <Text>{smesherSmeshingTimestamp}</Text>
        </TextWrapper>
        <Footer>
          <Button
            onClick={() => history.push('/main/node-setup', { modifyPostData: true })}
            img={posDirectoryWhite}
            text="MODIFY POST DATA"
            isPrimary={false}
            style={{ marginRight: 15 }}
            imgPosition="before"
            width={180}
          />
          <Button onClick={() => history.push('/main/node-setup', { modifyPostData: true })} text="MODIFY POST DATA" isPrimary={false} style={{ marginRight: 15 }} width={130} />
          {isCreatingPoSData && <Button onClick={() => {}} text="PAUSE POST DATA GENERATION" img={pauseIcon} isPrimary={false} width={280} imgPosition="before" />}
        </Footer>
      </>
    );
  };

  const openExplorerLink = (id: string) => eventsService.openExplorerLink({ uri: `smeshers/${id}` });

  const buttonHandler = () => {
    dispatch(hideSmesherLeftPanel());
    history.push('/main/node-setup');
  };

  // TODO Need to insert real smesher id
  const renderMainSection = () => {
    if (showIntro) {
      return <SmesherIntro hideIntro={() => setShowIntro(false)} isDarkMode={isDarkMode} />;
    } else if (!isSmeshing && !isCreatingPosData) {
      return (
        <>
          <SubHeader>
            Smesher
            <SmesherId> 0x12344...244AF </SmesherId>
            <ExplorerIcon src={explorer} onClick={() => openExplorerLink('0x12344')} />
            &nbsp;is&nbsp;
            <StatusSpan status={status}>{status ? 'ONLINE ' : 'OFFLINE '} </StatusSpan>
            &nbsp; on Network {networkId} (Testnet).
          </SubHeader>
          <TextWrapperFirst>
            <PosSmesherIcon src={posSmesher} />
            <BoldText>Proof of Space Status</BoldText>
          </TextWrapperFirst>
          <Text>Proof of Space data is not setup yet</Text>
          <br />
          <Button onClick={buttonHandler} text="SETUP PROOF OF SPACE" width={250} />
        </>
      );
    }
    return renderNodeDashboard();
  };

  const navigateToExplanation = () => eventsService.openExternalLink({ link: 'https://testnet.spacemesh.io/#/guide/setup' });

  const renderWalletOnlyMode = () => {
    return (
      <>
        <Row>
          <RowText color={smColors.purple} weight={700}>
            <Icon src={walletSecond} /> You app is currently in wallet-only mode and smeshing is not set up
          </RowText>
        </Row>
        <Row>
          <RowText color={smColors.darkOrange} weight={400}>
            <IconSmesher src={posSmesherOrange} />
            You can switch and start using a local Spacemesh full p2p node managed by this app and start smeshing and getting smeshing rewards.
          </RowText>
        </Row>
        <BottomPart>
          <Link onClick={navigateToExplanation} text="SMESHER GUIDE" />
          <Button width={120} onClick={() => history.push('/main/node-setup')} text="SETUP SMESHER" />
        </BottomPart>
      </>
    );
  };

  return (
    <Wrapper>
      <WrapperWith2SideBars width={650} height={450} header="SMESHER" headerIcon={posIcon} isDarkMode={isDarkMode}>
        {false ? renderWalletOnlyMode() : renderMainSection()}
      </WrapperWith2SideBars>
      <SmesherLog rewards={rewards} initTimestamp={smesherInitTimestamp} smeshingTimestamp={smesherSmeshingTimestamp} isDarkMode={isDarkMode} />
    </Wrapper>
  );
};

export default ScreenErrorBoundary(Node);
