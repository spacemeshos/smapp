// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { connect } from 'react-redux';
import type { RouterHistory } from 'react-router-dom';
import { DropContainer, DragItem } from '/components/wallet';
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
  line-height: 32px;
`;

const IndexWrapper = styled.div`
  height: 32px;
  line-height: 32px;
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
  height: 25px;
  margin-bottom: 22px;
`;

// $FlowStyledIssue
const Notification = styled(BaseText)`
  font-weight: bold;
  line-height: 30px;
  color: ${({ color }) => color};
`;

const WordOptionsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin-bottom: 42px;
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

const getTestWords = (mnemonic: string) => {
  const twelveWords = mnemonic.split(' ');
  const indices = [];
  while (indices.length < 4) {
    const idx = Math.floor(Math.random() * 12);
    if (!indices.includes(idx)) {
      indices.push(idx);
    }
  }
  const testWords: string[] = [];
  indices.forEach((index: number) => {
    testWords.push(twelveWords[index]);
  });
  return testWords;
};

type Props = {
  history: RouterHistory,
  mnemonic: string
};

type State = {
  testWords: string[],
  twelveWords: Array<Object>,
  dropsCounter: number,
  matchCounter: number
};

class TestMe extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { mnemonic } = props;
    this.state = {
      testWords: getTestWords(mnemonic),
      twelveWords: mnemonic.split(' ').map((word) => ({ word, droppedWord: '' })),
      dropsCounter: 0,
      matchCounter: 0
    };
  }

  render() {
    const { history } = this.props;
    const { testWords, twelveWords, dropsCounter, matchCounter } = this.state;
    const isTestSuccess = matchCounter === 4 && dropsCounter === 4;
    const isTestFailed = matchCounter < 4 && dropsCounter === 4;
    return (
      <Wrapper>
        <DragDropContextProvider backend={HTML5Backend}>
          <Header>Create a 12 Words Backup</Header>
          <HeaderExplanation>Drag each of the 4 words below to its matching number in your paper backup words list.</HeaderExplanation>
          <WordOptionsContainer>
            {testWords.map((word: string) => (
              <DragItem key={word} word={word} isDropped={this.checkIfWasDropped(word)} />
            ))}
          </WordOptionsContainer>
          <TwelveWordsContainer>
            {twelveWords.map(({ word, droppedWord }: { word: string, droppedWord: string }, index: number) => (
              <WordWrapper key={word}>
                <IndexWrapper>
                  <Index>{`${index + 1}`}</Index>
                </IndexWrapper>
                <DropContainer droppedWord={droppedWord} onDrop={this.handleDrop({ word, index })} />
              </WordWrapper>
            ))}
          </TwelveWordsContainer>
          <NotificationSection>
            {isTestSuccess && <Notification color={smColors.orange}>All right! Your 12 Words Backup is confirmed</Notification>}
            {isTestFailed && <Notification color={smColors.red}>No match. Check your 12 Words Paper Backup and try again.</Notification>}
          </NotificationSection>
          <ButtonsRow>
            <LeftButtonsContainer>
              <SmButton text="Try Again" theme="green" onPress={this.tryAgain} style={{ width: 150, marginRight: 20 }} />
              <SmButton text="Go Back" theme="green" onPress={history.goBack} style={{ width: 150 }} />
            </LeftButtonsContainer>
            <SmButton text="Done" isDisabled={!isTestSuccess} theme="orange" onPress={this.navigateToWallet} style={{ width: 150 }} />
          </ButtonsRow>
          <ActionLink onClick={history.goBack}>Stuck? Go back and write down the numbered words on paper.</ActionLink>
        </DragDropContextProvider>
      </Wrapper>
    );
  }

  handleDrop = ({ word, index }: { word: string, index: number }) => ({ droppedWord }: { droppedWord: string }) => {
    const { twelveWords, dropsCounter, matchCounter } = this.state;
    this.setState({
      twelveWords: [...twelveWords.slice(0, index), { word, droppedWord }, ...twelveWords.slice(index + 1)],
      dropsCounter: dropsCounter + 1,
      matchCounter: word === droppedWord ? matchCounter + 1 : matchCounter
    });
  };

  tryAgain = () => {
    const { twelveWords } = this.state;
    this.setState({ twelveWords: twelveWords.map(({ word }) => ({ word, droppedWord: '' })), dropsCounter: 0, matchCounter: 0 });
  };

  checkIfWasDropped = (word: string): boolean => {
    const { twelveWords } = this.state;
    return !!twelveWords.find(({ droppedWord }) => droppedWord === word);
  };

  navigateToWallet = () => {
    const { history } = this.props;
    history.push('/main/wallet/overview');
  };
}

const mapStateToProps = (state) => ({
  mnemonic: state.wallet.mnemonic
});

// $FlowConnectIssue
TestMe = connect(mapStateToProps)(TestMe);
export default TestMe;
