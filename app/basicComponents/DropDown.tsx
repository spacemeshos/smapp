import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { smColors } from '../vars';
import { chevronBottomBlack, chevronBottomWhite } from '../assets/images';

const Wrapper = styled.div<{
  isDisabled: boolean;
  isLightSkin: boolean;
  isOpened: boolean;
}>`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-left: auto;
  cursor: default;
  ${({ isOpened }) =>
    isOpened &&
    `
      border-bottom: none;
  `};
  border: ${({
      theme: {
        form: {
          dropdown: { dark, light },
        },
      },
      isLightSkin,
    }) =>
      isLightSkin ? Number(light.isOutBorder) : Number(dark.isOutBorder)}px
    solid
    ${({
      theme: {
        form: {
          dropdown: { dark, light },
        },
      },
      isLightSkin,
    }) => (isLightSkin ? light.borderColor : dark.borderColor)};
  ${({ isDisabled }) =>
    isDisabled &&
    `
      cursor: not-allowed;
      pointer-events: none;
      opacity: 0.6;
  `};
`;

const HeaderWrapper = styled.div<{
  onClick: (e?: React.MouseEvent) => void;
  rowHeight: number | string;
  isOpened: boolean;
  isLightSkin: boolean;
}>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: ${({ rowHeight }) => rowHeight}px;
  cursor: default;
  padding: 0 10px;
  border-top-left-radius: ${({
    theme: {
      form: { dropdown },
    },
  }) => dropdown.boxRadius}px;
  border-top-right-radius: ${({
    theme: {
      form: { dropdown },
    },
  }) => dropdown.boxRadius}px;
  border-bottom-left-radius: ${({
    isOpened,
    theme: {
      form: { dropdown },
    },
  }) => (isOpened ? 0 : dropdown.boxRadius)}px;
  border-bottom-right-radius: ${({
    isOpened,
    theme: {
      form: { dropdown },
    },
  }) => (isOpened ? 0 : dropdown.boxRadius)}px;
  background-color: ${({
    isLightSkin,
    theme: {
      form: {
        dropdown: { dark, light },
      },
    },
  }) =>
    // eslint-disable-next-line no-nested-ternary
    isLightSkin
      ? light.states.normal.backgroundColor
      : dark.states.normal.backgroundColor};
  ${({ isOpened }) =>
    isOpened &&
    `
    box-shadow: 0 3px 6px ${smColors.black02Alpha};
  `}
  ${({
    isLightSkin,
    theme: {
      form: {
        dropdown: { light, dark },
      },
    },
  }) =>
    `
    color: ${
      isLightSkin ? light.states.normal.color : dark.states.normal.color
    };
    
    &:hover {
        color: ${
          isLightSkin ? light.states.normal.color : dark.states.normal.color
        };
     }; `}
`;

const Icon = styled.img<{ isOpened: boolean }>`
  height: 11px;
  width: 22px;
  margin: 0 10px;
  transform: rotate(${({ isOpened }) => (isOpened ? '180' : '0')}deg);
  transition: transform 0.2s linear;
  cursor: inherit;
`;

const DropdownRow = styled.div<{
  onClick: (e?: React.MouseEvent) => void;
  rowContentCentered: boolean;
  height: number | string;
  isDisabled: boolean;
  key: string;
  isLightSkin: boolean;
}>`
  display: flex;
  ${({ rowContentCentered }) =>
    rowContentCentered && `justify-content: center;`}
  align-items: center;
  height: ${({ height }) => height}px;
  cursor: ${({ isDisabled }) => (isDisabled ? 'default' : 'pointer')};
  padding: 0 10px;

  ${({
    isLightSkin,
    isDisabled,
    theme: {
      form: {
        dropdown: { light, dark },
      },
    },
  }) =>
    !isDisabled &&
    `&:hover {
            background-color: ${
              isLightSkin
                ? light.states.hover.backgroundColor
                : dark.states.hover.backgroundColor
            }; 
            color: ${
              isLightSkin ? light.states.hover.color : dark.states.hover.color
            };
     } `}
