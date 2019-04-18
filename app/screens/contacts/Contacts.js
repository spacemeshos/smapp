// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { setLastUsedAddresses } from '/redux/wallet/actions';
import { AddNewContact, SearchContacts } from '/components/contacts';
import { smColors } from '/vars';
import type { Action, Contact } from '/types';

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
const RightPane = styled.div`
  flex: 1;
`;

type Props = {
  setLastUsedAddresses: Action,
  lastUsedAddresses: Contact[]
};

type State = {
  publicWalletAddress: ?string
};

class Contacts extends Component<Props, State> {
  state = {
    publicWalletAddress: null
  };

  render() {
    const { publicWalletAddress } = this.state;
    return (
      <Wrapper>
        <Header>My Contacts</Header>
        <BodyWrapper>
          <LeftPane>
            <SearchContacts onSave={({ publicWalletAddress }) => this.setState({ publicWalletAddress })} showLastUsedAddresses />
          </LeftPane>
          <RightPane>
            <AddNewContact publicWalletAddress={publicWalletAddress} resolve={publicWalletAddress ? this.handleSaveLastUsedAddress : null} />
          </RightPane>
        </BodyWrapper>
      </Wrapper>
    );
  }

  handleSaveLastUsedAddress = ({ publicWalletAddress, nickname, email }: Contact) => {
    const { setLastUsedAddresses, lastUsedAddresses } = this.props;
    const updatedIndex = lastUsedAddresses.findIndex((lastUsedAddress) => lastUsedAddress.publicWalletAddress === publicWalletAddress);
    const updatedLastUsedAddresses = [...lastUsedAddresses];
    updatedLastUsedAddresses[updatedIndex] = { publicWalletAddress, nickname, email };
    setLastUsedAddresses({ lastUsedAddresses: updatedLastUsedAddresses });
    this.setState({ publicWalletAddress: null });
  };
}

const mapStateToProps = (state) => ({
  lastUsedAddresses: state.wallet.lastUsedAddresses
});

const mapDispatchToProps = {
  setLastUsedAddresses
};

Contacts = connect(
  mapStateToProps,
  mapDispatchToProps
)(Contacts);

export default Contacts;
