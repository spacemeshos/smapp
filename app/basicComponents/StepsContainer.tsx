import React from 'react';
import styled from 'styled-components';
import {
  sidePanelRightMed,
  sidePanelRightMedWhite,
  sidePanelLeftMed,
  sidePanelLeftMedWhite,
  checkBlack,
  checkWhite,
} from '../assets/images';
import { smColors } from '../vars';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 290px;
  margin-right: 15px;
  background-color: ${({ theme }) =>
    theme.isDarkMode ? smColors.dMBlack1 : smColors.black10Alpha};
`;

const SideBar = styled.img`
  display: block;
  width: 13px;
  height: 100%;
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
      return theme.isDarkMode ? smColors.white : smColors.realBlack;
    } else {
      return smColors.purple;
    }
  }};
  font-family: ${({ isCompleted }) =>
    isCompleted ? 'SourceCodePro' : 'SourceCodeProBold'};
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
      return theme.isDarkMode ? smColors.white : smColors.realBlack;
    }
  }};
`;

const Icon = styled.img`
  width: 15px;
  height: 15px;
  margin-left: 10px;
`;

type Props = {
  steps: Array<string>;
  currentStep: number;
  isDarkMode: boolean;
};

const StepsContainer = ({ steps, currentStep, isDarkMode }: Props) => {
  const leftImg = isDarkMode ? sidePanelLeftMedWhite : sidePanelLeftMed;
  const rightImg = isDarkMode ? sidePanelRightMedWhite : sidePanelRightMed;
  const checkIcon = isDarkMode ? checkWhite : checkBlack;
  return (
    <Wrapper style={{ height: `${steps.length * 32 + 35}px` }}>
      <SideBar src={leftImg} />
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
              <Icon src={checkIcon} />
            ) : (
              <Indicator isCurrent={index === currentStep}>
                {index + 1}
              </Indicator>
            )}
          </StepContainer>
        ))}
      </InnerWrapper>
      <SideBar src={rightImg} />
    </Wrapper>
  );
};

export default StepsContainer;
