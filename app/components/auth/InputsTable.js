// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { SmInput } from '/basicComponents';
import { smColors } from '/vars';

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

const inputStyle = { border: `1px solid ${smColors.darkGreen}` };

type Props = {
  onInputChange: ({ value: string, index: number }) => void
};

type State = {
  words: Array<string>,
  errorMsg: string
};

class InputsTable extends PureComponent<Props, State> {
  render() {
    return (
      <Table>
        <TableColumn>{this.renderInputs({ start: 0 })}</TableColumn>
        <TableColumn>{this.renderInputs({ start: 4 })}</TableColumn>
        <TableColumn>{this.renderInputs({ start: 8 })}</TableColumn>
      </Table>
    );
  }

  renderInputs = ({ start }: { start: number }) => {
    const { onInputChange } = this.props;
    const res = [];
    for (let index = start; index < start + 4; index += 1) {
      res.push(
        <InputWrapper key={`input${index}`}>
          <InputCounter>{index + 1}</InputCounter>
          <SmInput
            type="text"
            placeholder=" "
            onChange={({ value }: { value: string }) => onInputChange({ value, index })}
            isErrorMsgEnabled={false}
            style={inputStyle}
            hasDebounce
          />
        </InputWrapper>
      );
    }
    return res;
  };
}

export default InputsTable;
