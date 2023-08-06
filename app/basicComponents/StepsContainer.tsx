import React from 'react';
import styled from 'styled-components';
import { smColors } from '../vars';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 290px;
  margin-right: 15px;
  background-color: ${({ theme }) =>
    theme.isDarkMode ? smColors.dMBlack1 : smColors.black10Alpha};
  ${({ theme }) => `border-radius: ${theme.box.radius}px;`}
`;

const SideBar = styled.img.attrs<{ isLeft: boolean }>(
  ({
    theme: {
      icons: { sidePanelLeftMed, sidePanelRightMed },
    },
    isLeft,
  }) => ({
    src: isLeft ? sidePanelLeftMed : sidePanelRightMed,
  })
)<{ isLeft: boolean }>`
  display: block;
  width: 18px;
  height: 100%;

  ${({ theme, isLeft }) => `
    border-top-left-radius: ${isLeft ? theme.box.radius : 0}px;
    border-top-right-radius: ${isLeft ? 0 : theme.box.radius}px;
    border-bottom-left-radius: ${isLeft ? theme.box.radius : 0}px;
    border-bottom-right-radius: ${isLeft ? 0 : theme.box.radius}px;
  `};
`;

const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 25px 15px;
`;

const StepContainer = styled.div<{ isFuture: boolean; key: string }>`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 15px;
  ${({ isFuture }) => isFuture && 'opacity: 0.4'}
`;

const StepText = styled.div<{ isCompleted: boolean; isCurrent: boolean }>`
  font-size: 13px;
  line-height: 17px;
  color: ${({ isCompleted, isCurrent, theme }) => {
    if (isCompleted || !isCurrent) {
      return theme.color.contrast;
    } else {
      return smColors.purple;
    }
  }};
  font-weight: ${({ isCompleted }) => (isCompleted ? 400 : 800)};
  text-align: right;
`;

const Indicator = styled.div<{ isCurrent: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 15px;
  height: 15px;
  margin-left: 10px;
  color: ${({ theme }) =>
    theme.isDarkMode ? smColors.dMBlack1 : smColors.white};
  font-size: 11px;
  background-color: ${({ isCurrent, theme }) => {
    if (isCurrent) {
      return smColors.purple;
    } else {
      return theme.color.contrast;
    }
  }};
  ${({ theme }) => `border-radius: ${theme.indicators.radius}px;`}
`;

const Icon = styled.img.attrs((props) => ({
  src: props.theme.icons.check,
}))`
  width: 15px;
  height: 15px;
  margin-left: 10px;
`;

type Props = {
  steps: Array<string>;
  currentStep: number;
};

const StepsContainer = ({ steps, currentStep }: Props) => {
  return (
    <Wrapper style={{ height: `${steps.length * 32 + 35}px` }}>
      <SideBar isLeft />
      <InnerWrapper>
        {steps.map((step, index) => (
          <StepContainer key={`step${index}`} isFuture={index > currentStep}>
            <StepText
              isCompleted={index < currentStep}
              isCurrent={index === currentStep}
            >
              {step}
            </StepText>
            {index < currentStep ? (
              <Icon />
            ) : (
              <Indicator isCurrent={index === currentStep}>
                {index + 1}
              </Indicator>
            )}
          </StepContainer>
        ))}
      </InnerWrapper>
      <SideBar isLeft={false} />
    </Wrapper>
  );
};

export default StepsContainer;
