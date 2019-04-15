// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { SmButton } from '/basicComponents';
import { keyGenService } from '/infra/keyGenService';
import { xWhite } from '/assets/images';
import { smColors } from '/vars';
import InputsTable from './InputsTable';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 50px 100px;
  background-color: ${smColors.white};
`;

const CloseBtnWrapper = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 30px;
  height: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${smColors.darkGreen};
  border-radius: 50%;
`;

const CloseButton = styled.img`
  width: 20px;
  height: 20px;
  margin: 0 5px;
  cursor: pointer;
`;

const Header = styled.div`
  font-size: 31px;
  font-weight: bold;
  line-height: 42px;
  color: ${smColors.lighterBlack};
  margin-bottom: 25px;
`;

const SubHeader = styled.div`
  font-size: 16px;
  line-height: 30px;
  color: ${smColors.lighterBlack};
  margin-bottom: 55px;
`;

const ErrorMsg = styled.div`
  width: 100%;
  height: 20px;
  font-size: 16px;
  line-height: 20px;
  color: ${smColors.red};
`;

const BottomSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Link = styled.div`
  font-size: 16px;
  line-height: 30px;
  color: ${smColors.darkGreen};
`;

type Props = {
  proceedWithRestore: ({ mnemonic: string }) => void,
  toggleRestoreWith12Words: () => void,
  hasCloseBtn?: boolean
};

type State = {
  words: Object,
  errorMsg: string
};

const createObjectWithEmptyStrings = () => {
  const obj = {};
  for (let i = 0; i < 12; i += 1) {
    obj[`${i}`] = '';
  }
  return obj;
};

class WordsRestore extends Component<Props, State> {
  state = {
    words: createObjectWithEmptyStrings(),
    errorMsg: ''
  };

  static defaultProps = {
    hasCloseBtn: true
  };

  render() {
    const { toggleRestoreWith12Words, hasCloseBtn } = this.props;
    const { errorMsg } = this.state;
    const isDoneDisabled = !this.isDoneEnabled();
    return (
      <Wrapper>
        <Header>Restore with 12 words</Header>
        <SubHeader>Please enter the 12 words in the right order</SubHeader>
        {hasCloseBtn && (
          <CloseBtnWrapper onClick={toggleRestoreWith12Words}>
            <CloseButton src={xWhite} />
          </CloseBtnWrapper>
        )}
        <InputsTable onInputChange={this.handleInputChange} />
        <ErrorMsg>{errorMsg}</ErrorMsg>
        <BottomSection>
          <Link>Learn more about 12 words wallet backup</Link>
          <SmButton text="Done" theme="orange" center isDisabled={isDoneDisabled} onPress={this.restoreWith12Words} style={{ width: 150 }} />
        </BottomSection>
      </Wrapper>
    );
  }

  handleInputChange = ({ value, index }: { value: string, index: number }) => {
    const { words } = this.state;
    this.setState({ words: { ...words, [`${index}`]: value }, errorMsg: '' });
  };

  isDoneEnabled = () => {
    const { words } = this.state;
    return Object.keys(words).every((key) => !!words[key] && words[key].length > 0);
  };

  restoreWith12Words = () => {
    const { proceedWithRestore } = this.props;
    const { words } = this.state;
    const mnemonic = Object.values(words).join(' ');
    if (keyGenService.validateMnemonic({ mnemonic })) {
      proceedWithRestore({ mnemonic });
    } else {
      this.setState({ errorMsg: 'Invalid Words' });
    }
  };
}

export default WordsRestore;
