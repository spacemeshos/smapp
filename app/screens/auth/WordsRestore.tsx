import * as R from 'ramda';
import * as bip39 from 'bip39';
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router';
import { useLocation } from 'react-router-dom';
import { BackButton } from '../../components/common';
import {
  WrapperWith2SideBars,
  Input,
  Button,
  Link,
  ErrorPopup,
} from '../../basicComponents';
import { smColors } from '../../vars';
import { AuthPath } from '../../routerPaths';
import { ExternalLinks } from '../../../shared/constants';

const Table = styled.div`
  display: flex;
  flex-direction: row;
  padding: 30px 30px 15px 30px;
  overflow: auto;
  margin: 15px 0;
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
  color: ${({ theme }) => theme.color.contrast};
  margin-right: 10px;
`;

const BottomSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
`;

const getInputStyle = (hasError: boolean) => ({
  border: `1px dashed ${hasError ? smColors.orange : smColors.darkGray}`,
  borderRadius: 2,
});

const DEFAULT_RESTORE_WORDS_AMOUNT = 12;

const WordsRestore = () => {
  const history = useHistory();
  const location = useLocation<{ wordsAmount?: number }>();
  const WORDS_AMOUNT =
    location.state?.wordsAmount ?? DEFAULT_RESTORE_WORDS_AMOUNT;
  const [words, setWords] = useState(Array(WORDS_AMOUNT).fill(''));
  const [hasError, setHasError] = useState(false);

  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const handleInputChange = ({
    value,
    index,
  }: {
    value: string;
    index: number;
  }) => {
    const input = value
      .split(/[\d.\s]+/)
      .filter(Boolean)
      .slice(0, WORDS_AMOUNT - index);
    const newWords = (input.length ? input : ['']).reduce(
      (acc, val, idx) => R.adjust(index + idx, R.always(val), acc),
      words
    );
    setWords(newWords);
    setHasError(false);
  };

  const isDoneEnabled = () => {
    return (
      words.every((word: string) => !!word && word.trim().length > 0) ||
      hasError
    );
  };

  const validateMnemonic = ({ mnemonic }: { mnemonic: string }) => {
    if (!mnemonic || !mnemonic.length) {
      return false;
    }
    return bip39.validateMnemonic(mnemonic);
  };

  const handleRestore = useCallback(() => {
    const mnemonic = Object.values(words).join(' ');
    if (validateMnemonic({ mnemonic })) {
      history.push(AuthPath.ConnectionType, { mnemonic });
    } else {
      setHasError(true);
    }
  }, [words, history, setHasError]);

  const handleKeyUp = useCallback(
    (e) => {
      if (e.keyCode === 13) {
        e.preventDefault();
        handleRestore();
      }
    },
    [handleRestore]
  );
  const nextInput = (index: number) => {
    const next = Math.max(0, Math.min(WORDS_AMOUNT, index + 1));
    inputRefs.current[next]?.focus();
  };

  useEffect(() => {
    window.addEventListener('keyup', handleKeyUp, false);
    return () => {
      window.removeEventListener('keyup', handleKeyUp, false);
    };
  }, [handleKeyUp]);

  const navigateTo12WordRestoreGuide = () =>
    window.open(ExternalLinks.RestoreMnemoGuide);

  const renderInputs = ({ start }: { start: number }) => {
    const res: Array<any> = [];
    const end = start + WORDS_AMOUNT / 3;
    for (let index = start; index < end; index += 1) {
      res.push(
        <InputWrapper key={`input${index}`}>
          <InputCounter>{index + 1}</InputCounter>
          <Input
            inputRef={(el) => {
              inputRefs.current[index] = el;
            }}
            value={words[index]}
            onChange={({ value }) => handleInputChange({ value, index })}
            onKeyDown={(event) => event.code === 'Space' && nextInput(index)}
            style={getInputStyle(hasError)}
            autofocus={index === 0}
          />
        </InputWrapper>
      );
    }
    return res;
  };

  const isDoneDisabled = !isDoneEnabled();
  const tableColumns =
    WORDS_AMOUNT === DEFAULT_RESTORE_WORDS_AMOUNT ? [0, 4, 8] : [0, 8, 16];
  return (
    <WrapperWith2SideBars
      width={800}
      height={480}
      header={`RESTORE WALLET FROM ${WORDS_AMOUNT} WORDS`}
      subHeader={`Please enter the ${WORDS_AMOUNT} words in the right order.`}
    >
      <BackButton action={history.goBack} />
      <Table>
        {tableColumns.map((start) => (
          <TableColumn>{renderInputs({ start })}</TableColumn>
        ))}
      </Table>
      <BottomSection>
        <Link
          onClick={navigateTo12WordRestoreGuide}
          text={'WORDS BACKUP GUIDE'}
        />
        <Button
          onClick={handleRestore}
          text="RESTORE"
          isDisabled={isDoneDisabled}
        />
      </BottomSection>
      {hasError && (
        <ErrorPopup
          onClick={() => {
            setHasError(false);
          }}
          text={`this ${WORDS_AMOUNT} words phrase in incorrect, please try again`}
          style={{ bottom: 15, left: 185 }}
        />
      )}
    </WrapperWith2SideBars>
  );
};

export default WordsRestore;
