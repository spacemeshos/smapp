import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 75px;
`;

const UpperPart = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
  padding: 10px 0;
  color: ${({ theme }) => theme.color.contrast};
  border-bottom: ${({ theme }) => `1px solid ${theme.color.contrast}`};
`;

const UpperPartLeft = styled.div`
  display: flex;
  align-items: center;
  flex: 2;
  color: ${({ theme }) => theme.color.contrast};
`;

const UpperPartRight = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  justify-content: flex-end;
  align-items: center;
`;

const Name = styled.div`
  font-size: 16px;
  line-height: 22px;
  color: ${({ theme }) => theme.color.contrast};
`;

const Text = styled.div`
  font-size: 13px;
  line-height: 17px;
  color: ${({ theme: { color } }) => color.primary};
`;

type Props = {
  upperPart?: any;
  upperPartLeft?: any;
  isUpperPartLeftText?: boolean;
  upperPartRight?: any;
  rowName: string;
  bottomPart?: any;
};

const SettingRow = ({
  upperPart = null,
  upperPartLeft = null,
  isUpperPartLeftText = false,
  upperPartRight = null,
  rowName,
  bottomPart = null,
}: Props) => (
  <Wrapper>
    <UpperPart>
      {upperPart || (
        <>
          <UpperPartLeft>
            {isUpperPartLeftText ? <Text>{upperPartLeft}</Text> : upperPartLeft}
          </UpperPartLeft>
          {upperPartRight && <UpperPartRight>{upperPartRight}</UpperPartRight>}
        </>
      )}
    </UpperPart>
    <Name>{rowName}</Name>
    {bottomPart}
  </Wrapper>
);

export default SettingRow;
