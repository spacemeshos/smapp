import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { RouteComponentProps } from 'react-router-dom';
import { WrapperWith2SideBars, Button, Link, CorneredWrapper, SmallHorizontalPanel } from '../../basicComponents';
import { smColors } from '../../vars';
import { RootState } from '../../types';

const SubHeader = styled.div`
  margin-bottom: 25px;
  font-size: 15px;
  line-height: 20px;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.realBlack)};
`;

const Text = styled.span`
  font-size: 14px;
  line-height: 24px;
`;

const WhiteText = styled(Text)`
  color: ${smColors.white};
`;

const MiddleSectionRow = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
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
  margin-right: 20px;
  min-width: 190px;
`;

const WordsSection = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
`;

const WordContainer = styled.div<{ isDraggingOver?: boolean }>`
  border: ${({ isDraggingOver }) => (isDraggingOver ? `none` : `1px dashed ${smColors.darkGray}`)};
  height: 27px;
  width: 155px;
  border-radius: 5px;
  margin-right: 20px;
  padding-left: 16px;
`;

const TestWordContainer = styled(WordContainer)<{ isDropped: boolean; isDragging?: boolean }>`
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
  height: 29px;
  width: 157px;
  border-radius: 5px;
  margin-right: 20px;
  margin-bottom: 30px;
`;

const WordDroppable = styled.div<{ isDraggingOver: boolean; isDropped: boolean }>`
  height: 27px;
  width: 155px;
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
  line-height: 26px;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.darkGray)};
`;

const WordWrapper = styled.div`
  display: flex;
`;

const NotificationBoxOuter = styled(CorneredWrapper)`
  position: absolute;
  bottom: -40px;
  right: 0px;
`;

const NotificationBox = styled.div`
  width: 315px;
  padding: 4px 9px;
  background-color: ${smColors.lightGray};
  font-size: 10px;
  line-height: 13px;
  color: ${({ color }) => color};
`;

const getTestWords = (mnemonic: string): Array<{ id: string; content: string }> => {
  const twelveWords = mnemonic.split(' ');
  const indices: Array<number> = [];
  while (indices.length < 4) {
    const idx = Math.floor(Math.random() * 12);
    if (!indices.includes(idx)) {
      indices.push(idx);
    }
  }
  const testWords: Array<{ id: string; content: string }> = [];
  indices.forEach((index: number) => {
    testWords.push({ id: twelveWords[index], content: twelveWords[index] });
  });
  return testWords;
};

interface Props extends RouteComponentProps {
  location: {
    hash: string;
    pathname: string;
    search: string;
    state: { mnemonic: string };
  };
}

