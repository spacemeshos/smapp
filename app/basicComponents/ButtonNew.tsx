import React from 'react';
import styled, { DefaultTheme } from 'styled-components';

import smColors from '../vars/colors';

const HEIGHT = '44px';

const ButtonShadow = styled.div`
  width: 100%;
  height: ${HEIGHT};
  z-index: 1;
  position: absolute;
  left: 4px;
  top: 4px;
  background: transparent;
  cursor: inherit;
`;

const ButtonBody = styled.div`
  position: relative;
  height: ${HEIGHT};
  padding: 0 1em;
  z-index: 2;
  font-size: 12px;
  line-height: ${HEIGHT};
  color: ${smColors.white};
  cursor: inherit;
`;

const borderState = (
  isPrimary: boolean,
  state: keyof DefaultTheme['button']['primary']['state'],
  theme: DefaultTheme['button']
) =>
  isPrimary
    ? theme.primary.settings.hasBorder &&
      `1px solid ${theme.primary.state[state]}`
    : theme.secondary.settings.hasBorder &&
      `1px solid ${theme.secondary.state[state]}`;

const colorState = (
  isPrimary: boolean,
  state: keyof DefaultTheme['button']['primary']['state'],
  theme: DefaultTheme['button']
) => (isPrimary ? theme.primary.state[state] : theme.secondary.state[state]);

const ButtonWrapper = styled.div<{
  isPrimary: boolean;
  isDisabled: boolean;
}>`
  position: relative;
  display: inline-block;

  ${({ isDisabled, isPrimary, theme: { button } }) => `
  cursor: ${isDisabled ? 'not-allowed' : 'pointer'};

  & > ${ButtonBody} {
    border-radius: ${
      isPrimary ? button.primary.boxRadius : button.secondary.boxRadius
    }px;

    ${
      isDisabled
        ? `
          background-color: ${colorState(isPrimary, 'inactive', button)};
          border: ${borderState(isPrimary, 'inactive', button)};
        `
        : `
          background-color: ${colorState(isPrimary, 'base', button)};
          border: ${borderState(isPrimary, 'base', button)};
        `
    }
  }

  & > ${ButtonShadow} {
    ${
      isDisabled
        ? `
          border: ${borderState(isPrimary, 'inactive', button)}
        `
        : `
          border: ${borderState(isPrimary, 'base', button)};
        `
    }
  }

  &:hover, &:focus {
    & > ${ButtonBody} {
      background-color: ${colorState(isPrimary, 'hover', button)};
      border: ${borderState(isPrimary, 'hover', button)};
    }
    & > ${ButtonShadow} {
      border: ${borderState(isPrimary, 'hover', button)};
    }
  }
  `}
`;

type Props = {
  text: string;
  onClick: (e?: React.MouseEvent) => void;
  isPrimary?: boolean;
  isDisabled?: boolean;
};

export const ButtonNew = ({
  text,
  onClick,
  isPrimary = false,
  isDisabled = false,
}: Props) => (
  <ButtonWrapper
    isPrimary={isPrimary}
    isDisabled={isDisabled}
    onClick={onClick}
  >
    <ButtonBody>{text}</ButtonBody>
    <ButtonShadow />
  </ButtonWrapper>
);

export const ButtonNewGroup = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 0 0 15px 0;
`;

export const ButtonNewDivider = styled.div`
  flex-grow: 1;
`;
