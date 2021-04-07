import React, { useState } from 'react';
import styled from 'styled-components';
import { Tooltip } from '../../basicComponents';
import { smColors } from '../../vars';
import { ComputeProvider, ComputeProviders, Status } from '../../types';
import Carousel from './Carousel';
import Checkbox from './Checkbox';
import PoSFooter from './PoSFooter';

const PauseSelector = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 20px;
`;

const Text = styled.div`
  font-size: 15px;
  line-height: 17px;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.black)};
`;

const ErrorText = styled.div`
  font-size: 20px;
  line-height: 25px;
  color: ${smColors.red};
`;

type Props = {
  providers: ComputeProviders;
  provider: ComputeProvider | undefined;
  setProvider: (provider: ComputeProvider) => void;
  throttle: boolean;
  setThrottle: (throttle: boolean) => void;
  nextAction: () => void;
  status: Status | null;
  isDarkMode: boolean;
};

const PoSProvider = ({ providers, provider, setProvider, throttle, setThrottle, nextAction, status, isDarkMode }: Props) => {
  const [selectedProviderIndex, setSelectedProviderIndex] = useState(provider ? providers.findIndex(({ id, model }) => id === provider.id && model === provider.model) : -1);

  const handleSetProcessor = ({ index }: { index: number }) => {
    setSelectedProviderIndex(index);
    setProvider(providers[index]);
  };

  return (
    <>
      {!providers ? <Text>CALCULATING POS PROCESSORS</Text> : <Carousel data={providers} onClick={handleSetProcessor} selectedItemIndex={selectedProviderIndex} />}
      {providers && providers.length === 0 && <ErrorText>NO SUPPORTED PROCESSOR DETECTED</ErrorText>}
      <PauseSelector>
        <Checkbox isChecked={throttle} check={() => setThrottle(!throttle)} />
        <Text>PAUSE WHEN SOMEONE IS USING THIS COMPUTER</Text>
        <Tooltip width={200} text="Some text" isDarkMode={isDarkMode} />
      </PauseSelector>
      <PoSFooter action={nextAction} isDisabled={selectedProviderIndex === -1 || !status} />
    </>
  );
};

export default PoSProvider;
