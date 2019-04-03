import React from 'react';
import styled from 'styled-components';
import { smColors } from '/vars';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 50px;
`;

const Row = styled.div`
  height: 60px;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: 1px solid ${smColors.borderGray};
`;

const FirstRow = styled(Row)`
  border-top: 1px solid ${smColors.borderGray};
`;

const Text = styled.div`
  flex: 1;
  font-size: 16px;
  color: ${smColors.darkGray};
  line-height: 22px;
`;

const LeftText = styled(Text)`
  font-weight: bold;
`;

const LocalNodeStatus = () => {
  return (
    <Wrapper>
      <FirstRow>
        <LeftText>Total Time Running</LeftText>
        <Text>{'0 days, 0 hours, 1 minutes'}</Text>
      </FirstRow>
      <Row>
        <LeftText>Total earnings</LeftText>
        <Text>{'0 Spacemesh coins'}</Text>
      </Row>
      <Row>
        <LeftText>Upcoming earnings</LeftText>
        <Text>3 Spacemesh coins (due in 2 days)</Text>
      </Row>
    </Wrapper>
  );
};

export default LocalNodeStatus;
