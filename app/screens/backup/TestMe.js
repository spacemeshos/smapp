// @flow
import { shell } from 'electron';
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { WrapperWith2SideBars, Button, Link, CorneredWrapper, SmallHorizontalPanel } from '/basicComponents';
import { smColors } from '/vars';
import type { RouterHistory } from 'react-router-dom';
import type { DropResult } from 'react-beautiful-dnd';

const Text = styled.span`
  font-size: 14px;
  line-height: 18px;
`;

const WhiteText = styled(Text)`
  color: ${smColors.white};
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

const NotificationBoxOuter = styled(CorneredWrapper)`
  position: absolute;
  bottom: -75px;
  right: 0px;
`;

const NotificationBox = styled.div`
  width: 130px;
  padding: 4px 9px;
  background-color: ${smColors.lightGray};
  font-size: 10px;
  line-height: 13px;
  color: ${({ color }) => color};
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
    return [
      <WrapperWith2SideBars
        width={920}
        height={400}
        header="CONFIRM YOUR 12 WORDS BACKUP"
        subHeader="Drag each of the four words below to its matching number in your paper backup word list"
        key="1"
      >
        <SmallHorizontalPanel />
        {this.renderDragAndDropArea()}
        <BottomRow>
          <Link onClick={this.openBackupGuide} text="BACKUP GUIDE" />
          <Button onClick={isTestSuccess ? this.navigateToWallet : this.resetTest} text={`${isTestSuccess ? 'DONE' : 'TRY AGAIN'}`} isPrimary={isTestSuccess} />
        </BottomRow>
      </WrapperWith2SideBars>,
      dropsCounter === 4 && (
        <NotificationBoxOuter key="2">
          <NotificationBox color={isTestSuccess ? smColors.green : smColors.orange}>
            {isTestSuccess ? 'All right! Your 12 word backup is confirmed.' : 'That confirmation isn’t correct, please try again'}
          </NotificationBox>
        </NotificationBoxOuter>
      )
    ];
  }

  renderDragAndDropArea = () => {
    const { testWords, twelveWords } = this.state;
    return (
      <DragDropContext onDragEnd={this.handleDragEnd}>
        <MiddleSectionRow>
          <TestWordsSection>
            {testWords.map((word: { id: string, content: string }, index: number) => (
              <Droppable droppableId={`Droppable_Src_${word.id}`} key={word.id}>
                {(provided) => (
                  <TestWordDroppable ref={provided.innerRef} {...provided.droppableProps}>
                    <Draggable draggableId={`Draggable_Src_${word.id}`} index={index}>
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
                      <Draggable draggableId={`Draggable_Dest_${word.id}`} index={index}>
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
    const isDraggedFromTestWords = source.droppableId.startsWith('Droppable_Src_');
    const droppedWordIndex = isDraggedFromTestWords
      ? testWords.findIndex((testWord: { id: string, content: string }) => testWord.id === droppedWord)
      : twelveWords.findIndex((testWord: { id: string, content: string }) => testWord.id === droppedWord);
    const droppedWordFromDropZone = twelveWords[droppedWordIndex].content;
    const isDropMatch = isDraggedFromTestWords ? droppedWord === destination.droppableId.split('_').pop() : droppedWordFromDropZone === destination.droppableId.split('_').pop();
    const wasDraggedPreviousMatch = droppedWordFromDropZone === source.droppableId.split('_').pop();

    if (twelveWords[wordIndex].content) {
      return;
    }

    const stateObj = {};

    if (isDraggedFromTestWords) {
      stateObj.twelveWords = [...twelveWords.slice(0, wordIndex), { id: wordId, content: droppedWord }, ...twelveWords.slice(wordIndex + 1)];
      stateObj.testWords = [...testWords.slice(0, droppedWordIndex), { id: droppedWord, content: '' }, ...testWords.slice(droppedWordIndex + 1)];
    } else {
      const twelveWordsArray = [...twelveWords.slice(0, droppedWordIndex), { id: droppedWord, content: '' }, ...twelveWords.slice(droppedWordIndex + 1)];
      stateObj.twelveWords = [...twelveWordsArray.slice(0, wordIndex), { id: wordId, content: droppedWordFromDropZone }, ...twelveWordsArray.slice(wordIndex + 1)];
    }

    this.setState(stateObj);

    if (isDraggedFromTestWords) {
      this.setState({ dropsCounter: dropsCounter + 1 });
    }

    if (isDropMatch) {
      this.setState({ matchCounter: matchCounter + 1 });
    } else if (wasDraggedPreviousMatch) {
      this.setState({ matchCounter: matchCounter - 1 });
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
