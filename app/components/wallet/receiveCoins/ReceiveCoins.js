// @flow
import { clipboard } from 'electron';
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import QRCode from 'qrcode.react';
import { Modal } from '/basicComponents';
import { copyIcon } from '/assets/images';
import { smColors } from '/vars';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  padding: 50px;
`;

const LeftPart = styled.div`
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  font-size: 16px;
  font-weight: bold;
  line-height: 22px;
  color: ${smColors.lighterBlack};
  margin-bottom: 15px;
`;

const LeftPartInner = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 15px;
  padding-right: 50px;
  border-right: 1px solid ${smColors.borderGray};
`;

const AddressWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  margin-bottom: 40px;
  border: 1px solid ${smColors.borderGray};
  border-radius: 2px;
  cursor: pointer;
`;

const Address = styled.div`
  font-size: 20px;
  line-height: 25px;
  color: ${smColors.green};
  cursor: inherit;
`;

const CopyIcon = styled.img`
  width: 19px;
  height: 22px;
  margin-left: 20px;
  cursor: inherit;
`;

const Text = styled.div`
  font-size: 16px;
  line-height: 30px;
  color: ${smColors.darkGray};
  margin-bottom: 15px;
`;

const Button = styled.div`
  font-size: 16px;
  line-height: 30px;
  color: ${smColors.darkGreen};
  cursor: pointer;
  padding: 5px;
`;

const RightPart = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 50px;
`;

const QrCodeWrapper = styled.div`
  width: 175px;
  height: 175px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 35px;
`;

type Props = {
  address: string,
  closeModal: () => void,
  navigateToExplanation: () => void
};

class ReceiveCoins extends PureComponent<Props> {
  render() {
    return <Modal header="Confirm Transaction" onQuestionMarkClick={this.onQuestionMarkClick} onCloseClick={this.onCloseClick} content={this.renderModalBody()} />;
  }

  componentDidMount(): void {
    const { address } = this.props;
    clipboard.writeText(address);
  }

  renderModalBody = () => {
    const { address, closeModal } = this.props;
    return (
      <Wrapper>
        <LeftPart>
          <Header>Your wallet public address has been copied to clipboard</Header>
          <LeftPartInner>
            <AddressWrapper onClick={this.copyPublicAddress}>
              <Address>{address.substring(0, 30)}</Address>
              <CopyIcon src={copyIcon} />
            </AddressWrapper>
            <Text>
              This address is public and safe to share.
              <br /> Send this address to anyone you want to receive Spacemesh Coins from.
              <br /> Just copy and paste to share via email or a text messaging session.
            </Text>
            <Button onClick={closeModal}>Close</Button>
          </LeftPartInner>
        </LeftPart>
        <RightPart>
          <QrCodeWrapper>
            <QRCode value={address} size={150} />
          </QrCodeWrapper>
          <Button onClick={this.copyQrCode}>Copy QR address code</Button>
        </RightPart>
      </Wrapper>
    );
  };

  onQuestionMarkClick = () => {
    const { navigateToExplanation } = this.props;
    navigateToExplanation();
  };

  onCloseClick = () => {
    const { closeModal } = this.props;
    closeModal();
  };

  copyPublicAddress = () => {
    const { address } = this.props;
    clipboard.writeText(address);
  };

  copyQrCode = () => {};
}

export default ReceiveCoins;
