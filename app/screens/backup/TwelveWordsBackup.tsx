import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { WrapperWith2SideBars, Button, Link, SmallHorizontalPanel } from '../../basicComponents';
import { eventsService } from '../../infra/eventsService';
import { smColors } from '../../vars';
import { RootState } from '../../types';

const TextWrapper = styled.div`
  height: 75px;
  margin-bottom: 40px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const Text = styled.span`
  font-size: 14px;
  line-height: 24px;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.realBlack)};
`;

const GreenText = styled.span`
  font-size: 12px;
  line-height: 20px;
  color: ${smColors.green};
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

const ButtonsSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 18px;
`;

const WordsSection = styled.div`
  display: flex;
  flex-wrap: wrap;
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

const IndexWrapper = styled.div`
  width: 20px;
  margin-right: 4px;
  text-align: right;
`;

const Index = styled(Text)`
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.darkGray)};
`;

const WordWrapper = styled.div`
  display: flex;
  &:not(:nth-child(1n)) {
    margin-bottom: 20px;
  }
  &:not(:nth-child(2n)) {
    margin-bottom: 20px;
  }
  &:not(:nth-child(3n)) {
    margin-bottom: 20px;
  }
`;

const TwelveWordsBackup = ({ history }: RouteComponentProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const mnemonic = useSelector((state: RootState) => state.wallet.mnemonic);
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

  const twelveWords: Array<string> = mnemonic.split(' ');
  let twelveWordsPrint = '<div>';
  twelveWords.forEach((word: string, index: number) => {
    twelveWordsPrint += `<h2>${index + 1} ${word}</h2>`;
  });
  twelveWordsPrint += '</div>';

  const navigateToTestMe = () => {
    history.push('/main/backup/test-twelve-words-backup', { mnemonic });
  };

  const copy12Words = async () => {
    await navigator.clipboard.writeText(mnemonic);
    setIsCopied(true);
  };

  const print12Words = () => {
    eventsService.print({ content: twelveWordsPrint });
  };

  const openBackupGuide = () => eventsService.openExternalLink({ link: 'https://testnet.spacemesh.io/#/backup' });

  return (
    <WrapperWith2SideBars width={920} header="YOUR 12 WORDS BACKUP" isDarkMode={isDarkMode}>
      <SmallHorizontalPanel isDarkMode={isDarkMode} />
      <TextWrapper>
        <Text>
          A paper backup is a numbered list of words written down on a paper Write down or print this numbered word list and store the paper in a a safe place, or copy & paste it
          into your password manager
        </Text>
      </TextWrapper>
      <MiddleSectionRow>
        <ButtonsSection>
          <Button onClick={print12Words} text="PRINT WORDS" width={172} isPrimary={false} style={{ marginBottom: 35 }} />
          <Button onClick={copy12Words} text="COPY WORDS" width={172} isPrimary={false} style={{ marginBottom: 35 }} />
          {isCopied && <GreenText>Copied to clipboard</GreenText>}
        </ButtonsSection>
        <WordsSection>
          {twelveWords.map((word: string, index: number) => (
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
        <Button onClick={navigateToTestMe} text="Next" width={95} />
      </BottomRow>
    </WrapperWith2SideBars>
  );
};

export default TwelveWordsBackup;
