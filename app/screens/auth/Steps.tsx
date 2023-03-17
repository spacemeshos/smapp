import React from 'react';
import { StepsContainer } from '../../basicComponents';

export enum Step {
  NEW_WALLET_SETUP = 'NEW WALLET SETUP',
  NEW_WALLET_TYPE = 'NEW WALLET TYPE',
  CREATE_WALLET = 'CREATE WALLET',
  PROTECT_WALLET = 'PROTECT WALLET',
  SELECT_NETWORK = 'SELECT NETWORK',
  WALLET_CREATED = 'WALLET CREATED',
}
const STEPS_ORDERED = [
  Step.NEW_WALLET_SETUP,
  Step.NEW_WALLET_TYPE,
  Step.SELECT_NETWORK,
  Step.CREATE_WALLET,
  Step.PROTECT_WALLET,
  Step.WALLET_CREATED,
];

const Steps = ({ step = Step[0] }: { step: Step }) => (
  <StepsContainer
    steps={STEPS_ORDERED}
    currentStep={STEPS_ORDERED.indexOf(step)}
  />
);

export default Steps;
