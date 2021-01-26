import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { smColors } from '../vars';
import { chevronBottomBlack, chevronBottomWhite } from '../assets/images';

const Wrapper = styled.div<{ isDisabled: boolean }>`
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

const HeaderWrapper = styled.div<{ onClick: (e?: React.MouseEvent) => void; rowHeight: number; bgColor: string; isOpened: boolean }>`
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

const Icon = styled.img<{ isOpened: boolean }>`
  height: 11px;
  width: 22px;
  margin: 0 10px;
  transform: rotate(${({ isOpened }) => (isOpened ? '180' : '0')}deg);
  transition: transform 0.2s linear;
  cursor: inherit;
`;

const ItemsWrapper = styled.div<{ rowHeight: number }>`
  position: absolute;
  top: ${({ rowHeight }) => rowHeight - 1}px;
  width: 100%;
  flex: 1;
  z-index: 10;
  overflow: hidden;
  transition: all 0.2s linear;
  overflow-y: scroll;
  box-shadow: 0 3px 6px ${smColors.black02Alpha};
  background-color: ${({ theme }) => (theme.isDarkMode ? smColors.black : smColors.white)};
`;

const DropdownRow = styled.div<{ onClick: (e?: React.MouseEvent) => void; rowContentCentered: boolean; height: number; isDisabled: boolean; key: string }>`
  display: flex;
  ${({ rowContentCentered }) => rowContentCentered && `justify-content: center;`}
  align-items: center;
  height: ${({ height }) => height}px;
  cursor: ${({ isDisabled }) => (isDisabled ? 'default' : 'pointer')};
`;

type Props = {
  onClick: ({ index }: { index: number }) => void | Promise<number>;
  DdElement: React.ElementType;
  data: any;
  selectedItemIndex: number;
  isDarkMode?: boolean;
  rowHeight?: number;
  rowContentCentered?: boolean;
  isDisabled?: boolean;
  bgColor?: string;
  style?: any;
  whiteIcon?: boolean;
};

const DropDown = ({
  data,
  DdElement,
  onClick,
  selectedItemIndex,
  isDarkMode,
  rowHeight = 44,
  rowContentCentered = true,
  isDisabled = false,
  bgColor = smColors.white,
  style = null,
  whiteIcon = false
}: Props) => {
  const [isOpened, setIsOpened] = useState(false);
  useEffect(() => {
    requestAnimationFrame(() => {
      if (isOpened) {
        window.addEventListener('click', () => setIsOpened(false));
      } else {
        window.removeEventListener('click', () => setIsOpened(false));
      }
    });
  }, [isOpened]);

  const isDisabledComputed = isDisabled || !data || !data.length;
  const icon = whiteIcon || isDarkMode ? chevronBottomWhite : chevronBottomBlack;

  const renderRow = ({
    item,
    index,
    rowHeight = 44,
    rowContentCentered
  }: {
    item: { label: string; isDisabled?: boolean };
    index: number;
    rowHeight?: number;
    rowContentCentered: boolean;
  }) => (
    <DropdownRow
      rowContentCentered={rowContentCentered}
      isDisabled={item.isDisabled || false}
      key={`${item.label}${index}`}
      onClick={
        item.isDisabled
          ? () => {}
          : (e: any) => {
              e.preventDefault();
              e.stopPropagation();
              onClick({ index });
              setIsOpened(false);
            }
      }
      height={rowHeight}
    >
      <DdElement {...item} />
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
      <HeaderWrapper isOpened={isOpened} bgColor={bgColor} onClick={isDisabledComputed ? () => {} : handleToggle} rowHeight={rowHeight}>
        <DdElement {...data[selectedItemIndex]} isMain />
        <Icon isOpened={isOpened} src={icon} />
      </HeaderWrapper>
      {isOpened && data && <ItemsWrapper rowHeight={rowHeight}>{data.map((item: any, index: number) => renderRow({ item, index, rowHeight, rowContentCentered }))}</ItemsWrapper>}
    </Wrapper>
  );
};

export default DropDown;
