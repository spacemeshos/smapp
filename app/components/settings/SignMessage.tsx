import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { eventsService } from '../../infra/eventsService';
import { Modal } from '../common';
import { Input, Button } from '../../basicComponents';
import { getAbbreviatedAddress } from '../../infra/utils';
import { smColors } from '../../vars';
import { RootState } from '../../types';

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 30px 0 15px 0;
`;

const CopiedText = styled.div`
  margin-top: 10px;
  text-align: left;
  font-size: 14px;
  line-height: 16px;
  height: 20px;
  color: ${smColors.green};
`;

const inputStyle = { marginBottom: 20 };

type Props = {
  index: number;
  close: () => void;
};

const SignMessage = ({ index, close }: Props) => {
  let copiedTimeout: any = null;
  const [message, setMessage] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  useEffect(() => {
    return () => {
      clearTimeout(copiedTimeout);
    };
  });

  const accounts = useSelector((state: RootState) => state.wallet.accounts);
  const keychain = useSelector((state: RootState) => state.wallet.keychain);

  const signText = async () => {
    const signedMessage = await eventsService.signMessage({
      message: message.trim(),
      accountIndex: index,
    });
    copiedTimeout && clearTimeout(copiedTimeout);
    await navigator.clipboard.writeText(
      JSON.stringify(
        {
          text: message,
          signature: `0x${signedMessage}`,
          publicKey: `0x${keychain[index].publicKey}`,
        },
        null,
        2
      )
    );
    copiedTimeout = setTimeout(() => setIsCopied(false), 10000);
    setIsCopied(true);
  };

  return (
    <Modal
      header="SIGN TEXT"
      subHeader={`sign text with account ${getAbbreviatedAddress(
        accounts[index].address
      )}`}
    >
      <Input
        value={message}
        placeholder="ENTER TEXT TO SIGN"
        onChange={({ value }) => setMessage(value)}
        maxLength="64"
        style={inputStyle}
        autofocus
      />
      <ButtonsWrapper>
        <Button
          onClick={signText}
          text="SIGN"
          width={150}
          isDisabled={!message}
        />
        <Button onClick={close} isPrimary={false} text="Cancel" />
      </ButtonsWrapper>
      <CopiedText>{isCopied ? 'Signed message copied' : ' '}</CopiedText>
    </Modal>
  );
};

export default SignMessage;