const TestMe = ({ history, location }: Props) => {
  const {
    state: { mnemonic }
  } = location;
  const [testWords, setTestWords] = useState<{ id: string; content: string }[]>(getTestWords(mnemonic));
  const [twelveWords, setTwelveWords] = useState<{ id: string; content: string }[]>(mnemonic.split(' ').map((word: string) => ({ id: word, content: '' })));
  const [dropsCounter, setDropsCounter] = useState(0);
  const [matchCounter, setMatchCounter] = useState(0);

  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

  const isTestSuccess = matchCounter === 4 && dropsCounter === 4;

  const resetTest = () => {
    setTestWords(getTestWords(mnemonic));
    setTwelveWords(mnemonic.split(' ').map((word: string) => ({ id: word, content: '' })));
    setDropsCounter(0);
    setMatchCounter(0);
  };

  const openBackupGuide = () => window.open('https://testnet.spacemesh.io/#/backup');

  const navigateToWallet = () => {
    history.push('/main/wallet/overview');
  };

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    // dropped outside the destination zone
    if (!destination || !destination.droppableId.startsWith('Droppable_Dest_')) {
      return;
    }

    const wordId = destination.droppableId.split('_').pop() || '';
    const wordIndex: number = twelveWords.findIndex((word: { id: string; content: string }) => word.id === wordId);
    const droppedWord = source.droppableId.split('_').pop() || '';
    const isDraggedFromTestWords = source.droppableId.startsWith('Droppable_Src_');
    const droppedWordIndex = isDraggedFromTestWords
      ? testWords.findIndex((testWord: { id: string; content: string }) => testWord.id === droppedWord)
      : twelveWords.findIndex((testWord: { id: string; content: string }) => testWord.id === droppedWord);
    const droppedWordFromDropZone = twelveWords[droppedWordIndex].content;
    const isDropMatch = isDraggedFromTestWords ? droppedWord === destination.droppableId.split('_').pop() : droppedWordFromDropZone === destination.droppableId.split('_').pop();
    const wasDraggedPreviousMatch = droppedWordFromDropZone === source.droppableId.split('_').pop();

    if (twelveWords[wordIndex].content) {
      return;
    }

    let tmpTwelveWords: Array<{ id: string; content: string }>;
    let tmpTestWords: Array<{ id: string; content: string }>;

    if (isDraggedFromTestWords) {
      tmpTwelveWords = [...twelveWords.slice(0, wordIndex), { id: wordId, content: droppedWord }, ...twelveWords.slice(wordIndex + 1)];
      tmpTestWords = [...testWords.slice(0, droppedWordIndex), { id: droppedWord, content: '' }, ...testWords.slice(droppedWordIndex + 1)];
    } else {
      tmpTwelveWords = [...twelveWords.slice(0, droppedWordIndex), { id: droppedWord, content: '' }, ...twelveWords.slice(droppedWordIndex + 1)];
      tmpTestWords = [...tmpTwelveWords.slice(0, wordIndex), { id: wordId, content: droppedWordFromDropZone }, ...tmpTwelveWords.slice(wordIndex + 1)];
    }

    setTwelveWords(tmpTwelveWords);
    setTestWords(tmpTestWords);

    if (isDraggedFromTestWords) {
      setDropsCounter(dropsCounter + 1);
    }

    if (isDropMatch) {
      setMatchCounter(matchCounter + 1);
    } else if (wasDraggedPreviousMatch) {
      setMatchCounter(matchCounter - 1);
    }
  };

  const renderDragAndDropArea = () => (
    <DragDropContext onDragEnd={handleDragEnd}>
      <MiddleSectionRow>
        <TestWordsSection>
          {testWords.map((word: { id: string; content: string }, index: number) => (
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
                        isDropped={!!word.content}
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
          {twelveWords.map((word: { id: string; content: string }, index: number) => (
            <WordWrapper key={word.id}>
              <IndexWrapper>
                <Index>{`${index + 1}`}</Index>
              </IndexWrapper>
              <Droppable droppableId={`Droppable_Dest_${word.id}`}>
                {(provided, snapshot) => (
                  <WordDroppable ref={provided.innerRef} {...provided.droppableProps} isDraggingOver={snapshot.isDraggingOver} isDropped={!!word.content}>
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

  return [
    <WrapperWith2SideBars width={920} header="CONFIRM YOUR 12 WORDS BACKUP" key="1" isDarkMode={isDarkMode}>
      <SubHeader>Drag each of the four words below to its matching number in your paper backup word list</SubHeader>
      {renderDragAndDropArea()}
      <BottomRow>
        <Link onClick={openBackupGuide} text="BACKUP GUIDE" />
        <Button onClick={isTestSuccess ? navigateToWallet : resetTest} text={`${isTestSuccess ? 'DONE' : 'TRY AGAIN'}`} isPrimary={isTestSuccess} />
      </BottomRow>
    </WrapperWith2SideBars>,
    dropsCounter === 4 && (
      <NotificationBoxOuter key="2" isDarkMode={isDarkMode}>
        <NotificationBox color={isTestSuccess ? smColors.green : smColors.orange}>
          {isTestSuccess ? 'All right! Your 12 word backup is confirmed.' : 'That confirmation isn’t correct, please try again'}
        </NotificationBox>
      </NotificationBoxOuter>
    )
  ];
};

export default TestMe;
