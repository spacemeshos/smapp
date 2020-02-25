// @flow
import React, { Component } from 'react';
import { CorneredWrapper, Button } from '/basicComponents';
import styled from 'styled-components';
import { smColors } from '/vars';
import { walletUpdateService } from '/infra/walletUpdateService';

// $FlowStyledIssue
const Wrapper = styled.div`
  position: fixed;
  z-index: 1;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.3);
`;

const InnerWrapper = styled.div`
  padding: 25px;
  background-color: ${smColors.lightGray};
`;

const Text = styled.div`
  font-size: 16px;
  line-height: 22px;
  color: ${smColors.black};
  margin-top: 20px;
`;

const Header = styled(Text)`
  font-size: 20px;
  margin-top: 0;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: ${({ hasSingleButton }) => (hasSingleButton ? 'center' : 'space-between')};
  margin-top: 30px;
`;

type Props = {
  onCloseModal: () => void
};

class UpdaterModal extends Component<Props> {
  render() {
    const { onCloseModal } = this.props;
    return (
      <Wrapper>
        <CorneredWrapper>
          <InnerWrapper>
            <Header>Wallet Update Available</Header>
            <Text>An important App update is available.</Text>
            <Text>Would you like to install it now?</Text>
            <ButtonsWrapper>
              <Button onClick={walletUpdateService.quitAppAndInstallUpdate} text="YES" style={{ marginRight: 20 }} />
              <Button onClick={onCloseModal} text="NO" isPrimary={false} />
            </ButtonsWrapper>
          </InnerWrapper>
        </CorneredWrapper>
      </Wrapper>
    );
  }
}

export default UpdaterModal;
