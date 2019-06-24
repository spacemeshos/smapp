// @flow
import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { smColors } from '/vars';
import { Loader } from '/basicComponents';
import { openIcon } from '/assets/images';

const ENTRY_HEIGHT = 55;
const ENTRY_WIDTH = 165;
const ENTRY_WIDTH_CLOSED = 60;

// $FlowStyledIssue
const Wrapper = styled.div`
  height: 100%;
  width: ${({ width }) => width}px;
  min-width: ${({ width }) => width}px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid ${smColors.borderGray};
  transition: all 0.2s linear;
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
  cursor: ${({ isDisabled }) => (isDisabled ? 'default' : 'pointer')};
  opacity: ${({ isDisabled }) => (isDisabled ? 0.5 : 1)};
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
  position: relative;
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

const NetworkDisconnected = styled.div`
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background-color: ${smColors.red};
`;

export type SideMenuItem = {
  text: string,
  path: string | null,
  icon?: string,
  isDisabled?: boolean,
  hasSeparator?: boolean
};

type Props = {
  items: SideMenuItem[],
  isConnected: boolean,
  selectedItemIndex?: number,
  loadingItemIndex?: number,
  onMenuItemPress: ({ index: number }) => void
};

type State = {
  isExpanded: boolean,
  width: number
};

class SideMenu extends React.Component<Props, State> {
  state = {
    isExpanded: true,
    width: ENTRY_WIDTH
  };

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
    const { selectedItemIndex, loadingItemIndex, isConnected } = this.props;
    const isDisabled = !item.path;
    const networkIndex = 5;
    return [
      item.hasSeparator && <Separator key="separator" />,
      <MenuItemWrapper
        key={item.text}
        onClick={
          isDisabled
            ? null
            : () => {
                this.handleSelectEntry({ index });
              }
        }
        isDisabled={isDisabled}
      >
        {index === selectedItemIndex && <SelectedMenuItemBorder />}
        <MenuItemIconWrapper>
          {/** when network is disconnected, showing an indication on top of the network icon */}
          {!isConnected && networkIndex === index && <NetworkDisconnected />}
          <MenuItemIcon src={item.icon} alt="Icon missing" />
        </MenuItemIconWrapper>
        <MenuLabel>{item.text}</MenuLabel>
        {index === loadingItemIndex && <Loader />}
      </MenuItemWrapper>
    ];
  };

  handleSelectEntry = ({ index }: { index: number }) => {
    const { onMenuItemPress } = this.props;
    onMenuItemPress({ index });
  };

  handleSideMenuToggle = () => {
    const { isExpanded } = this.state;
    const finalWidth = isExpanded ? ENTRY_WIDTH_CLOSED : ENTRY_WIDTH;
    this.setState({ isExpanded: !isExpanded, width: finalWidth });
  };
}

const mapStateToProps = (state) => ({
  isConnected: state.network.isConnected
});

SideMenu = connect(mapStateToProps)(SideMenu);

export default SideMenu;
