import React, { Component } from 'react';
import styled from 'styled-components';
import { smColors } from '/vars';

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
  margin-left: ${({ width, slide }) => -1 * width * slide}px;
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

const DEFAULT_WIDTH = 300;
const DEFAULT_TIMEOUT = 3000;

type Props = {
  children: any,
  width: number,
  timeout?: number,
  isAutoPlayEnabled?: boolean
};

type State = {
  slide: number
};

class SmCarousel extends Component<Props, State> {
  state = {
    slide: 0
  };

  static defaultProps = {
    isAutoPlayEnabled: true
  };

  render() {
    const { children, width } = this.props;
    const { slide } = this.state;

    return (
      <Wrapper>
        <SlidesWrapper>
          <SlidesInnerWrapper width={width || DEFAULT_WIDTH} numOfChildren={children.length} slide={slide}>
            {children.map((child) => (
              <StyledFragment key={child.props.id} width={width || DEFAULT_WIDTH}>
                {child}
              </StyledFragment>
            ))}
          </SlidesInnerWrapper>
        </SlidesWrapper>
        <SelectorsWrapper>
          {children.map((child, index) => (
            <Selector key={child.props.id} index={index} selected={slide} onClick={() => this.setState({ slide: index })} />
          ))}
        </SelectorsWrapper>
      </Wrapper>
    );
  }

  componentDidMount() {
    const { children, timeout, isAutoPlayEnabled } = this.props;
    if (isAutoPlayEnabled) {
      this.timer = setInterval(() => {
        const { slide } = this.state;
        this.setState({ slide: (slide + 1) % children.length });
      }, timeout || DEFAULT_TIMEOUT);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }
}

export default SmCarousel;
