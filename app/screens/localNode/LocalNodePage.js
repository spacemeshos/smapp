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
  ItemText,
  LoadingBar,
  LocalNodeLog,
  LocalNodeStatus,
  LocalNodeBase
} from '/components/localNode';
import { SmButton } from '/basicComponents';
import type { DropdownEntry } from '/basicComponents';
import { miner } from '/assets/images';

type Props = {
  history: any,
  localNode: any
};
type State = {};

const rightPaneLinks = [
  {
    id: 'learnMore',
    text: 'Learn more about Spacemesh Local Node'
  },
  {
    id: 'showComputerEffort',
    text: 'Show computer effort'
  },
  {
    id: 'changeLocalNodeSettings',
    text: 'Change Local Node Settings'
  }
];

const readyInformationText = 'To run Spacemesh p2p network and get awarded for your contribution, you need to keep your computer running 24/7.';

class LocalNodePage extends Component<Props, State> {
  render() {
    return <LocalNodeBase header="Local Node" leftPane={this.renderLeftPane} rightPane={this.renderRightPane} />;
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
        {rightPaneLinks.map((loadingLink: { id: 'learnMore' | 'showComputerEffort' | 'changeLocalNodeSettings', text: string }) => (
          <LinkTextWrapper key={loadingLink.id} onClick={() => this.handleLinkClick(loadingLink.id)}>
            <ActionLink>{loadingLink.text}</ActionLink>
          </LinkTextWrapper>
        ))}
      </BottomLinksWrapper>
    </RightPaneInner>
  );

  renderLeftPane = () => {
    const { localNode } = this.props;
    const { capacity }: { capacity: DropdownEntry } = localNode;

    return (
      <LeftPaneInner>
        <BottomPaddedRow>
          <LoadingBar isLoading={false} capacity={(capacity && capacity.label) || ''} status="Active and Connected" />
          <SmButton theme="green" text="Stop" onPress={this.handleStopSetup} style={{ height: 44, marginLeft: 32 }} />
        </BottomPaddedRow>
        <LocalNodeStatus />
        <LocalNodeLog />
      </LeftPaneInner>
    );
  };

  handleStopSetup = () => {
    const { history } = this.props;
    history.push('/main/local-node/local-node-setup');
  };

  handleLinkClick = (linkId: 'learnMore' | 'changeLocalNodeSettings' | 'showComputerEffort') => {
    const { history } = this.props;
    switch (linkId) {
      case 'learnMore':
        break;
      case 'changeLocalNodeSettings':
        history.push('/main/local-node/local-node-setup');
        break;
      case 'showComputerEffort':
        break;
      default:
        break;
    }
  };
}

const mapStateToProps = (state) => ({
  localNode: state.localNode
});

LocalNodePage = connect(mapStateToProps)(LocalNodePage);

export default LocalNodePage;
