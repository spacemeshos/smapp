// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import type { RouterHistory } from 'react-router-dom';
import { WrapperWith2SideBars, Button, Link } from '/basicComponents';
import { smColors } from '/vars';
import { bottomLeftCorner, bottomRightCorner, topLeftCorner, topRightCorner, smallHorizontalSideBar } from '/assets/images';
import { shell } from 'electron';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import type { DropResult } from 'react-beautiful-dnd';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
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
  line-height: 22px;
`;

const SmallText = styled.span`
  font-size: 12px;
  line-height: 12px;
`;

const GreenText = styled(SmallText)`
  color: ${smColors.green};
`;

const RedText = styled(SmallText)`
  color: ${smColors.orange};
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

const TopLeftCorner = styled.img`
  position: absolute;
  top: -5px;
  left: -5px;
  width: 8px;
  height: 8px;
`;

const TopRightCorner = styled.img`
  position: absolute;
  top: -5px;
  right: -5px;
  width: 8px;
  height: 8px;
`;

const BottomLeftCorner = styled.img`
  position: absolute;
  bottom: -5px;
  left: -5px;
  width: 8px;
  height: 8px;
`;

const BottomRightCorner = styled.img`
  position: absolute;
  bottom: -5px;
  right: -5px;
  width: 8px;
  height: 8px;
`;

const MiddleSectionRow = styled.div`
  display: flex;
  flex-direction: row;
`;

const BottomRow = styled(MiddleSectionRow)`
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: flex-end;
  justify-content: space-between;
`;

const TestWordsSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 18px;
  min-width: 190px;
`;

const WordsSection = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  height: 140px;
  width: 100%;
`;

const WordContainer = styled.div`
  border: ${({ isDraggingOver }) => (isDraggingOver ? `none` : `1px dashed ${smColors.darkGray}`)};
  height: 27px;
  width: 155px;
  margin-bottom: 7px;
  border-radius: 5px;
  margin-right: 20px;
  padding-left: 16px;
`;

const TestWordContainer = styled(WordContainer)`
  background-color: ${smColors.black};
  ${({ isDropped }) =>
    !isDropped &&
    `
    background-color: ${smColors.black10Alpha};
  `};
  border: none;
  opacity: ${({ isDragging }) => (isDragging ? 0.9 : 1)};
`;

const TestWordDroppable = styled.div`
  border: 1px solid ${smColors.darkGray};
  height: 27px;
  width: 155px;
  margin-bottom: 7px;
  border-radius: 5px;
  margin-right: 20px;
`;

const WordDroppable = styled.div`
  height: 27px;
  width: 155px;
  margin-bottom: 7px;
  border-radius: 5px;
  margin-right: 20px;
  transform: none !important;
  ${({ isDraggingOver }) =>
    isDraggingOver &&
    `
    background-color: ${smColors.lightGray};
  `};
  ${({ isDropped }) =>
    isDropped &&
    `
    background-color: ${smColors.black};
    color: ${smColors.white};
  `};
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

const NotificationBoxOuter = styled.div`
  position: absolute;
  bottom: -70px;
  right: -6px;
`;

const NotificationBox = styled.div`
  position: relative;
  bottom: 0;
  width: 195px;
  height: 47px;
  padding: 6px;
  background-color: ${smColors.lightGray};
