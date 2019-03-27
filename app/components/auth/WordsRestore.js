// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { deriveEncryptionKey } from '/redux/wallet/actions';
import { SmInput, SmButton } from '/basicComponents';
import { keyGenService } from '/infra/keyGenService';
import { xWhite } from '/assets/images';
import { smColors } from '/vars';

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

const Table = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 30px;
  padding: 30px 30px 15px 30px;
  border: 1px solid ${smColors.darkGreen};
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
  color: ${smColors.darkGray50Alpha};
  margin-right: 10px;
`;

const ErrorMsg = styled.div`
  width: 100%;
  height: 20px;
  font-size: 14px;
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

const inputStyle = { border: `1px solid ${smColors.darkGreen}` };

type Props = {
  proceedWithRestore: () => void,
  toggleRestoreWith12Words: () => void
};

type State = {
  words: Array<string>,
  errorMsg: string
};

class WordsRestore extends Component<Props, State> {
  state = {
    words: [...Array(12)].map(() => ''),
    errorMsg: ''
  };

  render() {
    const { toggleRestoreWith12Words } = this.props;
    const { errorMsg } = this.state;
    const isDoneDisabled = !this.isDoneEnabled();
    return (
      <Wrapper>
        <Header>Restore with 12 words</Header>
        <SubHeader>Please enter the 12 words in the right order</SubHeader>
        <CloseBtnWrapper onClick={toggleRestoreWith12Words}>
          <CloseButton src={xWhite} />
        </CloseBtnWrapper>
        <Table>
          <TableColumn>{this.renderInputs({ start: 0 })}</TableColumn>
          <TableColumn>{this.renderInputs({ start: 4 })}</TableColumn>
          <TableColumn>{this.renderInputs({ start: 8 })}</TableColumn>
        </Table>
        <ErrorMsg>{errorMsg}</ErrorMsg>
        <BottomSection>
          <Link>Learn more about 12 words wallet backup</Link>
          <SmButton text="Done" theme="orange" center isDisabled={isDoneDisabled} onPress={this.restoreWith12Words} style={{ width: 150 }} />
        </BottomSection>
      </Wrapper>
    );
  }

  renderInputs = ({ start }) => {
    const res = [];
    for (let index = start; index < start + 3; index += 1) {
      res.push(
        <InputWrapper key={`input${index}`}>
          <InputCounter>{index + 1}</InputCounter>
          <SmInput type="text" placeholder=" " onChange={this.handleInputChange({ index })} isErrorMsgEnabled={false} style={inputStyle} />
        </InputWrapper>
      );
    }
    return res;
  };

  handleInputChange = ({ index }) => ({ value }) => {
    const { words } = this.state;
    this.setState({ words: [...words.slice(0, index), value, ...words.slice(index)], errorMsg: '' });
  };

  isDoneEnabled = () => {
    const { words } = this.state;
    return words.every((word) => !!words && word.length > 0);
  };

  restoreWith12Words = () => {
    const { proceedWithRestore } = this.props;
    const { words } = this.state;
    if (keyGenService.validateMnemonic(words)) {
      proceedWithRestore();
    } else {
      this.setState({ errorMsg: 'Invalid 12 words' });
    }
  };
}

const mapDispatchToProps = {
  deriveEncryptionKey
};

WordsRestore = connect(
  null,
  mapDispatchToProps
)(WordsRestore);

export default WordsRestore;
