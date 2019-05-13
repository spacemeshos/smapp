import React, { Component } from 'react';
import styled from 'styled-components';
import smColors from '/vars/colors';
import { whiteClose } from '/assets/images';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Text = styled.span`
  font-size: 16px;
  color: ${smColors.lighterBlack};
  line-height: 22px;
`;

const NoConnectionSection = styled.div`
  background-color: ${smColors.red};
  height: 48px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const NoConnection = styled(Text)`
  background-color: ${smColors.red};
  color: ${smColors.white};
  font-weight: bold;
  line-height: 48px;
  padding: 0 16px;
`;

const ViewInfo = styled.div`
  display: flex;
  flex-direction: row;
`;

const IconWrapper = styled.div`
  width: 22px;
  height: 48px;
  line-height: 42px;
  cursor: pointer;
`;

// $FlowStyledIssue
const Icon = styled.img`
  height: 5px;
  width: 9px;
  cursor: inherit;
  transform: rotate(${({ isExpanded }) => (isExpanded ? '180' : '0')}deg);
  transition: transform 0.2s linear;
`;

// $FlowStyledIssue
const ExplanationWrapper = styled.div`
  height: ${({ isExpanded }) => (isExpanded ? '44' : '0')}px;
  opacity: ${({ isExpanded }) => (isExpanded ? 1 : 0)};
  transition: all 0.2s linear;
`;

type Props = {};

type State = {
  showNoNetworkExplanation: boolean
};

class NoNetworkSection extends Component<Props, State> {
  state = {
    showNoNetworkExplanation: false
  };

  render() {
    const { showNoNetworkExplanation } = this.state;
    return (
      <Wrapper>
        <NoConnectionSection>
          <NoConnection>Could not connect to network !</NoConnection>
          <ViewInfo>
            <NoConnection>View info</NoConnection>
            <IconWrapper onClick={this.toggleNoNetworkExplanation}>
              <Icon isExpanded={showNoNetworkExplanation} src={whiteClose} alt="no source" />
            </IconWrapper>
          </ViewInfo>
        </NoConnectionSection>
        <ExplanationWrapper isExpanded={showNoNetworkExplanation}>
          <Text>Please check your internet connection and select the network you wish to connect to</Text>
        </ExplanationWrapper>
      </Wrapper>
    );
  }

  toggleNoNetworkExplanation = () => {
    this.setState((prevState) => {
      return { showNoNetworkExplanation: !prevState.showNoNetworkExplanation };
    });
  };
}

export default NoNetworkSection;
