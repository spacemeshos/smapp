// @flow
import React from 'react';
import styled from 'styled-components';
import { sidePanelRightMed, sidePanelRightMedWhite, sidePanelLeftMed, sidePanelLeftMedWhite, checkBlack, checkWhite } from '/assets/images';
import { smColors } from '/vars';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 290px;
  height: 190px;
  margin-right: 15px;
  background-color: ${({ theme }) => (theme.isDarkModeOn ? smColors.dMBlack1 : smColors.black10Alpha)};
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

const Header = styled.div`
  align-self: center;
  margin-bottom: 10px;
  font-size: 15px;
  line-height: 20px;
  color: ${({ theme }) => (theme.isDarkModeOn ? smColors.white : smColors.realBlack)};
  font-family: SourceCodeProBold;
`;

const StepContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 15px;
  ${({ isFuture }) => isFuture && 'opacity: 0.4'}
`;

const StepText = styled.div`
  font-size: 13px;
  line-height: 17px;
  color: ${({ isCompleted, isCurrent, theme }) => {
    if (isCompleted || !isCurrent) {
      return theme.isDarkModeOn ? smColors.white : smColors.realBlack;
    } else {
      return smColors.purple;
    }
  }};
  font-family: ${({ isCompleted }) => (isCompleted ? 'SourceCodePro' : 'SourceCodeProBold')};
  text-align: right;
`;

const Indicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 15px;
  height: 15px;
  margin-left: 10px;
  color: ${({ theme }) => (theme.isDarkModeOn ? smColors.dMBlack1 : smColors.white)};
  font-size: 11px;
  background-color: ${({ isCurrent, theme }) => {
    if (isCurrent) {
      return smColors.purple;
    } else {
      return theme.isDarkModeOn ? smColors.white : smColors.realBlack;
    }
  }};
`;

const Icon = styled.img`
  width: 15px;
  height: 15px;
  margin-left: 10px;
`;

type Props = {
  steps: Array<Object>,
  header: string,
  currentStep: number,
  isDarkModeOn: boolean
};

const StepsContainer = ({ steps, header, currentStep, isDarkModeOn }: Props) => {
  const leftImg = isDarkModeOn ? sidePanelLeftMedWhite : sidePanelLeftMed;
  const rightImg = isDarkModeOn ? sidePanelRightMedWhite : sidePanelRightMed;
  const checkIcon = isDarkModeOn ? checkWhite : checkBlack;
  return (
    <Wrapper>
      <SideBar src={leftImg} />
      <InnerWrapper>
        <Header>{header}</Header>
        {steps.map((step, index) => (
          <StepContainer key={step} isFuture={index > currentStep}>
            <StepText isCompleted={index < currentStep} isCurrent={index === currentStep}>
              {step}
            </StepText>
            {index < currentStep ? <Icon src={checkIcon} /> : <Indicator isCurrent={index === currentStep}>{index + 1}</Indicator>}
          </StepContainer>
        ))}
      </InnerWrapper>
      <SideBar src={rightImg} />
    </Wrapper>
  );
};

export default StepsContainer;
