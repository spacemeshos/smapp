// @flow
import { clipboard } from 'electron';
import React, { Component } from 'react';
import styled from 'styled-components';
import type { RouterHistory } from 'react-router-dom';
import { connect } from 'react-redux';
// import { backupWallet } from '/redux/wallet/actions';
import get from 'lodash.get';
import { SmButton } from '/basicComponents';
import { smColors } from '/vars';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
  flex-direction: flex-start;
  padding: 50px;
`;

const Header = styled.span`
  font-size: 31px;
  font-weight: bold;
  line-height: 42px;
  color: ${smColors.lighterBlack};
  margin-bottom: 20px;
`;

const HeaderExplanation = styled.div`
  font-size: 16px;
  color: ${smColors.lighterBlack};
  line-height: 30px;
  margin-bottom: 22px;
`;

const BaseText = styled.span`
  font-size: 16px;
  font-weight: normal;
  line-height: 22px;
  color: ${smColors.lighterBlack};
`;

const ActionLink = styled(BaseText)`
  user-select: none;
  color: ${smColors.darkGreen};
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
  &:active {
    opacity: 0.6;
  }
`;

const Text = styled.span`
  font-size: 18px;
  color: ${smColors.darkGray};
  line-height: 24px;
`;

const Indices = styled(Text)`
  color: ${smColors.darkGray50Alpha};
  margin-right: 50px;
`;

const TwelveWordsContainer = styled.div`
  border: 1px solid ${smColors.darkGreen};
  padding: 28px;
  margin-bottom: 22px;
  column-count: 3;
`;

const WordWrapper = styled.div`
  height: 50px;
  line-height: 50px;
`;

const NotificationSection = styled.div`
  display: flex;
  flex-direction: column;
  height: 48px;
  margin-bottom: 22px;
`;

const Notification = styled(BaseText)`
  line-height: 22px;
  color: ${smColors.darkGreen};
`;

const ButtonsRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 22px;
`;

const LeftButtonsContainer = styled.div`
  display: flex;
`;

type Props = {
  history: RouterHistory,
  mnemonic: string
};

type State = {
  twelveWords: string[],
  twelveWordsCopied: boolean
};

class TwelveWordsBackup extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      twelveWords: props.mnemonic ? props.mnemonic.split(' ') : [],
      twelveWordsCopied: false
    };
  }

  render() {
    const { twelveWords, twelveWordsCopied } = this.state;

    return (
      <Wrapper>
        <Header>Create a 12 Words Backup</Header>
        <HeaderExplanation>
          A 12 Words Backup is a numbered list of words written down on a paper. You can restore your wallet in the future using the list. Write down this numbered words list on a
          paper and store the paper in a safe place. Alternatively, print it, or copy & paste it into your password manager.
        </HeaderExplanation>
        <TwelveWordsContainer>
          {twelveWords.map((word: string, index: number) => (
            <WordWrapper key={word}>
              <Indices>{`${index + 1}`}</Indices>
              <Text>{word}</Text>
            </WordWrapper>
          ))}
        </TwelveWordsContainer>
        <NotificationSection>
          {twelveWordsCopied && (
            <React.Fragment>
              <Notification>The list has been copied to your clipboard. Paste it into your password manager.</Notification>
              <Notification>Next step, we will test you with a small little game.</Notification>
            </React.Fragment>
          )}
        </NotificationSection>
        <ButtonsRow>
          <LeftButtonsContainer>
            <SmButton text="Print" theme="green" onPress={this.print12Words} style={{ width: 144, marginRight: 18 }} />
            <SmButton text="Copy" theme="green" onPress={this.copy12Words} style={{ width: 144 }} />
          </LeftButtonsContainer>
          <SmButton text="Test Me" theme="orange" onPress={this.navigateToTestMe} style={{ width: 144 }} />
        </ButtonsRow>
        <ActionLink onClick={this.learnMoreAboutPaperBackup}>Learn more about paper backup</ActionLink>
      </Wrapper>
    );
  }

  navigateToTestMe = () => {
    const { history } = this.props;
    history.push('/main/wallet/test-twelve-words-backup'); // TODO: impelment this nav and component
  };

  copy12Words = () => {
    const { mnemonic } = this.props;
    clipboard.writeText(mnemonic);
    this.setState({ twelveWordsCopied: true });
  };

  print12Words = () => {};

  learnMoreAboutPaperBackup = () => {};
}
const mapStateToProps = (state) => ({
  mnemonic: get(state.wallet.wallet, 'crypto.cipherText.mnemonic', null)
});

TwelveWordsBackup = connect(mapStateToProps)(TwelveWordsBackup);

export default TwelveWordsBackup;
