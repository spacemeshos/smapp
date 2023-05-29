import { RootState } from 'app/types';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Tooltip, Button } from '../../basicComponents';
import { Modal } from '../common';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: start;
  margin-top: 50px;
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

const StyledRow = styled(Row)`
  display: flex;
  justify-content: space-between;
  gap: 8px;
`;

type Props = {
  deleteData: () => void;
};

const PoSModifyPostData = ({ deleteData }: Props) => {
  const nodeError = useSelector((state: RootState) => state.node.error);
  const [showModal, setShowModal] = useState<boolean>(false);
  const onDeleteClick = () => {
    setShowModal(true);
  };
  return (
    <>
      <Wrapper>
        <Row>
          <Text>Stop smeshing and delete PoS data</Text>
          <Tooltip
            width={200}
            text="Stop Smeshing and delete the POS data files."
          />
          <Dots>.....................................................</Dots>
          <Button
            isDisabled={!!nodeError}
            onClick={onDeleteClick}
            text="DELETE DATA"
            isPrimary={false}
          />
          {showModal && (
            <Modal header="Are you sure you want to delete your POS data?">
              <StyledRow>
                <Button
                  isPrimary={false}
                  text="CANCEL"
                  onClick={() => setShowModal(false)}
                />
                <Button text="CONFIRM" onClick={() => deleteData()} />
              </StyledRow>
            </Modal>
          )}
        </Row>
      </Wrapper>
    </>
  );
};

export default PoSModifyPostData;
