// @flow
import * as bip39 from 'bip39';
import { shell } from 'electron';
import React, { Component } from 'react';
import styled from 'styled-components';
import { BackButton } from '/components/common';
import { WrapperWith2SideBars, Input, Button, Link, ErrorPopup, SmallHorizontalPanel } from '/basicComponents';
import { smColors } from '/vars';
import type { RouterHistory } from 'react-router-dom';

const Header = styled.div`
  font-size: 18px;
  line-height: 22px;
  color: ${smColors.realBlack};
`;

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
  color: ${smColors.realBlack};
  margin-right: 10px;
`;

const BottomSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
`;

type Props = {
  history: RouterHistory
};

type State = {
  words: Array<string>,
  hasError: boolean
};

const getInputStyle = (hasError) => ({ border: `1px dashed ${hasError ? smColors.orange : smColors.darkGray}`, borderRadius: 2 });

class WordsRestore extends Component<Props, State> {
  state = {
    words: Array(12).fill(''),
    hasError: false
  };

  render() {
    const { history } = this.props;
    const { hasError } = this.state;
    const isDoneDisabled = !this.isDoneEnabled();
    return (
      <WrapperWith2SideBars width={800} height={480} header="WALLET 12 WORDS RESTORE">
        <SmallHorizontalPanel />
        <BackButton action={history.goBack} />
        <Header>Please enter the 12 words in the right order.</Header>
        <Table>
          <TableColumn>{this.renderInputs({ start: 0 })}</TableColumn>
          <TableColumn>{this.renderInputs({ start: 4 })}</TableColumn>
          <TableColumn>{this.renderInputs({ start: 8 })}</TableColumn>
        </Table>
        <BottomSection>
          <Link onClick={this.navigateTo12WordRestoreGuide} text="12 WORDS GUIDE" />
          <Button onClick={this.restoreWith12Words} text="RESTORE" isDisabled={isDoneDisabled} />
        </BottomSection>
        {hasError && <ErrorPopup onClick={() => this.setState({ hasError: false })} text="this 12 words phrase in incorrect, please try again" style={{ bottom: 15, left: 185 }} />}
      </WrapperWith2SideBars>
    );
  }

  renderInputs = ({ start }: { start: number }) => {
    const { words, hasError } = this.state;
    const res = [];
    for (let index = start; index < start + 4; index += 1) {
      res.push(
        <InputWrapper key={`input${index}`}>
          <InputCounter>{index + 1}</InputCounter>
          <Input
            value={words[index]}
            onChange={({ value }) => this.handleInputChange({ value, index })}
            isErrorMsgEnabled={false}
            style={getInputStyle(hasError)}
            autofocus={index === 0}
          />
        </InputWrapper>
      );
    }
    return res;
  };

  handleInputChange = ({ value, index }: { value: string, index: number }) => {
    const { words } = this.state;
    const newWords = [...words];
    newWords[index] = value;
    this.setState({ words: newWords, hasError: false });
  };

  isDoneEnabled = () => {
    const { words, hasError } = this.state;
    return words.every((word) => !!word && word.trim().length > 0) || hasError;
  };

  validateMnemonic = ({ mnemonic }: { mnemonic: string }) => {
    if (!mnemonic || !mnemonic.length) {
      return false;
    }
    return bip39.validateMnemonic(mnemonic);
  };

  restoreWith12Words = () => {
    const { history } = this.props;
    const { words } = this.state;
    const mnemonic = Object.values(words).join(' ');
    if (this.validateMnemonic({ mnemonic })) {
      history.push('/auth/create', { mnemonic });
    } else {
      this.setState({ hasError: true });
    }
  };

  navigateTo12WordRestoreGuide = () => shell.openExternal('https://testnet.spacemesh.io/#/backup?id=restoring-from-a-12-words-list');
}

export default WordsRestore;
