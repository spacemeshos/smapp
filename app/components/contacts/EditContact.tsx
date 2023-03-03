import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { addToContacts, removeFromContacts } from '../../redux/wallet/actions';
import { EnterPasswordModal } from '../settings';
import { Input, Link, ErrorPopup } from '../../basicComponents';
import { smColors } from '../../vars';
import { RootState } from '../../types';
import { handleInputFocus, validate, ValidateError } from './utils';

const Wrapper = styled.div<{ isStandalone: boolean }>`
  display: flex;
  flex-direction: column;
  ${({ isStandalone }) =>
    isStandalone && `background-color: ${smColors.purple}; padding: 15px;`}
  border-bottom: 1px solid ${smColors.disabledGray};
  margin-right: 10px;
`;

const Row = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  position: relative;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

const nicknameStyle = { margin: '10px 0', flex: 1, height: '23px' };
const addressStyle = { margin: '10px 0', flex: 2, height: '23px' };

type Props = {
  isStandalone?: boolean;
  onCompleteAction: () => void;
  onCancel: () => void;
  oldNickname: string;
  oldAddress: string;
};

const EditContact = ({
  oldNickname,
  oldAddress,
  isStandalone = false,
  onCompleteAction,
  onCancel,
}: Props) => {
  const [address, setAddress] = useState(oldAddress);
  const [nickname, setNickname] = useState(oldNickname);
  const [error, setError] = useState<ValidateError | null>();
  const [shouldShowPasswordModal, setShouldShowPasswordModal] = useState(false);

  const contacts = useSelector((state: RootState) => state.wallet.contacts);
  const dispatch = useDispatch();

  const onSave = () => {
    const error = validate(nickname, address, contacts, oldAddress);
    if (error) {
      setError(error);
    } else {
      setShouldShowPasswordModal(true);
    }
  };

  const onValidPassword = async ({ password }: { password: string }) => {
    await dispatch(
      removeFromContacts({
        password,
        contact: { address: oldAddress, nickname: oldNickname },
      })
    );

    setTimeout(async () => {
      await dispatch(
        addToContacts({ password, contact: { address, nickname } })
      );
      onCompleteAction();
    }, 1000);
  };

  return (
    <Wrapper isStandalone={isStandalone}>
      <Row>
        <Input
          value={nickname}
          placeholder="Nickname"
          onChange={({ value }) => {
            setNickname(value);
            setError(null);
          }}
          maxLength="50"
          style={nicknameStyle}
          autofocus
        />
        <Input
          value={address}
          placeholder="Account address"
          onChange={({ value }) => {
            setAddress(value);
            setError(null);
          }}
          maxLength="90"
          style={addressStyle}
          onFocus={handleInputFocus}
        />
        {error && (
          <ErrorPopup
            onClick={() => setError(null)}
            text={error.message.toUpperCase()}
            style={{
              zIndex: 100,
              bottom: -33,
              left:
                error.type === 'name' ? 'calc(0% + 10px)' : 'calc(50% + 10px)',
            }}
          />
        )}
        <ButtonsWrapper>
          <Link
            onClick={onSave}
            text="SAVE"
            style={{ color: smColors.green, marginRight: 15 }}
          />
          <Link
            onClick={onCancel}
            text="CANCEL"
            style={{ color: smColors.orange }}
          />
        </ButtonsWrapper>
      </Row>
      {shouldShowPasswordModal && (
        <EnterPasswordModal
          submitAction={onValidPassword}
          closeModal={() => setShouldShowPasswordModal(false)}
        />
      )}
    </Wrapper>
  );
};

export default EditContact;
