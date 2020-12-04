import * as bip39 from 'bip39';
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { BackButton } from '../../components/common';
import { WrapperWith2SideBars, Input, Button, Link, ErrorPopup, SmallHorizontalPanel } from '../../basicComponents';
import { smColors } from '../../vars';
import { RootState } from '../../types';
import { eventsService } from '../../infra/eventsService';

const Table = styled.div`
  display: flex;
  flex-direction: row;
  padding: 30px 30px 15px 30px;
`;

const TableColumn = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 50px;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
`;

const InputCounter = styled.div`
  width: 25px;
  font-size: 18px;
  line-height: 22px;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.realBlack)};
  margin-right: 10px;
`;

const BottomSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
`;

const getInputStyle = (hasError: boolean) => ({ border: `1px dashed ${hasError ? smColors.orange : smColors.darkGray}`, borderRadius: 2 });

const WordsRestore = ({ history }: RouteComponentProps) => {
  const [words, setWords] = useState(Array(12).fill(''));
  const [hasError, setHasError] = useState(false);

  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

  const handleInputChange = ({ value, index }: { value: string; index: number }) => {
    const newWords = [...words];
    newWords[index] = value;
    setWords(newWords);
    setHasError(false);
  };

  const isDoneEnabled = () => {
    return words.every((word: string) => !!word && word.trim().length > 0) || hasError;
  };

  const validateMnemonic = ({ mnemonic }: { mnemonic: string }) => {
    if (!mnemonic || !mnemonic.length) {
      return false;
    }
    return bip39.validateMnemonic(mnemonic);
  };

  const restoreWith12Words = () => {
    const mnemonic = Object.values(words).join(' ');
    if (validateMnemonic({ mnemonic })) {
      history.push('/auth/create', { mnemonic });
    } else {
      setHasError(true);
    }
  };

  const handleKeyUp = useCallback(
    (e) => {
      if (e.keyCode === 13) {
        e.preventDefault();
        restoreWith12Words();
      }
    },
    [restoreWith12Words]
  );

  useEffect(() => {
    window.addEventListener('keyup', handleKeyUp, false);
    return () => {
      window.removeEventListener('keyup', handleKeyUp, false);
    };
  }, [handleKeyUp]);

  const navigateTo12WordRestoreGuide = () => eventsService.openExternalLink({ link: 'https://testnet.spacemesh.io/#/backup?id=restoring-from-a-12-words-list' });

  const renderInputs = ({ start }: { start: number }) => {
    const res = [];
    for (let index = start; index < start + 4; index += 1) {
      res.push(
        <InputWrapper key={`input${index}`}>
          <InputCounter>{index + 1}</InputCounter>
          <Input value={words[index]} onChange={({ value }) => handleInputChange({ value, index })} style={getInputStyle(hasError)} autofocus={index === 0} />
        </InputWrapper>
      );
    }
    return res;
  };

  const isDoneDisabled = !isDoneEnabled();
  return (
    <WrapperWith2SideBars width={800} height={480} isDarkMode={isDarkMode} header="WALLET 12 WORDS RESTORE" subHeader="Please enter the 12 words in the right order.">
      <SmallHorizontalPanel isDarkMode={isDarkMode} />
      <BackButton action={history.goBack} />
      <Table>
        <TableColumn>{renderInputs({ start: 0 })}</TableColumn>
        <TableColumn>{renderInputs({ start: 4 })}</TableColumn>
        <TableColumn>{renderInputs({ start: 8 })}</TableColumn>
      </Table>
      <BottomSection>
        <Link onClick={navigateTo12WordRestoreGuide} text="12 WORDS GUIDE" />
        <Button onClick={restoreWith12Words} text="RESTORE" isDisabled={isDoneDisabled} />
      </BottomSection>
      {hasError && (
        <ErrorPopup
          onClick={() => {
            setHasError(false);
          }}
          text="this 12 words phrase in incorrect, please try again"
          style={{ bottom: 15, left: 185 }}
        />
      )}
    </WrapperWith2SideBars>
  );
};

export default WordsRestore;
