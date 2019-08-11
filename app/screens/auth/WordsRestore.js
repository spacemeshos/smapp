// @flow
import { shell } from 'electron';
import React, { Component } from 'react';
import styled from 'styled-components';
import { Container } from '/components/common';
import { Input, Button, Link, SecondaryButton, ErrorPopup } from '/basicComponents';
import { cryptoService } from '/infra/cryptoService';
import { smColors } from '/vars';
import { smallHorizontalSideBar } from '/assets/images';
import type { RouterHistory } from 'react-router-dom';

const SideBar = styled.img`
  position: absolute;
  top: -30px;
  right: 0;
  width: 55px;
  height: 15px;
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
      <Container width={800} height={480} header="WALLET 12 WORDS RESTORE" subHeader="please enter the 12 words in the right order">
        <SideBar src={smallHorizontalSideBar} />
        <SecondaryButton onClick={history.goBack} imgName="chevronLeftWhite" imgWidth={10} imgHeight={15} style={{ position: 'absolute', bottom: 0, left: -35 }} />
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
      </Container>
    );
  }

  renderInputs = ({ start }: { start: number }) => {
    const { words, hasError } = this.state;
    const res = [];
    for (let index = start; index < start + 4; index += 1) {
      res.push(
        <InputWrapper key={`input${index}`}>
          <InputCounter>{index + 1}</InputCounter>
          <Input value={words[index]} onChange={({ value }) => this.handleInputChange({ value, index })} isErrorMsgEnabled={false} style={getInputStyle(hasError)} />
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

  restoreWith12Words = () => {
    const { history } = this.props;
    const { words } = this.state;
    const mnemonic = Object.values(words).join(' ');
    if (cryptoService.validateMnemonic({ mnemonic })) {
      history.push('/auth/create', { mnemonic });
    } else {
      this.setState({ hasError: true });
    }
  };

  navigateTo12WordRestoreGuide = () => shell.openExternal('https://testnet.spacemesh.io/#/backup?id=restoring-from-a-12-words-list');
}

export default WordsRestore;
