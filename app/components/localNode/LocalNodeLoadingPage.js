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
  ItemText
} from './LocalNodeJointStyles';
import { thinking } from '/assets/images';
import LoadingBar from './LoadingBar';
import { SmButton } from '/basicComponents';
import type { DropdownEntry } from '/basicComponents';
import LocalNodeLog from './LocalNodeLog';
import LocalNodeStatus from './LocalNodeStatus';
import LocalNodeBase from './LocalNodeBase';

type SeupPageProps = {
  history: any,
  resetNodeSettings: Function,
  localNode: any
};
type SetupPageState = {
  drive: ?DropdownEntry,
  capacity: ?DropdownEntry
};

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

const loadingInformationText = "Local node setup may take up to 48 hours. you can leave it running and continue using your device as usual, just don't turn it off.";

class LocalNodeLoadingPage extends Component<SeupPageProps, SetupPageState> {
  render() {
    return <LocalNodeBase header="Local Node Setup" leftPane={this.renderLeftPane} rightPane={this.renderRightPane} />;
  }

  renderRightPane = () => (
    <RightPaneInner>
      <ImageWrapper maxHeight={264}>
        <BaseImage src={thinking} />
      </ImageWrapper>
      <CenterTextWrapper>
        <RightHeaderText>Local Node Setup Information</RightHeaderText>

        <ItemTextWrapperUniformPadding>
          <ItemText>{loadingInformationText}</ItemText>
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
          <LoadingBar isLoading capacity={(capacity && capacity.label) || ''} status="Connetcing" />
          <SmButton theme="green" text="Stop" onPress={this.handleStopSetup} style={{ height: 44, marginLeft: 32 }} />
        </BottomPaddedRow>
        <LocalNodeStatus />
        <LocalNodeLog />
      </LeftPaneInner>
    );
  };

  // Test: enable to switch to ready page
  // componentDidMount() {
  //   const { history } = this.props;
  //   setTimeout(() => {
  //     history.push('/main/local-node/local-node-ready');
  //   }, 10000);
  // }

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
