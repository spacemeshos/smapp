import React, { Component } from 'react';
import styled from 'styled-components';
import { Modal, SmInput, SmButton } from '/basicComponents';
import { connect } from 'react-redux';
import { setNodeIpAddress } from '/redux/network/actions';
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
  nodeIpAddress: string,
  setNodeIpAddress: Action,
  closeModal: () => void,
  navigateToExplanation: () => void
};

type State = {
  ipAddress: string,
  ipAddressErrorMsg: string
};

class SetNodeIp extends Component<Props, State> {
  state = {
    ipAddress: '',
    ipAddressErrorMsg: ''
  };

  render() {
    const { navigateToExplanation, closeModal } = this.props;
    return (
      <Modal header="Set Node IP Address" onQuestionMarkClick={navigateToExplanation} onCancelBtnClick={closeModal} onCloseClick={closeModal} content={this.renderModalBody()} />
    );
  }

  renderModalBody = () => {
    const { closeModal, nodeIpAddress: defaultIp } = this.props;
    const { ipAddressErrorMsg, ipAddress } = this.state;
    return (
      <Wrapper>
        <Label>Spacemesh Node IP Address</Label>
        <SmInput type="text" placeholder="Type Node IP Address" defaultValue={defaultIp} errorMsg={ipAddressErrorMsg} onChange={this.handleTyping} />
        <ButtonsWrapper>
          <SmButton text="Cancel" theme="green" onPress={closeModal} style={{ marginRight: 20 }} />
          <SmButton text="Done" isDisabled={!!ipAddressErrorMsg || !ipAddress} theme="orange" onPress={this.handleSave} />
        </ButtonsWrapper>
      </Wrapper>
    );
  };

  handleSave = () => {
    const { closeModal, setNodeIpAddress } = this.props;
    const { ipAddress } = this.state;
    setNodeIpAddress({ nodeIpAddress: ipAddress });
    closeModal();
  };

  handleTyping = ({ value }: { value: string }) => {
    this.setState({ ipAddress: value, ipAddressErrorMsg: this.validateIp({ value }) });
  };

  validateIp = ({ value }: { value: string }) => {
    return value.length > 0 ? '' : 'IP Address is invalid';
  };
}

const mapStateToProps = (state) => ({
  nodeIpAddress: state.network.nodeIpAddress
});

const mapDispatchToProps = {
  setNodeIpAddress
};

SetNodeIp = connect(
  mapStateToProps,
  mapDispatchToProps
)(SetNodeIp);

export default SetNodeIp;
