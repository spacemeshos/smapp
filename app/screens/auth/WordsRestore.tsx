import * as R from 'ramda';
import * as bip39 from 'bip39';
import React, { useState, useEffect, useCallback, JSX } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router';
import { useLocation } from 'react-router-dom';
import { captureReactBreadcrumb } from '../../sentry';
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
import { MnemonicStrengthType } from '../../../shared/types';

const WordsContainer = styled.div<{ is24WordsMode: boolean }>`
  display: flex;
  flex-direction: row;
  padding: ${({ is24WordsMode }) => (is24WordsMode ? 5 : 30)}px 30px 15px 30px;
  overflow: auto;
  margin: 15px 0;
  flex-wrap: wrap;
`;

const InputWrapper = styled.div<{ is24WordsMode: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: ${({ is24WordsMode }) => (is24WordsMode ? 153 : 210)}px;
  margin-bottom: ${({ is24WordsMode }) => (is24WordsMode ? 15 : 30)}px;
  margin-right: 15px;
`;

const InputCounter = styled.div<{ is24WordsMode: boolean }>`
  width: ${({ is24WordsMode }) => (is24WordsMode ? 21 : 25)}px;
  font-size: ${({ is24WordsMode }) => (is24WordsMode ? 14 : 18)}px;
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

const getInputStyle = (hasError: boolean, is24WordsMode: boolean) => ({
  border: `1px dashed ${hasError ? smColors.orange : smColors.darkGray}`,
  borderRadius: 2,
  height: is24WordsMode ? 35 : 40,
});

const DEFAULT_RESTORE_WORDS_AMOUNT: MnemonicStrengthType = 12;

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
    captureReactBreadcrumb({
      category: 'Words Restore',
      data: {
        action: 'Input change',
      },
      level: 'info',
    });

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
      history.push(AuthPath.ConnectionType, {
        mnemonic: { existing: mnemonic },
      });
    } else {
      setHasError(true);
      captureReactBreadcrumb({
        category: 'Words Restore',
        data: {
          action: 'Restore with words with error',
        },
        level: 'info',
      });
    }
    captureReactBreadcrumb({
      category: 'Words Restore',
      data: {
        action: 'Restore with words with validate state',
      },
      level: 'info',
    });
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
    captureReactBreadcrumb({
      category: 'Words Restore',
      data: {
        action: 'Next input',
      },
      level: 'info',
    });
  };

  useEffect(() => {
    window.addEventListener('keyup', handleKeyUp, false);
    return () => {
      window.removeEventListener('keyup', handleKeyUp, false);
    };
  }, [handleKeyUp]);

  const navigateToWordRestoreGuide = () => {
    window.open(ExternalLinks.RestoreMnemoGuide);
    captureReactBreadcrumb({
      category: 'Words Restore',
      data: {
        action: 'Navigate to words restore guide',
      },
      level: 'info',
    });
  };

  const renderInputs = () => {
    const is24WordsMode = WORDS_AMOUNT !== DEFAULT_RESTORE_WORDS_AMOUNT;
    const res: JSX.Element[] = [];

    for (let index = 0; index < WORDS_AMOUNT; index += 1) {
      res.push(
        <InputWrapper is24WordsMode={is24WordsMode} key={`input${index}`}>
          <InputCounter is24WordsMode={is24WordsMode}>{index + 1}</InputCounter>
          <Input
            inputRef={(el) => {
              inputRefs.current[index] = el;
            }}
            value={words[index]}
            onChange={({ value }) => handleInputChange({ value, index })}
            onKeyDown={(event) => event.code === 'Space' && nextInput(index)}
            style={getInputStyle(hasError, is24WordsMode)}
            autofocus={index === 0}
          />
        </InputWrapper>
      );
    }
    return <WordsContainer is24WordsMode={is24WordsMode}>{res}</WordsContainer>;
  };

  const isDoneDisabled = !isDoneEnabled();

  const resetErrorWords = () => {
    setHasError(false);
    captureReactBreadcrumb({
      category: 'Words Restore',
      data: {
        action: 'Reset error Words',
      },
      level: 'info',
    });
  };
  return (
    <WrapperWith2SideBars
      width={800}
      height={480}
      header={`RESTORE WALLET FROM ${WORDS_AMOUNT} WORDS`}
      subHeader={`Please enter the ${WORDS_AMOUNT} words in the right order.`}
    >
      <BackButton action={history.goBack} />
      {renderInputs()}
      <BottomSection>
        <Link
          onClick={navigateToWordRestoreGuide}
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
          onClick={resetErrorWords}
          text={`this ${WORDS_AMOUNT} words phrase in incorrect, please try again`}
          style={{ bottom: 15, left: 185 }}
        />
      )}
    </WrapperWith2SideBars>
  );
};

export default WordsRestore;