`;

const getTestWords = (mnemonic: string): Array<{ id: string, content: string }> => {
  const twelveWords = mnemonic.split(' ');
  const indices = [];
  while (indices.length < 4) {
    const idx = Math.floor(Math.random() * 12);
    if (!indices.includes(idx)) {
      indices.push(idx);
    }
  }
  const testWords: Array<{ id: string, content: string }> = [];
  indices.forEach((index: number) => {
    testWords.push({ id: twelveWords[index], content: twelveWords[index] });
  });
  return testWords;
};

const getInitialState = (mnemonic: string) => ({
  testWords: getTestWords(mnemonic),
  twelveWords: mnemonic.split(' ').map((word) => ({ id: word, content: '' })),
  dropsCounter: 0,
  matchCounter: 0
});

type Props = {
  history: RouterHistory,
  mnemonic: string
};

type State = {
  testWords: Array<{ id: string, content: string }>,
  twelveWords: Array<{ id: string, content: string }>,
  dropsCounter: number,
  matchCounter: number
};

class TestMe extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { mnemonic } = props;
    this.state = { ...getInitialState(mnemonic) };
  }

  render() {
    const { dropsCounter, matchCounter } = this.state;
    const isTestSuccess = matchCounter === 4 && dropsCounter === 4;
    const isTestFailed = matchCounter < 4 && dropsCounter === 4;

    return (
      <Wrapper>
        <WrapperWith2SideBars width={920} height={400} header="CONFIRM YOUR 12 WORDS BACKUP">
          <HorizontalBarWrapper>
            <HorizontalBar src={smallHorizontalSideBar} />
          </HorizontalBarWrapper>
          <TextWrapper>
            <Text>Drag each of the four words below to its matching number in your paper backup word list</Text>
          </TextWrapper>
          {this.renderDragAndDropArea()}
          <BottomRow>
            <Link onClick={this.openBackupGuide} text="BACKUP GUIDE" />
            <Button
              onClick={isTestSuccess ? this.navigateToWallet : this.resetTest}
              text={`${isTestSuccess ? 'DONE' : 'TRY AGAIN'}`}
              width={isTestSuccess ? 95 : 110}
              isPrimary={isTestSuccess}
            />
          </BottomRow>
        </WrapperWith2SideBars>
        {this.renderNotificationBox({ isTestSuccess, isTestFailed })}
      </Wrapper>
    );
  }

  renderDragAndDropArea = () => {
    const { testWords, twelveWords } = this.state;
    return (
      <DragDropContext onDragEnd={this.handleDragEnd}>
        <MiddleSectionRow>
          <TestWordsSection>
            {testWords.map((word: { id: string, content: string }, index: number) => (
              <Droppable droppableId={`Droppable_${word.id}`} key={word.id}>
                {(provided) => (
                  <TestWordDroppable ref={provided.innerRef} {...provided.droppableProps}>
                    <Draggable draggableId={`Draggable_${word.id}`} index={index}>
                      {(provided, snapshot) => (
                        <TestWordContainer
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          isDragging={snapshot.isDragging}
                          isDropped={word.content}
                        >
                          <WhiteText>{word.content}</WhiteText>
                        </TestWordContainer>
                      )}
                    </Draggable>
                    {provided.placeholder}
                  </TestWordDroppable>
                )}
              </Droppable>
            ))}
          </TestWordsSection>
          <WordsSection>
            {twelveWords.map((word: { id: string, content: string }, index: number) => (
              <WordWrapper key={word.id}>
                <IndexWrapper>
                  <Index>{`${index + 1}`}</Index>
                </IndexWrapper>
                <Droppable droppableId={`Droppable_Dest_${word.id}`}>
                  {(provided, snapshot) => (
                    <WordDroppable ref={provided.innerRef} {...provided.droppableProps} isDraggingOver={snapshot.isDraggingOver} isDropped={word.content}>
                      <Draggable draggableId={`Draggable_Dest_${word.id}`} index={index} isDragDisabled>
                        {(provided) => (
                          <WordContainer ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} isDraggingOver={snapshot.isDraggingOver}>
                            <Text>{word.content}</Text>
                          </WordContainer>
                        )}
                      </Draggable>
                    </WordDroppable>
                  )}
                </Droppable>
              </WordWrapper>
            ))}
          </WordsSection>
        </MiddleSectionRow>
      </DragDropContext>
    );
  };

  renderNotificationBox = ({ isTestSuccess, isTestFailed }: { isTestSuccess: boolean, isTestFailed: boolean }) => (
    <NotificationBoxOuter>
      {(isTestSuccess || isTestFailed) && (
        <NotificationBox>
          <TopLeftCorner src={topLeftCorner} />
          <TopRightCorner src={topRightCorner} />
          <BottomLeftCorner src={bottomLeftCorner} />
          <BottomRightCorner src={bottomRightCorner} />
          {isTestSuccess && <GreenText>All right! Your 12 word backup is confirmed.</GreenText>}
          {isTestFailed && <RedText>That confirmation isn’t correct, please try again</RedText>}
        </NotificationBox>
      )}
    </NotificationBoxOuter>
  );

  handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    const { matchCounter, dropsCounter, testWords, twelveWords } = this.state;

    // dropped outside the destination zone
    if (!destination || !destination.droppableId.startsWith('Droppable_Dest_')) {
      return;
    }

    const wordId = destination.droppableId.split('_').pop();
    const wordIndex = twelveWords.findIndex((word: { id: string, content: string }) => word.id === wordId);
    const droppedWord = source.droppableId.split('_').pop();
    const droppedWordIndex = testWords.findIndex((testWord: { id: string, content: string }) => testWord.id === droppedWord);

    if (twelveWords[wordIndex].content) {
      return;
    }

    this.setState({
      twelveWords: [...twelveWords.slice(0, wordIndex), { id: wordId, content: droppedWord }, ...twelveWords.slice(wordIndex + 1)],
      testWords: [...testWords.slice(0, droppedWordIndex), { id: droppedWord, content: '' }, ...testWords.slice(droppedWordIndex + 1)]
    });

    if (droppedWord === destination.droppableId.split('_').pop()) {
      // dropped at destination and a match
      this.setState({ matchCounter: matchCounter + 1, dropsCounter: dropsCounter + 1 });
    } else {
      // dropped at destination and not a match
      this.setState({ dropsCounter: dropsCounter + 1 });
    }
  };

  resetTest = () => {
    const { mnemonic } = this.props;
    this.setState({ ...getInitialState(mnemonic) });
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
