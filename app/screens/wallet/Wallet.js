// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logout } from '/redux/wallet/actions';

type Props = {
  logout: Function
};
type State = {};

class Wallet extends Component<Props, State> {
  render() {
    return <div>test wallet page</div>;
  }

  componentWillUnmount(): void {
    const { logout } = this.props;
    logout();
  }
}

const mapDispatchToProps = {
  logout
};

Wallet = connect(
  null,
  mapDispatchToProps
)(Wallet);

export default Wallet;
