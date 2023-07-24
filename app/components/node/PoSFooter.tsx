import React, { PureComponent } from 'react';
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

type Props = {
  action: () => void;
  isDisabled: boolean;
  isLastMode?: boolean;
  skipAction?: () => void;
  skipLabel?: string;
  nextLabel?: string;
};

class PoSFooter extends PureComponent<Props> {
  render() {
    const {
      action,
      isDisabled,
      isLastMode,
      skipAction,
      skipLabel,
      nextLabel,
    } = this.props;
    return (
      <Footer>
        <Link onClick={this.navigateToExplanation} text="POST SETUP GUIDE" />
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
            text={nextLabel || (isLastMode ? 'CREATE DATA' : 'NEXT')}
            isDisabled={isDisabled}
          />
        </ButtonWrap>
      </Footer>
    );
  }

  navigateToExplanation = () => window.open(ExternalLinks.SetupGuide);
}

export default PoSFooter;
