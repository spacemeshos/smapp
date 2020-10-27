// @flow
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { smColors } from '/vars';
import { chevronBottomBlack, chevronBottomWhite } from '/assets/images';

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
    box-shadow: 0 3px 6px ${smColors.black02Alpha};
  `}
`;

const Icon = styled.img`
  height: 11px;
  width: 22px;
  margin: 0 10px;
  transform: rotate(${({ isOpened }) => (isOpened ? '180' : '0')}deg);
  transition: transform 0.2s linear;
  cursor: inherit;
`;

const ItemsWrapper = styled.div`
  position: absolute;
  top: ${({ rowHeight }) => rowHeight - 1}px;
  width: 100%;
  flex: 1;
  z-index: 10;
  overflow: hidden;
  transition: all 0.2s linear;
  overflow-y: scroll;
  box-shadow: 0 3px 6px ${smColors.black02Alpha};
  background-color: ${smColors.white};
`;

const DropdownRow = styled.div`
  display: flex;
  ${({ rowContentCentered }) => rowContentCentered && `justify-content: center;`}
  align-items: center;
  height: ${({ height }) => height}px;
  cursor: ${({ isDisabled }) => (isDisabled ? 'default' : 'pointer')};
`;

type Props = {
  onPress: ({ index: number }) => void | Promise,
  DdElement: Object | Function,
  data: Object[],
  selectedItemIndex: number,
  rowHeight?: number,
  rowContentCentered?: boolean,
  isDisabled?: boolean,
  bgColor?: string,
  style?: Object,
  whiteIcon?: boolean
};

const DropDown = ({ data, DdElement, onPress, selectedItemIndex, rowHeight = 44, rowContentCentered = true, isDisabled, bgColor, style, whiteIcon = false }: Props) => {
  const [isOpened, setIsOpened] = useState(false);
  useEffect(() => {
    requestAnimationFrame(() => {
      if (isOpened) {
        window.addEventListener('click', closeDropdown);
      } else {
        window.removeEventListener('click', closeDropdown);
      }
    });
  }, [isOpened]);

  const closeDropdown = () => {
    setIsOpened(false);
  };

  const isDisabledComputed = isDisabled || !data || !data.length;
  const icon = whiteIcon ? chevronBottomWhite : chevronBottomBlack;

  const renderRow = ({ item, index, rowHeight, rowContentCentered }: { item: Object, index: number, rowHeight?: number, rowContentCentered: boolean }) => (
    <DropdownRow
      rowContentCentered={rowContentCentered}
      isDisabled={item.isDisabled}
      key={`${item.label}${index}`}
      onClick={
        item.isDisabled
          ? null
          : (e: Event) => {
              e.preventDefault();
              e.stopPropagation();
              onPress({ index });
              setIsOpened(false);
            }
      }
      height={rowHeight}
    >
      <DdElement isDisabled={item.isDisabled} {...item} />
    </DropdownRow>
  );

  const handleToggle = () => {
    setIsOpened(!isOpened);
  };

  return (
    <Wrapper
      isDisabled={isDisabledComputed}
      style={style}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <HeaderWrapper isOpened={isOpened} bgColor={bgColor} onClick={isDisabledComputed ? null : handleToggle} rowHeight={rowHeight}>
        <DdElement isDisabled={isDisabled} {...data[selectedItemIndex]} isMain />
        <Icon isOpened={isOpened} src={icon} />
      </HeaderWrapper>
      {isOpened && data && <ItemsWrapper rowHeight={rowHeight}>{data.map((item, index) => renderRow({ item, index, rowHeight, rowContentCentered }))}</ItemsWrapper>}
    </Wrapper>
  );
};

export default DropDown;
