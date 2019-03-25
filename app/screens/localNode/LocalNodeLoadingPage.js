// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { resetNodeSettings } from '/redux/localNode/actions';
import {
  RightHeaderText,
  BaseImage,
  RightPaneInner,
  LeftPaneInner,
  ActionLink,
  ImageWrapper,
  BottomPaddedRow,
  ItemTextWrapperUniformPadding,
  BottomLinksWrapper,
  CenterTextWrapper,
  LinkTextWrapper,
  ItemText,
  LoadingBar,
  LocalNodeLog,
  LocalNodeStatus,
  LocalNodeBase
} from '/components/localNode';
import { SmButton } from '/basicComponents';
import type { DropdownEntry } from '/basicComponents';
import { thinking } from '/assets/images';
import type { Action } from '/types';

const rightPaneLoadingModeLinks = [
  {
    id: 'learnMore',
    text: 'Learn more about Spacemesh Local Node'
  },
  {
    id: 'showComputerEffort',
    text: 'Show computer effort'
  }
];

type Props = {
  history: { push: (string) => void },
  resetNodeSettings: Action,
  localNode: any
};
type State = {
  drive: ?DropdownEntry,
  capacity: ?DropdownEntry
};

class LocalNodeLoadingPage extends Component<Props, State> {
  render() {
    return <LocalNodeBase header="Local Node Setup" leftPane={this.renderLeftPane} rightPane={this.renderRightPane} />;
  }

  // Test: enable to switch to ready page
  componentDidMount() {
    const { history } = this.props;
    setTimeout(() => {
      history.push('/main/local-node/local-node-ready');
    }, 10000);
  }

  renderRightPane = () => (
    <RightPaneInner>
      <ImageWrapper maxHeight={264}>
        <BaseImage src={thinking} />
      </ImageWrapper>
      <CenterTextWrapper>
        <RightHeaderText>Local Node Setup Information</RightHeaderText>
        <ItemTextWrapperUniformPadding>
          <ItemText>Local node setup may take up to 48 hours. you can leave it running and continue using your device as usual, just don&#96;t turn it off.</ItemText>
        </ItemTextWrapperUniformPadding>
      </CenterTextWrapper>
      <BottomLinksWrapper>
        {rightPaneLoadingModeLinks.map((loadingLink) => (
          <LinkTextWrapper key={loadingLink.id} onClick={() => this.handleLinkClick(loadingLink.id)}>
            <ActionLink>{loadingLink.text}</ActionLink>
          </LinkTextWrapper>
        ))}
      </BottomLinksWrapper>
    </RightPaneInner>
  );

  renderLeftPane = () => {
    const { localNode } = this.props;
    const { capacity } = localNode;
    return (
      <LeftPaneInner>
        <BottomPaddedRow>
          <LoadingBar isLoading capacity={(capacity && capacity.label) || ''} status="Connecting" />
          <SmButton theme="green" text="Stop" onPress={this.handleStopSetup} style={{ height: 44, marginLeft: 32 }} />
        </BottomPaddedRow>
        <LocalNodeStatus />
        <LocalNodeLog />
      </LeftPaneInner>
    );
  };

  handleStopSetup = () => {
    const { resetNodeSettings, history } = this.props;
    resetNodeSettings();
    history.push('/main/local-node/local-node-setup');
  };

  handleLinkClick = (linkId: 'learnMore' | 'changeLocalNodeAddress' | 'showComputerEffort') => {
    switch (linkId) {
      case 'learnMore':
        break;
      case 'changeLocalNodeAddress':
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

const mapDispatchToProps = {
  resetNodeSettings
};

LocalNodeLoadingPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(LocalNodeLoadingPage);

export default LocalNodeLoadingPage;
