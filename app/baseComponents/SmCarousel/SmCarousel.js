import React, { Component } from 'react';
import styled from 'styled-components';
import { smColors } from '/vars';

const DEFAULT_WIDTH = 340;

type SmCarouselProps = {
  children: any,
  width: number,
  timeout?: number,
  disableAutoPlay?: boolean
};

type SmCarouselState = {
  fragment: number
};

const StyledAction = styled.div`
  &:hover {
    opacity: 0.8;
  }
  &:active {
    opacity: 0.6;
  }
`;

const StyledCarouselWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

// $FlowStyledIssue
const StyledCarousel = styled.div`
  width: ${({ width, numOfChildren }) => width * numOfChildren}px;
  height: calc(100% - 18px);
  display: flex;
  flex-direction: row;
  margin-left: ${({ width, fragment }) => -1 * width * fragment}px;
  transition: all 0.3s ease-in-out;
`;

// $FlowStyledIssue
const StyledFragment = styled(StyledAction)`
  width: ${({ width }) => width}px;
  height: inherit;
`;

const StyledSelectorsWrapper = styled.div`
  height: 24px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding-left: 25%;
  padding-right: 25%;
`;

// $FlowStyledIssue
const StyledSelecor = styled(StyledAction)`
  height: 12px;
  width: 12px;
  border: 1px solid ${smColors.borderGray};
  background-color: ${({ index, selected }) => (selected === index ? smColors.green : smColors.white)};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
`;

class SmCarousel extends Component<SmCarouselProps, SmCarouselState> {
  timer;

  state = {
    fragment: 0
  };

  componentDidMount() {
    const defaultTimout: number = 3000;
    const { children, timeout, disableAutoPlay } = this.props;
    if (!disableAutoPlay) {
      this.timer = setInterval(() => {
        this.setState((prevState: SmCarouselState) => {
          return {
            fragment: (prevState.fragment + 1) % children.length
          };
        });
      }, timeout || defaultTimout);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  handleItemSelect = (index: numnber) => {
    this.setState({ fragment: index });
  };

  render() {
    const { children, width } = this.props;
    const { fragment } = this.state;

    return (
      <StyledCarouselWrapper>
        <StyledCarousel width={width || DEFAULT_WIDTH} numOfChildren={children.length} fragment={fragment}>
          {children.map((child, index) => (
            <StyledFragment key={index} width={width || DEFAULT_WIDTH}>
              {children[index]}
            </StyledFragment>
          ))}
        </StyledCarousel>
        <StyledSelectorsWrapper>
          {children.map((child, index) => (
            <StyledSelecor key={index} index={index} selected={fragment} onClick={() => this.handleItemSelect(index)} />
          ))}
        </StyledSelectorsWrapper>
      </StyledCarouselWrapper>
    );
  }
}

export default SmCarousel;
