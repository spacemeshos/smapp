// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  RightHeaderText,
  BaseImage,
  RightPaneInner,
  LeftPaneInner,
  ActionLink,
  BottomPaddedRow,
  ImageWrapper,
  ItemTextWrapperUniformPadding,
  LinkTextWrapper,
  BottomLinksWrapper,
  CenterTextWrapper,
  ItemText
} from './FullNodeJointStyles';
import { miner } from '/assets/images';
import LoadingBar from './LoadingBar';
import { SmButton } from '/basicComponents';
import type { DropdownEntry } from '/basicComponents';
import FullNodeLog from './FullNodeLog';
import FullNodeStatus from './FullNodeStatus';
import FullNodeBase from './FullNodeBase';

type Props = {
  history: any,
  fullNode: any
};
type State = {};

const rightPaneLinks = [
  {
    id: 'learnMore',
    text: 'Learn more about Spacemesh Full Node'
  },
  {
    id: 'showComputerEffort',
    text: 'Show computer effort'
  },
  {
    id: 'changeFullNodeSettings',
    text: 'Change Full Node Settings'
  }
];

const readyInformationText = 'To run Spacemesh p2p network and get awarded for your contribution, you need to keep your computer running 24/7.';

class FullNodePage extends Component<Props, State> {
  render() {
    return <FullNodeBase header="Full Node" leftPane={this.renderLeftPane} rightPane={this.renderRightPane} />;
  }

  renderRightPane = () => (
    <RightPaneInner>
      <ImageWrapper maxHeight={270}>
        <BaseImage src={miner} />
      </ImageWrapper>
      <CenterTextWrapper>
        <RightHeaderText>Spacemesh Tips and Information</RightHeaderText>
        <ItemTextWrapperUniformPadding>
          <ItemText>{readyInformationText}</ItemText>
        </ItemTextWrapperUniformPadding>
      </CenterTextWrapper>
      <BottomLinksWrapper>
        {rightPaneLinks.map((loadingLink: { id: 'learnMore' | 'showComputerEffort' | 'changeFullNodeSettings', text: string }) => (
          <LinkTextWrapper key={loadingLink.id} onClick={() => this.handleLinkClick(loadingLink.id)}>
            <ActionLink>{loadingLink.text}</ActionLink>
          </LinkTextWrapper>
        ))}
      </BottomLinksWrapper>
    </RightPaneInner>
  );

  renderLeftPane = () => {
    const { fullNode } = this.props;
    const { capacity }: { capacity: DropdownEntry } = fullNode;

    return (
      <LeftPaneInner>
        <BottomPaddedRow>
          <LoadingBar isLoading={false} capacity={(capacity && capacity.label) || ''} status="Active and Connected" />
          <SmButton theme="green" text="Stop" onPress={this.handleStopSetup} style={{ height: 44, marginLeft: 32 }} />
        </BottomPaddedRow>
        <FullNodeStatus />
        <FullNodeLog />
      </LeftPaneInner>
    );
  };

  handleStopSetup = () => {
    const { history } = this.props;
    history.push('/root/full-node/full-node-setup');
  };

  handleLinkClick = (linkId: 'learnMore' | 'changeFullNodeSettings' | 'showComputerEffort') => {
    const { history } = this.props;
    switch (linkId) {
      case 'learnMore':
        break;
      case 'changeFullNodeSettings':
        history.push('/root/full-node/full-node-setup');
        break;
      case 'showComputerEffort':
        break;
      default:
        break;
    }
  };
}

const mapStateToProps = (state) => ({
  fullNode: state.fullNode
});

FullNodePage = connect(mapStateToProps)(FullNodePage);

export default FullNodePage;
