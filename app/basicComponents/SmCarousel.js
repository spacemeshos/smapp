import React, { Component } from 'react';
import styled from 'styled-components';
import { smColors } from '/vars';

const DEFAULT_WIDTH = 300;

const StyledAction = styled.div`
  &:hover {
    opacity: 0.8;
  }
  &:active {
    opacity: 0.6;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  margin: 0 20px;
`;

const SlidesWrapper = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

// $FlowStyledIssue
const SlidesInnerWrapper = styled.div`
  width: ${({ width, numOfChildren }) => width * numOfChildren}px;
  height: 100%;
  display: flex;
  flex-direction: row;
  margin-left: ${({ width, fragment }) => -1 * width * fragment}px;
  transition: all 0.3s ease-in-out;
`;

// $FlowStyledIssue
const StyledFragment = styled.div`
  width: ${({ width }) => width}px;
  height: 100%;
`;

const SelectorsWrapper = styled.div`
  height: 24px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 25%;
`;

// $FlowStyledIssue
const Selector = styled(StyledAction)`
  height: 12px;
  width: 12px;
  border: 1px solid ${smColors.borderGray};
  background-color: ${({ index, selected }) => (selected === index ? smColors.green : smColors.white)};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
`;

type Props = {
  children: any,
  width: number,
  timeout?: number,
  disableAutoPlay?: boolean
};

type State = {
  fragment: number
};

class SmCarousel extends Component<Props, State> {
  state = {
    fragment: 0
  };

  render() {
    const { children, width } = this.props;
    const { fragment } = this.state;

    return (
      <Wrapper>
        <SlidesWrapper>
          <SlidesInnerWrapper width={width || DEFAULT_WIDTH} numOfChildren={children.length} fragment={fragment}>
            {children.map((child) => (
              <StyledFragment key={child.props.id} width={width || DEFAULT_WIDTH}>
                {child}
              </StyledFragment>
            ))}
          </SlidesInnerWrapper>
        </SlidesWrapper>
        <SelectorsWrapper>
          {children.map((child, index) => (
            <Selector key={child.props.id} index={index} selected={fragment} onClick={() => this.handleItemSelect(index)} />
          ))}
        </SelectorsWrapper>
      </Wrapper>
    );
  }

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

  handleItemSelect = (index: number) => {
    this.setState({ fragment: index });
  };
}

export default SmCarousel;
