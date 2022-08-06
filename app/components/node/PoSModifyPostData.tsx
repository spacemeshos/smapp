import React from 'react';
import styled from 'styled-components';
import { Tooltip, Button } from '../../basicComponents';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-around;
`;
const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
  &:first-child {
    margin-bottom: 10px;
  }
  &:last-child {
    margin-bottom: 0;
  }
`;

const Text = styled.div`
  font-size: 15px;
  line-height: 17px;
  color: ${({ theme: { color } }) => color.primary};
`;

const Dots = styled.div`
  flex: 1;
  flex-shrink: 1;
  overflow: hidden;
  margin: 0 5px;
  font-size: 15px;
  line-height: 17px;
  color: ${({ theme: { color } }) => color.primary};
`;

type Props = {
  modify: () => void;
  deleteData: () => void;
};

const PoSModifyPostData = ({ modify, deleteData }: Props) => (
  <>
    <Wrapper>
      <Row>
        <Text>Change your PoS data</Text>
        <Tooltip width={200} text="Some text" />
        <Dots>.....................................................</Dots>
        <Button onClick={modify} text="MODIFY POS" isPrimary={false} />
      </Row>
      <Row>
        <Text>Stop smeshing and delete PoS data</Text>
        <Tooltip width={200} text="Some text" />
        <Dots>.....................................................</Dots>
        <Button onClick={deleteData} text="DELETE DATA" isPrimary={false} />
      </Row>
    </Wrapper>
  </>
);

export default PoSModifyPostData;
