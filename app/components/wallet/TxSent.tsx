import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Link, Button } from '../../basicComponents';
import { fireworksImg, doneIconGreen } from '../../assets/images';
import { smColors } from '../../vars';
import Address, { AddressType } from '../common/Address';
import { ExternalLinks } from '../../../shared/constants';
import { safeReactKey } from '../../infra/utils';
// eslint-disable-next-line import/no-cycle
import { captureReactBreadcrumb } from '../../sentry';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 600px;
  height: 100%;
  margin-right: 10px;
  padding: 10px 15px;
  background: url(${fireworksImg}) center center no-repeat;
  background-size: contain;
  background-color: ${({ theme: { wrapper } }) => wrapper.color};
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const HeaderText = styled.div`
  font-size: 32px;
  line-height: 40px;
  color: ${smColors.green};
  text-transform: uppercase;
`;

const HeaderIcon = styled.img`
  width: 30px;
  height: 29px;
  margin-top: auto;
`;

const DetailsRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
  margin-bottom: 10px;
  border-bottom: 1px solid ${smColors.navLinkGrey};
  &:last-child {
    border-bottom: none;
  }
`;

const DetailsTextRight = styled.div`
  flex: 1;
  margin-right: 10px;
  font-size: 16px;
  line-height: 20px;
  color: ${({ theme: { color } }) => color.primary};
`;

const DetailsTextLeft = styled(DetailsTextRight)`
  margin-right: 0;
  text-align: right;
`;

const DetailsTextLeftBold = styled(DetailsTextLeft)`
  font-weight: 800;
`;

const ComplexText = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Footer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  justify-content: space-between;
  align-items: flex-end;
`;

const ButtonsBlock = styled.div`
  display: flex;
  flex-direction: row;
`;

export enum TxSentFieldType {
  Default = 0,
  Bold = 1,
}

export type TxSentField = {
  label: string;
  value: string;
  type?: TxSentFieldType;
};

type Props = {
  fields: TxSentField[];
  txId: string;
  navigateToTxList: () => void;
  doneButtonRoute: string;
};

const TxSent = ({ fields, txId, navigateToTxList, doneButtonRoute }: Props) => {
  const navigateToGuide = () => {
    window.open(ExternalLinks.SendCoinGuide);
    captureReactBreadcrumb({
      category: 'TX Sent',
      data: {
        action: 'Click to send SMH guide',
      },
      level: 'info',
    });
  };

  const handleNavigateToTxList = () => {
    navigateToTxList();
    captureReactBreadcrumb({
      category: 'TX Sent',
      data: {
        action: 'Navigate to view transaction',
      },
      level: 'info',
    });
  };

  const history = useHistory();

  const doneButton = () => {
    history.replace(doneButtonRoute);
    captureReactBreadcrumb({
      category: 'TX Sent',
      data: {
        action: 'Click done button',
      },
      level: 'info',
    });
  };

  return (
    <Wrapper>
      <Header>
        <HeaderText>TRANSACTION SENT!</HeaderText>
        <HeaderIcon src={doneIconGreen} />
      </Header>
      <>
        <DetailsRow>
          <DetailsTextRight>Transaction ID</DetailsTextRight>
          <ComplexText>
            <DetailsTextLeft>
              <Address address={txId} isHex type={AddressType.TX} />
            </DetailsTextLeft>
          </ComplexText>
        </DetailsRow>
        {fields.map((field, idx) => (
          <DetailsRow key={`txSent_${idx}_${safeReactKey(field.label)}`}>
            <DetailsTextRight>{field.label}</DetailsTextRight>
            {field.type === TxSentFieldType.Bold ? (
              <DetailsTextLeftBold>{field.value}</DetailsTextLeftBold>
            ) : (
              <DetailsTextLeft>{field.value}</DetailsTextLeft>
            )}
          </DetailsRow>
        ))}
      </>
      <Footer>
        <Link onClick={navigateToGuide} text="SEND SMH GUIDE" />
        <ButtonsBlock>
          <Button
            onClick={handleNavigateToTxList}
            text="VIEW TRANSACTION"
            isPrimary={false}
            width={170}
            style={{ marginRight: 20 }}
          />
          <Button onClick={doneButton} text="DONE" />
        </ButtonsBlock>
      </Footer>
    </Wrapper>
  );
};

export default TxSent;
