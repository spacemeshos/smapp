import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { SmesherIntro, SmesherLog } from 'components/node';
import { WrapperWith2SideBars, Button, ProgressBar } from 'basicComponents';
import { ScreenErrorBoundary } from 'components/errorHandler';
import { getFormattedTimestamp } from 'infra/utils';
import { posIcon, posSmesher, posDirectoryBlack, posDirectoryWhite } from 'assets/images';
import { smColors } from 'vars';
import { RootState, Status } from 'types';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const Text = styled.div`
  font-size: 15px;
  line-height: 20px;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.realBlack)};
`;

const BoldText = styled(Text)`
  font-family: SourceCodeProBold;
`;

const SubHeader = styled(Text)`
  margin-bottom: 15px;
  color: ${smColors.green};
`;

const Footer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: flex-end;
`;

const SmesherId = styled.span`
  color: ${smColors.blue};
`;

const StatusSpan = styled.span<{ status?: Status | null }>`
  color: ${({ status }) => (status ? smColors.green : smColors.orange)};
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

const Dots = styled.div`
  flex: 1;
  flex-shrink: 1;
  overflow: hidden;
  margin: 0 5px;
  font-size: 16px;
  line-height: 20px;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.realBlack)};
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

interface Props extends RouteComponentProps {
  location: {
    hash: string;
    pathname: string;
    search: string;
    state: { showIntro?: boolean };
  };
}

const Node = ({ history, location }: Props) => {
  const [showIntro, setShowIntro] = useState(location?.state?.showIntro);

  const status = useSelector((state: RootState) => state.node.status);
  const networkId = useSelector((state: RootState) => state.smesher.networkId);
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

  const renderNodeDashboard = () => {
    const isCreatingPoSData = !isSmeshing && isCreatingPosData;
    return (
      <>
        <SubHeader>
          Smesher
          <SmesherId> 0x12344...244AF </SmesherId>
          <StatusSpan status={status}>{status ? 'ONLINE' : 'OFFLINE'} </StatusSpan>
          on Network {networkId}.
        </SubHeader>
        <br />
        <TextWrapper>
          <PosSmesherIcon src={posSmesher} />
          <BoldText>Proof of Space Status</BoldText>
        </TextWrapper>
        <TextWrapper>
          <PosFolderIcon src={isDarkMode ? posDirectoryWhite : posDirectoryBlack} />
          <Text>
            {posDataPath} with {commitmentSize}GB allocated
          </Text>
        </TextWrapper>
        <TextWrapper>
          <Text>Status</Text>
          <Dots>........................................</Dots>
          <Text>{isCreatingPoSData ? 'Creating PoS data' : 'Smeshing'}</Text>
        </TextWrapper>
        <TextWrapper>
          <Text>Started creating</Text>
          <Dots>........................................</Dots>
          <Text>{smesherInitTimestamp}</Text>
        </TextWrapper>
        <TextWrapper>
          <Text>Progress</Text>
          <Dots>........................................</Dots>
          <ProgressBar progress={0.3} />
          <Text> 30% 150GB / 200GB</Text>
        </TextWrapper>

        <TextWrapper>
          <Text>{isCreatingPoSData ? 'Estimated finish time' : 'Finished creating'}</Text>
          <Dots>........................................</Dots>
          <Text>{smesherSmeshingTimestamp}</Text>
        </TextWrapper>
        <Footer>
          <Button onClick={() => history.push('/main/node-setup', { modifyPostData: true })} text="MODIFY POST DATA" isPrimary={false} style={{ marginRight: 15 }} width={130} />
          {isCreatingPoSData && <Button onClick={() => {}} text="PAUSE POST DATA GENERATION" isPrimary={false} width={200} />}
        </Footer>
      </>
    );
  };

  const renderMainSection = () => {
    if (showIntro) {
      return <SmesherIntro hideIntro={() => setShowIntro(false)} isDarkMode={isDarkMode} />;
    } else if (!isSmeshing && !isCreatingPosData) {
      return (
        <>
          <SubHeader>
            Smesher
            <SmesherId> 0x12344...244AF </SmesherId>
            <StatusSpan status={status}>{status ? 'ONLINE' : 'OFFLINE'} </StatusSpan>
            on Network {networkId}.
          </SubHeader>
          <TextWrapper>
            <PosSmesherIcon src={posSmesher} />
            <BoldText>Proof of Space Status</BoldText>
          </TextWrapper>
          <Text>Proof of Space data is not setup yet</Text>
          <br />
          <Button onClick={() => history.push('/main/node-setup')} text="SETUP PROOF OF SPACE" width={250} />
        </>
      );
    }
    return renderNodeDashboard();
  };

  return (
    <Wrapper>
      <WrapperWith2SideBars width={650} height={450} header="SMESHER" headerIcon={posIcon} isDarkMode={isDarkMode}>
        {renderMainSection()}
      </WrapperWith2SideBars>
      <SmesherLog rewards={rewards} initTimestamp={smesherInitTimestamp} smeshingTimestamp={smesherSmeshingTimestamp} isDarkMode={isDarkMode} />
    </Wrapper>
  );
};

export default ScreenErrorBoundary(Node);
