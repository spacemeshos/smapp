// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { AddNewContact, AllContacts } from '/components/contacts';
import { smColors } from '/vars';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 50px 60px;
  overflow: hidden;
`;

const Header = styled.div`
  font-size: 31px;
  font-weight: bold;
  color: ${smColors.lighterBlack};
  line-height: 42px;
  margin-bottom: 35px;
`;

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const LeftPane = styled.div`
  flex: 1.5;
  margin-right: 100px;
`;

type State = {
  addressToAdd?: string
};

class Contacts extends Component<{}, State> {
  state = {
    addressToAdd: ''
  };

  render() {
    const { addressToAdd } = this.state;
    return (
      <Wrapper>
        <Header>My Contacts</Header>
        <BodyWrapper>
          <LeftPane>
            <AllContacts addContact={({ address }) => this.setState({ addressToAdd: address })} />
          </LeftPane>
          <AddNewContact defaultAddress={addressToAdd} onSave={() => this.setState({ addressToAdd: '' })} />
        </BodyWrapper>
      </Wrapper>
    );
  }
}

export default Contacts;
