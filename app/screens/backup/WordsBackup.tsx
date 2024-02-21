import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { WrapperWith2SideBars, Button, Link } from '../../basicComponents';
import { eventsService } from '../../infra/eventsService';
import { smColors } from '../../vars';
import { RootState } from '../../types';
import { BackupPath } from '../../routerPaths';
import { ExternalLinks } from '../../../shared/constants';

const TextWrapper = styled.div`
  height: 75px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const Text = styled.span`
  font-size: 14px;
  line-height: 24px;
  color: ${({ theme }) => theme.color.contrast};
`;

const GreenText = styled.span`
  font-size: 12px;
  line-height: 20px;
  color: ${smColors.green};
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
  align-items: end;
  justify-content: space-between;
  margin-top: 5px;
`;

const BottomActionSection = styled.div`
  display: flex;
  flex-direction: row;
`;

const ButtonsSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 18px;
`;

const WordsSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  overflow-y: auto;
  justify-content: space-between;
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

const IndexWrapper = styled.div`
  width: 20px;
  margin-right: 4px;
  text-align: right;
`;

const Index = styled(Text)`
  color: ${({ theme }) =>
    theme.isDarkMode ? smColors.white : smColors.darkGray};
`;

const WordWrapper = styled.div`
  display: flex;
`;

interface TwelveWordsBackupProps {
  nextButtonHandler?: (mnemonic: string) => void;
  skipButtonHandler?: () => void;
  mnemonics?: string;
}
const WordsBackup = ({
  nextButtonHandler,
  skipButtonHandler,
  mnemonics,
}: TwelveWordsBackupProps) => {
  const history = useHistory();
  const [isCopied, setIsCopied] = useState(false);

  const mnemonicState = useSelector(
    (state: RootState) => state.wallet.mnemonic
  );
  const mnemonic = mnemonics || mnemonicState;

  const words: Array<string> = mnemonic.split(' ');
  let wordsPrint = '<div>';
  words.forEach((word: string, index: number) => {
    wordsPrint += `<h2>${index + 1} ${word}</h2>`;
  });
  wordsPrint += '</div>';

  const navigateToTestMe = () => {
    if (nextButtonHandler) {
      nextButtonHandler(mnemonic);
      return;
    }
    history.push(BackupPath.TestMnemonics, { mnemonic });
  };

  const copyWords = async () => {
    const words = mnemonic.split(' ');
    const wordsWithNumbers = words.map(
      (word: string, index: number) => `${index + 1}. ${word}`
    );
    const mnemonicWithNumbers = wordsWithNumbers.join('\n');

    await navigator.clipboard.writeText(mnemonicWithNumbers);
    setIsCopied(true);
  };

  const printWords = () => {
    eventsService.print({ content: wordsPrint });
  };

  const openBackupGuide = () => window.open(ExternalLinks.BackupGuide);

  return (
    <WrapperWith2SideBars
      width={920}
      height={515}
      header={`YOUR ${words.length} WORDS BACKUP`}
    >
      <TextWrapper>
        <Text>
          A paper backup is a numbered list of words written down on a paper.
          Write down or print this numbered word list and store the paper in a a
          safe place, or copy & paste it into your password manager
        </Text>
      </TextWrapper>
      <MiddleSectionRow>
        <ButtonsSection>
          <Button
            onClick={printWords}
            text="PRINT WORDS"
            width={172}
            isPrimary={false}
            style={{ marginBottom: 35 }}
          />
          <Button
            onClick={copyWords}
            text="COPY WORDS"
            width={172}
            isPrimary={false}
            style={{ marginBottom: 35 }}
          />
          {isCopied && <GreenText>Copied to clipboard</GreenText>}
        </ButtonsSection>
        <WordsSection>
          {words.map((word: string, index: number) => (
            <WordWrapper key={word}>
              <IndexWrapper>
                <Index>{`${index + 1}`}</Index>
              </IndexWrapper>
              <WordContainer>
                <Text>{word}</Text>
              </WordContainer>
            </WordWrapper>
          ))}
        </WordsSection>
      </MiddleSectionRow>
      <BottomRow>
        <Link onClick={openBackupGuide} text="BACKUP GUIDE" />

        <BottomActionSection>
          {skipButtonHandler && (
            <Button
              onClick={skipButtonHandler}
              text="Skip"
              width={95}
              isPrimary={false}
            />
          )}
          <Button onClick={navigateToTestMe} text="Next" width={95} />
        </BottomActionSection>
      </BottomRow>
    </WrapperWith2SideBars>
  );
};

export default WordsBackup;
