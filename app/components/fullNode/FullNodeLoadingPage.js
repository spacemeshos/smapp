// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { resetNodeSettings } from '/redux/fullNode/actions';
import {
  PageWrapper,
  LeftPane,
  RightPane,
  RightHeaderText,
  BaseImage,
  RightPaneInner,
  LeftPaneInner,
  ActionLink,
  RightHeaderWrapper,
  ImageWrapper,
  LoadingRow,
  ItemTextWrapperUniformPadding,
  BottomLinksWrapper,
  CenterTextWrapper,
  LinkTextWrapper,
  ItemText,
  FullNodeHeaderText
} from './FullNodeJointStyles';
import { thinking } from '/assets/images';
import LoadingBar from './LoadingBar';
import { SmButton } from '/basicComponents';
import type { DropdownEntry } from '/basicComponents';
import FullNodeLog from './FullNodeLog';
import FullNodeStatus from './FullNodeStatus';

type SeupPageProps = {
  history: any,
  resetNodeSettings: Function,
  fullNode: any
};
type SetupPageState = {
  drive: ?DropdownEntry,
  capacity: ?DropdownEntry
};

const rightPaneLoadingModeLinks = [
  {
    id: 'learnMore',
    text: 'Learn more about Spacemesh Full Node'
  },
  {
    id: 'showComputerEffort',
    text: 'Show computer effort'
  }
];

const loadingInformationText = "Full node setup may take up to 48 hours. you can leave it running and continue using your device as usual, just don't turn it off.";

class FullNodeLoadingPage extends Component<SeupPageProps, SetupPageState> {
  render() {
    return [
      <div>
        <FullNodeHeaderText>Full Node Setup</FullNodeHeaderText>
      </div>,
      <PageWrapper>
        <LeftPane>{this.renderLeftPane()}</LeftPane>
        <RightPane>{this.renderRightPane()}</RightPane>
      </PageWrapper>
    ];
  }

  renderRightPane = () => (
    <RightPaneInner>
      <ImageWrapper>
        <BaseImage src={thinking} width={132} height={152} />
      </ImageWrapper>
      <CenterTextWrapper>
        <RightHeaderWrapper>
          <RightHeaderText>Full Node Setup Information</RightHeaderText>
        </RightHeaderWrapper>
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
    const { fullNode } = this.props;
    const { capacity } = fullNode;
    return (
      <LeftPaneInner>
        <LoadingRow>
          <LoadingBar isLoading capacity={(capacity && capacity.label) || ''} status="Connetcing" />
          <SmButton theme="green" text="Stop" onPress={this.handleStopSetup} style={{ height: 44, marginLeft: 32 }} />
        </LoadingRow>
        <FullNodeStatus />
        <FullNodeLog />
      </LeftPaneInner>
    );
  };

  // Test: enable to switch to ready page
  // componentDidMount() {
  //   const { history } = this.props;
  //   setTimeout(() => {
  //     history.push('/root/full-node/full-node-ready');
  //   }, 8000);
  // }

  handleStopSetup = () => {
    const { resetNodeSettings, history } = this.props;
    resetNodeSettings();
    history.push('/root/full-node/full-node-setup');
  };

  handleLinkClick = (linkId: 'learnMore' | 'changeFullNodeAddress' | 'showComputerEffort') => {
    switch (linkId) {
      case 'learnMore':
        break;
      case 'changeFullNodeAddress':
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

const mapDispatchToProps = {
  resetNodeSettings
};

FullNodeLoadingPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(FullNodeLoadingPage);

export default FullNodeLoadingPage;
