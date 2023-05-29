import React from 'react';
import styled from 'styled-components';
import { Contact } from '../../../shared/types';
import { Button } from '../../basicComponents';
import { smColors } from '../../vars';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 115px;
`;

const Header = styled.div`
  font-family: SourceCodeProBold;
  font-size: 16px;
  line-height: 22px;
  color: ${({ theme }) =>
    theme.isDarkMode ? smColors.white : smColors.realBlack};
`;

const MainWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 75px;
  margin-bottom: 20px;
`;

const MainWrapperUpperPart = styled.div`
  position: absolute;
  top: 0;
  left: 5px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: calc(100% - 5px);
  padding: 10px 15px;
  background-color: ${({ theme }) =>
    theme.isDarkMode ? smColors.white : smColors.black};
  z-index: 1;
`;

const MainWrapperLowerPart = styled.div`
  position: absolute;
  top: 5px;
  left: 0;
  width: calc(100% - 5px);
  height: 65px;
  border: ${({ theme }) =>
    `1px solid ${theme.isDarkMode ? smColors.white : smColors.black}`};
`;

const Text = styled.div`
  font-size: 16px;
  line-height: 20px;
  color: ${smColors.white};
`;

type Props = {
  contact: Contact;
  action: () => void;
};

const CreatedNewContact = ({ contact, action }: Props) => (
  <Wrapper>
    <Header>
      Create a new contact
      <br />
      --
    </Header>
    <MainWrapper>
      <MainWrapperUpperPart>
        <Text>{`"${contact.nickname}" contact created`}</Text>
        <Button onClick={action} text="SEND SMH" width={100} />
      </MainWrapperUpperPart>
      <MainWrapperLowerPart />
    </MainWrapper>
  </Wrapper>
);

export default CreatedNewContact;
