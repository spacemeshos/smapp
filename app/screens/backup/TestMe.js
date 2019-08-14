// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import type { RouterHistory } from 'react-router-dom';
import { WrapperWith2SideBars, Button, Link } from '/basicComponents';
import { smColors } from '/vars';
import { smallHorizontalSideBar } from '/assets/images';
import { shell } from 'electron';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const TextWrapper = styled.div`
  height: 75px;
  margin-bottom: 40px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const Text = styled.span`
  font-size: 14px;
  font-weight: normal;
  line-height: 22px;
`;

const WhiteText = styled(Text)`
  color: ${smColors.white};
`;

const HorizontalBarWrapper = styled.div`
  position: relative;
`;

const HorizontalBar = styled.img`
  position: absolute;
  top: -95px;
  right: -28px;
  width: 70px;
  height: 15px;
`;

const MiddleSectionRow = styled.div`
  display: flex;
  flex-direction: row;
`;

const BottomSection = styled(MiddleSectionRow)`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: flex-end;
`;

const BottomRow = styled(MiddleSectionRow)`
  justify-content: space-between;
`;

const TestWordsSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 18px;
`;

const WordsSection = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  height: 140px;
  width: 100%;
`;

const WordContainer = styled.div`
  border: 1px dashed ${smColors.darkGray};
  height: 27px;
  width: 155px;
  margin-bottom: 7px;
  border-radius: 5px;
  margin-right: 20px;
  padding-left: 16px;
`;

const TestWordContainer = styled(WordContainer)`
  background-color: ${smColors.black};
  border: none;
`;

const IndexWrapper = styled.div`
  width: 20px;
  margin-right: 4px;
  text-align: right;
`;

const Index = styled(Text)`
  color: ${smColors.darkGray};
`;

const WordWrapper = styled.div`
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
    const { testWords, twelveWords, dropsCounter, matchCounter } = this.state;
    const isTestSuccess = matchCounter === 4 && dropsCounter === 4;
    // const isTestFailed = matchCounter < 4 && dropsCounter === 4;
    return (
      <Wrapper>
        <div style={{ position: 'absolute', top: 0, left: 0 }}>{`matches: ${matchCounter} | drops: ${dropsCounter}`}</div>
        <WrapperWith2SideBars width={920} height={480} header="CONFIRM YOUR 12 WORDS BACKUP">
          <HorizontalBarWrapper>
            <HorizontalBar src={smallHorizontalSideBar} />
          </HorizontalBarWrapper>
          <TextWrapper>
            <Text>Drag each of the four words below to its matching number in your paper backup word list</Text>
          </TextWrapper>
          <MiddleSectionRow>
            <TestWordsSection>
              {testWords.map((word: string) => (
                <TestWordContainer key={word}>
                  <WhiteText>{word}</WhiteText>
                </TestWordContainer>
              ))}
            </TestWordsSection>
            <WordsSection>
              {twelveWords.map((word: { word: string, droppedWord: string }, index: number) => (
                <WordWrapper key={word.word}>
                  <IndexWrapper>
                    <Index>{`${index + 1}`}</Index>
                  </IndexWrapper>
                  <WordContainer>
                    <Text>{word.word}</Text>
                  </WordContainer>
                </WordWrapper>
              ))}
            </WordsSection>
          </MiddleSectionRow>
          <BottomSection>
            <BottomRow>
              <Link onClick={this.openBackupGuide} text="BACKUP GUIDE" style={{ paddingTop: 26 }} />
              <Button onClick={this.navigateToWallet} text="Done" width={95} isDisabled={!isTestSuccess} />
            </BottomRow>
          </BottomSection>
        </WrapperWith2SideBars>
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

  openBackupGuide = () => shell.openExternal('https://testnet.spacemesh.io/#/backup');

  navigateToWallet = () => {
    const { history } = this.props;
    history.push('/main/wallet/overview');
  };
}

const mapStateToProps = (state) => ({
  mnemonic: state.wallet.mnemonic
});

TestMe = connect<any, any, _, _, _, _>(mapStateToProps)(TestMe);
export default TestMe;