`;

const ItemsWrapper = styled.div<{
  rowHeight: number | string;
  isLightSkin: boolean;
  isOpened: boolean;
}>`
  position: absolute;
  top: ${({ rowHeight }) => Number(rowHeight) - 1 || rowHeight}px;
  width: 100%;
  flex: 1;
  z-index: 10;
  overflow: hidden;
  transition: all 0.2s linear;
  overflow-y: auto;
  box-sizing: content-box;
  box-shadow: 0 3px 6px ${smColors.black02Alpha};
  border-bottom-left-radius: ${({
    theme: {
      form: { dropdown },
    },
  }) => dropdown.boxRadius}px;
  border-bottom-right-radius: ${({
    theme: {
      form: { dropdown },
    },
  }) => dropdown.boxRadius}px;
  border: ${({
      theme: {
        form: {
          dropdown: { dark, light },
        },
      },
      isLightSkin,
    }) =>
      isLightSkin ? Number(light.isOutBorder) : Number(dark.isOutBorder)}px
    solid
    ${({
      theme: {
        form: {
          dropdown: { dark, light },
        },
      },
      isLightSkin,
    }) => (isLightSkin ? light.borderColor : dark.borderColor)};
  margin-left: ${({
    theme: {
      form: {
        dropdown: { dark, light },
      },
    },
    isLightSkin,
  }) =>
    `-${isLightSkin ? Number(light.isOutBorder) : Number(dark.isOutBorder)}px`};
  background-color: ${({
    theme: {
      form: {
        dropdown: { dark, light },
      },
    },
    isLightSkin,
  }) =>
    isLightSkin
      ? light.states.normal.backgroundColor
      : dark.states.normal.backgroundColor};

  ${DropdownRow}:last-child > div {
    border-bottom: none;
  }

  ${({
    theme: {
      colors: { light140 },
    },
  }) => `
  > div:first-child  {
      border-top: 1px solid ${light140};
  }
  
  > div:last-child  {
      border-bottom: none;
  }  
    
  > div {
    
    line-height: 1.5;
    border-bottom: 1px solid ${light140};

    &:hover {
      border-color: transparent;
    }
  }`};

  ${({ isOpened }) =>
    isOpened &&
    `
      border-top: none;
  `};
`;

const StyledDropDownItem = styled.div<{ uppercase?: boolean }>`
  width: 100%;
  font-size: 13px;
  ${({ uppercase }) =>
    uppercase &&
    css`
      text-transform: uppercase;
    `};
  color: ${smColors.black};
  cursor: inherit;
`;

type ADataItem = {
  [k: string]: any;
  isDisabled?: boolean;
  isMain?: boolean;
};

interface DropDownItemProps extends ADataItem {
  label: string;
  description: string;
  key: string;
}

const DropDownItem: React.FC<DropDownItemProps> = ({ label, description }) => {
  return (
    <StyledDropDownItem>
      <p>{label}</p>
      {description && (
        <small>
          <br />
          {description}
        </small>
      )}
    </StyledDropDownItem>
  );
};

type Props<T extends ADataItem> = {
  onClick: ({ index }: { index: number }) => void | Promise<number>;
  data: Partial<T>[];
  selectedItemIndex: number;
  isDarkMode?: boolean;
  rowHeight?: number | string;
  rowContentCentered?: boolean;
  isDisabled?: boolean;
  bgColor?: string;
  whiteIcon?: boolean;
};

const DropDown = <T extends ADataItem>({
  data,
  onClick,
  selectedItemIndex,
  isDarkMode,
  rowHeight = 44,
  rowContentCentered = true,
  isDisabled = false,
  bgColor = smColors.white,
  whiteIcon = false,
}: Props<T>) => {
  const [isOpened, setIsOpened] = useState(false);
  const closeDropdown = () => setIsOpened(false);
  useEffect(() => {
    window.addEventListener('click', closeDropdown);
    return () => window.removeEventListener('click', closeDropdown);
  }, []);
  const isDefault = bgColor === smColors.white;

  const isDisabledComputed = isDisabled || !data || !data.length;
  const icon =
    whiteIcon || isDarkMode ? chevronBottomWhite : chevronBottomBlack;

  const renderRow = ({
    item,
    index,
    rowHeight = 44,
    rowContentCentered,
  }: {
    item: Partial<T>;
    index: number;
    rowHeight?: number | string;
    rowContentCentered: boolean;
  }) => (
    <DropdownRow
      rowContentCentered={rowContentCentered}
      isDisabled={item.isDisabled || false}
      isLightSkin={isDefault}
      key={`${item?.label}${index}`}
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
      <DropDownItem
        key={(item.key as string) || String(index)}
        isMain={item?.isMain}
        isDisabled={item?.isDisabled}
        label={item?.label as string}
        description={item?.description as string}
      />
    </DropdownRow>
  );

  const handleToggle = () => {
    setIsOpened(!isOpened);
  };

  return (
    <Wrapper
      isLightSkin={isDefault}
      isDisabled={isDisabledComputed}
      isOpened={isOpened}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <HeaderWrapper
        isOpened={isOpened}
        isLightSkin={isDefault}
        onClick={isDisabledComputed ? () => {} : handleToggle}
        rowHeight={rowHeight}
      >
        <DropDownItem
          key={
            (data[selectedItemIndex].key as string) || String(selectedItemIndex)
          }
          isMain={data[selectedItemIndex]?.isMain}
          isDisabled={data[selectedItemIndex]?.isDisabled}
          label={data[selectedItemIndex]?.label as string}
          description={data[selectedItemIndex]?.description as string}
        />
        <Icon isOpened={isOpened} src={icon} />
      </HeaderWrapper>
      {isOpened && data && (
        <ItemsWrapper
          isLightSkin={isDefault}
          rowHeight={rowHeight}
          isOpened={isOpened}
        >
          {data.map((item, index: number) =>
            renderRow({ item, index, rowHeight, rowContentCentered })
          )}
        </ItemsWrapper>
      )}
    </Wrapper>
  );
};

export default DropDown;
