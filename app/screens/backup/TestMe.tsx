import React, { useState } from 'react';
import styled from 'styled-components';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import { useLocation } from 'react-router-dom';
import { useHistory } from 'react-router';
import {
  WrapperWith2SideBars,
  Button,
  Link,
  CorneredWrapper,
} from '../../basicComponents';
import { smColors } from '../../vars';
import { WalletPath } from '../../routerPaths';
import { ExternalLinks } from '../../../shared/constants';

const SubHeader = styled.div`
  margin-bottom: 25px;
  font-size: 15px;
  line-height: 20px;
  color: ${({ theme }) => theme.color.contrast};
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

const ScrollableContainer = styled.div`
  height: 300px;
  overflow-y: auto;
`;

const TestWordsSection = styled(ScrollableContainer)`
  display: flex;
  flex-direction: column;
  margin-right: 20px;
  min-width: 200px;
  user-select: none;
`;

const WordsSection = styled(ScrollableContainer)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  user-select: none;
`;

const WordContainer = styled.div<{ isDraggingOver?: boolean }>`
  border: ${({ isDraggingOver }) =>
    isDraggingOver ? 'none' : `1px dashed ${smColors.darkGray}`};
  height: 27px;
  width: 155px;
  border-radius: 5px;
  margin-right: 20px;
  padding-left: 16px;
`;

const TestWordContainer = styled(WordContainer)<{
  isDropped: boolean;
  isDragging?: boolean;
}>`
  background-color: ${smColors.black};
  ${({ isDropped }) =>
    !isDropped &&
    `
    background-color: ${smColors.black10Alpha};
  `};
  border: none;
  opacity: ${({ isDragging }) => (isDragging ? 0.9 : 1)};
  cursor: ${({ isDragging }) => (isDragging ? 'grabbing' : 'grab')};

  * {
    cursor: ${({ isDragging }) =>
      isDragging ? 'grabbing' : 'grab'} !important;
  }
`;

const TestWordDroppable = styled.div<{
  isDraggingOver: boolean;
}>`
  border: 1px dashed ${smColors.darkGray};
  width: 157px;
  border-radius: 5px;
  margin-bottom: 10px;
  margin-right: 20px;

  ${({ isDraggingOver }) =>
    isDraggingOver &&
    `
    border: none;
    background-color: ${smColors.lightGray};
  `};
`;

const WordDroppable = styled.div<{
  isDraggingOver: boolean;
  isDropped: boolean;
}>`
  height: 31px;
  width: 160px;
  border: 1px dashed ${smColors.darkGray};
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
  color: ${({ theme }) =>
    theme.isDarkMode ? smColors.white : smColors.darkGray};
`;

const WordWrapper = styled.div`
  display: flex;
`;

const NotificationBoxOuter = styled(CorneredWrapper)`
  position: absolute;
  bottom: 30px;
  right: 160px;
`;

const NotificationBox = styled.div`
  min-width: 312px;
  padding: 2px 7px;
  font-size: 14px;
  line-height: 14px;
  color: ${({ color }) => color};
`;

const range = (offset: number, n: number) => {
  const r: number[] = [];
  for (let i = 0; i < n; i += 1) {
    r.push(offset + i);
  }
  return r;
};

type TestWords = Record<
  string,
  {
    word: string;
    index: number;
    validIndex: number;
  }
>;

const getTestWords = (
  mnemonic: string,
  wordsAmount: number,
  mnemonicLength: number
): TestWords => {
  const twelveWords = mnemonic.split(' ');
  const indices = new Set<number>();
  while (indices.size < wordsAmount) {
    const idx = Math.floor(Math.random() * mnemonicLength);
    if (!indices.has(idx)) {
      indices.add(idx);
    }
  }
  const testWords: TestWords = Object.fromEntries(
    Array.from(indices).map((wordIndex, index) => {
      const word = twelveWords[wordIndex];
      return [word, { word, index, validIndex: wordIndex }];
    })
  );
  return testWords;
};

const getIndexFromId = (droppableId: string): number =>
  parseInt(droppableId.match(/^slot_(\d{1,2})$/)?.[1] || '0', 10);

interface Props {
  mnemonic?: string;
  nextButtonHandler?: () => void;
}

