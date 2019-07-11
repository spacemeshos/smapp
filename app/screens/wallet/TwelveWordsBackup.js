// @flow
import { clipboard, shell } from 'electron';
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import type { RouterHistory } from 'react-router-dom';
import { SmButton } from '/basicComponents';
import { smColors } from '/vars';
import { printService } from '/infra/printService';
import { localStorageService } from '/infra/storageService';

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
  margin-bottom: 30px;
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
  line-height: 48px;
`;

const IndexWrapper = styled.div`
  width: 28px;
  margin-right: 50px;
  text-align: right;
`;

const Index = styled(Text)`
  color: ${smColors.darkGray50Alpha};
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
  display: flex;
`;

const NotificationSection = styled.div`
  display: flex;
  flex-direction: column;
  height: 50px;
  margin-bottom: 22px;
`;

const Notification = styled(BaseText)`
  line-height: 30px;
  color: ${smColors.darkGreen};
`;

const ButtonsRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 30px;
`;

const LeftButtonsContainer = styled.div`
  display: flex;
`;

type Props = {
  history: RouterHistory,
  mnemonic: string
};

type State = {
  isTwelveWordsCopied: boolean
};

class TwelveWordsBackup extends Component<Props, State> {
  twelveWords: Array<string>;

  twelveWordsPrint: string;

  constructor(props: Props) {
    super(props);
    this.state = {
      isTwelveWordsCopied: false
    };
    const { mnemonic } = props;
    this.twelveWords = mnemonic.split(' ');
    this.twelveWordsPrint = '<div>';
    this.twelveWords.forEach((word: string, index: number) => {
      this.twelveWordsPrint += `<h2>${index + 1} ${word}</h2>`;
    });
    this.twelveWordsPrint += '</div>';
  }

  render() {
    const { isTwelveWordsCopied } = this.state;
    return (
      <Wrapper>
        <Header>Create a 12 Words Backup</Header>
        <HeaderExplanation>
          A 12 Words Backup is a numbered list of words written down on a paper. You can restore your wallet in the future using the list. Write down this numbered words list on a
          paper and store the paper in a safe place. Alternatively, print it, or copy & paste it into your password manager.
        </HeaderExplanation>
        <TwelveWordsContainer>
          {this.twelveWords.map((word: string, index: number) => (
            <WordWrapper key={word}>
              <IndexWrapper>
                <Index>{`${index + 1}`}</Index>
              </IndexWrapper>
              <Text>{word}</Text>
            </WordWrapper>
          ))}
        </TwelveWordsContainer>
        <NotificationSection>
          {isTwelveWordsCopied && (
            <React.Fragment>
              <Notification>The list has been copied to your clipboard. Paste it into your password manager.</Notification>
              <Notification>Next step, we will test you with a small little game.</Notification>
            </React.Fragment>
          )}
        </NotificationSection>
        <ButtonsRow>
          <LeftButtonsContainer>
            <SmButton text="Print" theme="green" onPress={this.print12Words} style={{ width: 150, marginRight: 20 }} />
            <SmButton text="Copy" theme="green" onPress={this.copy12Words} style={{ width: 150 }} />
          </LeftButtonsContainer>
          <SmButton text="Test Me" theme="orange" onPress={this.navigateToTestMe} style={{ width: 150 }} />
        </ButtonsRow>
        <ActionLink onClick={this.learnMoreAboutPaperBackup}>Learn more about paper backup</ActionLink>
      </Wrapper>
    );
  }

  navigateToTestMe = () => {
    const { history } = this.props;
    history.push('/main/wallet/test-twelve-words-backup'); // TODO: implement this nav and component
    localStorageService.set('hasBackup', true);
  };

  copy12Words = () => {
    const { mnemonic } = this.props;
    clipboard.writeText(mnemonic);
    localStorageService.set('hasBackup', true);
    this.setState({ isTwelveWordsCopied: true });
  };

  print12Words = () => {
    printService.print({ content: this.twelveWordsPrint });
    localStorageService.set('hasBackup', true);
  };

  learnMoreAboutPaperBackup = () => shell.openExternal('https://testnet.spacemesh.io'); // TODO: connect to actual link
}

const mapStateToProps = (state) => ({
  mnemonic: state.wallet.mnemonic
});

// $FlowConnectIssue
TwelveWordsBackup = connect(mapStateToProps)(TwelveWordsBackup);
export default TwelveWordsBackup;
