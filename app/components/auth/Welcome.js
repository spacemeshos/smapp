// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { SmCarousel, SmButton, Slide } from '/basicComponents';
import { steam, smcCoin } from '/assets/images';

type CarouselItem = {
  id: number,
  text: string,
  source: string
};

const carouselItems: Array<CarouselItem> = [
  {
    id: 1,
    text: 'Setup a local node on your computer and start earning spacemesh coins',
    source: smcCoin
  },
  {
    id: 2,
    text: 'Spacemesh Coins can be used to purchase Steam games and Steam game items',
    source: steam
  },
  {
    id: 3,
    text: 'Use your wallet to send and receive Spacemesh Coins',
    source: smcCoin
  },
  {
    id: 4,
    text: 'Your wallet can hold multiple accounts',
    source: smcCoin
  }
];

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
  padding: 30px;
`;

const BottomPart = styled.div`
  display: flex;
  flex-direction: column;
`;

type Props = {
  setCreationMode: () => void,
  setRestoreMode: () => void
};

class Welcome extends Component<Props> {
  render() {
    const { setCreationMode, setRestoreMode } = this.props;
    return (
      <Wrapper>
        <SmCarousel>
          {carouselItems.map((item) => (
            <Slide key={item.id} {...item} />
          ))}
        </SmCarousel>
        <BottomPart>
          <SmButton text="Create Wallet" theme="orange" center onPress={setCreationMode} style={{ marginTop: 20 }} />
          <SmButton text="Restore Wallet" theme="green" center onPress={setRestoreMode} style={{ marginTop: 20 }} />
        </BottomPart>
      </Wrapper>
    );
  }
}

export default Welcome;