const TestMe = (props: Props) => {
  const location = useLocation<{ mnemonic: string }>();
  const history = useHistory();
  const { mnemonic } = location.state || props;
  const { nextButtonHandler } = props;
  const MNEMONIC_LENGTH = mnemonic?.split(' ').length;
  const TEST_WORDS_AMOUNT = MNEMONIC_LENGTH === 24 ? 8 : 4;
  const TEST_WORDS_LIST = range(0, TEST_WORDS_AMOUNT);
  const PLACEHOLDERS_LIST = range(TEST_WORDS_AMOUNT, MNEMONIC_LENGTH);

  const [testWords, setTestWords] = useState<TestWords>(
    getTestWords(mnemonic, TEST_WORDS_AMOUNT, MNEMONIC_LENGTH)
  );

  const resetTest = () =>
    setTestWords(getTestWords(mnemonic, TEST_WORDS_AMOUNT, MNEMONIC_LENGTH));

  const openBackupGuide = () => window.open(ExternalLinks.BackupGuide);

  const navigateToWallet = () => history.push(WalletPath.Overview);

  const getWordByIndex = (i: number) =>
    Object.entries(testWords).find(([_, { index }]) => index === i)?.[0];

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    // Dropped outside of any Droppable area
    if (!destination) return;

    const oldIndex = getIndexFromId(source.droppableId);
    const newIndex = getIndexFromId(destination.droppableId);
    const ocuppiedWith = getWordByIndex(newIndex);

    setTestWords({
      ...testWords,
      ...(ocuppiedWith
        ? {
            [ocuppiedWith]: { ...testWords[ocuppiedWith], index: oldIndex },
          }
        : {}),
      [draggableId]: {
        ...testWords[draggableId],
        index: newIndex,
      },
    });
  };

  const TestWord = ({ word, index }: { word: string; index: number }) => (
    <Draggable draggableId={word} index={index}>
      {(provided, snapshot) => (
        <TestWordContainer
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          isDragging={snapshot.isDragging}
          isDropped={!!word}
        >
          <WhiteText>{word || ''}</WhiteText>
        </TestWordContainer>
      )}
    </Draggable>
  );

  const renderDragAndDropArea = () => (
    <DragDropContext onDragEnd={handleDragEnd}>
      <MiddleSectionRow>
        <TestWordsSection>
          {TEST_WORDS_LIST.map((index: number) => (
            <Droppable droppableId={`slot_${index}`} key={`slot_${index}`}>
              {(provided, snapshot) => {
                const word = getWordByIndex(index);
                return (
                  <TestWordDroppable
                    ref={provided.innerRef}
                    isDraggingOver={snapshot.isDraggingOver}
                    {...provided.droppableProps}
                  >
                    {word && <TestWord word={word} index={index} />}
                    {provided.placeholder}
                  </TestWordDroppable>
                );
              }}
            </Droppable>
          ))}
        </TestWordsSection>
        <WordsSection>
          {PLACEHOLDERS_LIST.map((n, index) => (
            <WordWrapper key={`word_field_${index}`}>
              <IndexWrapper>
                <Index>{`${index + 1}`}</Index>
              </IndexWrapper>
              <Droppable droppableId={`slot_${n}`}>
                {(provided, snapshot) => {
                  const word = getWordByIndex(n);
                  return (
                    <WordDroppable
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      isDraggingOver={snapshot.isDraggingOver}
                      isDropped={!!word}
                    >
                      {word && <TestWord word={word} index={n} />}
                      {provided.placeholder}
                    </WordDroppable>
                  );
                }}
              </Droppable>
            </WordWrapper>
          ))}
        </WordsSection>
      </MiddleSectionRow>
    </DragDropContext>
  );

  const showResults = Object.values(testWords).every(
    ({ index }) =>
      index >= TEST_WORDS_AMOUNT && index <= MNEMONIC_LENGTH + TEST_WORDS_AMOUNT
  );

  const isTestSuccess =
    showResults &&
    Object.values(testWords).every(
      ({ index, validIndex }) => index - TEST_WORDS_AMOUNT === validIndex
    );

  return (
    <>
      <WrapperWith2SideBars
        width={920}
        header="CONFIRM YOUR WORDS BACKUP"
        key="1"
      >
        <SubHeader>
          Drag each of the four words below to its matching number in your paper
          backup word list
        </SubHeader>
        {renderDragAndDropArea()}
        <BottomRow>
          <Link onClick={openBackupGuide} text="BACKUP GUIDE" />
          <Button
            onClick={
              isTestSuccess ? nextButtonHandler || navigateToWallet : resetTest
            }
            text={`${isTestSuccess ? 'DONE' : 'TRY AGAIN'}`}
            isPrimary={isTestSuccess}
          />
        </BottomRow>
      </WrapperWith2SideBars>
      {showResults && (
        <NotificationBoxOuter key="2">
          <NotificationBox
            color={isTestSuccess ? smColors.green : smColors.orange}
          >
            {isTestSuccess
              ? `All right! Your ${MNEMONIC_LENGTH} word backup is confirmed.`
              : 'That confirmation isn’t correct, please try again'}
          </NotificationBox>
        </NotificationBoxOuter>
      )}
    </>
  );
};

export default TestMe;
