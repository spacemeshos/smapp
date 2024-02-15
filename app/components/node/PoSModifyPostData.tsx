import { RootState } from 'app/types';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { useHistory } from 'react-router';
import { Tooltip, Button } from '../../basicComponents';
import { Modal } from '../common';
import PoSProvingOptsUpdateModal from '../../screens/modal/PoSProvingOptsUpdateModal';
import { MainPath } from '../../routerPaths';

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
  isDeleting: boolean;
};

const PoSModifyPostData = ({ deleteData, isDeleting }: Props) => {
  const history = useHistory();
  const nodeError = useSelector((state: RootState) => state.node.error);
  const [showDeletePoSModal, setShowDeletePoSModal] = useState<boolean>(false);
  const [showPoSProfiler, setShowPoSProfiler] = useState<boolean>(false);

  return (
    <>
      <Wrapper>
        <Row>
          <Text>Stop smeshing and delete PoS data</Text>
          <Tooltip
            width={200}
            text="Stop Smeshing and delete the PoS data files."
          />
          <Dots>.....................................................</Dots>
          <Button
            isDisabled={!!nodeError}
            onClick={() => setShowDeletePoSModal(true)}
            text="DELETE DATA"
            isPrimary={false}
          />
          {showDeletePoSModal && (
            <Modal header="Are you sure you want to delete your PoS data?">
              <StyledRow>
                <Button
                  isDisabled={isDeleting}
                  isPrimary={false}
                  text="CANCEL"
                  onClick={() => setShowDeletePoSModal(false)}
                />
                <Button
                  text={isDeleting ? 'Deleting...' : 'CONFIRM'}
                  onClick={() => deleteData()}
                  isDisabled={isDeleting}
                />
              </StyledRow>
            </Modal>
          )}
        </Row>
        <Row>
          <Text>Update PoS proving opts</Text>
          <Tooltip
            width={200}
            text={`Allows updating the number of Nonces and CPU threads. 
          These values will be used in the proving process.`}
          />
          <Dots>.....................................................</Dots>
          <Button
            isDisabled={!!nodeError}
            onClick={() => setShowPoSProfiler(true)}
            text="UPDATE"
            isPrimary={false}
          />
          {showPoSProfiler && (
            <PoSProvingOptsUpdateModal
              closeHandler={() => {
                setShowPoSProfiler(false);
                history.push(MainPath.Smeshing);
              }}
            />
          )}
        </Row>
      </Wrapper>
    </>
  );
};

export default PoSModifyPostData;
