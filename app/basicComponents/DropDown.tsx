import React, { useState, useEffect } from 'react';
import styled, { css, useTheme } from 'styled-components';
import { smColors } from '../vars';

const Wrapper = styled.div<{
  isDisabled: boolean;
  isDarkMode: boolean;
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
          dropdown: { isOutBorder },
        },
      },
    }) => Number(isOutBorder)}px
    solid
    ${({
      theme: {
        form: {
          dropdown: { dark, light },
        },
      },
      isDarkMode,
    }) => (isDarkMode ? dark.borderColor : light.borderColor)};
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
  isDarkMode: boolean;
}>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: ${({ rowHeight }) =>
    Number(rowHeight) ? `${rowHeight}px` : rowHeight};
  cursor: default;
  padding: 4px 10px;
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
    isDarkMode,
    theme: {
      form: {
        dropdown: { dark, light },
      },
    },
  }) =>
    // eslint-disable-next-line no-nested-ternary
    isDarkMode
      ? dark.states.normal.backgroundColor
      : light.states.normal.backgroundColor};
  ${({ isOpened }) =>
    isOpened &&
    `
    box-shadow: 0 3px 6px ${smColors.black02Alpha};
  `}
  ${({
    isDarkMode,
    theme: {
      form: {
        dropdown: { light, dark },
      },
    },
  }) =>
    `
    color: ${isDarkMode ? dark.states.normal.color : light.states.normal.color};
    
    &:hover {
        color: ${
          isDarkMode ? dark.states.normal.color : light.states.normal.color
        };
     }; `}
`;
const Icon = styled.img.attrs<{ isDark?: boolean }>(({ theme, isDark }) => ({
  src: !isDark
    ? theme.icons.chevronPrimaryDropDownBottom
    : theme.icons.chevronSecondaryDropDownBottom,
}))<{ isOpened: boolean; isDark?: boolean }>`
  height: 11px;
  width: 22px;
  transform: rotate(${({ isOpened }) => (isOpened ? '180' : '0')}deg);
  transition: transform 0.2s linear;
  cursor: inherit;
  z-index: 100;
