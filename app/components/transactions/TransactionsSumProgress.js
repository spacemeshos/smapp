// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { smColors } from '/vars';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 28px;
`;

const Text = styled.span`
  font-size: 13px;
  line-height: 17px;
  color: ${smColors.darkGray};
`;

const Bar = styled.div`
  width: 100%;
  height: 4px;
  background-color: ${smColors.lightGray20Alpha};
  position: relative;
`;

// $FlowStyledIssue
const Progress = styled.div`
  width: ${({ total, coins }) => (coins / total) * 100}%;
  height: inherit;
  background-color: ${smColors.green};
  position: absolute;
`;

type Props = {
  title: 'MINED' | 'SENT' | 'RECEIVED',
  coins: number,
  total: number
};

class TransactionsSumProgress extends PureComponent<Props> {
  render() {
    const { title, coins, total } = this.props;
    return (
      <Wrapper>
        <Text>{`${title} ${coins}`}</Text>
        <Bar>
          <Progress coins={coins} total={total} />
        </Bar>
      </Wrapper>
    );
  }
}

export default TransactionsSumProgress;
