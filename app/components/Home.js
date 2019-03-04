// @flow
import React, { Component } from 'react';
import CenterCard from './CenterCard';
import type { WelcomeActions } from './CenterCard';
import { Link } from 'react-router-dom';
import { background1, background2, background3 } from '/assets/images';
import { smColors } from '/vars';
import styled from 'styled-components';

type HomeProps = {};
type HomeState = {
  page: 1 | 2 | 3
};

// $FlowStyledIssue
const StyledHome = styled.div`
  ${({ showImage, backgroundImage }) =>
    showImage &&
    `
    background-image: url(${backgroundImage});
  `}
  transition: all 1s ease-in-out;
  background-position: center;
  background-size: cover;
  width: 100vw;
  height: 100vh;
`;

const StyledImageFilter = styled.div`
  background-color: ${`rgba(${smColors.greenRgb}, 0.2)`};
  height: inherit;
  width: inherit;
`;

/** TEST ONLY */
const TestRoutingComponentToBeRemoved = () => (
  <div
    style={{
      position: 'absolute',
      width: 200,
      height: 100,
      backgroundColor: 'lightBlue',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-around',
      textAlign: 'center'
    }}
  >
    <div>
      <h3>TEST</h3>
    </div>
    <div>
      <Link to="/counter">to Counter</Link>
    </div>
    <div>
      <Link to="/root">to ROOT</Link>
    </div>
  </div>
);

class Home extends Component<HomeProps, HomeState> {
  state = {
    page: 1
  };

  render() {
    const { page } = this.state;
    const renderHomeComponent = () => (
      <StyledHome showImage backgroundImage={this.getBackgroundImage()}>
        <TestRoutingComponentToBeRemoved />
        <StyledImageFilter>
          <CenterCard page={page} onPress={this.handleCardAction} />
        </StyledImageFilter>
      </StyledHome>
    );

    return <div>{renderHomeComponent()}</div>;
  }

  getBackgroundImage = () => {
    const { page } = this.state;
    let backgroundImage;
    switch (page) {
      case 1:
        backgroundImage = background1;
        break;
      case 2:
        backgroundImage = background2;
        break;
      case 3:
        backgroundImage = background3;
        break;
      default:
        return null;
    }
    return backgroundImage;
  };

  handleCardAction = (action: WelcomeActions) => {
    switch (action.type) {
      case 'create':
        this.setState({ page: 2 });
        break;
      case 'restore':
        break;
      case 'next':
        this.setState({ page: 3 });
        break;
      default:
        break;
    }
  };
}

export default Home;
