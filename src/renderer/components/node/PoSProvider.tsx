import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Tooltip } from '../../basicComponents';
import { smColors } from '../../vars';
import { PostSetupComputeProvider, NodeStatus } from '../../../shared/types';
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
  color: ${({ theme: { color } }) => color.primary};
`;

const ErrorText = styled.div`
  font-size: 20px;
  line-height: 25px;
  color: ${smColors.red};
`;

type Props = {
  providers: PostSetupComputeProvider[];
  provider: PostSetupComputeProvider | undefined;
  setProvider: (provider: PostSetupComputeProvider) => void;
  throttle: boolean;
  setThrottle: (throttle: boolean) => void;
  nextAction: () => void;
  status: NodeStatus | null;
};

const getFastestProvider = (
  providers: PostSetupComputeProvider[]
): PostSetupComputeProvider =>
  providers.sort((a, b) => b.performance - a.performance)[0];

const findProviderIndexEqTo = (
  eqProps: Partial<PostSetupComputeProvider>,
  providers: PostSetupComputeProvider[]
): number =>
  providers.findIndex(
    (provider) => provider.id === eqProps.id && provider.model === eqProps.model
  );

const PoSProvider = ({
  providers,
  provider,
  setProvider,
  throttle,
  setThrottle,
  nextAction,
  status,
}: Props) => {
  const [selectedProviderIndex, setSelectedProviderIndex] = useState(
    provider
      ? findProviderIndexEqTo(provider, providers)
      : findProviderIndexEqTo(getFastestProvider(providers), providers)
  );

  useEffect(() => setProvider(providers[selectedProviderIndex]), [
    providers,
    selectedProviderIndex,
    setProvider,
  ]);

  const handleSetProcessor = ({ index }: { index: number }) =>
    setSelectedProviderIndex(index);

  return (
    <>
      {!providers ? (
        <Text>CALCULATING POS PROCESSORS</Text>
      ) : (
        <Carousel
          data={providers}
          onClick={handleSetProcessor}
          selectedItemIndex={selectedProviderIndex}
        />
      )}
      {providers && providers.length === 0 && (
        <ErrorText>NO SUPPORTED PROCESSOR DETECTED</ErrorText>
      )}
      <PauseSelector>
        <Checkbox isChecked={throttle} check={() => setThrottle(!throttle)} />
        <Text>PAUSE WHEN SOMEONE IS USING THIS COMPUTER</Text>
        <Tooltip width={200} text="Some text" />
      </PauseSelector>
      <PoSFooter
        action={nextAction}
        isDisabled={selectedProviderIndex === -1 || !status}
      />
    </>
  );
};

export default PoSProvider;
