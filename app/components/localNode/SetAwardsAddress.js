// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { Modal, SmInput, SmButton } from '/basicComponents';
import { connect } from 'react-redux';
import { setAwardsAddress } from '/redux/localNode/actions';
import type { Action } from '/types';
import { smColors } from '/vars';

const Wrapper = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

const Label = styled.span`
  font-size: 14px;
  line-height: 22px;
  color: ${smColors.darkGray};
  margin-bottom: 8px;
`;

type Props = {
  awardsAddress: string,
  setAwardsAddress: Action,
  closeModal: () => void,
  navigateToExplanation: () => void
};

type State = {
  awardsAddress: string,
  addressErrorMsg: string
};

class SetAwardsAddress extends Component<Props, State> {
  state = {
    awardsAddress: '',
    addressErrorMsg: ''
  };

  render() {
    const { navigateToExplanation, closeModal } = this.props;
    return (
      <Modal header="Change Awards Address" onQuestionMarkClick={navigateToExplanation} onCancelBtnClick={closeModal} onCloseClick={closeModal} content={this.renderModalBody()} />
    );
  }

  renderModalBody = () => {
    const { closeModal, awardsAddress: defaultAddress } = this.props;
    const { addressErrorMsg, awardsAddress } = this.state;
    return (
      <Wrapper>
        <Label>Local Node Awards Address</Label>
        <SmInput type="text" placeholder="Type awards address" defaultValue={defaultAddress} errorMsg={addressErrorMsg} onChange={this.handleTyping} />
        <ButtonsWrapper>
          <SmButton text="Cancel" theme="green" onPress={closeModal} style={{ marginRight: 20 }} />
          <SmButton text="Done" isDisabled={!!addressErrorMsg || !awardsAddress} theme="orange" onPress={this.handleSave} />
        </ButtonsWrapper>
      </Wrapper>
    );
  };

  handleSave = async () => {
    const { closeModal, setAwardsAddress } = this.props;
    const { awardsAddress } = this.state;
    try {
      await setAwardsAddress({ awardsAddress });
      closeModal();
    } catch (error) {
      this.setState(() => {
        throw error;
      });
    }
  };

  handleTyping = ({ value }: { value: string }) => {
    this.setState({ awardsAddress: value, addressErrorMsg: this.validateAddress({ value }) });
  };

  validateAddress = ({ value }: { value: string }) => {
    const addressRegex = /\b[a-zA-Z0-9]{64}\b/;
    return addressRegex.test(value) ? '' : 'Address is invalid';
  };
}

const mapStateToProps = (state) => ({
  awardsAddress: state.localNode.awardsAddress
});

const mapDispatchToProps = {
  setAwardsAddress
};

// $FlowConnectIssue
SetAwardsAddress = connect(
  mapStateToProps,
  mapDispatchToProps
)(SetAwardsAddress);

export default SetAwardsAddress;
