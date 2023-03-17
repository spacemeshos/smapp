import React, { useState } from 'react';
import styled from 'styled-components';
import zxcvbn from 'zxcvbn';
import { smColors } from '../../vars';
import { /* ErrorPopup, */ Input } from '../../basicComponents';

export type PasswordLevel = {
  level: number;
  message?: string;
};

interface PasswordInputProps {
  password?: string;
  placeholder?: string;
  onEnterPress?: () => void;
  onChange: ({ value }: { value: string; level: PasswordLevel }) => void;
  onReset?: () => void;
  onPasswordValid?: ({ value }: { value: string }) => void;
  onBlur?: ({ value }: { value: string }) => void;
  hasError?: boolean;
  errorSection?: boolean;
  passwordIndicator?: boolean;
  style?: any;
  indicatorColors?: Array<string>;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-bottom: 15px;
  position: relative;
`;

const PasswordBottomSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
`;

const PasswordScoreTitle = styled.p`
  font-size: 12px;
  line-height: 14px;
  color: ${({ theme }) => theme.color.primary};
  margin-top: 10px;
  position: absolute;
  left: 105%;
  min-width: 100px;
`;

const PasswordLevelIndicatorWrapper = styled.div`
  padding-left: 6px;
  margin-left: 8px;
  margin-top: 10px;
  width: 100%;
  display: flex;
  align-content: center;
  justify-content: flex-start;
`;

const PasswordLevelIndicator = styled.div`
  width: 18%;
  border-radius: 10px;
  margin-right: 5px;
  height: 5px;
  border: 0.5px solid ${smColors.darkGray};
`;

const scoreWords = ['Weak', 'Medium', 'Strong', 'Great!', 'Very Strong'];

const getPasswordLevel = (password: string) => {
  if (password.length >= 8) {
    const result = zxcvbn(password);
    return { level: result.score, message: scoreWords[result.score] };
  }

  if (password === '') {
    return { level: -1, message: '' };
  }

  return { level: 0, message: scoreWords[0] };
};

const PasswordInput: React.FC<PasswordInputProps> = ({
  password,
  placeholder = 'ENTER PASSWORD',
  onEnterPress = () => {},
  onChange,
  onBlur,
  passwordIndicator,
  style = {},
  indicatorColors = [
    smColors.red,
    smColors.darkOrange,
    smColors.orange,
    smColors.darkerGreen,
    smColors.green,
  ],
}) => {
  const [passwordLevel, setPasswordLevel] = useState<PasswordLevel>({
    level: -1,
    message: '',
  });

  const onChangePassword = ({ value }: { value: string }) => {
    const passwordLevel = getPasswordLevel(value);
    setPasswordLevel(passwordLevel);
    onChange({ value, level: passwordLevel });
  };

  return (
    <Wrapper>
      <Input
        type="password"
        placeholder={placeholder}
        value={password}
        onEnterPress={onEnterPress}
        onChange={onChangePassword}
        onBlur={onBlur}
        style={{ flex: 1, ...style }}
        autofocus
      />

      {passwordIndicator && (
        <PasswordScoreTitle>{passwordLevel.message}</PasswordScoreTitle>
      )}

      {passwordIndicator && (
        <PasswordBottomSection>
          <PasswordLevelIndicatorWrapper>
            {indicatorColors.map((color, index) => (
              <PasswordLevelIndicator
                key={color}
                style={{
                  backgroundColor:
                    passwordLevel.level >= index ? color : 'gray',
                }}
              />
            ))}
          </PasswordLevelIndicatorWrapper>
        </PasswordBottomSection>
      )}
    </Wrapper>
  );
};

export default PasswordInput;