`;

const DropdownRow = styled.div<{
  onClick: (e?: React.MouseEvent) => void;
  height: number | string;
  isDisabled: boolean;
  key: string;
  isDarkMode: boolean;
}>`
  display: flex;
  align-items: center;
  height: ${({ height }) => height}px;
  cursor: ${({ isDisabled }) => (isDisabled ? 'default' : 'pointer')};
  padding: 4px 10px;

  ${({
    isDarkMode,
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
              isDarkMode
                ? dark.states.hover.backgroundColor
                : light.states.hover.backgroundColor
            }; 
            color: ${
              isDarkMode ? dark.states.hover.color : light.states.hover.color
            };
     } `}
`;

const ItemsWrapper = styled.div<{
  rowHeight: number | string;
  isDarkMode: boolean;
  isOpened: boolean;
  maxHeight?: number;
}>`
  max-height: ${({ maxHeight }) => `${maxHeight}px`};
  position: absolute;
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
      isDarkMode,
    }) => (isDarkMode ? Number(dark.isOutBorder) : Number(light.isOutBorder))}px
    solid
    ${({
      theme: {
        form: {
          dropdown: { dark, light },
        },
      },
      isDarkMode,
    }) => (isDarkMode ? dark.borderColor : light.borderColor)};
  margin-left: ${({
    theme: {
      form: {
        dropdown: { dark, light },
      },
    },
    isDarkMode,
  }) =>
    `-${isDarkMode ? Number(dark.isOutBorder) : Number(light.isOutBorder)}px`};
  background-color: ${({
    theme: {
      form: {
        dropdown: { dark, light },
      },
    },
    isDarkMode,
  }) =>
    isDarkMode
      ? dark.states.normal.backgroundColor
      : light.states.normal.backgroundColor};

  ${DropdownRow}:last-child > div {
    border-bottom: none;
  }

  ${({
    isDarkMode,
    theme: {
      form: {
        dropdown: { dark, light },
      },
    },
  }) => `
  
  > div:first-child {
    border-top: 1px solid ${isDarkMode ? dark.borderColor : light.borderColor};
  }
  
  > div:last-child  {
      border-bottom: none;
  }  
    
  > div {
    
    border-bottom: 1px solid  ${
      isDarkMode ? dark.borderColor : light.borderColor
    };

    &:hover {
      border-color: transparent;
    }
  }`};

  ${({ isOpened }) =>
    isOpened &&
    `
      border-top: none;
  `};
  top: 100%;
`;

const StyledDropDownItem = styled.div<{
  uppercase?: boolean;
  isDarkMode: boolean;
}>`
  width: 100%;
  font-size: 13px;
  ${({ uppercase }) =>
    uppercase &&
    css`
      text-transform: uppercase;
    `};
  color: ${({
    isDarkMode,
    theme: {
      form: {
        dropdown: { dark, light },
      },
    },
  }) => (isDarkMode ? dark.states.hover.color : light.states.hover.color)};
  cursor: inherit;
`;
const DropDownLabel = styled.p<{
  isBold?: boolean;
  uppercase?: boolean;
}>`
  font-weight: ${({ isBold }) => (isBold ? 800 : 400)};
  font-size: 14px;
  text-transform: ${({ uppercase }) => (uppercase ? 'uppercase' : 'inherit')};
`;

const DropDownLabelDescription = styled.p<{
  isBold?: boolean;
}>`
  font-weight: ${({ isBold }) => (isBold ? 800 : 400)};
  font-size: 12px;
  text-transform: uppercase;
  margin-top: 6px;
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
  isDarkMode: boolean;
  isBold?: boolean;
}

const DropDownItem: React.FC<DropDownItemProps> = ({
  label,
  description,
  isDarkMode,
  isBold,
}) => (
  <StyledDropDownItem isDarkMode={isDarkMode}>
    <DropDownLabel isBold={isBold} uppercase={Boolean(description)}>
      {label}
    </DropDownLabel>
    {description && (
      <DropDownLabelDescription>{description}</DropDownLabelDescription>
    )}
  </StyledDropDownItem>
);

type Props<T extends ADataItem> = {
  onClick: ({ index }: { index: number }) => void | Promise<number>;
  data: Partial<T>[];
  selectedItemIndex: number;
  rowHeight?: number | string;
  isDisabled?: boolean;
  bold?: boolean;
  hideSelectedItem?: boolean;
  dark?: boolean;
  maxHeight?: number;
};

const DropDown = <T extends ADataItem>({
  data,
  onClick,
  selectedItemIndex,
  rowHeight = 44,
  isDisabled = false,
  bold = false,
  hideSelectedItem = false,
  dark = undefined,
  maxHeight = undefined,
}: Props<T>) => {
  const theme = useTheme();
  const [isOpened, setIsOpened] = useState(false);
  const closeDropdown = () => setIsOpened(false);
  useEffect(() => {
    window.addEventListener('click', closeDropdown);
    return () => window.removeEventListener('click', closeDropdown);
  }, []);
  const isDisabledComputed = isDisabled || !data || !data.length;
  const isLightTheme = dark === undefined ? !theme.isDarkMode : dark;

  const renderRow = ({
    item,
    index,
    rowHeight = 44,
  }: {
    item: Partial<T>;
    index: number;
    rowHeight?: number | string;
  }) => (
    <DropdownRow
      isDisabled={item.isDisabled || false}
      isDarkMode={isLightTheme}
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
        isDarkMode={isLightTheme}
        key={(item.key as string) || String(index)}
        isMain={item?.isMain}
        isDisabled={item?.isDisabled}
        label={item?.label as string}
        description={item?.description as string}
        isBold={bold}
      />
    </DropdownRow>
  );

  const handleToggle = () => {
    setIsOpened(!isOpened);
  };

  return (
    <Wrapper
      isDarkMode={isLightTheme}
      isDisabled={isDisabledComputed}
      isOpened={isOpened}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <HeaderWrapper
        isOpened={isOpened}
        isDarkMode={isLightTheme}
        onClick={isDisabledComputed ? () => {} : handleToggle}
        rowHeight={rowHeight}
      >
        <DropDownItem
          isDarkMode={isLightTheme}
          key={
            (data[selectedItemIndex].key as string) || String(selectedItemIndex)
          }
          isMain={data[selectedItemIndex]?.isMain}
          isDisabled={data[selectedItemIndex]?.isDisabled}
          label={data[selectedItemIndex]?.label as string}
          description={data[selectedItemIndex]?.description as string}
          isBold={bold}
        />
        <Icon isOpened={isOpened} isDark={dark} />
      </HeaderWrapper>
      {isOpened && data && (
        <ItemsWrapper
          isDarkMode={isLightTheme}
          rowHeight={rowHeight}
          isOpened={isOpened}
          maxHeight={maxHeight}
        >
          {data.map((item, index: number) =>
            hideSelectedItem && Number(index) === Number(selectedItemIndex)
              ? null
              : renderRow({ item, index, rowHeight })
          )}
        </ItemsWrapper>
      )}
    </Wrapper>
  );
};

export default DropDown;
