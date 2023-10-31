import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { smColors } from '../../vars';
import { PostSetupProvider, NodeStatus } from '../../../shared/types';
import { captureReactBreadcrumb } from '../../sentry';
import { eventsService } from '../../infra/eventsService';
import Carousel from './Carousel';
import PoSFooter from './PoSFooter';

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
  providers: PostSetupProvider[];
  provider: PostSetupProvider | undefined;
  setProvider: (provider: PostSetupProvider) => void;
  nextAction: () => void;
  skipAction: () => void;
  status: NodeStatus | null;
};

const getFastestProvider = (
  providers: PostSetupProvider[]
): PostSetupProvider =>
  providers.sort((a, b) => b.performance - a.performance)[0];

const findProviderIndexEqTo = (
  eqProps: Partial<PostSetupProvider>,
  providers: PostSetupProvider[]
): number =>
  providers.findIndex(
    (provider) => provider.id === eqProps.id && provider.model === eqProps.model
  );

const PoSProvider = ({
  providers,
  provider,
  setProvider,
  nextAction,
  skipAction,
  status,
}: Props) => {
  const [isTimedout, setTimedOut] = useState(false);
  const [selectedProviderIndex, setSelectedProviderIndex] = useState(
    provider
      ? findProviderIndexEqTo(provider, providers)
      : findProviderIndexEqTo(getFastestProvider(providers), providers)
  );

  useEffect(() => {
    eventsService.requestPostSetupProviders();
    const t = setTimeout(() => setTimedOut(true), 30000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const fastestProvider = getFastestProvider(providers);
    if (!provider) {
      setSelectedProviderIndex(
        findProviderIndexEqTo(fastestProvider, providers)
      );
      setProvider(fastestProvider);
    } else {
      setProvider(providers[selectedProviderIndex]);
    }
  }, [provider, providers, selectedProviderIndex, setProvider]);
  const handleSetProcessor = ({ index }: { index: number }) => {
    setSelectedProviderIndex(index);
    captureReactBreadcrumb({
      category: 'PoS Provider',
      data: {
        action: 'Calculating PoS processor',
      },
      level: 'info',
    });
  };

  const handleNextAction = () => {
    nextAction();
    captureReactBreadcrumb({
      category: 'PoS Provider',
      data: {
        action: 'Click on next action button',
      },
      level: 'info',
    });
  };

  const hasProviders = providers && providers.length > 0;

  return (
    <>
      {/* eslint-disable no-nested-ternary */}
      {hasProviders ? (
        <Carousel
          data={providers}
          onClick={handleSetProcessor}
          selectedItemIndex={selectedProviderIndex}
        />
      ) : isTimedout ? (
        <ErrorText>NO SUPPORTED PROCESSOR DETECTED</ErrorText>
      ) : (
        <Text>DETECTING POS PROCESSORS...</Text>
      )}
      {/* eslint-enable no-nested-ternary */}
      <PoSFooter
        action={handleNextAction}
        skipAction={providers.length === 0 ? skipAction : undefined}
        isDisabled={selectedProviderIndex === -1 || !status}
      />
    </>
  );
};

export default PoSProvider;
