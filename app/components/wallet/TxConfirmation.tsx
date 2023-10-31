import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { captureReactBreadcrumb } from '../../sentry';
import { SecondaryButton, Link, Button, BoldText } from '../../basicComponents';
import { chevronLeftWhite } from '../../assets/images';
import { smColors } from '../../vars';
import { ExternalLinks } from '../../../shared/constants';
import { safeReactKey } from '../../infra/utils';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 600px;
  height: 100%;
  margin-right: 10px;
  padding: 10px 15px;
  color: ${({ theme: { wrapper } }) => wrapper.color};
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const HeaderText = styled(BoldText)`
  font-size: 16px;
  line-height: 20px;
  color: ${({ theme: { color } }) => color.primary};
`;

const SubHeader1 = styled(HeaderText)`
  margin-bottom: 15px;
`;

const SubHeader2 = styled(BoldText)`
  margin-bottom: 20px;
  font-size: 24px;
  line-height: 30px;
  color: ${({ theme: { color } }) => color.primary};
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

const TotalText = styled(BoldText)`
  font-size: 24px;
  line-height: 30px;
  color: ${({ theme: { color } }) => color.primary};
`;

const Footer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: flex-end;
`;

const ComplexButton = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  margin-right: 10px;
  ${({ theme: { themeName } }) => `
  
    img {
      position: relative;
      left: ${themeName === 'modern' ? -1 : 0}px;
    }
  `}
`;

const ComplexButtonText = styled.div`
  margin-left: 10px;
  font-size: 13px;
  line-height: 17px;
  text-decoration: underline;
  color: ${({ theme }) =>
    theme.isDarkMode ? smColors.white : smColors.mediumGray};
`;

export enum TxConfirmationFieldType {
  Default = 0,
  Total = 1,
}

export type TxConfirmationField = {
  label: string;
  value: string;
  type?: TxConfirmationFieldType;
};

type Props = {
  fields: TxConfirmationField[];
  isDisabled: boolean;
  doneAction: () => void;
  editTx: () => void;
  backButtonRoute: string;
};

const TxConfirmation = ({
  fields,
  isDisabled,
  doneAction,
  editTx,
  backButtonRoute,
}: Props) => {
  const history = useHistory();
  const handleSend = () => {
    captureReactBreadcrumb({
      category: 'Tx Confirmation',
      data: {
        action: 'Click send button',
      },
      level: 'info',
    });
    editTx();
  };

  const handleEditTx = () => {
    doneAction();
    captureReactBreadcrumb({
      category: 'Tx Confirmation',
      data: {
        action: 'Navigate to edit transaction',
      },
      level: 'info',
    });
  };

  const navigateToGuide = () => {
    window.open(ExternalLinks.SendCoinGuide);
    captureReactBreadcrumb({
      category: 'Tx Confirmation',
      data: {
        action: 'Navigate to send coin guide',
      },
      level: 'info',
    });
  };

  const renderFieldValue = (field: TxConfirmationField) => {
    switch (field.type) {
      case TxConfirmationFieldType.Total:
        return <TotalText>{field.value}</TotalText>;
      case TxConfirmationFieldType.Default:
      default:
        return <DetailsTextLeft>{field.value}</DetailsTextLeft>;
    }
  };
  const cancelButton = () => {
    history.replace(backButtonRoute);
    captureReactBreadcrumb({
      category: 'Tx Confirmation',
      data: {
        action: 'Click cancel transaction button',
      },
      level: 'info',
    });
  };

  return (
    <Wrapper>
      <Header>
        <HeaderText>Send SMH</HeaderText>
        <Link
          onClick={cancelButton}
          text="CANCEL TRANSACTION"
          style={{ color: smColors.orange }}
        />
      </Header>
      <SubHeader1>--</SubHeader1>
      <SubHeader2>SUMMARY</SubHeader2>
      <>
        {fields.map((field, idx) => (
          <DetailsRow
            key={`txConfirmation_${idx}_${safeReactKey(field.label)}`}
          >
            <DetailsTextRight>{field.label}</DetailsTextRight>
            {renderFieldValue(field)}
          </DetailsRow>
        ))}
      </>
      <Footer>
        <ComplexButton>
          <SecondaryButton
            onClick={handleEditTx}
            img={chevronLeftWhite}
            imgWidth={10}
            imgHeight={15}
          />
          <ComplexButtonText>EDIT TRANSACTION</ComplexButtonText>
        </ComplexButton>
        <Link onClick={navigateToGuide} text="SEND SMH GUIDE" />
        <Button
          onClick={handleSend}
          text="SEND"
          style={{ marginLeft: 'auto' }}
          isDisabled={isDisabled}
        />
      </Footer>
    </Wrapper>
  );
};

export default TxConfirmation;
