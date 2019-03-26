// @flow
import React from 'react';
import styled from 'styled-components';
import { smColors } from '/vars';
import { openDDIcon, openDDIconDisabled } from '/assets/images';

const ROW_HEIGHT: number = 44;

const StyledAction = styled.div`
  &:hover {
    background-color: ${smColors.hoverLightGreen};
  }
  &:active {
    background-color: ${smColors.actionLightGreen};
  }
  transition: all 0.1s linear;
`;

// $FlowStyledIssue
const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: ${smColors.white};
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
const HeaderWrapper = styled(StyledAction)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  border: 1px solid ${smColors.borderGray};
  border-radius: 2px;
  cursor: pointer;
  ${({ isOpened }) =>
    isOpened &&
    `
    border: 1px solid ${smColors.darkGreen};
    border-radius: 2px 2px 0 0;
    box-shadow: 0 3px 6px ${smColors.black20alpha};
  `}
`;

// $FlowStyledIssue
const Icon = styled.img`
  height: 6px;
  width: 10px;
  transform: rotate(${({ isOpened }) => (isOpened ? '0' : '180')}deg);
  transition: transform 0.2s linear;
`;

// $FlowStyledIssue
const ItemsWrapper = styled.div`
  position: absolute;
  top: ${ROW_HEIGHT - 1}px;
  width: 100%;
  flex: 1;
  z-index: 10;
  overflow: hidden;
  border: 1px solid ${smColors.darkGreen};
  border-top: 1px solid ${smColors.borderGray};
  transition: all 0.2s linear;
  overflow-y: scroll;
  border-radius: 0 0 2px 2px;
  box-shadow: 0 3px 6px ${smColors.black20alpha};
`;

// $FlowStyledIssue
const Text = styled.span`
  font-size: 16px;
  line-height: 22px;
  color: ${({ isDisabled }) => (isDisabled ? smColors.gray : smColors.lighterBlack)};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: inherit;
`;

// $FlowStyledIssue
const DropdownRow = styled(StyledAction)`
  padding: 10px 20px;
  background-color: ${smColors.white};
  border-top: 1px solid ${smColors.borderGray};
  opacity: 1;
  cursor: ${({ isDisabled }) => (isDisabled ? 'default' : 'pointer')};
`;

export type DropdownEntry = {
  id: number | string,
  label: string,
  isDisabled?: boolean
};

type SmDropdownProps = {
  onPress: ({ index: number }) => void,
  data: DropdownEntry[],
  selectedItemIndex: number,
  isDisabled?: boolean,
  placeholder?: string
};

type SmDropdownState = {
  isOpened: boolean
};

class SmDropdown extends React.Component<SmDropdownProps, SmDropdownState> {
  state: SmDropdownState = {
    isOpened: false
  };

  static defaultProps = {
    placeholder: 'Please Select...'
  };

  render() {
    const { data, selectedItemIndex, isDisabled, placeholder } = this.props;
    const { isOpened } = this.state;

    return (
      <Wrapper isDisabled={isDisabled}>
        <HeaderWrapper isOpened={isOpened} onClick={isDisabled ? null : this.handleToggle}>
          <Text isDisabled={isDisabled}>{selectedItemIndex !== -1 ? data[selectedItemIndex].label : placeholder}</Text>
          <Icon isOpened={isOpened} src={isOpened ? openDDIcon : openDDIconDisabled} />
        </HeaderWrapper>
        {isOpened && <ItemsWrapper>{data.map((item, index) => this.renderDropdownEntryElem({ label: item.label, isDisabled: item.isDisabled, index }))}</ItemsWrapper>}
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

  renderDropdownEntryElem = ({ label, isDisabled, index }: { label: string, isDisabled?: boolean, index: number }) => {
    const { onPress } = this.props;
    return (
      <DropdownRow
        isDisabled={isDisabled}
        key={label}
        onClick={
          isDisabled
            ? null
            : (e: Event) => {
                e.preventDefault();
                e.stopPropagation();
                onPress({ index });
                this.closeDropdown();
              }
        }
      >
        <Text isDisabled={isDisabled}>{label}</Text>
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

export default SmDropdown;
