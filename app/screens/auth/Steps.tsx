import React from 'react';
import { StepsContainer } from '../../basicComponents';

export enum Step {
  NEW_WALLET_SETUP = 'NEW WALLET SETUP',
  NEW_WALLET_TYPE = 'NEW WALLET TYPE',
  PROTECT_WALLET = 'PROTECT_WALLET',
  SELECT_NETWORK = 'SELECT NETWORK',
}
const STEPS_ORDERED = [
  Step.NEW_WALLET_SETUP,
  Step.NEW_WALLET_TYPE,
  Step.SELECT_NETWORK,
  Step.PROTECT_WALLET,
];

const Steps = ({ step = Step[0] }: { step: Step }) => (
  <StepsContainer
    steps={STEPS_ORDERED}
    currentStep={STEPS_ORDERED.indexOf(step)}
  />
);

export default Steps;
