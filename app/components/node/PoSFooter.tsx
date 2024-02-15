import React from 'react';
import styled from 'styled-components';
import { ExternalLinks } from '../../../shared/constants';
import { Link, Button } from '../../basicComponents';

const Footer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 25px;
`;

const ButtonWrap = styled.div`
  display: flex;
  width: 250px;
  justify-content: flex-end;
  flex-direction: row;
`;

export interface PoSFooterProps {
  action: () => void;
  isDisabled: boolean;
  skipAction?: () => void;
  skipLabel?: string;
  nextLabel?: string;
}

const PoSFooter = ({
  action,
  isDisabled,
  skipAction,
  skipLabel,
  nextLabel,
}: PoSFooterProps) => {
  const navigateToExplanation = () => window.open(ExternalLinks.SetupGuide);

  return (
    <Footer>
      <Link onClick={navigateToExplanation} text="POS SETUP GUIDE" />
      <ButtonWrap>
        {skipAction && (
          <Button
            isPrimary={false}
            onClick={skipAction}
            text={skipLabel || 'SKIP'}
          />
        )}
        <Button
          style={{ marginLeft: '20px' }}
          onClick={action}
          text={nextLabel || 'NEXT'}
          isDisabled={isDisabled}
        />
      </ButtonWrap>
    </Footer>
  );
};

export default PoSFooter;
