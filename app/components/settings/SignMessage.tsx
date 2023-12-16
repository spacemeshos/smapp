import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { eventsService } from '../../infra/eventsService';
import { Modal } from '../common';
import { Input, Button } from '../../basicComponents';
import { getAbbreviatedAddress } from '../../infra/utils';
import { smColors } from '../../vars';
import { RootState } from '../../types';
import SubHeader from '../../basicComponents/SubHeader';

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: auto 0 15px 0;
`;

const CopiedText = styled.div`
  margin-top: 10px;
  text-align: left;
  font-size: 14px;
  line-height: 16px;
  height: 20px;
  color: ${smColors.green};
`;

const ResultWrapper = styled.textarea`
  width: 100%;
  height: 95px;
  color: ${smColors.mediumGray};
  white-space: pre;
  overflow: auto;
  font-size: 12px;
  line-height: 1.2;
  padding: 10px 15px 20px 15px;
  box-sizing: border-box;
  background: ${smColors.black20Alpha};
  border: none;
  outline: none;
  resize: none;
`;

const inputStyle = { marginBottom: 20 };

type Props = {
  index: number;
  close: () => void;
};

const SignMessage = ({ index, close }: Props) => {
  let copiedTimeout: NodeJS.Timeout;
  const [message, setMessage] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [lastResult, setLastResult] = useState('');
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
    const result = JSON.stringify(
      {
        text: message,
        signature: `0x${signedMessage}`,
        publicKey: `0x${keychain[index].publicKey}`,
      },
      null,
      2
    );
    setLastResult(result);
    await navigator.clipboard.writeText(result);
    copiedTimeout = setTimeout(() => setIsCopied(false), 10000);
    setIsCopied(true);
  };

  return (
    <Modal header="SIGN TEXT" height={400}>
      <SubHeader>
        -- <br />
        sign text with account {getAbbreviatedAddress(accounts[index].address)}
      </SubHeader>
      <Input
        value={message}
        placeholder="ENTER TEXT TO SIGN"
        onChange={({ value }) => setMessage(value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            signText();
          } else if (e.key === 'Escape') {
            close();
          }
        }}
        style={inputStyle}
        autofocus
      />
      {lastResult.length > 0 && <ResultWrapper readOnly value={lastResult} />}
      <CopiedText>{isCopied ? 'Copied' : ' '}</CopiedText>
      <ButtonsWrapper>
        <Button
          onClick={signText}
          text="SIGN & COPY"
          width={150}
          isDisabled={!message}
        />
        <Button onClick={close} isPrimary={false} text="Cancel" />
      </ButtonsWrapper>
    </Modal>
  );
};

export default SignMessage;
