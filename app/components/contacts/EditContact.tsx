import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { captureReactBreadcrumb } from '../../sentry';
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
      captureReactBreadcrumb({
        category: 'Edit Contact',
        data: {
          action: `Save when editing contacts error: ${error}`,
        },
        level: 'info',
      });
    }
    setShouldShowPasswordModal(true);
    captureReactBreadcrumb({
      category: 'Edit Contact',
      data: {
        action: 'Click onSave for editing contacts',
      },
      level: 'info',
    });
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
    captureReactBreadcrumb({
      category: 'Edit Contact',
      data: {
        action: 'Check valid password',
      },
      level: 'info',
    });
  };

  const submitInputNickname = ({ value }) => {
    setNickname(value);
    setError(null);
    captureReactBreadcrumb({
      category: 'Edit Contact',
      data: {
        action: 'Input nickname',
      },
      level: 'info',
    });
  };
  const submitInputAccountAddress = ({ value }) => {
    setAddress(value);
    setError(null);
    captureReactBreadcrumb({
      category: 'Edit Contact',
      data: {
        action: 'Input account address',
      },
      level: 'info',
    });
  };

  const handleOnCancel = () => {
    onCancel();
    captureReactBreadcrumb({
      category: 'Edit Contact',
      data: {
        action: 'Click on cancel button',
      },
      level: 'info',
    });
  };

  return (
    <Wrapper isStandalone={isStandalone}>
      <Row>
        <Input
          value={nickname}
          placeholder="Nickname"
          onChange={submitInputNickname}
          maxLength="50"
          style={nicknameStyle}
          autofocus
        />
        <Input
          value={address}
          placeholder="Account address"
          onChange={submitInputAccountAddress}
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
            onClick={handleOnCancel}
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
