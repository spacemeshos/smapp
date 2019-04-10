// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import type { RouterHistory } from 'react-router-dom';
import { SmButton } from '/basicComponents';
import { smColors } from '/vars';
import { DropContainer, DragItem } from '/components/wallet';
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

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
  margin-bottom: 30px;
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

const getRandomNumber = (): number => Math.floor(Math.random() * 12);

const getFourRandomIndices = () => {
  const indices: number[] = [];
  while (indices.length < 4) {
    const idx = getRandomNumber();
    if (!indices.includes(idx)) {
      indices.push(idx);
    }
  }
  return indices;
};

const getTestWords = (mnemonic: string) => {
  const twelveWords = mnemonic.split(' ');
  const indices = getFourRandomIndices();
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
  matching: number,
  testWords: string[],
  droppedWords: string[],
  resetContainer: boolean
};

class TestMe extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      matching: 0,
      testWords: getTestWords(props.mnemonic),
      droppedWords: [],
      resetContainer: false
    };
  }

  render() {
    const { mnemonic } = this.props;
    const { matching, testWords, droppedWords, resetContainer } = this.state;
    const twelveWords = mnemonic.split(' ');
    const isMatching = matching === 4 && droppedWords.length === 4;
    const isNotMatching = matching < 4 && droppedWords.length === 4;
    return (
      <Wrapper>
        <DragDropContextProvider backend={HTML5Backend}>
          <Header>Create a 12 Words Backup</Header>
          <HeaderExplanation>Drag each of the 4 words below to its matching number in your paper backup words list.</HeaderExplanation>
          <WordOptionsContainer>
            {testWords.map((word: string) => (
              <DragItem key={word} word={word} isDropped={droppedWords.includes(word)} drop={this.handleDrop} />
            ))}
          </WordOptionsContainer>
          <TwelveWordsContainer>
            {twelveWords.map((word: string, index: number) => (
              <WordWrapper key={word}>
                <IndexWrapper>
                  <Index>{`${index + 1}`}</Index>
                </IndexWrapper>
                <DropContainer match={this.handleMatch} drop={this.handleDrop} word={word} resetContainer={resetContainer} />
              </WordWrapper>
            ))}
          </TwelveWordsContainer>
          <NotificationSection>
            {isMatching && <Notification color={smColors.orange}>All right! Your 12 Words Backup is confirmed</Notification>}
            {isNotMatching && <Notification color={smColors.red}>No match. Check your 12 Words Paper Backup and try again.</Notification>}
          </NotificationSection>
          <ButtonsRow>
            <LeftButtonsContainer>
              <SmButton text="Try Again" theme="green" onPress={this.tryAgain} style={{ width: 144, marginRight: 18 }} />
              <SmButton text="Go Back" theme="green" onPress={this.goBackToTwelveWordsBackup} style={{ width: 144 }} />
            </LeftButtonsContainer>
            <SmButton text="Done" isDisabled={!isMatching} theme="orange" onPress={this.navigateToWallet} style={{ width: 144 }} />
          </ButtonsRow>
          <ActionLink onClick={this.goBackToTwelveWordsBackup}>Stuck? Go back and write down the numbered words on paper.</ActionLink>
        </DragDropContextProvider>
      </Wrapper>
    );
  }

  handleDrop = (word: string) => {
    const { droppedWords } = this.state;
    this.setState({ droppedWords: [...droppedWords, word] });
  };

  handleMatch = (isMatching: boolean) => {
    if (isMatching) {
      this.setState((prevState: State) => {
        return { matching: prevState.matching + 1 };
      });
    }
  };

  goBackToTwelveWordsBackup = () => {
    const { history } = this.props;
    history.goBack();
  };

  tryAgain = () => {
    this.setState(
      (prevState) => {
        return {
          matching: 0,
          testWords: [...prevState.testWords],
          droppedWords: [],
          resetContainer: true
        };
      },
      () => {
        this.setState({ resetContainer: false });
      }
    );
  };

  navigateToWallet = () => {
    const { history } = this.props;
    history.push('/main/wallet/overview');
  };
}
const mapStateToProps = (state) => ({
  mnemonic: state.wallet.mnemonic
});

TestMe = connect(mapStateToProps)(TestMe);

export default TestMe;
