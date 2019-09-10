// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { sidePanelRightMed, sidePanelLeftMed, checkIconWhite } from '/assets/images';
import { smColors } from '/vars';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 290px;
  height: 190px;
  margin-right: 15px;
  background-color: ${smColors.black10Alpha};
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
  color: ${({ isCompleted, isCurrent }) => (isCompleted || !isCurrent ? smColors.realBlack : smColors.purple)};
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
  color: ${smColors.white};
  font-size: 11px;
  background-color: ${({ isCompleted, isCurrent }) => (isCompleted || !isCurrent ? smColors.realBlack : smColors.purple)};
`;

const Icon = styled.img`
  width: 10px;
  height: 12px;
`;

type Props = {
  steps: Array<Object>,
  currentStep: number
};

class StepsContainer extends PureComponent<Props> {
  render() {
    const { steps, currentStep } = this.props;
    return (
      <Wrapper>
        <SideBar src={sidePanelLeftMed} />
        <InnerWrapper>
          {steps.map((step, index) => (
            <StepContainer key={step} isFuture={index > currentStep}>
              <StepText isCompleted={index < currentStep} isCurrent={index === currentStep}>
                {step}
              </StepText>
              <Indicator isCompleted={index < currentStep} isCurrent={index === currentStep}>
                {index < currentStep ? <Icon src={checkIconWhite} /> : index + 1}
              </Indicator>
            </StepContainer>
          ))}
        </InnerWrapper>
        <SideBar src={sidePanelRightMed} />
      </Wrapper>
    );
  }
}

export default StepsContainer;
