// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { smColors } from '/vars';
import { chevronBottomBlack } from '/assets/images';

// $FlowStyledIssue
const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  cursor: pointer;
  ${({ isDisabled }) =>
    isDisabled &&
    `
      cursor: default;
      pointer-events: none;
      opacity: 0.6;
  `};
`;

// $FlowStyledIssue
const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: ${({ rowHeight }) => rowHeight}px;
  cursor: pointer;
  background-color: ${({ bgColor }) => bgColor};
  ${({ isOpened }) =>
    isOpened &&
    `
    box-shadow: 0 3px 6px ${smColors.black20alpha};
  `}
`;

// $FlowStyledIssue
const Icon = styled.img`
  height: 11px;
  width: 22px;
  margin: 0 10px;
  transform: rotate(${({ isOpened }) => (isOpened ? '180' : '0')}deg);
  transition: transform 0.2s linear;
  cursor: inherit;
`;

// $FlowStyledIssue
const ItemsWrapper = styled.div`
  position: absolute;
  top: ${({ rowHeight }) => rowHeight - 1}px;
  width: 100%;
  flex: 1;
  z-index: 10;
  overflow: hidden;
  transition: all 0.2s linear;
  overflow-y: scroll;
  box-shadow: 0 3px 6px ${smColors.black20alpha};
  background-color: ${smColors.white};
`;

// $FlowStyledIssue
const DropdownRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${({ height }) => height}px;
  cursor: ${({ isDisabled }) => (isDisabled ? 'default' : 'pointer')};
`;

type Props = {
  onPress: ({ index: number }) => void,
  DdElement: Object | Function,
  data: Object[],
  selectedItemIndex: number,
  rowHeight?: number,
  isDisabled?: boolean,
  bgColor?: string,
  style?: Object
};

type State = {
  isOpened: boolean
};

class DropDown extends Component<Props, State> {
  static defaultProps = {
    rowHeight: 44
  };

  state = {
    isOpened: false
  };

  render() {
    const { data, DdElement, selectedItemIndex, rowHeight, isDisabled, bgColor, style } = this.props;
    const { isOpened } = this.state;
    const isDisabledComputed = isDisabled || !data || !data.length;
    return (
      <Wrapper
        isDisabled={isDisabledComputed}
        style={style}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <HeaderWrapper isOpened={isOpened} bgColor={bgColor} onClick={isDisabledComputed ? null : this.handleToggle} rowHeight={rowHeight}>
          <DdElement isDisabled={isDisabled} {...data[selectedItemIndex]} isMain />
          <Icon isOpened={isOpened} src={chevronBottomBlack} />
        </HeaderWrapper>
        {isOpened && data && <ItemsWrapper rowHeight={rowHeight}>{data.map((item, index) => this.renderRow({ item, index, rowHeight }))}</ItemsWrapper>}
      </Wrapper>
    );
  }

  componentDidUpdate() {
    const { isOpened } = this.state;
    setTimeout(() => {
      if (isOpened) {
        window.addEventListener('click', this.closeDropdown);
      } else {
        window.removeEventListener('click', this.closeDropdown);
      }
    }, 0);
  }

  renderRow = ({ item, index, rowHeight }: { item: Object, index: number, rowHeight?: number }) => {
    const { onPress, DdElement } = this.props;
    return (
      <DropdownRow
        isDisabled={item.isDisabled}
        key={`${item.label}${index}`}
        onClick={
          item.isDisabled
            ? null
            : (e: Event) => {
                e.preventDefault();
                e.stopPropagation();
                onPress({ index });
                this.closeDropdown();
              }
        }
        height={rowHeight}
      >
        <DdElement isDisabled={item.isDisabled} {...item} />
      </DropdownRow>
    );
  };

  handleToggle = () => {
    const { isOpened } = this.state;
    if (isOpened) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  };

  closeDropdown = () => this.setState({ isOpened: false });

  openDropdown = () => this.setState({ isOpened: true });
}

export default DropDown;
