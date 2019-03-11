// @flow
import React from 'react';
import styled from 'styled-components';
import { smColors } from '/vars';
import { Loader } from '/basicComponents';
import { openIcon } from '/assets/images';

const ENTRY_HEIGHT = 55;
const ENTRY_WIDTH = 165;
const ENTRY_WIDTH_CLOSED = 60;

export type SideMenuItem = {
  text: string,
  path: string | null,
  icon?: any,
  disabled?: boolean,
  hasSeparator?: boolean
};

type Props = {
  items: SideMenuItem[],
  initialItemIndex?: number,
  loadingItemIndex?: number,
  onMenuItemPress: Function
};

type State = {
  isExpanded: boolean,
  selectedItemIndex: number,
  width: number
};

// $FlowStyledIssue
const Wrapper = styled.div`
  height: 100%;
  width: ${({ width }) => width}px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid ${smColors.borderGray};
  transition: width 0.2s linear;
  overflow-x: hidden;
`;

const ToggleBtnWrapper = styled.div`
  width: ${ENTRY_WIDTH}px;
  height: ${ENTRY_HEIGHT}px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

// $FlowStyledIssue
const ToggleBtn = styled.img`
  height: 22px;
  width: 13px;
  margin: 10px 15px;
  transform: rotate(${({ isExpanded }) => (isExpanded ? '180' : '0')}deg);
  transition: transform 0.2s linear;
  cursor: pointer;
`;

const MenuWrapper = styled.div`
  height: calc(100% - ${ENTRY_HEIGHT}px);
  width: ${ENTRY_WIDTH}px;
  display: flex;
  flex: 1;
  flex-direction: column;
`;

// $FlowStyledIssue
const MenuItemWrapper = styled.div`
  position: relative;
  width: ${ENTRY_WIDTH}px;
  height: ${ENTRY_HEIGHT}px;
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  &:hover {
    background-color: ${smColors.lightGray};
  }
  cursor: pointer;
`;

// $FlowStyledIssue
const SelectedMenuItemBorder = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 12px;
  height: ${ENTRY_HEIGHT}px;
  background-color: ${smColors.green};
`;

const MenuItemIconWrapper = styled.div`
  height: 20px;
  width: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 20px;
  cursor: inherit;
`;

const MenuItemIcon = styled.img`
  max-height: 20px;
  max-width: 20px;
  cursor: inherit;
`;

const MenuLabel = styled.span`
  margin-right: 20px;
  line-height: 20px;
  font-size: 12px;
  font-weight: 100;
  cursor: inherit;
`;

const Separator = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  border-bottom: 1px solid ${smColors.borderGray};
`;

class SideMenu extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isExpanded: true,
      selectedItemIndex: props.initialItemIndex || -1,
      width: ENTRY_WIDTH
    };
  }

  render() {
    const { items } = this.props;
    const { width, isExpanded } = this.state;

    return (
      <Wrapper width={width}>
        <ToggleBtnWrapper onClick={this.handleSideMenuToggle}>
          <ToggleBtn isExpanded={isExpanded} width={width} src={openIcon} alt="Icon missing" />
        </ToggleBtnWrapper>
        <MenuWrapper>{items.map(this.renderMenuElement)}</MenuWrapper>
      </Wrapper>
    );
  }

  renderMenuElement = (item: SideMenuItem, index: number) => {
    const { loadingItemIndex } = this.props;
    const { selectedItemIndex } = this.state;
    return [
      item.hasSeparator && <Separator key="separator" />,
      <MenuItemWrapper key={item.text} onClick={item.disabled ? null : () => this.handleSelectEntry({ index })} disabled={!!item.disabled}>
        {index === selectedItemIndex && <SelectedMenuItemBorder />}
        <MenuItemIconWrapper>
          <MenuItemIcon src={item.icon} alt="Icon missing" />
        </MenuItemIconWrapper>
        <MenuLabel>{item.text}</MenuLabel>
        {loadingItemIndex === index && <Loader />}
      </MenuItemWrapper>
    ];
  };

  handleSelectEntry = ({ index }: { index: number }) => {
    const { onMenuItemPress } = this.props;
    this.setState({ selectedItemIndex: index });
    onMenuItemPress({ index });
  };

  handleSideMenuToggle = () => {
    const { isExpanded } = this.state;
    const finalWidth = isExpanded ? ENTRY_WIDTH_CLOSED : ENTRY_WIDTH;
    this.setState({ isExpanded: !isExpanded, width: finalWidth });
  };
}

export default SideMenu;
